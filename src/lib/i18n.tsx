import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "te" | "en";

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (te: string, en: string) => string };

const LangContext = createContext<Ctx | null>(null);

const STORAGE_KEY = "nm_lang";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("te");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
      if (stored === "te" || stored === "en") setLangState(stored);
    } catch {}
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem(STORAGE_KEY, l); } catch {}
  };

  const t = (te: string, en: string) => (lang === "te" ? te : en);

  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside LanguageProvider");
  return ctx;
}

/** Convenience hook returning just the t function. */
export function useT() {
  return useLang().t;
}
