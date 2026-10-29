import { useEffect, useMemo, useState, type ReactNode } from "react";
import { fallbackSiteLinks } from "../data/siteLinks";
import { fallbackSpotifyAlbums } from "../data/fallbackSpotifyAlbums";
import { fetchSiteLinks, fetchSpotifyAlbums } from "../lib/siteApi";
import {
    SiteDataContext,
    type DataSource,
    type SiteDataContextValue,
} from "./SiteDataContext";
import type { TimelineItem } from "../types/timeLineItem";
import type { SpotifyAlbum } from "@rvalte-hu/spotify-api";

export const SiteDataProvider = ({ children }: { children: ReactNode }) => {
    const [albums, setAlbums] = useState<SiteDataContextValue["albums"]>([]);
    const [albumsLoading, setAlbumsLoading] = useState(true);
    const [albumsSource, setAlbumsSource] = useState<DataSource>("loading");
    const [links, setLinks] = useState<SiteDataContextValue["links"]>([]);
    const [linksLoading, setLinksLoading] = useState(true);
    const [linksSource, setLinksSource] = useState<DataSource>("loading");
    const [timeLineItems, setTimeLineItems] = useState<
        SiteDataContextValue["timeLineItems"]
    >([]);

    const setUpTimeLineItems = (albums: SpotifyAlbum[]): void => {
        const timeLineItems: TimelineItem[] = [];
        for (const album of albums) {
            // It's lame af but Szalai released two singles without his artist profile,
            // so we have to filter them out manually. Otherwise they would show up in the timeline.
            // I don't want to filter in the API because I want to keep the API generic and not specific to this site.
            if (album.name.toLowerCase().includes("szalai")) continue;

            if (album.tracks && album.tracks.length > 0) {
                for (const track of album.tracks) {
                    timeLineItems.push({
                        artists: track.artists,
                        url: track.url,
                        album_type: album.album_type || "featured track",
                        image: album.image,
                        name: track.name,
                        release_date: album.release_date,
                        id: track.id,
                    } as TimelineItem);
                }
            } else {
                timeLineItems.push(album as TimelineItem);
            }
        }

        timeLineItems.sort((a, b) =>
            b.release_date.localeCompare(a.release_date),
        );
        setTimeLineItems(
            timeLineItems.filter(
                (i) =>
                    !i.name.toLowerCase().includes("szalai") &&
                    !i.name.toLowerCase().includes("tristezza"),
            ),
        );
    };

    useEffect(() => {
        const controller = new AbortController();

        void fetchSpotifyAlbums(controller.signal)
            .then((data) => {
                if (controller.signal.aborted) return;
                setAlbums(data);
                setAlbumsSource("api");
                setUpTimeLineItems(data);
            })
            .catch(() => {
                if (controller.signal.aborted) return;
                setAlbums(
                    [...fallbackSpotifyAlbums].sort((a, b) =>
                        a.release_date.localeCompare(b.release_date),
                    ),
                );
                setAlbumsSource("fallback");
                setUpTimeLineItems(fallbackSpotifyAlbums);
            })
            .finally(() => {
                if (!controller.signal.aborted) setAlbumsLoading(false);
            });

        void fetchSiteLinks(controller.signal)
            .then((data) => {
                if (controller.signal.aborted) return;
                setLinks(data);
                setLinksSource("api");
            })
            .catch(() => {
                if (controller.signal.aborted) return;
                setLinks(fallbackSiteLinks);
                setLinksSource("fallback");
            })
            .finally(() => {
                if (!controller.signal.aborted) setLinksLoading(false);
            });

        return () => controller.abort();
    }, []);

    const value = useMemo<SiteDataContextValue>(
        () => ({
            albums,
            albumsLoading,
            albumsSource,
            links,
            linksLoading,
            linksSource,
            timeLineItems,
        }),
        [
            albums,
            albumsLoading,
            albumsSource,
            links,
            linksLoading,
            linksSource,
            timeLineItems,
        ],
    );

    return (
        <SiteDataContext.Provider value={value}>
            {children}
        </SiteDataContext.Provider>
    );
};
