import { env } from "@rvalte-hu/config";
import { createLogger } from "@rvalte-hu/logger";
import { getByKey, setByKey } from "@rvalte-hu/redis";
import { JSDOM } from "jsdom";

import type { SocialLink } from "./types.js";

const logger = createLogger("linktree-scraper-api", { module: "core" });

const getCachedLinks = async (): Promise<SocialLink[]> => {
    const cachedLinks = await getByKey("linktree-scraper-api:links");
    if (!cachedLinks) throw new Error("No cached links found");

    try {
        const parsedLinks = JSON.parse(cachedLinks);
        if (!Array.isArray(parsedLinks)) {
            throw new Error("Cached links data is not an array");
        }

        logger.info("Using cached links from Redis");
        return parsedLinks as SocialLink[];
    } catch (error) {
        const errorText = `Failed to parse cached links: ${(error as Error).message}`;
        logger.error(errorText);
        throw new Error(errorText);
    }
};

const setCachedLinks = async (
    links: SocialLink[],
    expiresIn: number = 60 * 60 * 24 - 60,
): Promise<void> => {
    await setByKey(
        "linktree-scraper-api:links",
        JSON.stringify(links),
        expiresIn,
    );
    logger.info("Cached new links in Redis");
};

export const getLinktreeLinks = async (): Promise<SocialLink[]> => {
    try {
        return await getCachedLinks();
    } catch (error) {
        logger.info("No cached links found, fetching new ones...");
        try {
            const newLinks = await parseLinktreeLinks();
            await setCachedLinks(newLinks);
            return newLinks;
        } catch (fetchError) {
            logger.error("Failed to fetch new links from Linktree.");
            throw fetchError;
        }
    }
};

const fetchConstructDom = async () => {
    const url = env.linktreeUrl;

    const response = await fetch(url);
    if (!response.ok) {
        const errorText = `Failed to fetch Linktree page. Status: ${response.status} ${response.statusText}`;
        logger.error(errorText);
        throw new Error(errorText);
    }

    const htmlText = await response.text();
    const dom = new JSDOM(htmlText);

    return dom.window.document;
};

const parseLinktreeLinks = async (): Promise<SocialLink[]> => {
    const document = await fetchConstructDom();

    const script = document.querySelector("script#__NEXT_DATA__")?.textContent;
    if (!script) {
        const errorText =
            "Failed to find the script tag with id '__NEXT_DATA__'.";
        logger.error(errorText);
        throw new Error(errorText);
    }

    const jsonData = JSON.parse(script);
    if (
        !jsonData.props ||
        !jsonData.props.pageProps ||
        !jsonData.props.pageProps.socialLinks
    ) {
        const errorText = "Failed to find the socialLinks in the JSON data.";
        logger.error(errorText);
        throw new Error(errorText);
    }

    const socialLinks = jsonData.props.pageProps.socialLinks;
    if (!Array.isArray(socialLinks)) {
        const errorText = "The socialLinks data is not an array.";
        logger.error(errorText);
        throw new Error(errorText);
    }

    socialLinks.sort((a: SocialLink, b: SocialLink) => a.position - b.position);
    return socialLinks;
};
