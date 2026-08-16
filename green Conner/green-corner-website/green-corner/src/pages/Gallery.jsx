import { useState } from "react";
import PageHeader from "../components/PageHeader";
import SEO from "../components/SEO";
import { useLanguage } from "../lib/i18n/LanguageContext";
import { useGallery } from "../lib/useContent";
import { isIllustration } from "../lib/media";

export default function Gallery() {
  const { data: images, loading } = useGallery();
  const { t } = useLanguage();
  const [filter, setFilter] = useState("All");
  const categories = ["All", ...new Set((images || []).map((i) => i.category))];
  const visible = filter === "All" ? images : images.filter((i) => i.category === filter);

  return (
    <>
      <SEO
        title="Gallery"
        description="A look at The Green Corner — smoothies, salads, juices and bowls in Nyamirambo, Kigali."
        path="/gallery"
      />
      <PageHeader
        eyebrow={t("pages.galleryEyebrow")}
        title={t("pages.galleryTitle")}
        description="These are placeholder illustrations, not real photos — replace them with real food and interior photography from the admin Gallery page."
      />

      <section className="container-narrow py-12">
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`rounded-full px-4 py-2 text-sm border ${
                filter === c ? "bg-leaf-500 border-leaf-500 text-white" : "border-ink-900/15 text-ink-700/70"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-ink-700/50">Loading gallery…</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {visible.map((img) => (
              <figure key={img.id} className="card-surface overflow-hidden">
                <div className={`aspect-square flex items-center justify-center ${isIllustration(img.url) ? "bg-mint p-8" : ""}`}>
                  <img
                    src={img.url}
                    alt={img.caption}
                    className={isIllustration(img.url) ? "h-full w-full object-contain" : "h-full w-full object-cover"}
                    loading="lazy"
                  />
                </div>
                <figcaption className="p-3 text-xs text-ink-700/50">{img.caption}</figcaption>
              </figure>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
