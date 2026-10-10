import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import { useLanguage } from "../lib/i18n/LanguageContext";

export default function NotFound() {
  const { t } = useLanguage();
  return (
    <section className="container-narrow pt-32 pb-24 text-center">
      <SEO title={t("notFound.title")} path="/404" noindex />
      <p className="eyebrow mb-3">404</p>
      <h1 className="section-heading mb-4">{t("notFound.heading")}</h1>
      <p className="text-mute mb-8">{t("notFound.body")}</p>
      <Link to="/" className="btn-primary">{t("notFound.back")}</Link>
    </section>
  );
}
