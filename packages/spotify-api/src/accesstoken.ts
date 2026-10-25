import { env } from "@rvalte-hu/config";
import { getByKey, setByKey } from "@rvalte-hu/redis";
import { createLogger } from "@rvalte-hu/logger";

const logger = createLogger("spotify-api", { module: "accesstoken" });

const getCachedAccessToken = async (): Promise<string> => {
    const cachedToken = await getByKey("spotify-api:access-token");
    if (!cachedToken) throw new Error("No cached access token found");

    logger.info("Using cached access token from Redis");
    return cachedToken;
};

const setCachedAccessToken = async (
    token: string,
    expiresIn: number = 60 * 60 - 60,
): Promise<void> => {
    await setByKey("spotify-api:access-token", token, expiresIn);
    logger.info("Cached new access token in Redis");
};

const fetchAccessToken = async (): Promise<string> => {
    const { tokenUrl, clientId, clientSecret } = env.spotify;
    const authString = btoa(`${clientId}:${clientSecret}`);

    const options = {
        method: "POST",
        headers: {
            Authorization: `Basic ${authString}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            grant_type: "client_credentials",
        }),
    };

    const response = await fetch(tokenUrl, options);
    if (!response.ok) {
        const errorText = `Failed to fetch access token: ${response.status} ${response.statusText}`;
        logger.error(errorText);
        throw new Error(errorText);
    }

    const data = (await response.json()) as { access_token: string };
    logger.info("Fetched new access token from Spotify API");
    return data.access_token;
};

export const getAccessToken = async (): Promise<string> => {
    try {
        return await getCachedAccessToken();
    } catch (error) {
        logger.info("No cached access token found, fetching a new one...");
        try {
            const token = await fetchAccessToken();
            await setCachedAccessToken(token);
            return token;
        } catch (fetchError) {
            logger.error(
                `Failed to fetch access token: ${(fetchError as Error).message}`,
            );
            throw fetchError;
        }
    }
};
