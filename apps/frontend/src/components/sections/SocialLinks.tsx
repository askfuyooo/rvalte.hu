import { ArrowUpRight, ExternalLink } from "lucide-react";
import { FaInstagram, FaYoutube, FaTiktok, FaSpotify } from "react-icons/fa";
import { SiApplemusic } from "react-icons/si";
import { MdAlternateEmail } from "react-icons/md";
import { BsTwitterX } from "react-icons/bs";
import { Reveal } from "../common/Reveal";
import { SkeletonBlock } from "../common/SkeletonBlock";
import { useSiteData } from "../../hooks/useSiteData";
import type { SocialLink } from "@rvalte-hu/linktree-scraper-api";

const SKELETON_LINK_COUNT = 5;

const LinkIcon = ({ link }: { link: SocialLink }) => {
    switch (link.type) {
        case "INSTAGRAM":
            return <FaInstagram size={20} aria-hidden="true" />;
        case "TIKTOK":
            return <FaTiktok size={20} aria-hidden="true" />;
        case "SPOTIFY":
            return <FaSpotify size={20} aria-hidden="true" />;
        case "APPLE_MUSIC":
            return <SiApplemusic size={20} aria-hidden="true" />;
        case "YOUTUBE":
            return <FaYoutube size={20} aria-hidden="true" />;
        case "EMAIL_ADDRESS":
            return <MdAlternateEmail size={19} aria-hidden="true" />;
        case "X":
            return <BsTwitterX size={20} aria-hidden="true" />;
        default:
            return <ExternalLink size={19} aria-hidden="true" />;
    }
};

const SocialLinksSkeleton = () => {
    return (
        <div
            className="social-links social-links--loading"
            role="status"
            aria-label="Profilhivatkozások betöltése"
            aria-busy="true"
        >
            {Array.from({ length: SKELETON_LINK_COUNT }, (_, index) => (
                <div
                    className="social-line social-line--skeleton"
                    key={index}
                    aria-hidden="true"
                >
                    <SkeletonBlock className="skeleton-social-num" />
                    <span className="social-skeleton-title">
                        <SkeletonBlock className="skeleton-social-icon" />
                        <SkeletonBlock
                            className={`skeleton-social-label skeleton-social-label--${index + 1}`}
                        />
                    </span>
                    <span className="social-handle">
                        <SkeletonBlock className="skeleton-social-meta" />
                    </span>
                    <SkeletonBlock className="skeleton-social-arrow" />
                </div>
            ))}
        </div>
    );
};

export const SocialLinks = () => {
    const { links, linksLoading } = useSiteData();

    return (
        <section id="links" className="links-section page-width">
            <Reveal className="section-label">
                <span>01</span>
                <p>ELÉRHETŐSÉG</p>
                <i />
            </Reveal>

            <div className="links-intro">
                <Reveal>
                    <p className="overline">RVALTE / LINKGYŰJTEMÉNY</p>
                    <h2>
                        Ahol
                        <br />
                        <em>megtalálod.</em>
                    </h2>
                </Reveal>
                <Reveal delay={0.1}>
                    <p>
                        Nyilvánosan elérhető hivatkozások az @rvalte Linktree
                        profilból.
                    </p>
                </Reveal>
            </div>

            {linksLoading ? (
                <SocialLinksSkeleton />
            ) : (
                <div className="social-links" aria-busy="false">
                    {links.map((link, index) => (
                        <Reveal
                            key={`social-link-${index}`}
                            delay={Math.min(index * 0.04, 0.2)}
                        >
                            <a
                                className="social-line"
                                href={link.url}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <span className="social-num">
                                    {String(index + 1).padStart(2, "0")}
                                </span>
                                <span className="social-title">
                                    <LinkIcon link={link} />{" "}
                                    {link.type.replace("_", " ")}
                                </span>
                                <ArrowUpRight size={19} aria-hidden="true" />
                            </a>
                        </Reveal>
                    ))}
                </div>
            )}
        </section>
    );
};
