import { useState } from "react";
import PageHeader from "../components/PageHeader";
import SEO from "../components/SEO";
import EmptyState from "../components/EmptyState";
import { useLanguage } from "../lib/i18n/LanguageContext";
import { useGallery } from "../lib/useContent";
import { isIllustration, isPlaceholderText } from "../lib/media";

export default function Gallery() {
  const { data: images, loading } = useGallery();
  const { t } = useLanguage();
  const [filter, setFilter] = useState("All");
  const realImages = (images || []).filter((i) => i.url && !isPlaceholderText(i.caption));
  const categories = ["All", ...new Set(realImages.map((i) => i.category).filter(Boolean))];
  const visible = filter === "All" ? realImages : realImages.filter((i) => i.category === filter);

  return (
    <>
      <SEO
        title="Gallery"
        description="A look at The Green Corner — fire-grilled fish, brochettes and drinks in Nyamirambo, Kigali."
        path="/gallery"
      />
      <PageHeader
        eyebrow={t("pages.galleryEyebrow")}
        title={t("pages.galleryTitle")}
      />

      <section className="container-narrow py-10 sm:py-12">
        {loading ? (
          <p className="text-ink-700/50">{t("common.loading")}</p>
        ) : realImages.length === 0 ? (
          <EmptyState body={t("empty.gallery")} />
        ) : (
          <>
            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  className={`rounded-full px-4 py-2 text-sm border min-h-[40px] ${
                    filter === c ? "bg-leaf-500 border-leaf-500 text-white" : "border-ink-900/15 text-ink-700/70"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {visible.map((img) => (
                <figure key={img.id} className="card-surface overflow-hidden">
                  <div className={`aspect-square flex items-center justify-center ${isIllustration(img.url) ? "bg-mint p-8" : ""}`}>
                    <img
                      src={img.url}
                      alt={img.caption || "The Green Corner"}
                      className={isIllustration(img.url) ? "h-full w-full object-contain" : "h-full w-full object-cover"}
                      loading="lazy"
                    />
                  </div>
                  {img.caption && (
                    <figcaption className="p-3 text-xs text-ink-700/50">{img.caption}</figcaption>
                  )}
                </figure>
              ))}
            </div>
          </>
        )}
      </section>
    </>
  );
}
