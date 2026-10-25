import type {
    SpotifyAlbumType,
    SpotifyArtist,
    SpotifyImage,
} from "@rvalte-hu/spotify-api";

export type TimelineItem = {
    readonly artists: SpotifyArtist[];
    readonly url: string;
    readonly album_type: SpotifyAlbumType;
    readonly release_date: string;
    readonly name: string;
    readonly image: SpotifyImage;
    readonly id: string;
};
