import { getOpenStatus } from "../lib/openStatus";
import { useLanguage } from "../lib/i18n/LanguageContext";

export default function OpenStatusBadge({ hours, invert = false, className = "" }) {
  const status = getOpenStatus(hours);
  const { t } = useLanguage();
  if (!status.known) return null;

  const openStyles = invert
    ? "bg-leaf-500/20 text-leaf-100 border border-leaf-400/30"
    : "bg-leaf-100 text-leaf-700";
  const closedStyles = invert
    ? "bg-white/10 text-white/80 border border-white/15"
    : "bg-ink-900/8 text-ink-700/60";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
        status.isOpen ? openStyles : closedStyles
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
