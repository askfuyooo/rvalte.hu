import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { siteLinks } from "../../data/siteLinks";
import { useSiteData } from "../../hooks/useSiteData";
import { SkeletonBlock } from "../common/SkeletonBlock";

export const SiteHeader = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { links, linksLoading } = useSiteData();
    const linktreeHref =
        links.find((link) => String(link.type) === "LINKTREE")?.url ??
        siteLinks.linktree;

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        document.body.classList.toggle("menu-open", menuOpen);
        return () => document.body.classList.remove("menu-open");
    }, [menuOpen]);

    const closeMenu = () => setMenuOpen(false);

    return (
        <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
            <div className="header-brand">
                <a
                    href="#top"
                    className="wordmark"
                    aria-label="rvalte.hu - Rajongói, nem hivatalos weboldal"
                >
                    <img
                        className="wordmark-signature"
                        src="/imgs/valter-signature.png"
                        alt="rvalte"
                        draggable={false}
                    />
                </a>
                <span
                    className="beta-badge"
                    title="Az oldal jelenleg tesztfázisban van"
                    aria-label="Béta, tesztfázis"
                >
                    <span className="beta-badge__dot" aria-hidden="true" />
                    <span className="beta-badge__full">BÉTA</span>
                    <span className="beta-badge__short">BÉTA</span>
                </span>
            </div>

            <nav
                className={menuOpen ? "header-nav open" : "header-nav"}
                aria-label="Fő navigáció"
            >
                <a href="#links" onClick={closeMenu}>
                    Profilok
                </a>
                <a href="#timeline" onClick={closeMenu}>
                    Idővonal
                </a>
            </nav>

            {linksLoading ? (
                <span
                    className="header-cta header-cta--skeleton"
                    role="status"
                    aria-label="Linkek betöltése"
                >
                    <SkeletonBlock className="skeleton-header-cta" />
                </span>
            ) : (
                <a
                    className="header-cta"
                    href={linktreeHref}
                    target="_blank"
                    rel="noreferrer"
                >
                    Linktree <ArrowUpRight size={15} />
                </a>
            )}

            <button
                className="mobile-menu"
                type="button"
                aria-label={menuOpen ? "Menü bezárása" : "Menü megnyitása"}
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((open) => !open)}
            >
                {menuOpen ? <X /> : <Menu />}
            </button>
        </header>
    );
}
