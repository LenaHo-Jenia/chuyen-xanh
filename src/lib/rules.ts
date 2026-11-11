import { RULES } from "./data";
import type { Outcome } from "./types";

/** 0 = trước thí điểm, 1 = 2026, 2 = 2027, 3 = từ 2028 */
export function phaseOf(d: Date): number {
  if (d < new Date(RULES.pilotStart + "T00:00:00")) return 0;
  const y = d.getFullYear();
  if (y <= 2026) return 1;
  if (y === 2027) return 2;
  return 3;
}

/** Kết quả cho một xe, một khu vực, một thời điểm. Toàn bộ quy định đọc từ data/rules.json. */
export function evaluate(vehicle: string, areaId: string, isOld: boolean, d: Date, ignoreTime = false): { id: string } & Outcome {
  const pick = (id: string) => ({ id, ...RULES.outcomes[id] });
  const p = phaseOf(d);
  const area = RULES.areas.find(a => a.id === areaId);
  if (!area) throw new Error(`Unknown area ${areaId}`);
  if (p === 0) return pick("pre_pilot");

  const c = RULES.curfew;
  if (!ignoreTime && areaId === c.area && c.days.includes(d.getDay()) && d.getHours() >= c.fromHour) return pick(c.outcome);

  if (p < area.from) return pick(RULES.notYet[String(area.from)]);

  const cell = RULES.matrix[vehicle]?.[String(p)];
  if (!cell) throw new Error(`No rule for ${vehicle} in phase ${p}`);
  if (typeof cell === "string") return pick(cell);
  return pick(isOld ? cell.old : cell.default);
}

export function parseLocal(date: string, time: string): Date | null {
  const [y, m, dd] = (date || "").split("-").map(Number);
  const [hh, mi] = (time || "12:00").split(":").map(Number);
  if (!y || !m || !dd) return null;
  return new Date(y, m - 1, dd, hh || 0, mi || 0);
}
