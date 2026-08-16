import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import SEO from "../components/SEO";
import LocalBusinessSchema from "../components/LocalBusinessSchema";
import { businessInfo as demo, hours as demoHours } from "../lib/demoData";
import { useBusinessInfo, useMenu, useGallery, useHours } from "../lib/useContent";
import { isIllustration } from "../lib/media";
import { useLanguage } from "../lib/i18n/LanguageContext";

const whyVisit = [
  { title: "Made to order", body: "Every smoothie and salad is blended or tossed fresh when you order — nothing pre-made." },
  { title: "Whole, real ingredients", body: "Fruit, vegetables and simple add-ins. No shortcuts, no invented health claims." },
  { title: "Quick & easy", body: "A fast, friendly stop in Nyamirambo for something that actually makes you feel good." }
];

export default function Home() {
  const { data: info } = useBusinessInfo();
  const b = info || demo;
  const { data: menu } = useMenu();
  const { data: gallery } = useGallery();
  const { data: hours } = useHours();
  const { t } = useLanguage();
  const featured = (menu?.flatMap((c) => c.items) || []).filter((i) => i.specialty).slice(0, 3);

  return (
    <>
      <SEO
        title="Fresh Smoothies & Salads in Nyamirambo, Kigali"
        description={b.description}
        path="/"
      />
      <LocalBusinessSchema business={b} hours={hours || demoHours} />
      <Hero />

      {/* Intro strip */}
      <section className="container-narrow py-16 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="eyebrow mb-3">Nyamirambo, Kigali</p>
            <h2 className="section-heading">A fresh corner in the neighborhood.</h2>
          </div>
          <p className="text-ink-700/70 leading-relaxed">{b.description}</p>
        </div>
      </section>

      {/* Featured items */}
      {featured.length > 0 && (
        <section className="bg-white border-y border-ink-900/8 py-16 sm:py-20">
          <div className="container-narrow">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="eyebrow mb-3">{t("home.featuredSection")}</p>
                <h2 className="section-heading">{t("home.featuredHeading")}</h2>
              </div>
              <Link to="/menu" className="hidden sm:inline text-sm text-leaf-600 hover:text-leaf-700">
                {t("home.fullMenu")}
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              {featured.map((item) => (
                <div key={item.id} className="card-surface overflow-hidden">
                  {item.image && (
                    <div className={`h-48 w-full flex items-center justify-center ${isIllustration(item.image) ? "bg-mint p-6" : ""}`}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className={isIllustration(item.image) ? "h-full w-full object-contain" : "h-full w-full object-cover"}
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="font-display text-lg font-semibold">{item.name}</h3>
                      <span className="text-leaf-600 text-sm whitespace-nowrap">RF {item.price}</span>
                    </div>
                    <p className="mt-2 text-sm text-ink-700/60">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/menu" className="sm:hidden mt-8 inline-block text-sm text-leaf-600">
              {t("home.fullMenu")}
            </Link>
          </div>
        </section>
      )}

      {/* Why visit */}
      <section className="container-narrow py-16 sm:py-20">
        <p className="eyebrow mb-3">{t("home.whySection")}</p>
        <h2 className="section-heading mb-10">{t("home.whyHeading")}</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {whyVisit.map((w) => (
            <div key={w.title} className="card-surface p-6">
              <h3 className="font-display text-lg font-semibold text-leaf-600">{w.title}</h3>
              <p className="mt-2 text-sm text-ink-700/65 leading-relaxed">{w.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery preview */}
      <section className="bg-white border-y border-ink-900/8 py-16 sm:py-20">
        <div className="container-narrow">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="eyebrow mb-3">{t("home.gallerySection")}</p>
              <h2 className="section-heading">{t("home.galleryHeading")}</h2>
            </div>
            <Link to="/gallery" className="hidden sm:inline text-sm text-leaf-600 hover:text-leaf-700">
              {t("home.fullGallery")}
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(gallery || []).slice(0, 4).map((img) => (
              <div key={img.id} className={`aspect-square w-full rounded-xl flex items-center justify-center ${isIllustration(img.url) ? "bg-mint p-6" : ""}`}>
                <img
                  src={img.url}
                  alt={img.caption}
                  className={isIllustration(img.url) ? "h-full w-full object-contain" : "h-full w-full rounded-xl object-cover"}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location CTA with an embedded map preview */}
      <section className="bg-leaf-50 border-t border-ink-900/8 py-16">
        <div className="container-narrow grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <p className="eyebrow mb-3">{t("home.findUsSection")}</p>
            <h2 className="font-display text-2xl font-semibold">{b.neighborhood}, {b.city}</h2>
            <p className="text-ink-700/60 mt-2">{t("home.orderNote")}</p>
            <div className="flex gap-3 mt-6">
              <Link to="/location" className="btn-primary">{t("common.getDirections")}</Link>
              <Link to="/contact" className="btn-outline">{t("common.orderAhead")}</Link>
            </div>
          </div>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(b.mapsQuery || `${b.neighborhood}, ${b.city}`)}`}
            target="_blank"
            rel="noreferrer"
            className="block rounded-2xl overflow-hidden border border-ink-900/10 shadow-sm shadow-ink-900/5 h-52 sm:h-64"
            aria-label="Open location in Google Maps"
          >
            <iframe
              title="The Green Corner location"
              className="h-full w-full pointer-events-none"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${encodeURIComponent(b.mapsQuery || `${b.neighborhood}, ${b.city}`)}&output=embed`}
            />
          </a>
        </div>
      </section>
    </>
  );
}