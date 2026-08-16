import { Link } from "react-router-dom";
import { businessInfo as demo } from "../lib/demoData";
import { useBusinessInfo } from "../lib/useContent";
import { useLanguage } from "../lib/i18n/LanguageContext";

export default function MobileActionBar() {
  const { data: info } = useBusinessInfo();
  const b = info || demo;
  const { t } = useLanguage();
  const hasPhone = b.phone && !b.phone.startsWith("PLACEHOLDER");
  const waMessage = encodeURIComponent(`Hi ${b.name}! I'd like to ask about an order.`);

  return (
    <nav
      className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-ink-900/10 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      aria-label="Quick actions"
    >
      <div className="grid grid-cols-3">
        {hasPhone ? (
          <a
            href={`tel:${b.phone.replace(/\s/g, "")}`}
            className="flex flex-col items-center justify-center gap-0.5 py-2.5 text-ink-700 active:bg-ink-900/5"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-[11px] font-medium">{t("common.call")}</span>
          </a>
        ) : (
          <div className="flex flex-col items-center justify-center gap-0.5 py-2.5 text-ink-700/30">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-[11px] font-medium">{t("common.call")}</span>
          </div>
        )}

        <a
          href={`https://wa.me/${b.whatsapp}?text=${waMessage}`}
          target="_blank"
          rel="noreferrer"
          className="flex flex-col items-center justify-center gap-0.5 py-2.5 text-leaf-600 border-x border-ink-900/10 active:bg-leaf-50"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.39a9.9 9.9 0 0 0 4.75 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm5.8 14.06c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.12.11-1.8-.11-.42-.13-.96-.31-1.65-.6-2.9-1.25-4.8-4.16-4.94-4.35-.14-.19-1.18-1.57-1.18-3 0-1.42.75-2.12 1.02-2.41.26-.29.57-.36.76-.36.19 0 .38 0 .55.01.17.01.41-.07.64.49.24.58.81 2 .88 2.14.07.14.12.31.02.5-.09.19-.14.31-.28.48-.14.17-.29.37-.41.5-.14.14-.28.29-.12.57.16.28.72 1.19 1.55 1.93 1.06.95 1.96 1.24 2.24 1.38.28.14.44.12.6-.07.17-.19.71-.83.9-1.11.19-.28.38-.24.64-.14.26.1 1.65.78 1.93.92.28.14.47.21.53.33.07.12.07.68-.17 1.36z" />
          </svg>
          <span className="text-[11px] font-medium">{t("common.whatsapp")}</span>
        </a>

        <Link
          to="/contact"
          className="flex flex-col items-center justify-center gap-0.5 py-2.5 text-citrus-600 active:bg-citrus-500/10"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 6h18M16 10a4 4 0 0 1-8 0" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-[11px] font-medium">{t("common.orderAhead")}</span>
        </Link>
      </div>
    </nav>
  );
}
