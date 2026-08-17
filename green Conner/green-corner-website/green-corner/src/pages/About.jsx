import PageHeader from "../components/PageHeader";
import SEO from "../components/SEO";
import { useLanguage } from "../lib/i18n/LanguageContext";
import { businessInfo as demo } from "../lib/demoData";
import { useBusinessInfo } from "../lib/useContent";

const pillars = [
  { title: "Kigali, Nyamirambo", body: "Set in one of Kigali's most characterful neighborhoods, known for its own rhythm and street life." },
  { title: "Whole ingredients", body: "Fruit, vegetables and simple add-ins — blended or tossed fresh, not pre-made." },
  { title: "Smoothie & salad bar", body: "A quick, easy stop for something light and fresh, not a full sit-down restaurant." },
  { title: "Order ahead", body: "Message ahead on WhatsApp and pick up when it's ready." }
];

export default function About() {
  const { data: info } = useBusinessInfo();
  const b = info || demo;
  const { t } = useLanguage();

  return (
    <>
      <SEO
        title="About Us"
        description="The Green Corner is a smoothie and salad bar in Nyamirambo, Kigali, built around fresh, whole ingredients."
        path="/about"
      />
      <PageHeader eyebrow={t("pages.aboutEyebrow")} title={t("pages.aboutTitle")} />

      <section className="container-narrow py-14 grid gap-12 lg:grid-cols-2 lg:items-start">
        <div className="space-y-5 text-ink-700/75 leading-relaxed">
          <p>{b.description}</p>
          <p>
            The Green Corner sits in {b.neighborhood}, a lively, residential part of Kigali known for
            its own identity and pace of life. It's built for anyone who wants something fresh and
            simple — a smoothie on the way to work, a salad on a lunch break, a juice to cool down.
          </p>
        </div>

        <div className="rounded-2xl bg-mint flex items-center justify-center p-12">
          <img
            src="/images/illustrations/salad-bowl.svg"
            alt="Illustration of a fresh salad bowl"
            className="w-full max-w-xs"
          />
        </div>
      </section>

      <section className="bg-white border-y border-ink-900/8 py-16">
        <div className="container-narrow">
          <h2 className="section-heading mb-10">What defines the experience</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {pillars.map((p) => (
              <div key={p.title} className="card-surface p-6">
                <h3 className="font-display text-lg font-semibold text-leaf-600">{p.title}</h3>
                <p className="mt-2 text-sm text-ink-700/65">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
