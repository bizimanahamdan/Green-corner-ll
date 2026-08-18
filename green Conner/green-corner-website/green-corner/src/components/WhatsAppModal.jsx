import { useEffect, useRef, useState } from "react";
import { businessInfo as demo } from "../lib/demoData";
import { useBusinessInfo } from "../lib/useContent";
import { useWhatsAppModal } from "../lib/WhatsAppModalContext";
import { translations } from "../lib/i18n/translations";

const OPTIONS = [
  { key: "quickOrder", emoji: "🥤", labelKey: "quickOrderLabel", messageKey: "quickOrderMessage" },
  { key: "catering", emoji: "🥗", labelKey: "cateringLabel", messageKey: "cateringMessage" },
  { key: "pickup", emoji: "📦", labelKey: "pickupLabel", messageKey: "pickupMessage" }
];

export default function WhatsAppModal() {
  const { open, closeModal } = useWhatsAppModal();
  const { data: info } = useBusinessInfo();
  const b = info || demo;
  const [selected, setSelected] = useState(null);
  const dialogRef = useRef(null);
  const firstOptionRef = useRef(null);

  // Reset back to the option list every time the modal is opened fresh.
  useEffect(() => {
    if (open) setSelected(null);
  }, [open]);

  // Basic focus handling + Escape-to-close for accessibility.
  useEffect(() => {
    if (!open) return;
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

  if (!open) return null;

  function sendMessage(langCode) {
    const copy = translations[langCode].whatsappModal;
    const text = encodeURIComponent(copy[selected.messageKey]);
    window.open(`https://wa.me/${b.whatsapp}?text=${text}`, "_blank", "noreferrer");
    closeModal();
  }

  const enCopy = translations.en.whatsappModal;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-ink-900/40 backdrop-blur-sm"
      onClick={closeModal}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="whatsapp-modal-heading"
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-sm bg-white rounded-t-3xl sm:rounded-3xl p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] shadow-xl shadow-ink-900/20 animate-modalIn motion-reduce:animate-none"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 id="whatsapp-modal-heading" className="font-display text-lg font-semibold text-ink-900">
            {selected ? enCopy[selected.labelKey] : enCopy.heading}
          </h2>
          <button
            onClick={closeModal}
            aria-label={enCopy.close}
            className="h-8 w-8 flex items-center justify-center rounded-full text-ink-700/50 hover:bg-ink-900/5 hover:text-ink-900"
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
                className="w-full flex items-center gap-3 rounded-xl border border-ink-900/10 px-4 py-3.5 text-left text-sm font-medium text-ink-900 hover:border-leaf-500 hover:bg-leaf-50 transition-colors"
              >
                <span className="text-xl" aria-hidden="true">{opt.emoji}</span>
                {enCopy[opt.labelKey]}
              </button>
            ))}
          </div>
        ) : (
          <div>
            <p className="text-sm text-ink-700/60 mb-4">Choose a language / Hitamo ururimi</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => sendMessage("en")}
                className="btn-primary justify-center"
              >
                English
              </button>
              <button
                onClick={() => sendMessage("rw")}
                className="btn-outline justify-center"
              >
                Kinyarwanda
              </button>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="mt-4 text-sm text-ink-700/50 hover:text-leaf-600"
            >
              ← Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
