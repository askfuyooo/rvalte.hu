import { Disc3 } from "lucide-react";
import { Reveal } from "../common/Reveal";
import { useSiteData } from "../../hooks/useSiteData";
import { ReleaseCard } from "./ReleaseCard";
import { TimelineSkeleton } from "./TimelineSkeleton";

export const Timeline = () => {
    const { timeLineItems, albumsLoading, albumsSource } = useSiteData();
    const releases = [...timeLineItems].sort((a, b) =>
        b.release_date.localeCompare(a.release_date),
    );
    const years = [
        ...new Set(releases.map((album) => album.release_date.slice(0, 4))),
    ].filter((year) => /^\d{4}$/.test(year));
    const statusText = albumsLoading
        ? "BETÖLTÉS ALATT"
        : albumsSource === "api"
          ? "API"
          : "HELYI ADATOK";

    return (
        <section id="timeline" className="timeline-section page-width">
            <Reveal className="section-label">
                <span>02</span>
                <p>DISZKOGRÁFIA / IDŐVONAL</p>
                <i />
            </Reveal>

            <Reveal className="timeline-heading-row">
                <div>
                    <p className="overline">ALBUMOK (EP, LP, SINGLE) ÉS DALOK</p>
                    <h2>
                        A megjelenések.
                        <br />
                        <em>Időrendben.</em>
                    </h2>
                </div>
                <div className="timeline-intro">
                    <p>
                        Diszkográfiai adatok a Spotify API-ból. A kártyákra kattintva az adott kiadvány Spotify oldalára jutsz.
                        A kiadványok listája két naponként frissül. Ha a Spotify API nem elérhető, a kiadványok helyi tartalékadatokkal jelennek meg.
                    </p>
                    <span
                        className={`api-state ${albumsSource === "api" ? "live" : ""} ${albumsLoading ? "is-loading" : ""}`}
                    >
                        <i />
                        {statusText}
                    </span>
                </div>
            </Reveal>

            {albumsLoading ? (
                <TimelineSkeleton />
            ) : releases.length > 0 ? (
                <div
                    className="timeline-list"
                    aria-label="Kiadások időrendben"
                    aria-busy="false"
                >
                    {releases.map((album, index) => {
                        const year = album.release_date.slice(0, 4);
                        const previousYear =
                            index > 0
                                ? releases[index - 1].release_date.slice(0, 4)
                                : "";
                        const isFirstInYear = year !== previousYear;

                        return (
                            <ReleaseCard
                                album={album}
                                index={index}
                                isFirstInYear={isFirstInYear}
                                key={`${album.id}-${album.release_date}`}
                            />
                        );
                    })}
                </div>
            ) : (
                <p className="timeline-message">
                    Nincs elérhető kiadvány.
                </p>
            )}

            <div className="timeline-footnote">
                <Disc3 size={16} />
                <p>
                    {albumsLoading
                        ? "A kiadványok adatai betöltés alatt..."
                        : albumsSource === "api"
                          ? "A kiadványok adatai a Spotify API segítségével kerülnek megjelenítésre."
                          : "Az API jelenleg nem érhető el, ezért a lista helyi tartalékadatokkal jelenik meg."}
                </p>
            </div>

            {!albumsLoading && releases.length > 0 && (
                <nav
                    className="timeline-year-nav"
                    aria-label="Ugrás kiadási évre"
                >
                    <div className="timeline-year-nav-heading">
                        <span>ARCHÍVUM / ÉVEK</span>
                        <span>UGRÁS AZ ÉVEKHEZ</span>
                    </div>
                    <div className="timeline-year-links">
                        {years.map((year) => (
                            <a href={`#timeline-year-${year}`} key={year}>
                                {year}
                                <span aria-hidden="true">↗</span>
                            </a>
                        ))}
                    </div>
                </nav>
            )}
        </section>
    );
};
