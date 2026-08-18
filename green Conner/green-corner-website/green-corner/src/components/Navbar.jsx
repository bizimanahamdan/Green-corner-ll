import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { businessInfo as demo } from "../lib/demoData";
import { useBusinessInfo } from "../lib/useContent";
import { useLanguage } from "../lib/i18n/LanguageContext";
import { useCart } from "../lib/CartContext";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: info } = useBusinessInfo();
  const b = info || demo;
  const { t, language, toggleLanguage } = useLanguage();
  const { count, openCart } = useCart();
  const location = useLocation();

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
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const linkClass = ({ isActive }) =>
    `text-sm font-medium tracking-wide transition-colors ${
      isActive ? "text-ember-400" : "text-paper/75 hover:text-paper"
    }`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled || open ? "bg-char-950/95 backdrop-blur border-b border-line/10" : "bg-char-950/70 backdrop-blur-sm"
      }`}
    >
      <div className="container-narrow flex items-center justify-between py-3 sm:py-4">
        <NavLink to="/" className="flex items-center gap-2.5 min-w-0">
          <img src="/images/mark-bowl.png" alt="" className="h-9 w-9 object-contain bg-white rounded-full p-1" />
          <span className="font-display text-lg sm:text-xl font-semibold tracking-wide truncate text-paper">
            <span className="text-leaf-400">Green</span> Corner
          </span>
          <span className="sr-only">{b.name}</span>
        </NavLink>

        <nav className="hidden lg:flex items-center gap-6">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
          <ThemeToggle />
          <button
            onClick={toggleLanguage}
            className="text-xs font-semibold border border-line/20 rounded-full px-3 py-1.5 text-paper/75 hover:border-ember-400 hover:text-ember-400 transition-colors min-h-[36px]"
            aria-label="Switch language"
          >
            {language === "en" ? "RW" : "EN"}
          </button>
          {count > 0 && (
            <button type="button" onClick={openCart} className="relative text-sm font-medium text-paper">
              Order
              <span className="ml-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-citrus-500 px-1 text-[11px] font-bold text-soot">
                {count}
              </span>
            </button>
          )}
          <NavLink to="/contact" className="btn-primary">
            {t("nav.orderAhead")}
          </NavLink>
        </nav>

        <div className="flex items-center gap-1.5 lg:hidden">
          {count > 0 && (
            <button
              type="button"
              onClick={openCart}
              className="relative p-2 text-paper"
              aria-label={`Open order, ${count} items`}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 6h18M16 10a4 4 0 0 1-8 0" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="absolute top-0.5 right-0.5 h-4 min-w-[1rem] rounded-full bg-citrus-500 px-1 text-[10px] font-bold text-soot">
                {count}
              </span>
            </button>
          )}
          <ThemeToggle />
          <button
            onClick={toggleLanguage}
            className="text-xs font-semibold border border-line/20 rounded-full px-2.5 py-1 min-h-[36px] text-paper/75"
            aria-label="Switch language"
          >
            {language === "en" ? "RW" : "EN"}
          </button>
          <button
            className="p-2 text-paper"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav-drawer"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <svg aria-hidden="true" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            ) : (
              <svg aria-hidden="true" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-nav-drawer" className="lg:hidden bg-char-950 border-t border-line/10">
          <nav className="container-narrow flex flex-col py-3 pb-6">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `py-3 text-base border-b border-line/10 ${isActive ? "text-ember-400" : "text-paper"}`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <NavLink to="/contact" className="btn-primary mt-4 w-full">
              {t("nav.orderAhead")}
            </NavLink>
          </nav>
        </div>
      )}
    </header>
  );
}
