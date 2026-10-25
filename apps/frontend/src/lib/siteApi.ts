import type { SpotifyAlbum } from "@rvalte-hu/spotify-api";
import type { SocialLink } from "@rvalte-hu/linktree-scraper-api";

const linksEndpoint = "/api/links";
const albumsEndpoint = "/api/albums";

const fetchJson = async (
    url: string,
    outerSignal: AbortSignal,
): Promise<unknown> => {
    const requestController = new AbortController();
    const abortRequest = () => requestController.abort();
    outerSignal.addEventListener("abort", abortRequest, { once: true });
    const timeoutId = window.setTimeout(() => requestController.abort(), 30000);

    try {
        const response = await fetch(url, {
            signal: requestController.signal,
            headers: { Accept: "application/json" },
        });
        if (!response.ok)
            throw new Error(`API request failed (${response.status}): ${url}`);
        return (await response.json()) as unknown;
    } finally {
        window.clearTimeout(timeoutId);
        outerSignal.removeEventListener("abort", abortRequest);
    }
};

export const fetchSiteLinks = async (
    signal: AbortSignal,
): Promise<SocialLink[]> => {
    const payload = await fetchJson(linksEndpoint, signal);
    if (payload && (payload as any).success !== true)
        return Promise.reject(
            new Error("The Linktree API did not return a successful response."),
        );

    const rows = (payload as any).data;
    if (!Array.isArray(rows))
        return Promise.reject(
            new Error("The Linktree API did not return an array of links."),
        );

    rows.sort((a: SocialLink, b: SocialLink) => a.position - b.position);
    return rows;
};

export const fetchSpotifyAlbums = async (
    signal: AbortSignal,
): Promise<SpotifyAlbum[]> => {
    const payload = await fetchJson(albumsEndpoint, signal);
    if (payload && (payload as any).success !== true)
        return Promise.reject(
            new Error("The Spotify API did not return a successful response."),
        );

    const albums = (payload as any).data;
    if (!Array.isArray(albums))
        return Promise.reject(
            new Error("The Spotify API did not return an array of albums."),
        );

    albums.sort(
        (a: SpotifyAlbum, b: SpotifyAlbum) =>
            new Date(a.release_date).getTime() -
            new Date(b.release_date).getTime(),
    );
    return albums;
};
