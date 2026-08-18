import { useEffect, useRef, useState } from "react";
import { businessInfo as demo } from "../lib/demoData";
import { useBusinessInfo } from "../lib/useContent";
import { useWhatsAppModal } from "../lib/WhatsAppModalContext";
import { useLanguage } from "../lib/i18n/LanguageContext";
import { translations } from "../lib/i18n/translations";
import { isConfirmedWhatsApp, whatsappHref } from "../lib/business";

const OPTIONS = [
  { key: "quickOrder", emoji: "🔥", labelKey: "quickOrderLabel", messageKey: "quickOrderMessage" },
  { key: "table", emoji: "👥", labelKey: "tableLabel", messageKey: "tableMessage" },
  { key: "catering", emoji: "🥘", labelKey: "cateringLabel", messageKey: "cateringMessage" },
  { key: "question", emoji: "💬", labelKey: "questionLabel", messageKey: "questionMessage" }
];

export default function WhatsAppModal() {
  const { open, closeModal } = useWhatsAppModal();
  const { data: info } = useBusinessInfo();
  const b = info || demo;
  const { language, t } = useLanguage();
  const [selected, setSelected] = useState(null);
  const firstOptionRef = useRef(null);
  const available = isConfirmedWhatsApp(b.whatsapp);

  useEffect(() => {
    if (open) setSelected(null);
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    firstOptionRef.current?.focus();
    const onKeyDown = (e) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, closeModal]);

  if (!open || !available) return null;

  const copy = translations[language].whatsappModal;

  function sendMessage(langCode) {
    const text = translations[langCode].whatsappModal[selected.messageKey];
    const href = whatsappHref(b.whatsapp, text);
    if (href) window.open(href, "_blank", "noopener,noreferrer");
    closeModal();
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-ink-900/50 backdrop-blur-sm"
      onClick={closeModal}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="whatsapp-modal-heading"
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-sm bg-char-900 text-paper rounded-t-3xl sm:rounded-3xl p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] shadow-xl animate-modalIn motion-reduce:animate-none border border-line/10"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 id="whatsapp-modal-heading" className="font-display text-lg font-semibold text-paper">
            {selected ? copy[selected.labelKey] : copy.heading}
          </h2>
          <button
            onClick={closeModal}
            aria-label={copy.close}
            className="h-10 w-10 flex items-center justify-center rounded-full text-mute hover:bg-ink-900/5 hover:text-paper"
          >
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {!selected ? (
          <div className="space-y-2">
            {OPTIONS.map((opt, i) => (
              <button
                key={opt.key}
                ref={i === 0 ? firstOptionRef : undefined}
                onClick={() => setSelected(opt)}
                className="w-full flex items-center gap-3 rounded-xl border border-line/10 px-4 py-3.5 text-left text-sm font-medium text-paper hover:border-leaf-500 hover:bg-char-900 transition-colors min-h-[48px]"
              >
                <span className="text-xl" aria-hidden="true">{opt.emoji}</span>
                {copy[opt.labelKey]}
              </button>
            ))}
          </div>
        ) : (
          <div>
            <p className="text-sm text-mute mb-4">{t("whatsappModal.languagePrompt")}</p>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => sendMessage("en")} className="btn-primary justify-center">
                English
              </button>
              <button onClick={() => sendMessage("rw")} className="btn-outline justify-center">
                Kinyarwanda
              </button>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="mt-4 text-sm text-mute hover:text-leaf-400"
            >
              ← {t("common.back")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
