export type SocialLinkType =
    | "INSTAGRAM"
    | "SPOTIFY"
    | "TIKTOK"
    | "APPLE_MUSIC"
    | "YOUTUBE"
    | "X"
    | "EMAIL_ADDRESS"
    | "LINKTREE";

export type SocialLink = {
    type: SocialLinkType;
    url: string;
    position: number;
};
