import { Link } from "react-router-dom";
import { businessInfo as demo } from "../lib/demoData";
import { useBusinessInfo } from "../lib/useContent";
import { useLanguage } from "../lib/i18n/LanguageContext";

export default function Footer() {
  const { data: info } = useBusinessInfo();
  const b = info || demo;
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-ink-900/8">
      <div className="container-narrow py-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          {b.logoUrl ? (
            <img src={b.logoUrl} alt={`${b.name} logo`} className="h-10 w-auto mb-3" />
          ) : (
            <p className="font-display text-xl font-semibold mb-3">
              <span className="text-leaf-600">Green</span> Corner
            </p>
          )}
          <p className="text-sm text-ink-700/60 leading-relaxed">
            {b.tagline}
          </p>
        </div>

        <div>
          <p className="eyebrow mb-4">{t("footer.explore")}</p>
          <ul className="space-y-2 text-sm text-ink-700/70">
            <li><Link to="/menu" className="hover:text-leaf-600">{t("nav.menu")}</Link></li>
            <li><Link to="/gallery" className="hover:text-leaf-600">{t("nav.gallery")}</Link></li>
            <li><Link to="/specials" className="hover:text-leaf-600">{t("nav.specials")}</Link></li>
            <li><Link to="/reviews" className="hover:text-leaf-600">{t("nav.reviews")}</Link></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-4">{t("footer.visit")}</p>
          <ul className="space-y-2 text-sm text-ink-700/70">
            <li>{b.neighborhood}, {b.city}</li>
            <li>
              {b.phone?.startsWith("PLACEHOLDER") ? (
                <span className="text-ink-700/40">{b.phone}</span>
              ) : (
                <a href={`tel:${b.phone?.replace(/\s/g, "")}`} className="hover:text-leaf-600">{b.phone}</a>
              )}
            </li>
            <li className="flex flex-wrap gap-x-3">
              {b.instagram && (
                <a href={`https://instagram.com/${b.instagram.replace("@", "")}`} target="_blank" rel="noreferrer" className="hover:text-leaf-600">
                  Instagram
                </a>
              )}
              {b.facebookUrl && (
                <a href={b.facebookUrl} target="_blank" rel="noreferrer" className="hover:text-leaf-600">
                  Facebook
                </a>
              )}
              {b.tiktokUrl && (
                <a href={b.tiktokUrl} target="_blank" rel="noreferrer" className="hover:text-leaf-600">
                  TikTok
                </a>
              )}
            </li>
          </ul>
        </div>

        <div>
          <p className="eyebrow mb-4">{t("footer.order")}</p>
          <p className="text-sm text-ink-700/70 mb-4">{t("footer.orderNote")}</p>
          <Link to="/contact" className="btn-outline">{t("nav.orderAhead")}</Link>
        </div>
      </div>

      <div className="border-t border-ink-900/8 py-6">
        <div className="container-narrow flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-ink-700/40">
          <p>© {year} The Green Corner. {t("footer.rights")}</p>
        </div>
      </div>
    </footer>
  );
}
