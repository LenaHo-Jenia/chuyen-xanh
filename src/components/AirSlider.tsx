"use client";
import { useEffect, useState, type RefObject } from "react";
import { useI18n } from "@/lib/i18n";

/* Lớp mù trên ảnh đầu trang theo mức PM2.5 (mô phỏng để minh họa) */
const PRESETS = [
  { v: 5, label: "air.who", note: "air.noteWho" },
  { v: 28.7, label: "air.vn", note: "air.noteVn" },
  { v: 45.4, label: "air.hn", note: "air.noteHn" }
];

export default function AirSlider({ img, haze }: { img: RefObject<HTMLImageElement | null>; haze: RefObject<HTMLDivElement | null> }) {
  const { t, lang } = useI18n();
  const [v, setV] = useState(45.4);

  useEffect(() => {
    const k = Math.min(1, Math.max(0, (v - 5) / 50));
    haze.current?.style.setProperty("--a", (k * 0.75).toFixed(3));
    haze.current?.style.setProperty("--b", (k * 4).toFixed(2) + "px");
    if (img.current) img.current.style.filter = `saturate(${(1 - k * 0.6).toFixed(2)}) contrast(${(1 - k * 0.3).toFixed(2)}) brightness(${(1 + k * 0.08).toFixed(2)})`;
  }, [v, img, haze]);

  const hit = PRESETS.find(p => Math.abs(p.v - v) < 0.05);
  const num = lang === "en" ? v.toFixed(1) : v.toFixed(1).replace(".", ",");
  return (
    <div className="air">
      <div className="air-top">
        <label htmlFor="pm">{t("air.label")}</label>
        <output htmlFor="pm">{num} <small>µg/m³</small></output>
      </div>
      <input type="range" id="pm" min={5} max={60} step={0.1} value={v} aria-describedby="pmNote" onChange={e => setV(+e.target.value)} />
      <div className="air-presets" role="group" aria-label={t("air.presets")}>
        {PRESETS.map(p => (
          <button key={p.v} type="button" aria-pressed={Math.abs(p.v - v) < 0.05} onClick={() => setV(p.v)}>{t(p.label)}</button>
        ))}
      </div>
      <p className="air-note" id="pmNote">{hit ? t(hit.note) : t("air.noteX", { n: Math.max(1, Math.round(v / 5)) })}</p>
    </div>
  );
}
