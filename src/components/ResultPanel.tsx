"use client";
import { useEffect, useRef, useState } from "react";
import { RULES, SOURCES } from "@/lib/data";
import { evaluate, parseLocal, phaseOf } from "@/lib/rules";
import { buildIcs, deepLink, download, drawCard, shareOrDownload } from "@/lib/share";
import { useI18n } from "@/lib/i18n";
import type { CheckInput, Level } from "@/lib/types";

const ICON: Record<Level, React.ReactNode> = {
  ok: <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5 9-10" /></svg>,
  limit: <svg viewBox="0 0 24 24" fill="none" stroke="#133630" strokeWidth="3" strokeLinecap="round"><path d="M12 6v7M12 18h.01" /></svg>,
  cond: <svg viewBox="0 0 24 24" fill="none" stroke="#133630" strokeWidth="3" strokeLinecap="round"><path d="M12 6v7M12 18h.01" /></svg>,
  ban: <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
};
const STAGES = RULES.phases.filter(p => p.sample);

export default function ResultPanel({ submitted, toast }: { submitted: { input: CheckInput; quiet: boolean; n: number } | null; toast: (m: string) => void }) {
  const { t, pick, lang } = useI18n();
  const ref = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  const [reminded, setReminded] = useState(false);

  // Kết quả mới: cuộn tới, cập nhật địa chỉ trang thành link chia sẻ
  useEffect(() => {
    if (!submitted) return;
    setCopied(false); setReminded(false);
    const go = () => ref.current?.scrollIntoView({ behavior: submitted.quiet || matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    // Mở từ link: chờ bản đồ và ảnh dựng xong rồi mới cuộn, tránh bị đẩy lệch
    if (submitted.quiet) { const id = setTimeout(go, 400); return () => clearTimeout(id); }
    go();
  }, [submitted]);
  useEffect(() => {
    if (!submitted) return;
    try { history.replaceState(null, "", deepLink(submitted.input, lang).replace(location.origin, "")); } catch {}
  }, [submitted, lang]);

  const input = submitted?.input;
  const d = input ? parseLocal(input.date, input.time) : null;
  if (!input || !d) return <section className="result-wrap" id="result" ref={ref} aria-live="polite" />;

  const r = evaluate(input.vehicle, input.area, input.old, d);
  const v = RULES.vehicles.find(x => x.id === input.vehicle)!;
  const a = RULES.areas.find(x => x.id === input.area)!;
  const vLabel = pick(v.label), aLabel = pick(a.label), lvl = pick(RULES.levels[r.level]);
  const stages = STAGES.map(p => ({ label: pick(p.label!), ...evaluate(input.vehicle, input.area, input.old, new Date(p.sample!), true) }));
  const when = t("result.when", { time: input.time, date: `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}` });
  const url = deepLink(input, lang);

  const share = async () => {
    const text = `Chuyển Xanh: ${vLabel}, ${aLabel}, ${input.date} ${input.time}: ${lvl}. ${pick(r.title)}.`;
    try {
      if (navigator.share) { await navigator.share({ text, url }); return; }
      await navigator.clipboard.writeText(`${text} ${url}`);
      setCopied(true);
      toast(t("result.copiedToast"));
    } catch { /* người dùng hủy */ }
  };
  const saveImage = async () => {
    const blob = await drawCard({
      brand: "Chuyển Xanh", sub: t("result.cardSub"), levelText: lvl, level: r.level, title: pick(r.title),
      meta: t("result.cardAt", { vehicle: vLabel, area: aLabel, when }), aheadLabel: t("result.cardAhead"),
      stages: stages.map(s => ({ label: s.label, level: s.level, title: pick(s.title) })),
      foot: t("result.cardFoot", { host: location.host || "Chuyển Xanh" })
    });
    if (blob) await shareOrDownload(blob, lang === "en" ? "chuyen-xanh-result.png" : "chuyen-xanh-ket-qua.png", "Chuyển Xanh");
  };
  const remind = () => {
    const ev = (date: string, phase: string, s: (typeof stages)[number]) => ({
      date, uid: `${date}-${v.id}-${a.id}`,
      summary: t("result.icsSummary", { phase }),
      description: `${vLabel}, ${aLabel}: ${pick(s.title)}. ${pick(s.detail)}`
    });
    const ics = buildIcs([ev("20270101", t("result.phase2"), stages[1]), ev("20280101", t("result.phase3"), stages[2])], t("result.icsAlarm"), lang);
    download(new Blob([ics], { type: "text/calendar" }), "chuyen-xanh-nhac-moc.ics");
    setReminded(true);
  };

  const phase = RULES.phases[phaseOf(d)];
  return (
    <section className="result-wrap" id="result" ref={ref} aria-live="polite">
      <div className="container result">
        <div className="status">
          <span className={`status-mark ${r.level}`}>{ICON[r.level]}</span>
          <div>
            <p className="level">{lvl}: {lang === "en" ? vLabel : vLabel.toLowerCase()}, {aLabel}</p>
            <h3>{pick(r.title)}</h3>
            <p>{pick(r.detail)}</p>
            <p className="src">{t("result.applies", { phase: pick(phase.name) })} <a href={SOURCES[RULES.source].url} target="_blank" rel="noopener">{t("result.source")}</a></p>
            <div className="actions">
              <button className="btn btn-line" type="button" onClick={share}>{copied ? t("result.copied") : t("result.share")}</button>
              <button className="btn btn-line" type="button" onClick={saveImage}>{t("result.image")}</button>
              <button className="btn btn-line" type="button" onClick={remind}>{reminded ? t("result.reminded") : t("result.remind")}</button>
              <a className="btn btn-line" href="#cost">{t("result.cost")}</a>
            </div>
          </div>
        </div>
        <div className="track">
          <h4>{t("result.track")}</h4>
          <ol>
            {stages.map(s => (
              <li key={s.label}><span className={`dot ${s.level}`} /><div className="when">{s.label}</div><div className="what">{pick(s.title)}</div></li>
            ))}
          </ol>
          {input.area === RULES.curfew.area && <p className="note">{t("result.kv1Note")}</p>}
        </div>
      </div>
    </section>
  );
}
