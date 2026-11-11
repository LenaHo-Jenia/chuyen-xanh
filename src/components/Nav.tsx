"use client";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import Leaf from "./Leaf";

type InstallEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<unknown> };
const SECTIONS = [
  ["top", "nav.check"], ["cost", "nav.cost"], ["support", "nav.support"], ["faq", "nav.faq"], ["voice", "nav.top"]
] as const;

export default function Nav({ toast }: { toast: (m: string) => void }) {
  const { t, lang, setLang } = useI18n();
  const [cur, setCur] = useState("top");
  const [installEv, setInstallEv] = useState<InstallEvent | null>(null);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      let c = "top";
      SECTIONS.forEach(([id]) => { const el = document.getElementById(id); if (el && el.getBoundingClientRect().top < 140) c = id; });
      setCur(c);
    };
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => removeEventListener("scroll", onScroll);
  }, []);

  // Cài lên màn hình chính, báo khi mất mạng
  useEffect(() => {
    if ("serviceWorker" in navigator && location.protocol === "https:") navigator.serviceWorker.register("/sw.js").catch(() => {});
    const onPrompt = (e: Event) => { e.preventDefault(); setInstallEv(e as InstallEvent); };
    const onInstalled = () => { setInstallEv(null); toast(t("nav.installed")); };
    const net = () => setOffline(!navigator.onLine);
    addEventListener("beforeinstallprompt", onPrompt);
    addEventListener("appinstalled", onInstalled);
    addEventListener("online", net); addEventListener("offline", net); net();
    return () => {
      removeEventListener("beforeinstallprompt", onPrompt); removeEventListener("appinstalled", onInstalled);
      removeEventListener("online", net); removeEventListener("offline", net);
    };
  }, [t, toast]);

  const install = async () => {
    if (!installEv) return;
    await installEv.prompt();
    try { await installEv.userChoice; } catch {}
    setInstallEv(null);
  };

  return (
    <>
      {offline && <div className="offline-note" role="status">{t("nav.offline")}</div>}
      <nav className={`nav${installEv ? " can-install" : ""}`} aria-label={t("nav.label")}>
        <div className="container">
          <a className="logo" href="#top"><Leaf />Chuyển Xanh<span className="beta">Beta</span></a>
          <div className="nav-links">
            {SECTIONS.map(([id, key]) => <a key={id} href={`#${id}`} className={cur === id ? "on" : undefined}>{t(key)}</a>)}
          </div>
          <div className="nav-tools">
            <div className="lang" role="group" aria-label={t("nav.language")}>
              <button type="button" aria-pressed={lang === "vi"} lang="vi" title="Tiếng Việt" onClick={() => setLang("vi")}>VI</button>
              <button type="button" aria-pressed={lang === "en"} lang="en" title="English" onClick={() => setLang("en")}>EN</button>
            </div>
            {installEv && (
              <button className="btn-install" type="button" onClick={install}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 4v11m-5-5 5 5 5-5M5 20h14" /></svg>
                <span>{t("nav.install")}</span>
              </button>
            )}
            <a className="btn nav-cta" href="#top">{t("nav.cta")}</a>
          </div>
        </div>
      </nav>
    </>
  );
}
