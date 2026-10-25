import { createLogger } from "@rvalte-hu/logger";
import { env } from "@rvalte-hu/config";
import { getByKey, setByKey } from "@rvalte-hu/redis";
import type { SpotifyAlbum } from "./types.js";
import { fetchAndFormatAlbums } from "./core.js";

const logger = createLogger("spotify-api", { module: "albums" });

const getCachedAlbums = async (): Promise<SpotifyAlbum[]> => {
    const cachedAlbums = await getByKey("spotify-api:albums");
    if (!cachedAlbums) throw new Error("No cached albums found");

    try {
        const parsedAlbums = JSON.parse(cachedAlbums);
        if (!Array.isArray(parsedAlbums)) {
            throw new Error("Cached albums data is not an array");
        }

        logger.info("Using cached albums from Redis");
        return parsedAlbums as SpotifyAlbum[];
    } catch (error) {
        const errorText = `Failed to parse cached albums: ${(error as Error).message}`;
        logger.error(errorText);
        throw new Error(errorText);
    }
};

const setCachedAlbums = async (
    albums: SpotifyAlbum[],
    expiresIn: number = 60 * 60 * 24 * 2 - 60,
): Promise<void> => {
    await setByKey("spotify-api:albums", JSON.stringify(albums), expiresIn);
    logger.info("Cached new albums in Redis");
};

const getUrl = (artistId: string) => {
    const { baseUrl } = env.spotify;
    return `${baseUrl}artists/${artistId}/albums?include_groups=album,single,compilation`;
};

export const getArtistAlbums = async (): Promise<SpotifyAlbum[]> => {
    try {
        return await getCachedAlbums();
    } catch (error) {
        logger.info("No cached albums found, fetching new albums...");
        try {
            const { artistId, artistBands } = env.spotify;
            const url = getUrl(artistId);
            const artistAlbums = await fetchAndFormatAlbums(url);

            for (const band of artistBands) {
                const bandUrl = getUrl(band.bandId);
                await new Promise((resolve) => setTimeout(resolve, 200));
                const bandAlbums = await fetchAndFormatAlbums(bandUrl);
                const uniqueBandAlbums = bandAlbums.filter(
                    (bandAlbum) =>
                        !artistAlbums.some(
                            (album) => album.id === bandAlbum.id,
                        ),
                );

                for (const album of uniqueBandAlbums) {
                    console.log(
                        `Adding album "${album.name}" from  to the list of albums.`,
                    );
                    const { artistIds } = band;
                    const albumArtistIds = album.artists.map(
                        (artist) => artist.id,
                    );
                    const hasAllRequiredArtists = artistIds.every((id) =>
                        albumArtistIds.includes(id),
                    );
                    const hasAnyRequiredArtist =
                        artistIds.some((id) => albumArtistIds.includes(id)) &&
                        hasAllRequiredArtists;
                    const artistNotIncluded =
                        artistIds.every((id) => !albumArtistIds.includes(id)) &&
                        albumArtistIds.includes(band.bandId);
                    if (
                        (hasAllRequiredArtists && hasAnyRequiredArtist) ||
                        artistNotIncluded
                    ) {
                        logger.info(
                            `Adding album "${album.name}" from ${band.bandId} to the list of albums.`,
                        );
                        artistAlbums.push(album);
                    } else {
                        logger.info(
                            `Skipping album "${album.name}" from ${band.bandId} due to missing required artists.`,
                        );
                    }
                }
            }

            await setCachedAlbums(artistAlbums);
            return artistAlbums;
        } catch (fetchError) {
            logger.error(
                `Failed to fetch artist albums: ${(fetchError as Error).message}`,
            );
            throw fetchError;
        }
    }
};
