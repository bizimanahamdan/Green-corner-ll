import { getOpenStatus } from "../lib/openStatus";
import { useLanguage } from "../lib/i18n/LanguageContext";

export default function OpenStatusBadge({ hours, className = "" }) {
  const status = getOpenStatus(hours);
  const { t } = useLanguage();
  if (!status.known) return null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
        status.isOpen ? "bg-leaf-100 text-leaf-700" : "bg-ink-900/8 text-ink-700/60"
      } ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${status.isOpen ? "bg-leaf-500" : "bg-ink-700/40"}`} />
      {status.isOpen
        ? `${t("openStatus.openNow")} · ${t("openStatus.closes")} ${status.closeTime}`
        : `${t("openStatus.closed")} · ${t("openStatus.opens")} ${status.openTime}`}
    </span>
  );
}
