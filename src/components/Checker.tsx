"use client";
import type { Dispatch, SetStateAction } from "react";
import { RULES, SOURCES } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import type { CheckInput } from "@/lib/types";
import type { Picked } from "./Home";
import ZoneMap from "./ZoneMap";

export type CheckerProps = {
  form: CheckInput;
  setForm: Dispatch<SetStateAction<CheckInput>>;
  onSubmit: () => void;
  picked: Picked;
  setPicked: (p: Picked) => void;
  fitArea: { area: string; n: number } | null;
  setFitArea: Dispatch<SetStateAction<{ area: string; n: number } | null>>;
};

export default function Checker({ form, setForm, onSubmit, picked, setPicked, fitArea, setFitArea }: CheckerProps) {
  const { t, pick } = useI18n();
  const areaLabel = (id: string) => pick(RULES.areas.find(a => a.id === id)!.label);
  const [y, m, d] = RULES.updated.split("-").map(Number);
  const vehicle = RULES.vehicles.find(v => v.id === form.vehicle);

  const pickedText = () => {
    switch (picked.kind) {
      case "notFound": return t("check.notFound", { q: picked.q });
      case "point": return <><b>{picked.here ? t("check.here") : picked.name || t("check.yourPick")}</b>: {areaLabel(picked.area)}.</>;
      case "list":
      case "link": {
        const [before, after] = t(picked.kind === "list" ? "check.fromList" : "check.fromLink").split("{area}");
        return <>{before}<b>{areaLabel(picked.area)}</b>{after}</>;
      }
      case "hint": return t("check.pickHint");
      default: return t(`check.${picked.kind}`);
    }
  };

  return (
    <form className="checker" noValidate onSubmit={e => { e.preventDefault(); onSubmit(); }}>
      <h2>{t("check.title")}</h2>
      <p className="hint">{t("check.updated", { date: `${d}/${m}/${y}` })}</p>
      <div className="group">
        <span className="field" id="vehLabel">{t("check.vehicle")}</span>
        <div className="veh" role="radiogroup" aria-labelledby="vehLabel">
          {RULES.vehicles.map(v => (
            <label key={v.id}>
              <input type="radio" name="veh" value={v.id} checked={form.vehicle === v.id} onChange={() => setForm(f => ({ ...f, vehicle: v.id }))} />
              <span>{pick(v.label)}<small>{pick(v.note)}</small></span>
            </label>
          ))}
        </div>
        {vehicle?.canBeOld && (
          <label className="tick" style={{ display: "flex" }}>
            <input type="checkbox" id="oldBike" checked={form.old} onChange={e => setForm(f => ({ ...f, old: e.target.checked }))} />
            <span>{t("check.old")}</span>
          </label>
        )}
      </div>
      <div className="group">
        <span className="field" id="placeLabel">{t("check.place")}</span>
        <ZoneMap
          fitArea={fitArea}
          onPick={(area, info) => { setForm(f => ({ ...f, area })); setPicked({ kind: "point", area, ...info }); }}
          onStatus={setPicked}
        >
          <p className="picked" aria-live="polite">{pickedText()}</p>
          <div className="or">{t("check.or")}</div>
        </ZoneMap>
        <label className="sr" htmlFor="area">{t("check.area")}</label>
        <select id="area" value={form.area} onChange={e => {
          const area = e.target.value;
          setForm(f => ({ ...f, area }));
          setPicked({ kind: "list", area });
          setFitArea(x => ({ area, n: (x?.n || 0) + 1 }));
        }}>
          {RULES.areas.map(a => <option key={a.id} value={a.id}>{pick(a.label)}</option>)}
        </select>
        <p className="hint">{t("check.boundary")} <a href={SOURCES.lez.url} target="_blank" rel="noopener">{t("check.officialMap")}</a>.</p>
      </div>
      <div className="group row2">
        <div><label className="field" htmlFor="date">{t("check.date")}</label><input type="date" id="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} /></div>
        <div><label className="field" htmlFor="time">{t("check.time")}</label><input type="time" id="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} /></div>
      </div>
      <button className="btn btn-primary" type="submit">{t("check.submit")}</button>
    </form>
  );
}
