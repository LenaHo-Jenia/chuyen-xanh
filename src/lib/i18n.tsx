"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import vi from "../../messages/vi.json";
import en from "../../messages/en.json";
import type { Lang, Text } from "./types";

/* Thêm ngôn ngữ: tạo messages/<mã>.json cùng cấu trúc với vi.json,
   thêm trường <mã> vào các Text trong data/, rồi khai báo ở đây. */
const MESSAGES = { vi, en } as const;
export type Messages = typeof vi;

type Ctx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
  pick: (x: Text) => string;
  messages: Messages;
  money: (n: number) => string;
};
const I18n = createContext<Ctx | null>(null);

function lookup(obj: unknown, key: string): unknown {
  return key.split(".").reduce<unknown>((o, k) => (o && typeof o === "object" ? (o as Record<string, unknown>)[k] : undefined), obj);
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("vi");

  useEffect(() => {
    let pref: string | null = new URLSearchParams(location.search).get("lang");
    if (!pref) { try { pref = localStorage.getItem("cx-lang"); } catch {} }
    if (!pref) pref = (navigator.language || "vi").toLowerCase().startsWith("vi") ? "vi" : "en";
    setLangState(pref === "en" ? "en" : "vi");
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = MESSAGES[lang].meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", MESSAGES[lang].meta.description);
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { localStorage.setItem("cx-lang", l); } catch {}
    const u = new URL(location.href);
    if (u.searchParams.has("lang") || u.searchParams.has("v")) {
      if (l === "vi") u.searchParams.delete("lang"); else u.searchParams.set("lang", l);
      history.replaceState(null, "", u.pathname + u.search + u.hash);
    }
  }, []);

  const value = useMemo<Ctx>(() => {
    const messages = MESSAGES[lang] as Messages;
    return {
      lang, setLang, messages,
      t: (key, vars) => {
        const raw = lookup(messages, key);
        const s = typeof raw === "string" ? raw : key;
        return vars ? s.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`)) : s;
      },
      pick: x => x[lang] ?? x.vi,
      money: n => Math.round(n).toLocaleString(lang === "en" ? "en-US" : "vi-VN") + messages.common.currency
    };
  }, [lang, setLang]);

  return <I18n.Provider value={value}>{children}</I18n.Provider>;
}

export function useI18n() {
  const c = useContext(I18n);
  if (!c) throw new Error("useI18n must be used inside I18nProvider");
  return c;
}

