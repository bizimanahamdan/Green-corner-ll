import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { translations } from "./translations";

const LanguageContext = createContext(null);
const STORAGE_KEY = "green-corner-language";

function getNested(obj, path) {
  return path.split(".").reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : null), obj);
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    if (typeof window === "undefined") return "en";
    return localStorage.getItem(STORAGE_KEY) || "en";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === "en" ? "rw" : "en"));
  }, []);

  const t = useCallback(
    (key) => {
      const value = getNested(translations[language], key) ?? getNested(translations.en, key);
      return value ?? key;
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
