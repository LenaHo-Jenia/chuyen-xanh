"use client";
import { useState } from "react";
import { computeCost, DEFAULT_COST, type CostInput } from "@/lib/cost";
import { useI18n } from "@/lib/i18n";

type Field = { k: keyof CostInput; step: number; hint?: React.ReactNode };

export default function CostCalculator() {
  const { t, money, lang } = useI18n();
  const [c, setC] = useState<CostInput>(DEFAULT_COST);
  const r = computeCost(c);
  const max = Math.max(r.gasMonth, r.evMonth, r.busMonth, 1);

  const input = ({ k, step, hint }: Field) => (
    <div>
      <label className="field" htmlFor={k}>{t(`cost.${k}`)}</label>
      <input type="number" id={k} min={0} step={step} inputMode="decimal" value={Number.isNaN(c[k]) ? "" : c[k]}
        onChange={e => setC(x => ({ ...x, [k]: e.target.value === "" ? NaN : +e.target.value }))} />
      {hint}
    </div>
  );
  const row = (cls: string, name: string, sub: string, val: number) => (
    <div className={`opt ${cls}`}>
      <div className="name">{name}<small>{sub}</small></div>
      <div className="bar"><i style={{ width: `${Math.max(2, (val / max) * 100).toFixed(1)}%` }} /></div>
      <div className="val">{money(val)}</div>
    </div>
  );
  const years = (r.months / 12).toFixed(1);
  let take = "";
  if (r.km === 0) take = t("cost.empty");
  else if (r.save <= 0) take = t("cost.notCheaper");
  else take = t("cost.save", { money: money(r.save) }) +
    (r.months ? t("cost.payback", { months: r.months, years: lang === "en" ? years : years.replace(".", ",") }) : t("cost.noUpfront")) +
    t("cost.co2", { litres: r.litresYear, kg: r.co2Year });
  if (r.busCheapest) take += t("cost.busTip");

  return (
    <section className="section" id="cost">
      <div className="container">
        <div className="section-head">
          <h2>{t("cost.title")}</h2>
          <p>{t("cost.sub")}</p>
        </div>
        <div className="cost">
          <div className="inputs">
            <div className="row2">{input({ k: "kmDay", step: 1 })}{input({ k: "daysMonth", step: 1 })}</div>
            <div className="row2">
              {input({ k: "battery", step: 10000, hint: <p className="hint">{t("cost.batteryHint")}</p> })}
              {input({ k: "subsidy", step: 500000, hint: <p className="hint"><a href="#support">{t("cost.eligible")}</a></p> })}
            </div>
            <div className="row2">{input({ k: "resale", step: 500000 })}<div /></div>
            <details className="prices">
              <summary>{t("cost.prices")}</summary>
              <p className="hint">{t("cost.pricesHint")}</p>
              <div className="row2">{input({ k: "gasPrice", step: 100 })}{input({ k: "gasUse", step: 0.1 })}</div>
              <div className="row2">{input({ k: "evPrice", step: 100000 })}{input({ k: "evUse", step: 0.1 })}</div>
              <div className="row2">{input({ k: "elecPrice", step: 100 })}{input({ k: "busPass", step: 10000 })}</div>
              <div className="row2">{input({ k: "maint", step: 10000 })}<div /></div>
            </details>
          </div>
          <div className="out">
            <h3>{t("cost.monthly")}</h3>
            <div>
              {row("gas", t("cost.gas"), t("cost.litres", { n: r.litres.toFixed(0) }), r.gasMonth)}
              {row("ev", t("cost.ev"), t("cost.upfront", { money: money(r.evUpfront) }), r.evMonth)}
              {row("bus", t("cost.bus"), t("cost.noBuy"), r.busMonth)}
            </div>
            <div className="takeaway" dangerouslySetInnerHTML={{ __html: take }} />
            <p className="fine">{t("cost.fine")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
