import PageHeader from "../components/PageHeader";
import SEO from "../components/SEO";
import { useLanguage } from "../lib/i18n/LanguageContext";
import { useSpecials } from "../lib/useContent";
import { isIllustration, isPlaceholderText } from "../lib/media";

export default function Specials() {
  const { data: specials, loading } = useSpecials();
  const { t } = useLanguage();

  return (
    <>
      <SEO
        title="Specials"
        description="Combos, promotions and featured picks at The Green Corner smoothie and salad bar in Nyamirambo, Kigali."
        path="/specials"
      />
      <PageHeader
        eyebrow={t("pages.specialsEyebrow")}
        title={t("pages.specialsTitle")}
      />

      <section className="container-narrow py-12">
        {loading ? (
          <p className="text-ink-700/50">Loading specials…</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-3">
            {specials.map((s) => (
              <div key={s.id} className="card-surface overflow-hidden">
                {s.image && (
                  <div className={`h-44 w-full flex items-center justify-center ${isIllustration(s.image) ? "bg-mint p-8" : ""}`}>
                    <img
                      src={s.image}
                      alt={s.title}
                      className={isIllustration(s.image) ? "h-full w-full object-contain" : "h-full w-full object-cover"}
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="p-5">
                  {s.tag && !isPlaceholderText(s.tag) && s.tag !== "Sample idea" && s.tag !== "Confirm details" && (
                    <span className="eyebrow">{s.tag}</span>
                  )}
                  <h3 className="font-display text-lg font-semibold mt-2">{s.title}</h3>
                  {!isPlaceholderText(s.description) && s.description && (
                    <p className="mt-2 text-sm text-ink-700/65">{s.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
