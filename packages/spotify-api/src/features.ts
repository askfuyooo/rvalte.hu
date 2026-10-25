import { createLogger } from "@rvalte-hu/logger";
import { getByKey, setByKey } from "@rvalte-hu/redis";
import type { SpotifyAlbum, SpotifyArtist, SpotifyTrack } from "./types.js";
import { fetchAndFormatAlbums } from "./core.js";
import { env } from "@rvalte-hu/config";
import { getAccessToken } from "./accesstoken.js";

const logger = createLogger("spotify-api", { module: "features" });

const getCachedFeaturedAlbums = async (): Promise<SpotifyAlbum[]> => {
    const cachedFeaturedAlbums = await getByKey("spotify-api:featured-albums");
    if (!cachedFeaturedAlbums)
        throw new Error("No cached featured albums found");

    try {
        const parsedFeaturedAlbums = JSON.parse(cachedFeaturedAlbums);
        if (!Array.isArray(parsedFeaturedAlbums)) {
            throw new Error("Cached albums data is not an array");
        }

        logger.info("Using cached featured albums from Redis");
        return parsedFeaturedAlbums as SpotifyAlbum[];
    } catch (error) {
        const errorText = `Failed to parse cached featured albums: ${(error as Error).message}`;
        logger.error(errorText);
        throw new Error(errorText);
    }
};

const setCachedFeaturedAlbums = async (
    albums: SpotifyAlbum[],
    expiresIn: number = 60 * 60 * 24 * 2 - 60,
): Promise<void> => {
    await setByKey(
        "spotify-api:featured-albums",
        JSON.stringify(albums),
        expiresIn,
    );
    logger.info("Cached new featured albums in Redis");
};

const getUrl = (artistId: string) => {
    const { baseUrl } = env.spotify;
    return `${baseUrl}artists/${artistId}/albums?include_groups=appears_on`;
};

export const getArtistFeaturedAlbumsWithTracks = async (
    excludeAlbums: SpotifyAlbum[] = [],
): Promise<SpotifyAlbum[]> => {
    try {
        return await getCachedFeaturedAlbums();
    } catch (error) {
        logger.info(
            "No cached featured albums found, fetching new featured albums...",
        );
        try {
            const { artistId, artistBands } = env.spotify;
            const featuredAlbums = await fetchAttachTracksToAlbums(
                artistId,
                excludeAlbums,
            );

            for (const band of artistBands) {
                await new Promise((resolve) => setTimeout(resolve, 200));
                const bandAlbums = await fetchAttachTracksToAlbums(
                    band.bandId,
                    excludeAlbums,
                );
                const uniqueBandAlbums = bandAlbums.filter(
                    (bandAlbum) =>
                        !featuredAlbums.some(
                            (album) => album.id === bandAlbum.id,
                        ),
                );
                for (const album of uniqueBandAlbums) {
                    let tracks: SpotifyTrack[] = [];
                    for (const track of album.tracks || []) {
                        const { artistIds } = band;
                        const albumArtistIds = track.artists.map(
                            (artist) => artist.id,
                        );
                        const hasAllRequiredArtists = artistIds.every((id) =>
                            albumArtistIds.includes(id),
                        );
                        const hasAnyRequiredArtist =
                            artistIds.some((id) =>
                                albumArtistIds.includes(id),
                            ) && hasAllRequiredArtists;
                        const artistNotIncluded =
                            artistIds.every(
                                (id) => !albumArtistIds.includes(id),
                            ) && albumArtistIds.includes(band.bandId);
                        if (
                            (hasAllRequiredArtists && hasAnyRequiredArtist) ||
                            artistNotIncluded
                        ) {
                            tracks.push(track);
                            logger.info(
                                `Adding track "${track.name}" from ${band.bandId} to the list of tracks for album "${album.name}".`,
                            );
                        } else {
                            logger.info(
                                `Skipping track "${track.name}" from ${band.bandId} for album "${album.name}" due to artist ID mismatch.`,
                            );
                        }
                    }
                    if (tracks.length > 0) {
                        album.tracks = tracks;
                        featuredAlbums.push(album);
                        logger.info(
                            `Adding album "${album.name}" from ${band.bandId} to the list of featured albums.`,
                        );
                    } else {
                        logger.info(
                            `Skipping album "${album.name}" from ${band.bandId} due to no matching tracks.`,
                        );
                    }
                }
            }

            await setCachedFeaturedAlbums(featuredAlbums);
            return featuredAlbums;
        } catch (fetchError) {
            logger.error(
                `Failed to fetch artist featured albums: ${(fetchError as Error).message}`,
            );
            throw fetchError;
        }
    }
};

const fetchArtistFeaturedAlbums = async (
    artistId: string,
): Promise<SpotifyAlbum[]> => {
    try {
        const url = getUrl(artistId);
        return await fetchAndFormatAlbums(url);
    } catch (fetchError) {
        logger.error(
            `Failed to fetch artist featured albums: ${(fetchError as Error).message}`,
        );
        throw fetchError;
    }
};

const fetchAlbumTracksRecursive = async (
    url: string,
): Promise<SpotifyTrack[]> => {
    const token = await getAccessToken();
    if (!token) {
        const errorText = "No access token available for Spotify API request";
        logger.error(errorText);
        throw new Error(errorText);
    }

    const options = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await fetch(url, options);
    if (!response.ok) {
        const errorText = `Failed to fetch album tracks: ${response.status} ${response.statusText}`;
        logger.error(errorText);
        throw new Error(errorText);
    }

    const data = await response.json();
    if (!data || !data.items) {
        const errorText = "Invalid response structure from Spotify API";
        logger.error(errorText);
        throw new Error(errorText);
    }

    const tracks: SpotifyTrack[] = data.items.map(
        (track: any) =>
            ({
                artists: track.artists.map(
                    (artist: any) =>
                        ({
                            id: artist.id || "unknown",
                            name: artist.name || "unknown",
                            url: artist.external_urls.spotify || "unknown",
                        }) as SpotifyArtist,
                ),
                id: track.id || "unknown",
                name: track.name || "unknown",
                url: track.external_urls.spotify || "unknown",
            }) as SpotifyTrack,
    );

    if (data.next) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        const nextTracks = await fetchAlbumTracksRecursive(data.next);
        return tracks.concat(nextTracks);
    }

    return tracks;
};

const fetchAttachTracksToAlbums = async (
    artistId: string,
    excludeAlbums: SpotifyAlbum[] = [],
) => {
    let featuredAlbums: SpotifyAlbum[] = [];
    try {
        featuredAlbums = await fetchArtistFeaturedAlbums(artistId);
    } catch (error) {
        logger.error(
            `Failed to fetch artist featured albums: ${(error as Error).message}`,
        );
        throw error;
    }

    const allowedAlbums = featuredAlbums.filter(
        (album) => !excludeAlbums.some((excluded) => excluded.id === album.id),
    );
    const { baseUrl } = env.spotify;
    for (const album of allowedAlbums) {
        album.album_type = "featured track";
        try {
            const url = `${baseUrl}albums/${album.id}/tracks`;
            await new Promise((resolve) => setTimeout(resolve, 200));
            const tracks = await fetchAlbumTracksRecursive(url);
            album.tracks = tracks.filter((track) =>
                track.artists.some((artist) => artist.id === artistId),
            );
        } catch (error) {
            logger.error(
                `Failed to fetch tracks for album ${album.id}: ${(error as Error).message}`,
            );
            throw error;
        }
    }

    return allowedAlbums;
};
