import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { FaSpotify } from "react-icons/fa";
import type { TimelineItem } from "../../types/timeLineItem";

type ReleaseCardProps = {
    album: TimelineItem;
    index: number;
    isFirstInYear: boolean;
};

const formatFullDate = (date: string): string => {
    const [year, month, day] = date.split("-");
    if (!month) return year;
    if (!day) return `${year}.${month}.`;
    return `${year}.${month}.${day}.`;
};

const formatDayMonth = (date: string): string => {
    const [, month, day] = date.split("-");
    if (month && day) return `${day}.${month}.`;
    if (month) return `${month}. hó`;
    return date.slice(0, 4);
};

const easing = [0.22, 1, 0.36, 1] as const;

export const ReleaseCard = ({
    album,
    index,
    isFirstInYear,
}: ReleaseCardProps) => {
    const prefersReducedMotion = useReducedMotion();
    const artists = album.artists.map((artist) => artist.name).join(", ");
    const href = album.url;
    const kind = album.album_type;

    return (
        <motion.div
            id={
                isFirstInYear
                    ? `timeline-year-${album.release_date.slice(0, 4)}`
                    : undefined
            }
            className={`release-row ${isFirstInYear ? "release-row--year-start" : ""}`}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.12 }}
            transition={{
                duration: prefersReducedMotion ? 0 : 0.55,
                delay: Math.min(index * 0.045, 0.25),
                ease: easing,
            }}
        >
            <div
                className={`release-date ${isFirstInYear ? "release-date--year" : "release-date--detail"}`}
            >
                {isFirstInYear ? (
                    <>
                        <span className="release-date-primary">
                            {album.release_date.slice(0, 4)}
                        </span>
                        <small>{formatFullDate(album.release_date)}</small>
                    </>
                ) : (
                    <>
                        <span className="release-date-primary release-date-primary--detail">
                            {formatDayMonth(album.release_date)}
                        </span>
                        <small>{album.release_date.slice(0, 4)}</small>
                    </>
                )}
            </div>
            <div className="release-node" aria-hidden="true">
                <span />
            </div>

            <motion.a
                className="release-card"
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={`${album.name} - ${artists}. Megnyitás Spotifyon.`}
                initial="rest"
                whileHover="hover"
                whileFocus="hover"
                whileTap={prefersReducedMotion ? undefined : { scale: 0.995 }}
                transition={{
                    duration: prefersReducedMotion ? 0 : 0.32,
                    ease: easing,
                }}
            >
                <div className="release-cover-wrap">
                    <div className="release-cover">
                        <img
                            src={album.image.url}
                            alt={`${album.name} borító`}
                            loading="lazy"
                            width={album.image.width}
                            height={album.image.height}
                        />
                        <span className="cover-open">
                            <ArrowUpRight size={20} />
                        </span>
                    </div>
                </div>

                <div className="release-card-content">
                    <div className="release-card-meta">
                        <span className="release-number">
                            {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className={`format-tag ${kind.toLowerCase()}`}>
                            {kind}
                        </span>
                        <span className="release-open-label">
                            <FaSpotify size={14} /> SPOTIFY{" "}
                            <ArrowUpRight size={13} />
                        </span>
                    </div>

                    <h3>{album.name}</h3>
                    <p className="release-artists">{artists}</p>
                    <div className="release-card-hint">
                        <span>{album.album_type === "featured track" ? "DAL" : "ALBUM"} ADATAI</span>
                        <span className="hint-dash" />
                        <span>HOVER TO EXPLORE</span>
                    </div>

                    <motion.div
                        className="release-expanded"
                        variants={{
                            rest: { height: 0, opacity: 0, y: -7 },
                            hover: { height: "auto", opacity: 1, y: 0 },
                        }}
                        transition={{
                            duration: prefersReducedMotion ? 0 : 0.34,
                            ease: easing,
                        }}
                    >
                        <div className="release-expanded-rule" />
                        <div className="release-expanded-grid">
                            <div>
                                <span>MEGJELENÉS</span>
                                <strong>{album.release_date}</strong>
                            </div>
                            <div>
                                <span>TÍPUS</span>
                                <strong>{kind}</strong>
                            </div>
                            <div>
                                <span>ELŐADÓ{album.artists.length > 1 ? "K" : ""}</span>
                                <strong>{artists}</strong>
                            </div>
                        </div>
                        <div className="release-expanded-cta">
                            <FaSpotify size={17} />
                            <span>MEGNYITÁS SPOTIFYON</span>
                            <ArrowUpRight size={16} />
                        </div>
                    </motion.div>
                </div>
            </motion.a>
        </motion.div>
    );
};
