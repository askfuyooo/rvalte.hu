import { getAccessToken } from "./accesstoken.js";
import { createLogger } from "@rvalte-hu/logger";
import type { SpotifyAlbum, SpotifyAlbumType } from "./types.js";

const logger = createLogger("spotify-api", { module: "core" });

const fetchArtistAlbumSpotifyDataRecursive = async (
    url: string,
): Promise<any> => {
    let tokenResult: string;
    try {
        tokenResult = await getAccessToken();
    } catch (error) {
        logger.error(`Failed to get access token: ${(error as Error).message}`);
        throw error;
    }

    const token = tokenResult;

    if (!token) {
        logger.error("No access token available for Spotify API request");
        throw new Error("No access token available for Spotify API request");
    }

    const options = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await fetch(url, options);
    if (!response.ok) {
        const errorText = `Failed to fetch artist albums: ${response.status} ${response.statusText}`;
        logger.error(errorText);
        throw new Error(errorText);
    }

    const data = await response.json();
    if (!data || !data.items) {
        const errorText = "Invalid response structure from Spotify API";
        logger.error(errorText);
        throw new Error(errorText);
    }

    const albums = data.items;
    if (data.next) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        const nextAlbums = await fetchArtistAlbumSpotifyDataRecursive(
            data.next,
        );
        return albums.concat(nextAlbums);
    }

    return albums;
};

export const fetchAndFormatAlbums = async (
    url: string,
): Promise<SpotifyAlbum[]> => {
    try {
        return (await fetchArtistAlbumSpotifyDataRecursive(url)).map(
            (album: any) =>
                ({
                    album_type: (album.album_type ||
                        "unknown") as SpotifyAlbumType,
                    total_tracks: album.total_tracks || -1,
                    url: album.external_urls.spotify || "unknown",
                    artists: (album.artists || []).map((artist: any) => ({
                        id: artist.id || "unknown",
                        name: artist.name || "unknown",
                        url: artist.external_urls.spotify || "unknown",
                    })),
                    id: album.id || "unknown",
                    name: album.name || "unknown",
                    release_date: album.release_date || "unknown",
                    image: {
                        url:
                            (album.images &&
                                album.images[0] &&
                                album.images[0].url) ||
                            (album.image && album.image.url) ||
                            "unknown",
                        height:
                            (album.images &&
                                album.images[0] &&
                                album.images[0].height) ||
                            (album.image && album.image.height) ||
                            -1,
                        width:
                            (album.images &&
                                album.images[0] &&
                                album.images[0].width) ||
                            (album.image && album.image.width) ||
                            -1,
                    },
                }) as SpotifyAlbum,
        );
    } catch (error) {
        logger.error(
            `Failed to format artist albums: ${(error as Error).message}`,
        );
        throw error;
    }
};
