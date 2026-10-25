export type SpotifyArtist = {
    readonly id: string;
    readonly name: string;
    readonly url: string;
};

export type SpotifyImage = {
    readonly url: string;
    readonly height: number;
    readonly width: number;
};

export type SpotifyAlbumType =
    | "album"
    | "single"
    | "featured track"
    | "unknown";

export type SpotifyAlbum = {
    readonly total_tracks: number;
    readonly url: string;
    readonly artists: SpotifyArtist[];
    readonly id: string;
    readonly name: string;
    readonly release_date: string;
    readonly image: SpotifyImage;
    album_type: SpotifyAlbumType;
    tracks?: SpotifyTrack[];
};

export type SpotifyTrack = {
    readonly id: string;
    readonly artists: SpotifyArtist[];
    readonly name: string;
    readonly url: string;
};
