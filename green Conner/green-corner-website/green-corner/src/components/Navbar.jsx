import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { businessInfo as demo } from "../lib/demoData";
import { useBusinessInfo } from "../lib/useContent";
import { useLanguage } from "../lib/i18n/LanguageContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: info } = useBusinessInfo();
  const b = info || demo;
  const { t, language, toggleLanguage } = useLanguage();

  const links = [
    { to: "/menu", label: t("nav.menu") },
    { to: "/about", label: t("nav.about") },
    { to: "/gallery", label: t("nav.gallery") },
    { to: "/specials", label: t("nav.specials") },
    { to: "/reviews", label: t("nav.reviews") },
    { to: "/location", label: t("nav.location") }
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-cream/95 backdrop-blur border-b border-ink-900/8" : "bg-transparent"
      }`}
    >
      <div className="container-narrow flex items-center justify-between py-4">
        <NavLink to="/" className="flex items-center gap-2 font-display text-xl font-semibold text-ink-900">
          {b.logoUrl ? (
            <img src={b.logoUrl} alt={`${b.name} logo`} className="h-10 w-auto" />
          ) : (
            <>
              <span className="text-leaf-600">Green</span> Corner
            </>
          )}
        </NavLink>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive ? "text-leaf-600" : "text-ink-700/80 hover:text-ink-900"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <button
            onClick={toggleLanguage}
            className="text-xs font-semibold border border-ink-900/15 rounded-full px-3 py-1.5 text-ink-700/70 hover:border-leaf-500 hover:text-leaf-600 transition-colors"
            aria-label="Switch language"
          >
            {language === "en" ? "RW" : "EN"}
          </button>
          <NavLink to="/contact" className="btn-primary">
            {t("nav.orderAhead")}
          </NavLink>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleLanguage}
            className="text-xs font-semibold border border-ink-900/15 rounded-full px-2.5 py-1 text-ink-700/70"
            aria-label="Switch language"
          >
            {language === "en" ? "RW" : "EN"}
          </button>
          <button
            className="text-ink-900 p-2"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-cream border-t border-ink-900/8">
          <nav className="container-narrow flex flex-col py-4 gap-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `py-3 text-base border-b border-ink-900/5 ${isActive ? "text-leaf-600" : "text-ink-800"}`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <NavLink to="/contact" onClick={() => setOpen(false)} className="btn-primary mt-4 w-full">
              {t("nav.orderAhead")}
            </NavLink>
          </nav>
        </div>
      )}
    </header>
  );
}
