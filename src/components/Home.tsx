"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Nav from "./Nav";
import Hero from "./Hero";
import ResultPanel from "./ResultPanel";
import Band from "./Band";
import CostCalculator from "./CostCalculator";
import Support from "./Support";
import Faq from "./Faq";
import TopQuestions from "./TopQuestions";
import Footer from "./Footer";
import Chat from "./Chat";
import { RULES } from "@/lib/data";
import { readDeepLink } from "@/lib/share";
import { useI18n } from "@/lib/i18n";
import type { CheckInput } from "@/lib/types";

export type Picked =
  | { kind: "hint" | "searching" | "searchFail" | "noGeo" | "locating" | "geoFail" }
  | { kind: "notFound"; q: string }
  | { kind: "point"; area: string; name?: string; here?: boolean }
  | { kind: "list" | "link"; area: string };

const pad = (n: number) => String(n).padStart(2, "0");

export default function Home() {
  const { t } = useI18n();
  const [form, setForm] = useState<CheckInput>({ vehicle: RULES.vehicles[0].id, area: RULES.areas[0].id, old: false, date: "", time: "" });
  const [submitted, setSubmitted] = useState<{ input: CheckInput; quiet: boolean; n: number } | null>(null);
  const [picked, setPicked] = useState<Picked>({ kind: "hint" });
  const [fitArea, setFitArea] = useState<{ area: string; n: number } | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const toast = useCallback((m: string) => {
    setToastMsg(m);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(null), 3200);
  }, []);

  // Ngày giờ hiện tại, và mở thẳng kết quả nếu vào từ link chia sẻ
  useEffect(() => {
    const now = new Date();
    const base: CheckInput = {
      vehicle: RULES.vehicles[0].id, area: RULES.areas[0].id, old: false,
      date: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`,
      time: `${pad(now.getHours())}:${pad(now.getMinutes())}`
    };
    const l = readDeepLink(location.search);
    if (l.vehicle && l.area && RULES.vehicles.some(v => v.id === l.vehicle) && RULES.areas.some(a => a.id === l.area)) {
      const input = { vehicle: l.vehicle, area: l.area, old: l.old, date: l.date || base.date, time: l.time || base.time };
      setForm(input);
      setPicked({ kind: "link", area: l.area });
      setFitArea({ area: l.area, n: 1 });
      setSubmitted({ input, quiet: true, n: 1 });
    } else setForm(base);
  }, []);

  const submit = () => {
    if (!form.date) { document.getElementById("date")?.focus(); return; }
    setSubmitted(s => ({ input: { ...form }, quiet: false, n: (s?.n || 0) + 1 }));
  };

  return (
    <>
      <Nav toast={toast} />
      <Hero form={form} setForm={setForm} onSubmit={submit} picked={picked} setPicked={setPicked} fitArea={fitArea} setFitArea={setFitArea} />
      <ResultPanel submitted={submitted} toast={toast} />
      <main>
        <Band />
        <CostCalculator />
        <Support />
        <Faq />
        <TopQuestions />
      </main>
      <Footer />
      <Chat />
      {toastMsg && <div className="toast" role="status">{toastMsg}</div>}
      <noscript><p style={{ padding: 16 }}>{t("nav.noscript")}</p></noscript>
    </>
  );
}
