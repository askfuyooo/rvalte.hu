import type { SocialLink } from "@rvalte-hu/linktree-scraper-api";
import type { SpotifyAlbum } from "@rvalte-hu/spotify-api";
import { createContext } from "react";
import type { TimelineItem } from "../types/timeLineItem";

export type DataSource = "loading" | "api" | "fallback";

export type SiteDataContextValue = {
    readonly albums: SpotifyAlbum[];
    readonly albumsLoading: boolean;
    readonly albumsSource: DataSource;
    readonly links: SocialLink[];
    readonly linksLoading: boolean;
    readonly linksSource: DataSource;
    readonly timeLineItems: TimelineItem[];
};

export const SiteDataContext = createContext<SiteDataContextValue | null>(null);
