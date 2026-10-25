import { ArrowDown, ArrowUpRight, Play } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { siteLinks } from "../../data/siteLinks";

const easing = [0.22, 1, 0.36, 1] as const;

export const HeroVideo = () => {
    const prefersReducedMotion = useReducedMotion();

    return (
        <section className="hero-video-section" aria-label="Soundcheck klip">
            <div className="hero-video">
                <iframe
                    src="https://www.youtube-nocookie.com/embed/P-L5vs92M94?autoplay=1&mute=1&start=18&controls=0&disablekb=1&loop=1&playlist=P-L5vs92M94&playsinline=1&rel=0&iv_load_policy=3&cc_load_policy=0&hl=hu&modestbranding=1"
                    title="ibbigang - Soundcheck (Official Video)"
                    allow="autoplay; encrypted-media; picture-in-picture"
                    referrerPolicy="strict-origin-when-cross-origin"
                    tabIndex={-1}
                    aria-hidden="true"
                />
                <div className="video-scrim" />
                <div className="video-vignette" />

                <div className="hero-content page-width">
                    <motion.h1
                        initial={
                            prefersReducedMotion ? false : { opacity: 0, y: 34 }
                        }
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: prefersReducedMotion ? 0 : 0.9,
                            delay: 0.2,
                            ease: easing,
                        }}
                    >
                        RVALTE<span>.</span>
                    </motion.h1>

                    <motion.div
                        className="hero-bottom"
                        initial={
                            prefersReducedMotion ? false : { opacity: 0, y: 18 }
                        }
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: prefersReducedMotion ? 0 : 0.7,
                            delay: 0.45,
                        }}
                    >
                        <a
                            href={siteLinks.soundcheck}
                            target="_blank"
                            rel="noreferrer"
                            className="watch-link"
                        >
                            <span>
                                <Play size={13} fill="currentColor" />
                            </span>
                            Klip megnyitása <ArrowUpRight size={14} />
                        </a>
                        <a href="#links" className="hero-scroll">
                            LEJJEBB <ArrowDown size={14} />
                        </a>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
