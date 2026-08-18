import PageHeader from "../components/PageHeader";
import SEO from "../components/SEO";
import { useLanguage } from "../lib/i18n/LanguageContext";
import { businessInfo as demo } from "../lib/demoData";
import { useBusinessInfo } from "../lib/useContent";

const pillars = [
  { title: "Kigali, Nyamirambo", body: "Set in one of Kigali's most characterful neighborhoods, known for its own rhythm and street life." },
  { title: "Fire-grilled, not fried", body: "Fish, goat and beef cooked over an open flame, seasoned with local spices." },
  { title: "Grill pub", body: "A lively spot for good food and a cold drink, not a quiet sit-down restaurant." },
  { title: "Order ahead", body: "Build an order on the site, or message ahead and pick up when it's ready." }
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
          <p>
            The Green Corner sits in {b.neighborhood}, a lively, residential part of Kigali known for
            its own identity and pace of life. It's built for anyone who wants a proper fire-grilled
            meal — a big grilled fish to share, a plate of brochettes after work, a cold beer with friends.
          </p>
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
          <h2 className="section-heading mb-8">What defines the experience</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {pillars.map((p) => (
              <div key={p.title} className="card-surface p-6">
                <h3 className="font-display text-lg font-semibold text-leaf-400">{p.title}</h3>
                <p className="mt-2 text-sm text-mute">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
