import { Link } from "react-router-dom";
import { businessInfo as demo, hours as demoHours } from "../lib/demoData";
import { useBusinessInfo, useHours } from "../lib/useContent";
import { useLanguage } from "../lib/i18n/LanguageContext";
import { useCart } from "../lib/CartContext";
import OpenStatusBadge from "./OpenStatusBadge";

export default function Hero() {
  const { data: info } = useBusinessInfo();
  const b = info || demo;
  const { data: hours } = useHours();
  const { t } = useLanguage();
  const { openCart, count } = useCart();

  const videoOn = b.heroMediaType === "video" && b.heroVideoUrl;
  const backdrop = b.heroImage1 || "/images/hero-embers.jpg";

  return (
    <section className="relative min-h-[88vh] sm:min-h-[92vh] flex items-end overflow-hidden bg-ink-900 text-white">
      {videoOn ? (
        <video
          src={b.heroVideoUrl}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
      ) : (
        <img
          src={backdrop}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/25" />
      <div className="absolute inset-0 bg-leaf-700/10 mix-blend-multiply" />

      <div className="container-narrow relative z-10 w-full pt-28 pb-14 sm:pb-20">
        <div className="max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <p className="eyebrow text-leaf-100/90">
              {b.neighborhood}, {b.city}
            </p>
            <OpenStatusBadge hours={hours || demoHours} invert />
          </div>

          <h1 className="mt-5 font-display text-[2.35rem] sm:text-5xl lg:text-6xl font-semibold leading-[1.05]">
            Fire-grilled fish
            <span className="italic text-citrus-400"> &amp; brochettes.</span>
          </h1>

          <p className="mt-5 max-w-xl text-base sm:text-lg text-white/75 leading-relaxed">
            {b.description}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link to="/menu" className="btn-primary">
              {t("common.viewMenu")}
            </Link>
            {count > 0 ? (
              <button type="button" onClick={openCart} className="btn-citrus">
                {t("nav.orderAhead")} · {count}
              </button>
            ) : (
              <Link to="/contact" className="btn-citrus">
                {t("common.orderAhead")}
              </Link>
            )}
            <Link to="/location" className="btn-ghost-light">
              {t("common.getDirections")}
            </Link>
          </div>

          {b.serviceOptions?.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {b.serviceOptions.map((opt) => (
                <span
                  key={opt}
                  className="rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs text-white/80"
                >
                  {opt}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
