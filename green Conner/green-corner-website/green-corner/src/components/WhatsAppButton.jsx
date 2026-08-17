import { useWhatsAppModal } from "../lib/WhatsAppModalContext";

export default function WhatsAppButton() {
  const { openModal } = useWhatsAppModal();
  return (
    <button
      onClick={openModal}
      aria-label="Message The Green Corner on WhatsApp"
      className="hidden sm:flex fixed bottom-5 right-5 z-40 h-14 w-14 items-center justify-center rounded-full bg-leaf-500 text-white shadow-lg shadow-ink-900/20 transition-transform hover:scale-105"
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.39a9.9 9.9 0 0 0 4.75 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm5.8 14.06c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.12.11-1.8-.11-.42-.13-.96-.31-1.65-.6-2.9-1.25-4.8-4.16-4.94-4.35-.14-.19-1.18-1.57-1.18-3 0-1.42.75-2.12 1.02-2.41.26-.29.57-.36.76-.36.19 0 .38 0 .55.01.17.01.41-.07.64.49.24.58.81 2 .88 2.14.07.14.12.31.02.5-.09.19-.14.31-.28.48-.14.17-.29.37-.41.5-.14.14-.28.29-.12.57.16.28.72 1.19 1.55 1.93 1.06.95 1.96 1.24 2.24 1.38.28.14.44.12.6-.07.17-.19.71-.83.9-1.11.19-.28.38-.24.64-.14.26.1 1.65.78 1.93.92.28.14.47.21.53.33.07.12.07.68-.17 1.36z" />
      </svg>
    </button>
  );
}
