import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import SEO from "../components/SEO";
import LocalBusinessSchema from "../components/LocalBusinessSchema";
import { businessInfo as demo, hours as demoHours } from "../lib/demoData";
import { useBusinessInfo, useMenu, useGallery, useHours, useSpecials, useReviews } from "../lib/useContent";
import { isIllustration, isPlaceholderText } from "../lib/media";
import { useLanguage } from "../lib/i18n/LanguageContext";
import { displayPrice, mapsDirectionsHref, mapsEmbedSrc, mapsFallback } from "../lib/business";
import { useCart } from "../lib/CartContext";

const whyVisit = [
  { titleKey: "home.why1Title", bodyKey: "home.why1Body" },
  { titleKey: "home.why2Title", bodyKey: "home.why2Body" },
  { titleKey: "home.why3Title", bodyKey: "home.why3Body" }
];

function Stars({ rating }) {
  return (
    <span className="text-citrus-500" aria-label={`${rating} out of 5 stars`}>
      {"★".repeat(rating)}
      <span className="text-line/20">{"★".repeat(5 - rating)}</span>
    </span>
  );
}

export default function Home() {
  const { data: info } = useBusinessInfo();
  const b = info || demo;
  const { data: menu } = useMenu();
  const { data: gallery } = useGallery();
  const { data: hours } = useHours();
  const { data: specials } = useSpecials();
  const { data: reviews } = useReviews();
  const { t } = useLanguage();
  const { addItem } = useCart();
  const featured = (menu?.flatMap((c) => c.items) || []).filter((i) => i.specialty && i.available !== false).slice(0, 3);
  const liveHours = hours || demoHours;
  const realGallery = (gallery || []).filter((img) => img.url && !isPlaceholderText(img.caption)).slice(0, 4);
  const realSpecials = (specials || []).filter((s) => !isPlaceholderText(s.description)).slice(0, 3);
  const realReviews = (reviews || []).filter((r) => !isPlaceholderText(r.quote)).slice(0, 3);
  const fallback = mapsFallback(b);
  const directionsHref = mapsDirectionsHref(b.mapsQuery, fallback);
  const embedSrc = mapsEmbedSrc(b.mapsQuery, fallback);

  return (
    <>
      <SEO
        title="Grilled Fish & Brochettes in Nyamirambo, Kigali"
        description={b.description}
        path="/"
      />
      <LocalBusinessSchema business={b} hours={liveHours} />
      <Hero />

      <section className="container-narrow py-14 sm:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="eyebrow mb-3">{b.neighborhood}, {b.city}</p>
            <h2 className="section-heading">{t("home.neighborhoodHeading")}</h2>
          </div>
          <p className="text-mute leading-relaxed">{b.description}</p>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="band py-14 sm:py-20">
          <div className="container-narrow">
            <div className="flex items-end justify-between gap-4 mb-8">
              <div>
                <p className="eyebrow mb-3">{t("home.featuredSection")}</p>
                <h2 className="section-heading">{t("home.featuredHeading")}</h2>
              </div>
              <Link to="/menu" className="hidden sm:inline text-sm text-leaf-400 hover:text-leaf-300">
                {t("home.fullMenu")}
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-3">
              {featured.map((item) => (
                <article key={item.id} className="card-surface overflow-hidden flex flex-col">
                  {item.image && (
                    <div className={`h-48 w-full ${isIllustration(item.image) ? "bg-char-800 p-6 flex items-center justify-center" : ""}`}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className={isIllustration(item.image) ? "h-full w-full object-contain" : "h-full w-full object-cover"}
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-display text-lg font-semibold leading-snug">{item.name}</h3>
                      <span className="text-leaf-400 text-sm whitespace-nowrap">{displayPrice(item.price)}</span>
                    </div>
                    {!isPlaceholderText(item.description) && item.description && (
                      <p className="mt-2 text-sm text-mute flex-1">{item.description}</p>
                    )}
                    <button type="button" onClick={() => addItem(item)} className="btn-outline mt-4 w-full">
                      {t("common.addToOrder")}
                    </button>
                  </div>
                </article>
              ))}
            </div>
            <Link to="/menu" className="sm:hidden mt-6 inline-block text-sm text-leaf-400">
              {t("home.fullMenu")}
            </Link>
          </div>
        </section>
      )}

      <section className="container-narrow py-14 sm:py-20">
        <p className="eyebrow mb-3">{t("home.whySection")}</p>
        <h2 className="section-heading mb-8">{t("home.whyHeading")}</h2>
        <div className="grid gap-5 sm:grid-cols-3">
          {whyVisit.map((w) => (
            <div key={w.titleKey} className="card-surface p-6">
              <h3 className="font-display text-lg font-semibold text-leaf-400">{t(w.titleKey)}</h3>
              <p className="mt-2 text-sm text-mute leading-relaxed">{t(w.bodyKey)}</p>
            </div>
          ))}
        </div>
      </section>

      {realSpecials.length > 0 && (
        <section className="band py-14 sm:py-20">
          <div className="container-narrow">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="eyebrow mb-3">{t("home.specialsSection")}</p>
                <h2 className="section-heading">{t("home.specialsHeading")}</h2>
              </div>
              <Link to="/specials" className="hidden sm:inline text-sm text-leaf-400 hover:text-leaf-300">
                {t("nav.specials")} →
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-3">
              {realSpecials.map((s) => (
                <article key={s.id} className="card-surface overflow-hidden">
                  {s.image && (
                    <img src={s.image} alt="" className="h-40 w-full object-cover" loading="lazy" />
                  )}
                  <div className="p-5">
                    {s.tag && !isPlaceholderText(s.tag) && <p className="eyebrow mb-2">{s.tag}</p>}
                    <h3 className="font-display text-lg font-semibold">{s.title}</h3>
                    <p className="mt-2 text-sm text-mute">{s.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {realGallery.length > 0 && (
        <section className="band py-14 sm:py-20">
          <div className="container-narrow">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="eyebrow mb-3">{t("home.gallerySection")}</p>
                <h2 className="section-heading">{t("home.galleryHeading")}</h2>
              </div>
              <Link to="/gallery" className="hidden sm:inline text-sm text-leaf-400 hover:text-leaf-300">
                {t("home.fullGallery")}
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {realGallery.map((img) => (
                <div key={img.id} className={`aspect-square w-full rounded-xl overflow-hidden ${isIllustration(img.url) ? "bg-char-800 p-6" : ""}`}>
                  <img
                    src={img.url}
                    alt={img.caption || "The Green Corner"}
                    className={isIllustration(img.url) ? "h-full w-full object-contain" : "h-full w-full object-cover"}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {realReviews.length > 0 && (
        <section className="container-narrow py-14 sm:py-20">
          <p className="eyebrow mb-3">{t("home.reviewsSection")}</p>
          <h2 className="section-heading mb-8">{t("home.reviewsHeading")}</h2>
          <div className="grid gap-5 sm:grid-cols-3">
            {realReviews.map((r) => (
              <blockquote key={r.id} className="card-surface p-6">
                <Stars rating={r.rating} />
                <p className="mt-3 text-mute leading-relaxed">“{r.quote}”</p>
                <footer className="mt-4 text-sm font-medium">{r.author_name}</footer>
              </blockquote>
            ))}
          </div>
        </section>
      )}

      <section className="band py-14">
        <div className="container-narrow grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <p className="eyebrow mb-3">{t("home.findUsSection")}</p>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold">{b.neighborhood}, {b.city}</h2>
            <p className="text-mute mt-2">{t("home.orderNote")}</p>
            {(!liveHours || liveHours.length === 0) && (
              <p className="text-sm text-mute mt-3">{t("empty.hours")}</p>
            )}
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Link to="/book" className="btn-primary">{t("common.bookTable")}</Link>
              <Link to="/location" className="btn-outline">{t("common.getDirections")}</Link>
              <Link to="/contact" className="btn-outline">{t("common.orderAhead")}</Link>
            </div>
          </div>
          <a
            href={directionsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-2xl overflow-hidden border border-line/10 h-52 sm:h-64"
            aria-label="Open location in Google Maps"
          >
            <iframe
              title="The Green Corner location"
              className="h-full w-full pointer-events-none"
              loading="lazy"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              src={embedSrc}
            />
          </a>
        </div>
      </section>

      <section className="relative overflow-hidden bg-soot text-white py-16 sm:py-20">
        <img src="/images/hero-embers.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-black/70" />
        <div className="container-narrow relative text-center max-w-2xl">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold">{t("home.ctaHeading")}</h2>
          <p className="mt-3 text-white/70">{t("home.ctaBody")}</p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
            <Link to="/menu" className="btn-primary">{t("common.viewMenu")}</Link>
            <Link to="/contact" className="btn-citrus">{t("common.orderAhead")}</Link>
          </div>
        </div>
      </section>
    </>
  );
}
