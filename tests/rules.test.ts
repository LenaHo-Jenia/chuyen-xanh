import { describe, expect, it } from "vitest";
import fixtures from "./fixtures-v1.json";
import { evaluate, parseLocal, phaseOf } from "../src/lib/rules";
import { RULES } from "../src/lib/data";

describe("quy định vùng phát thải thấp", () => {
  it("khớp toàn bộ kết quả của bản web đầu tiên (400 tình huống)", () => {
    for (const f of fixtures) {
      const r = evaluate(f.vehicle, f.area, f.old, parseLocal(f.date, f.time)!);
      expect({ ...f, level: r.level, title: r.title.vi }).toEqual(f);
    }
  });

  it("Khu vực 1 cấm mọi xe, kể cả xe điện, 19h–24h thứ Sáu đến Chủ nhật", () => {
    const fri = parseLocal("2026-11-13", "19:00")!;
    for (const v of RULES.vehicles) expect(evaluate(v.id, "kv1", false, fri).id).toBe("kv1_curfew");
    expect(evaluate("xm_dien", "kv1", false, parseLocal("2026-11-12", "20:00")!).id).toBe("ev_ok"); // thứ Năm
  });

  it("chia giai đoạn đúng mốc", () => {
    expect(phaseOf(parseLocal("2026-06-30", "23:59")!)).toBe(0);
    expect(phaseOf(parseLocal("2026-07-01", "00:00")!)).toBe(1);
    expect(phaseOf(parseLocal("2027-01-01", "00:00")!)).toBe(2);
    expect(phaseOf(parseLocal("2028-01-01", "00:00")!)).toBe(3);
  });

  it("mọi kết quả đều có bản tiếng Anh", () => {
    for (const o of Object.values(RULES.outcomes)) {
      expect(o.title.en).toBeTruthy();
      expect(o.detail.en).toBeTruthy();
    }
  });
});
