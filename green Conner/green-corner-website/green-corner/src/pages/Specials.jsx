import PageHeader from "../components/PageHeader";
import SEO from "../components/SEO";
import EmptyState from "../components/EmptyState";
import { useLanguage } from "../lib/i18n/LanguageContext";
import { useSpecials } from "../lib/useContent";
import { isIllustration, isPlaceholderText } from "../lib/media";

export default function Specials() {
  const { data: specials, loading } = useSpecials();
  const { t } = useLanguage();
  const real = (specials || []).filter((s) => !isPlaceholderText(s.description) && s.tag !== "Sample idea");

  return (
    <>
      <SEO
        title="Specials"
        description="Promotions and featured picks at The Green Corner grill pub in Nyamirambo, Kigali."
        path="/specials"
      />
      <PageHeader
        eyebrow={t("pages.specialsEyebrow")}
        title={t("pages.specialsTitle")}
      />

      <section className="container-narrow py-10 sm:py-12">
        {loading ? (
          <p className="text-ink-700/50">{t("common.loading")}</p>
        ) : real.length === 0 ? (
          <EmptyState body={t("empty.specials")} />
        ) : (
          <div className="grid gap-5 sm:grid-cols-3">
            {real.map((s) => (
              <article key={s.id} className="card-surface overflow-hidden">
                {s.image && (
                  <div className={`h-44 w-full ${isIllustration(s.image) ? "bg-mint p-8 flex items-center justify-center" : ""}`}>
                    <img
                      src={s.image}
                      alt={s.title}
                      className={isIllustration(s.image) ? "h-full w-full object-contain" : "h-full w-full object-cover"}
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="p-5">
                  {s.tag && !isPlaceholderText(s.tag) && <span className="eyebrow">{s.tag}</span>}
                  <h3 className="font-display text-lg font-semibold mt-2">{s.title}</h3>
                  <p className="mt-2 text-sm text-ink-700/65">{s.description}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
