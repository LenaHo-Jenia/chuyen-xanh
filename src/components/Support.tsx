"use client";
import { useEffect, useState } from "react";
import { DOCUMENTS, SOURCES } from "@/lib/data";
import { useI18n } from "@/lib/i18n";

export default function Support() {
  const { t, pick } = useI18n();
  const [saved, setSaved] = useState<Record<number, boolean>>({});
  useEffect(() => { try { setSaved(JSON.parse(localStorage.getItem("cx-docs") || "{}")); } catch {} }, []);
  const toggle = (i: number, v: boolean) => {
    const next = { ...saved, [i]: v };
    setSaved(next);
    try { localStorage.setItem("cx-docs", JSON.stringify(next)); } catch {}
  };
  return (
    <section className="section alt" id="support">
      <div className="container">
        <div className="section-head">
          <h2>{t("support.title")}</h2>
          <p>{t("support.sub")}</p>
        </div>
        <div className="support">
          <div>
            <p className="amount"><strong>{t("support.amount")}</strong><span>{t("support.amountNote")}</span></p>
            <p>{t("support.body")}</p>
            <h3>{t("support.conditions")}</h3>
            <ul>{["c1", "c2", "c3", "c4"].map(k => <li key={k}>{t(`support.${k}`)}</li>)}</ul>
            <p className="callout">{t("support.callout")}</p>
            <p className="basis">{t("support.source")} <a href={SOURCES.nq68.url} target="_blank" rel="noopener">{t("support.sourceName")}</a></p>
          </div>
          <div className="paper">
            <span className="draft">{t("support.draft")}</span>
            <h3>{t("support.docs")}</h3>
            <p className="hint" style={{ margin: "0 0 8px" }}>{t("support.docsHint")}</p>
            <div>
              {DOCUMENTS.map((d, i) => (
                <label className="tick" key={i}>
                  <input type="checkbox" checked={!!saved[i]} onChange={e => toggle(i, e.target.checked)} />
                  <span>{pick(d)}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
