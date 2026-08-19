import { Helmet } from "react-helmet-async";
import { SITE_URL } from "../lib/siteConfig";

function isPlaceholder(value) {
  return !value || String(value).startsWith("PLACEHOLDER");
}

/**
 * Renders LocalBusiness structured data — but only for fields that are
 * actually confirmed. Google can penalize sites for structured data that
 * doesn't match reality, so placeholder phone numbers, hours, and ratings
 * are deliberately left out until the owner confirms them (they'll then
 * show up here automatically since this reads from business info + hours).
 */
export default function LocalBusinessSchema({ business, hours }) {
  if (!business) return null;

  const data = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: business.name,
    url: SITE_URL,
    image: `${SITE_URL}${business.logoUrl || "/images/logo.png"}`,
    servesCuisine: ["Rwandan", "Grill"],
    acceptsReservations: "True"
  };

  if (!isPlaceholder(business.description)) data.description = business.description;

  if (!isPlaceholder(business.phone)) data.telephone = business.phone;

  if (!isPlaceholder(business.neighborhood) || !isPlaceholder(business.city)) {
    data.address = {
      "@type": "PostalAddress",
      addressLocality: business.neighborhood,
      addressRegion: business.city,
      addressCountry: "RW"
    };
  }

  if (business.googleRating && business.googleReviewCount) {
    data.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: business.googleRating,
      reviewCount: business.googleReviewCount
    };
  }

  if (Array.isArray(hours) && hours.length > 0) {
    const dayMap = {
      Monday: "Mo", Tuesday: "Tu", Wednesday: "We", Thursday: "Th",
      Friday: "Fr", Saturday: "Sa", Sunday: "Su"
    };
    const usable = hours.filter(
      (h) => dayMap[h.day] && h.open && h.close && !/closed/i.test(h.open) && !/placeholder/i.test(h.open)
    );
    if (usable.length) {
      data.openingHoursSpecification = usable.map((h) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: `https://schema.org/${h.day}`,
        opens: to24h(h.open),
        closes: to24h(h.close)
      }));
    }
  }

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(data)}</script>
    </Helmet>
  );
}

// Converts "7:00 AM" -> "07:00" for schema.org's expected time format.
function to24h(time) {
  const match = /(\d+):(\d+)\s*(AM|PM)/i.exec(time);
  if (!match) return time;
  let [, h, m, period] = match;
  h = parseInt(h, 10);
  if (/PM/i.test(period) && h !== 12) h += 12;
  if (/AM/i.test(period) && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}:${m}`;
}
