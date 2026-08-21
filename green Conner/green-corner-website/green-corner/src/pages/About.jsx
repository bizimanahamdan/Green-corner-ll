import PageHeader from "../components/PageHeader";
import SEO from "../components/SEO";
import { useLanguage } from "../lib/i18n/LanguageContext";
import { businessInfo as demo } from "../lib/demoData";
import { useBusinessInfo } from "../lib/useContent";

const pillars = [
  { titleKey: "about.p1Title", bodyKey: "about.p1Body" },
  { titleKey: "about.p2Title", bodyKey: "about.p2Body" },
  { titleKey: "about.p3Title", bodyKey: "about.p3Body" },
  { titleKey: "about.p4Title", bodyKey: "about.p4Body" }
];

export default function About() {
  const { data: info } = useBusinessInfo();
  const b = info || demo;
  const { t } = useLanguage();

  return (
    <>
      <SEO
        title="About Us"
        description="The Green Corner is a grill pub in Nyamirambo, Kigali, known for fire-grilled fish, goat and beef brochettes."
        path="/about"
      />
      <PageHeader eyebrow={t("pages.aboutEyebrow")} title={t("pages.aboutTitle")} />

      <section className="container-narrow py-12 sm:py-14 grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="space-y-5 text-mute leading-relaxed">
          <p>{b.description}</p>
          <p>{t("about.body")}</p>
        </div>

        <div className="rounded-2xl overflow-hidden bg-ink-900 min-h-[240px]">
          <img
            src="/images/hero-embers.jpg"
            alt="Charcoal grill fire"
            className="w-full h-full max-h-96 object-cover"
            loading="lazy"
          />
        </div>
      </section>

      <section className="band py-14 sm:py-16">
        <div className="container-narrow">
          <h2 className="section-heading mb-8">{t("about.experienceHeading")}</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {pillars.map((p) => (
              <div key={p.titleKey} className="card-surface p-6">
                <h3 className="font-display text-lg font-semibold text-leaf-400">{t(p.titleKey)}</h3>
                <p className="mt-2 text-sm text-mute">{t(p.bodyKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
