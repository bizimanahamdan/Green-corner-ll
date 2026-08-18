import PageHeader from "../components/PageHeader";
import SEO from "../components/SEO";
import { useLanguage } from "../lib/i18n/LanguageContext";
import { businessInfo as demo } from "../lib/demoData";
import { useBusinessInfo, useHours } from "../lib/useContent";
import { isConfirmedPhone, telHref } from "../lib/business";

export default function Location() {
  const { data: info } = useBusinessInfo();
  const b = info || demo;
  const { data: hours } = useHours();
  const { t } = useLanguage();
  const mapQuery = encodeURIComponent(b.mapsQuery || `${b.neighborhood}, ${b.city}`);
  const phoneHref = telHref(b.phone);
  const dayHours = hours || [];

  return (
    <>
      <SEO
        title="Location & Hours"
        description={`Find The Green Corner in ${b.neighborhood}, ${b.city}.`}
        path="/location"
      />
      <PageHeader eyebrow={t("pages.locationEyebrow")} title={t("pages.locationTitle")} />

      <section className="container-narrow py-10 sm:py-12 grid gap-8 lg:grid-cols-2">
        <div>
          <div className="card-surface p-6 mb-6">
            <h2 className="font-display text-lg font-semibold mb-3">Address</h2>
            <p className="text-mute">{b.neighborhood}, {b.city}</p>
            {phoneHref && isConfirmedPhone(b.phone) && (
              <p className="text-mute mt-1">
                <a href={phoneHref} className="hover:text-leaf-400">{b.phone}</a>
              </p>
            )}
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-5 inline-flex"
            >
              {t("common.getDirections")}
            </a>
          </div>

          <div className="card-surface p-6">
            <h2 className="font-display text-lg font-semibold mb-3">Opening Hours</h2>
            {dayHours.length === 0 ? (
              <p className="text-sm text-mute">{t("empty.hours")}</p>
            ) : (
              <ul className="divide-y divide-ink-900/8">
                {dayHours.map((h) => (
                  <li key={h.day} className="flex justify-between py-2.5 text-sm text-mute gap-3">
                    <span>{h.day}</span>
                    <span className="text-right">{h.open} – {h.close}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden border border-line/10 min-h-[360px]">
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
