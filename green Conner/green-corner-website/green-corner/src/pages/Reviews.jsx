import PageHeader from "../components/PageHeader";
import SEO from "../components/SEO";
import EmptyState from "../components/EmptyState";
import { businessInfo as demo } from "../lib/demoData";
import { useBusinessInfo, useReviews } from "../lib/useContent";
import { useLanguage } from "../lib/i18n/LanguageContext";
import { isPlaceholderText } from "../lib/media";

function Stars({ rating }) {
  return (
    <span className="text-citrus-500" aria-label={`${rating} out of 5 stars`}>
      {"★".repeat(rating)}
      <span className="text-ink-900/15">{"★".repeat(5 - rating)}</span>
    </span>
  );
}

export default function Reviews() {
  const { data: info } = useBusinessInfo();
  const b = info || demo;
  const { data: rawReviews, loading } = useReviews();
  const reviews = (rawReviews || []).filter((r) => !isPlaceholderText(r.quote));
  const { t } = useLanguage();
  const hasRating = Boolean(b.googleRating && b.googleReviewCount);

  return (
    <>
      <SEO
        title="Reviews"
        description="What customers say about The Green Corner grill pub in Nyamirambo, Kigali."
        path="/reviews"
      />
      <PageHeader eyebrow={t("pages.reviewsEyebrow")} title={t("pages.reviewsTitle")} />

      <section className="container-narrow py-12 sm:py-14">
        {hasRating && (
          <div className="card-surface p-10 text-center max-w-xl mx-auto mb-12">
            <p className="font-display text-6xl font-semibold text-citrus-500">{b.googleRating}★</p>
            <p className="mt-3 text-ink-700/70">Based on {b.googleReviewCount} Google reviews</p>
          </div>
        )}

        {loading ? (
          <p className="text-ink-700/50 text-center">{t("common.loading")}</p>
        ) : reviews.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 max-w-3xl mx-auto">
            {reviews.map((r) => (
              <blockquote key={r.id} className="card-surface p-6">
                <Stars rating={r.rating} />
                <p className="mt-3 text-ink-700/75 leading-relaxed">“{r.quote}”</p>
                <footer className="mt-4 text-sm font-medium text-ink-900">{r.author_name}</footer>
              </blockquote>
            ))}
          </div>
        ) : (
          <EmptyState body={t("empty.reviews")} />
        )}
      </section>
    </>
  );
}
