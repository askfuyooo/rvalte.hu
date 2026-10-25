import { useEffect } from "react";
import { SiteDataProvider } from "./context/SiteDataProvider";
import { BackgroundPortrait } from "./components/layout/BackgroundPortrait";
import { PageProgress } from "./components/layout/PageProgress";
import { SiteFooter } from "./components/layout/SiteFooter";
import { SiteHeader } from "./components/layout/SiteHeader";
import { HeroVideo } from "./components/sections/HeroVideo";
import { SocialLinks } from "./components/sections/SocialLinks";
import { Timeline } from "./components/sections/Timeline";

export const App = () => {
    useEffect(() => {
        let frameId = 0;
        let isAnimating = false;

        const clearAnimation = () => {
            if (frameId) window.cancelAnimationFrame(frameId);
            frameId = 0;
            isAnimating = false;
            document.documentElement.classList.remove(
                "is-programmatic-scrolling",
            );
        };

        const stopForUserInput = (event: Event) => {
            if (!isAnimating) return;
            if (event.type === "keydown") {
                const key = (event as KeyboardEvent).key;
                if (
                    ![
                        "ArrowUp",
                        "ArrowDown",
                        "PageUp",
                        "PageDown",
                        "Home",
                        "End",
                        " ",
                    ].includes(key)
                )
                    return;
            }
            clearAnimation();
        };

        const onInternalNavigation = (event: MouseEvent) => {
            if (
                event.defaultPrevented ||
                event.button !== 0 ||
                event.metaKey ||
                event.ctrlKey ||
                event.shiftKey ||
                event.altKey
            )
                return;
            const clicked = event.target;
            if (!(clicked instanceof Element)) return;
            const anchor = clicked.closest<HTMLAnchorElement>("a[href]");
            if (!anchor || anchor.target === "_blank") return;
            const href = anchor.getAttribute("href");
            if (!href?.startsWith("#") || href.length < 2) return;

            let targetId: string;
            try {
                targetId = decodeURIComponent(href.slice(1));
            } catch {
                targetId = href.slice(1);
            }
            const target = document.getElementById(targetId);
            if (!target) return;

            event.preventDefault();
            clearAnimation();

            const scroller =
                document.scrollingElement ?? document.documentElement;
            const reducedMotion = window.matchMedia(
                "(prefers-reduced-motion: reduce)",
            ).matches;
            const nextUrl =
                targetId === "top"
                    ? `${window.location.pathname}${window.location.search}`
                    : `${window.location.pathname}${window.location.search}#${encodeURIComponent(targetId)}`;
            window.history.replaceState(window.history.state, "", nextUrl);

            if (window.matchMedia("(max-width: 640px)").matches) {
                target.scrollIntoView({
                    behavior: reducedMotion ? "auto" : "smooth",
                    block: "start",
                    inline: "nearest",
                });
                return;
            }

            if (!reducedMotion) {
                document.documentElement.classList.add(
                    "is-programmatic-scrolling",
                );
            }

            const startY = scroller.scrollTop;
            const isTopTarget = targetId === "top";
            const headerHeight =
                document
                    .querySelector<HTMLElement>(".site-header")
                    ?.getBoundingClientRect().height ?? 0;
            const targetDocumentY = startY + target.getBoundingClientRect().top;
            const offset = isTopTarget
                ? 0
                : target.classList.contains("release-row")
                  ? 108
                  : headerHeight + 16;
            const maxY = Math.max(
                0,
                scroller.scrollHeight - scroller.clientHeight,
            );
            const destinationY = Math.max(
                0,
                Math.min(maxY, targetDocumentY - offset),
            );

            if (reducedMotion || Math.abs(destinationY - startY) < 2) {
                scroller.scrollTop = destinationY;
                document.documentElement.classList.remove(
                    "is-programmatic-scrolling",
                );
                return;
            }

            isAnimating = true;
            const startTime = performance.now();
            const distance = destinationY - startY;
            const duration = Math.min(
                1400,
                Math.max(500, Math.abs(distance) * 0.38),
            );

            const tick = (now: number) => {
                if (!isAnimating) return;
                const linear = Math.min(1, (now - startTime) / duration);
                const eased =
                    linear < 0.5
                        ? 4 * linear * linear * linear
                        : 1 - Math.pow(-2 * linear + 2, 3) / 2;
                scroller.scrollTop = startY + distance * eased;

                if (linear < 1) {
                    frameId = window.requestAnimationFrame(tick);
                } else {
                    scroller.scrollTop = destinationY;
                    clearAnimation();
                }
            };

            frameId = window.requestAnimationFrame(tick);
        };

        document.addEventListener("click", onInternalNavigation, true);
        window.addEventListener("wheel", stopForUserInput, { passive: true });
        window.addEventListener("touchstart", stopForUserInput, {
            passive: true,
        });
        window.addEventListener("keydown", stopForUserInput);

        return () => {
            clearAnimation();
            document.removeEventListener("click", onInternalNavigation, true);
            window.removeEventListener("wheel", stopForUserInput);
            window.removeEventListener("touchstart", stopForUserInput);
            window.removeEventListener("keydown", stopForUserInput);
        };
    }, []);

    return (
        <SiteDataProvider>
            <div className="site-shell" id="top">
                <PageProgress />
                <BackgroundPortrait />
                <SiteHeader />

                <main>
                    <HeroVideo />
                    <SocialLinks />
                    <Timeline />
                </main>

                <SiteFooter />
            </div>
        </SiteDataProvider>
    );
};
