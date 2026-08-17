import { createContext, useContext, useState, useCallback } from "react";

const WhatsAppModalContext = createContext(null);

export function WhatsAppModalProvider({ children }) {
  const [open, setOpen] = useState(false);
  const openModal = useCallback(() => setOpen(true), []);
  const closeModal = useCallback(() => setOpen(false), []);

  return (
    <WhatsAppModalContext.Provider value={{ open, openModal, closeModal }}>
      {children}
    </WhatsAppModalContext.Provider>
  );
}

export function useWhatsAppModal() {
  const ctx = useContext(WhatsAppModalContext);
  if (!ctx) {
    throw new Error("useWhatsAppModal must be used within a WhatsAppModalProvider");
  }
  return ctx;
}
