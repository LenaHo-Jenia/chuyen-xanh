import { describe, expect, it } from "vitest";
import { keywordAnswer, retrieve, topicOf } from "../src/lib/retrieval";
import { zoneOf } from "../src/lib/zones";
import { computeCost } from "../src/lib/cost";

describe("tìm câu trả lời trong kho", () => {
  it.each([
    ["grab chạy phố cổ năm 2027 được không", "app-drivers"],
    ["Ai được hỗ trợ tiền đổi xe?", "support-who"],
    ["Khu vực 2 gồm những phố nào?", "kv2-streets"],
    ["giờ cao điểm mấy giờ", "peak-hours"],
    ["Can ride-hailing bikes enter Hoan Kiem in 2027?", "app-drivers"],
    ["who can get the subsidy", "support-who"],
    ["are electric scooters banned?", "kv1-curfew"]
  ])("%s → %s", (q, id) => {
    expect(keywordAnswer(q).top?.id).toBe(id);
  });

  it("không đoán khi kho không có căn cứ", () => {
    for (const q of ["vi phạm thì bị phạt bao nhiêu tiền?", "giá xăng hôm nay", "what is the fine"]) expect(keywordAnswer(q).ok).toBe(false);
    expect(topicOf("giá xăng hôm nay")).toBe("other");
  });

  it("bước retrieve cho AI luôn kèm đoạn liên quan nhất", () => {
    expect(retrieve("xe ôm công nghệ 2028").map(d => d.id)).toContain("app-drivers");
  });
});

describe("bản đồ và chi phí", () => {
  it("xác định khu vực theo tọa độ", () => {
    expect(zoneOf([21.0288, 105.8525])).toBe("kv1"); // Hồ Gươm
    expect(zoneOf([21.0, 105.75])).toBe("out");
  });
  it("tính hòa vốn", () => {
    const r = computeCost({ kmDay: 20, daysMonth: 26, battery: 0, subsidy: 0, resale: 0, gasPrice: 21000, gasUse: 2, evPrice: 20000000, evUse: 3, elecPrice: 3000, busPass: 200000, maint: 50000 });
    expect(Math.round(r.save)).toBe(221600);
    expect(r.months).toBe(91);
  });
});

describe("gắn chủ đề cho thống kê", () => {
  it.each([
    ["Xe đạp điện có cần biển số không?", "other"],
    ["grab chạy phố cổ năm 2027 được không", "app-drivers"],
    ["Ai được hỗ trợ tiền đổi xe?", "support-who"]
  ])("%s → %s", (q, id) => expect(topicOf(q)).toBe(id));
});

it("không trả lời câu hỏi chỉ trùng vài từ chung chung", () => {
  expect(keywordAnswer("Xe đạp điện có cần biển số không?").ok).toBe(false);
});
