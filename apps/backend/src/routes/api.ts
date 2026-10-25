import { Router } from "express";
import { createLogger } from "@rvalte-hu/logger";
import { getArtistData, type SpotifyAlbum } from "@rvalte-hu/spotify-api";
import {
    getLinktreeLinks,
    type SocialLink,
} from "@rvalte-hu/linktree-scraper-api";
import type { ReturnData } from "../types/returnData.js";

const logger = createLogger("backend", { module: "api" });
const router = Router();

const inFlight = new Map<string, Promise<unknown>>();

function singleFlight<T>(key: string, task: () => Promise<T>): Promise<T> {
    const existing = inFlight.get(key);

    if (existing) {
        return existing as Promise<T>;
    }

    const promise = Promise.resolve()
        .then(task)
        .finally(() => {
            if (inFlight.get(key) === promise) {
                inFlight.delete(key);
            }
        });

    inFlight.set(key, promise);

    return promise;
}

const registerArrayRoute = <T>(
    path: string,
    key: string,
    load: () => Promise<T[]>,
    errorMessage: string,
) => {
    router.get(path, async (_req, res) => {
        try {
            const result = await singleFlight(
                key,
                async (): Promise<ReturnData<T[]>> => {
                    try {
                        return {
                            success: true,
                            data: await load(),
                        };
                    } catch {
                        logger.error(errorMessage);

                        return {
                            success: false,
                            data: [],
                        };
                    }
                },
            );

            res.json(result);
        } catch {
            logger.error(errorMessage);

            res.json({
                success: false,
                data: [],
            });
        }
    });
};

router.get("/", (_req, res) => {
    res.json({
        message: "API is running",
    });
});

registerArrayRoute<SpotifyAlbum>(
    "/albums",
    "api:albums",
    async () => {
        const artistData = await getArtistData(true);

        return Array.isArray(artistData) ? (artistData as SpotifyAlbum[]) : [];
    },
    "Failed to fetch Spotify albums.",
);

registerArrayRoute<SocialLink>(
    "/links",
    "api:links",
    getLinktreeLinks,
    "Failed to fetch Linktree links.",
);

export default router;
