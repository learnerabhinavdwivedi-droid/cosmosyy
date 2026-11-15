import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import hi from "./hi.json";

function getInitialLanguage(): string {
  try {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("cosmosyy-v2");
      if (stored) {
        const parsed = JSON.parse(stored) as {
          state?: { settings?: { audioLanguage?: string } };
        };
        if (parsed?.state?.settings?.audioLanguage === "hinglish") {
          return "hi";
        }
      }
    }
  } catch {
    // fallback to en
  }
  return "en";
}

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    hi: { translation: hi },
  },
  lng: getInitialLanguage(),
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
