import { useEffect, useState } from "react";
import {
    motion,
    useReducedMotion,
    useScroll,
    useTransform,
} from "framer-motion";
import { useSiteData } from "../../hooks/useSiteData";
import { SkeletonBlock } from "../common/SkeletonBlock";
import type { TimelineItem } from "../../types/timeLineItem";

export const BackgroundPortrait = () => {
    const { timeLineItems, albumsLoading } = useSiteData();
    const [sideReleases, setSideReleases] = useState<TimelineItem[]>([]);

    useEffect(() => {
        if (timeLineItems.length === 0) {
            setSideReleases([]);
            return;
        }

        const pickCount = Math.min(6, timeLineItems.length);
        const randomIndexes = new Set<number>();

        while (randomIndexes.size < pickCount) {
            randomIndexes.add(Math.floor(Math.random() * timeLineItems.length));
        }

        setSideReleases(
            [...randomIndexes].map((index) => timeLineItems[index]),
        );
    }, [timeLineItems]);

    const sideReleasesLoading =
        albumsLoading ||
        (timeLineItems.length > 0 && sideReleases.length === 0);
    const reduceMotion = useReducedMotion();
    const { scrollYProgress } = useScroll();

    const wordmarkY = useTransform(scrollYProgress, [0, 1], [12, -118]);
    const releaseMotion = [
        useTransform(scrollYProgress, [0, 1], [-12, 72]),
        useTransform(scrollYProgress, [0, 1], [28, -55]),
        useTransform(scrollYProgress, [0, 1], [-18, 46]),
        useTransform(scrollYProgress, [0, 1], [36, -38]),
        useTransform(scrollYProgress, [0, 1], [-26, 58]),
        useTransform(scrollYProgress, [0, 1], [18, -64]),
    ];
    const releaseRotations = [-7, 5, 4, -5, 6, -3];

    return (
        <div className="atmosphere-layer" aria-hidden="true">
            <div className="atmosphere-grain" />

            <motion.div
                className="atmosphere-wordmark"
                style={reduceMotion ? undefined : { y: wordmarkY }}
            >
                RVALTE
            </motion.div>

            <div className="atmosphere-lyric" aria-hidden="true">
                <span className="atmosphere-lyric-prefix">ibbi</span>
                <span className="atmosphere-lyric-line atmosphere-lyric-line--gang">
                    a gang
                </span>
                <span className="atmosphere-lyric-line atmosphere-lyric-line--toppon">
                    a toppon
                </span>
                <span className="atmosphere-lyric-line atmosphere-lyric-line--egbe">
                    az égbe
                </span>
            </div>

            <div className="atmosphere-index">
                <span>RV / 001</span>
                <i />
                <span>IBBIGANG</span>
                <span>1331</span>
            </div>

            <div className="atmosphere-orbit atmosphere-orbit--one" />
            <div className="atmosphere-orbit atmosphere-orbit--two" />

            <img
                src="/imgs/valter-portrait.png"
                alt=""
                className="fixed-portrait"
                draggable={false}
            />

            {sideReleasesLoading
                ? Array.from({ length: 6 }, (_, index) => (
                      <motion.div
                          key={`release-skeleton-${index}`}
                          className={`atmosphere-release atmosphere-release--${index + 1} atmosphere-release--skeleton`}
                          style={
                              reduceMotion
                                  ? { rotate: releaseRotations[index] }
                                  : {
                                        y: releaseMotion[index],
                                        rotate: releaseRotations[index],
                                    }
                          }
                      >
                          <div className="atmosphere-release-art atmosphere-release-art--skeleton">
                              <SkeletonBlock className="skeleton-atmosphere-cover" />
                              <span className="atmosphere-release-index">
                                  0{index + 1}
                              </span>
                          </div>
                          <div className="atmosphere-release-meta">
                              <SkeletonBlock className="skeleton-atmosphere-meta" />
                              <SkeletonBlock className="skeleton-atmosphere-title" />
                          </div>
                      </motion.div>
                  ))
                : sideReleases.map((album, index) => (
                      <motion.div
                          key={album.id}
                          className={`atmosphere-release atmosphere-release--${index + 1}`}
                          style={
                              reduceMotion
                                  ? { rotate: releaseRotations[index] }
                                  : {
                                        y: releaseMotion[index],
                                        rotate: releaseRotations[index],
                                    }
                          }
                      >
                          <div className="atmosphere-release-art">
                              <img
                                  src={album.image.url}
                                  alt=""
                                  loading="lazy"
                              />
                              <span className="atmosphere-release-index">
                                  0{index + 1}
                              </span>
                          </div>
                          <div className="atmosphere-release-meta">
                              <span>
                                  {album.release_date.slice(0, 4)} /{" "}
                                  {album.album_type.toUpperCase()}
                              </span>
                              <strong>{album.name}</strong>
                              <span>
                                  {album.artists.length > 0 &&
                                      album.artists
                                          .map((artist) => artist.name)
                                          .join(", ")}
                              </span>
                          </div>
                      </motion.div>
                  ))}

            <div className="atmosphere-coordinate">
                <span>47.47520150985004</span>
                <span>19.050387293033438</span>
                <i />
                <span>STRENGTH & SOUND</span>
            </div>
        </div>
    );
};
