import type { SocialLink } from "@rvalte-hu/linktree-scraper-api";

export const siteLinks = {
    linktree: "https://linktr.ee/rvalte",
    soundcheck: "https://www.youtube.com/watch?v=P-L5vs92M94",
} as const;

export const footerLinks = {
    projectGithubUrl: "https://github.com/askfuyooo/rvalte.hu",
    contactEmail: "adamtoth1215@gmail.com",
} as const;

export const fallbackSiteLinks: SocialLink[] = [
    {
        type: "INSTAGRAM",
        url: "https://instagram.com/rvalte",
        position: 1,
    },
    {
        type: "TIKTOK",
        url: "https://tiktok.com/@rvalte",
        position: 5,
    },
    {
        type: "SPOTIFY",
        url: "https://open.spotify.com/artist/3g7HTvu3GHHLLFxF1B9Esy?si=7I58PRboQVSQSWhsC08vtA",
        position: 2,
    },
    {
        type: "YOUTUBE",
        url: "https://youtube.com/@ibbigang?si=FUlCRJDme2dyvf_B",
        position: 0,
    },
    {
        type: "APPLE_MUSIC",
        url: "https://music.apple.com/hu/artist/ibbigang/1453182833?l=hu",
        position: 3,
    },
    {
        type: "EMAIL_ADDRESS",
        url: "mailto:valterszecsei@gmail.com",
        position: 6,
    },
    {
        type: "X",
        url: "https://x.com/rvaltervalte",
        position: 4,
    },
];
