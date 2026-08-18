import { Link } from "react-router-dom";
import { businessInfo as demo } from "../lib/demoData";
import { useBusinessInfo } from "../lib/useContent";
import { useLanguage } from "../lib/i18n/LanguageContext";
import { instagramHref, isConfirmedPhone, isConfirmedText, telHref } from "../lib/business";

export default function Footer() {
  const { data: info } = useBusinessInfo();
  const b = info || demo;
  const { t } = useLanguage();
  const year = new Date().getFullYear();
  const phoneHref = telHref(b.phone);
  const ig = instagramHref(b.instagram);

  return (
    <footer className="bg-char-950 text-paper border-t border-white/10">
      <div className="container-narrow py-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <img src="/images/mark-bowl.png" alt="" className="h-9 w-9 object-contain bg-paper rounded-full p-1" />
            <p className="font-display text-xl font-semibold">
              <span className="text-leaf-400">Green</span> Corner
            </p>
          </div>
          {isConfirmedText(b.tagline) && (
            <p className="text-sm text-white/60 leading-relaxed">{b.tagline}</p>
          )}
        </div>

        <div>
          <p className="eyebrow text-leaf-300 mb-4">{t("footer.explore")}</p>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link to="/menu" className="hover:text-white">{t("nav.menu")}</Link></li>
            <li><Link to="/gallery" className="hover:text-white">{t("nav.gallery")}</Link></li>
            <li><Link to="/specials" className="hover:text-white">{t("nav.specials")}</Link></li>
            <li><Link to="/reviews" className="hover:text-white">{t("nav.reviews")}</Link></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow text-leaf-300 mb-4">{t("footer.visit")}</p>
          <ul className="space-y-2 text-sm text-white/70">
            <li>{b.neighborhood}, {b.city}</li>
            {phoneHref && isConfirmedPhone(b.phone) && (
              <li>
                <a href={phoneHref} className="hover:text-white">{b.phone}</a>
              </li>
            )}
            <li className="flex flex-wrap gap-x-3">
              {ig && (
                <a href={ig} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  Instagram
                </a>
              )}
              {isConfirmedText(b.facebookUrl) && (
                <a href={b.facebookUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  Facebook
                </a>
              )}
              {isConfirmedText(b.tiktokUrl) && (
                <a href={b.tiktokUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  TikTok
                </a>
              )}
            </li>
          </ul>
        </div>

        <div>
          <p className="eyebrow text-leaf-300 mb-4">{t("footer.order")}</p>
          <p className="text-sm text-white/70 mb-4">{t("footer.orderNote")}</p>
          <Link to="/contact" className="btn-citrus">{t("nav.orderAhead")}</Link>
        </div>
      </div>

      <div className="border-t border-white/10 py-6">
        <div className="container-narrow flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-white/40">
          <p>© {year} The Green Corner. {t("footer.rights")}</p>
        </div>
      </div>
    </footer>
  );
}
