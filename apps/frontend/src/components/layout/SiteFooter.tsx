import { ArrowUpRight, Mail, ArrowUp } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { footerLinks } from "../../data/siteLinks";

const projectGithubUrl = footerLinks.projectGithubUrl.trim();
const contactEmail = footerLinks.contactEmail.trim();

export const SiteFooter = () => (
    <footer className="site-footer">
        <div className="page-width footer-inner">
            <div className="footer-top">
                <a className="footer-mark" href="#top">
                    rvalte.hu
                </a>
                <p>
                    Rajongói archívum.
                    <br />
                    Nem hivatalos oldal.
                </p>
                <a
                    className="to-top"
                    href="#top"
                    aria-label="Vissza az oldal tetejére"
                >
                    VISSZA A TETEJÉRE <ArrowUp size={16} aria-hidden="true" />
                </a>
            </div>

            <div className="footer-note-panel">
                <div className="disclaimer">
                    <span className="disclaimer-i">i</span>
                    <p>
                        <strong>Fontos megjegyzés: </strong>
                        Az rvalte.hu weboldal rajongói kezdeményezés,
                        és nem áll kapcsolatban Valterral.
                        Ez nem hivatalos rajongói projekt.
                        A weboldal célja kizárólag a közösség támogatása és információk megosztása.
                        A képek, zenei tartalmak és egyéb adatok szerzői jogai az eredeti tulajdonosoknál maradnak.
                        Amennyiben Valter, vagy képviselői szeretnék,
                        hogy a weboldal tartalma eltávolításra kerüljön,
                        vagy igényt tartanak a domain név átvételére,
                        kétség nélkül eleget teszek a kérésnek.
                    </p>
                </div>

                <div className="footer-contact-grid">
                    {projectGithubUrl && (
                        <a
                            className="footer-contact-card"
                            href={projectGithubUrl}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <span className="footer-contact-icon">
                                <FaGithub size={20} />
                            </span>
                            <span className="footer-contact-copy">
                                <small>NYÍLT PROJEKT</small>
                                <strong>Forráskód GitHubon</strong>
                                <span>A projekt megtekintése</span>
                            </span>
                            <ArrowUpRight
                                className="footer-contact-arrow"
                                size={17}
                            />
                        </a>
                    )}

                    {contactEmail && (
                        <a
                            className="footer-contact-card"
                            href={`mailto:${contactEmail}`}
                        >
                            <span className="footer-contact-icon">
                                <Mail size={20} />
                            </span>
                            <span className="footer-contact-copy">
                                <small>KAPCSOLAT</small>
                                <strong>Oldallal kapcsolatos kérdések, javaslatok</strong>
                                <span>
                                    Bármilyen kérdés, javaslat, vagy észrevétel esetén írj!
                                    Minden visszajelzés fontos, igyekszem a lehető leghamarabb válaszolni.
                                </span>
                            </span>
                            <ArrowUpRight
                                className="footer-contact-arrow"
                                size={17}
                            />
                        </a>
                    )}
                </div>
            </div>

            <div className="footer-bottom">
                <span>FAN-MADE PROJECT · NOT AFFILIATED WITH THE ARTIST</span>
                <span>HU / {new Date().getFullYear()}</span>
            </div>
        </div>
    </footer>
);
