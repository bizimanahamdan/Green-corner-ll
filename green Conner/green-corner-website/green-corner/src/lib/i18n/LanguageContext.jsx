import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { translations } from "./translations";

const LanguageContext = createContext(null);
const STORAGE_KEY = "green-corner-language";

export const SUPPORTED_LANGUAGES = ["en", "fr"];
export const DEFAULT_LANGUAGE = "en";

// Kinyarwanda ("rw") was replaced by French. Browsers that still have the old
// value stored are moved to the language that took its place.
const RETIRED_LANGUAGES = { rw: "fr" };

export function normalizeLanguage(value) {
  if (!value) return DEFAULT_LANGUAGE;
  const mapped = RETIRED_LANGUAGES[value] ?? value;
  return SUPPORTED_LANGUAGES.includes(mapped) ? mapped : DEFAULT_LANGUAGE;
}

function getNested(obj, path) {
  return path.split(".").reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : null), obj);
}

function interpolate(text, params) {
  if (!params || typeof text !== "string") return text;
  return text.replace(/\{(\w+)\}/g, (match, name) =>
    params[name] === undefined ? match : String(params[name])
  );
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    if (typeof window === "undefined") return DEFAULT_LANGUAGE;
    try {
      return normalizeLanguage(localStorage.getItem(STORAGE_KEY));
    } catch {
      return DEFAULT_LANGUAGE;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      /* storage unavailable — keep the in-memory language */
    }
    document.documentElement.lang = language === "fr" ? "fr" : "en";
  }, [language]);

  const setLanguage = useCallback((next) => {
    setLanguageState(normalizeLanguage(next));
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState((prev) => (prev === "fr" ? "en" : "fr"));
  }, []);

  const t = useCallback(
    (key, params) => {
      const value = getNested(translations[language], key) ?? getNested(translations.en, key);
      return interpolate(value, params) ?? key;
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
