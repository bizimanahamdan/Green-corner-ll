import PageHeader from "../components/PageHeader";
import SEO from "../components/SEO";
import { useLanguage } from "../lib/i18n/LanguageContext";
import { businessInfo as demo } from "../lib/demoData";
import { useBusinessInfo, useHours } from "../lib/useContent";

export default function Location() {
  const { data: info } = useBusinessInfo();
  const b = info || demo;
  const { data: hours } = useHours();
  const { t } = useLanguage();
  const mapQuery = encodeURIComponent(b.mapsQuery || `${b.neighborhood}, ${b.city}`);
  const hasPhone = b.phone && !b.phone.startsWith("PLACEHOLDER");

  return (
    <>
      <SEO
        title="Location & Hours"
        description={`Find The Green Corner in ${b.neighborhood}, ${b.city}. Opening hours and directions.`}
        path="/location"
      />
      <PageHeader eyebrow={t("pages.locationEyebrow")} title={t("pages.locationTitle")} />

      <section className="container-narrow py-12 grid gap-10 lg:grid-cols-2">
        <div>
          <div className="card-surface p-6 mb-6">
            <h2 className="font-display text-lg font-semibold mb-3">Address</h2>
            <p className="text-ink-700/70">{b.neighborhood}, {b.city}</p>
            <p className="text-ink-700/70 mt-1">
              {hasPhone ? (
                <a href={`tel:${b.phone.replace(/\s/g, "")}`} className="hover:text-leaf-600">{b.phone}</a>
              ) : (
                <span className="text-ink-700/40">Phone number pending confirmation</span>
              )}
            </p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
              target="_blank"
              rel="noreferrer"
              className="btn-primary mt-5 inline-flex"
            >
              {t("common.getDirections")}
            </a>
          </div>

          <div className="card-surface p-6">
            <h2 className="font-display text-lg font-semibold mb-3">Opening Hours</h2>
            <ul className="divide-y divide-ink-900/8">
              {hours.map((h) => (
                <li key={h.day} className="flex justify-between py-2 text-sm text-ink-700/70">
                  <span>{h.day}</span>
                  <span>{h.open} – {h.close}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-ink-700/40">
              Hours shown are placeholders. Please confirm final opening hours with the business
              before publishing this site.
            </p>
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden border border-ink-900/8 min-h-[360px]">
          <iframe
            title="The Green Corner location map"
            className="h-full w-full min-h-[360px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
          />
        </div>
      </section>
    </>
  );
}
