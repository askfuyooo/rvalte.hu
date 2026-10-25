import { getArtistAlbums } from "./albums.js";
import { getArtistFeaturedAlbumsWithTracks } from "./features.js";
import type { SpotifyAlbum } from "./types.js";

export const getArtistData = async (
    mixed: boolean = false,
): Promise<
    SpotifyAlbum[] | { albums: SpotifyAlbum[]; featuredAlbums: SpotifyAlbum[] }
> => {
    const albums = await getArtistAlbums();
    const featuredAlbums = await getArtistFeaturedAlbumsWithTracks(albums);

    if (mixed) {
        return [...albums, ...featuredAlbums].sort(
            (a, b) =>
                new Date(b.release_date).getTime() -
                new Date(a.release_date).getTime(),
        );
    }

    return {
        albums: albums.sort(
            (a, b) =>
                new Date(b.release_date).getTime() -
                new Date(a.release_date).getTime(),
        ),
        featuredAlbums: featuredAlbums.sort(
            (a, b) =>
                new Date(b.release_date).getTime() -
                new Date(a.release_date).getTime(),
        ),
    };
};
