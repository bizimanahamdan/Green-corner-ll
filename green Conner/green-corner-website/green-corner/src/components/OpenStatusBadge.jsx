import { getOpenStatus } from "../lib/openStatus";
import { useLanguage } from "../lib/i18n/LanguageContext";

export default function OpenStatusBadge({ hours, className = "" }) {
  const status = getOpenStatus(hours);
  const { t } = useLanguage();
  if (!status.known) return null;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
        status.isOpen
          ? "bg-leaf-500/20 text-leaf-100 border border-leaf-400/30"
          : "bg-white/10 text-paper/70 border border-white/15"
      } ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${status.isOpen ? "bg-leaf-400" : "bg-current opacity-50"}`} />
      {status.closedAllDay
        ? t("openStatus.closedToday")
        : status.isOpen
          ? `${t("openStatus.openNow")} · ${t("openStatus.closes")} ${status.closeTime}`
          : `${t("openStatus.closed")} · ${t("openStatus.opens")} ${status.openTime}`}
    </span>
  );
}
