import { KNOWLEDGE } from "./data";
import type { Knowledge } from "./types";

/* Tìm đoạn văn bản liên quan nhất trong kho (tiếng Việt và tiếng Anh).
   Dùng chung cho trợ lý khi chưa có AI, cho bước "retrieve" của RAG,
   và để gắn chủ đề cho câu hỏi người dân gửi về. */

export const fold = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d");

const SYN: [RegExp, string][] = [
  // Gộp cụm hay bị nhầm thành một từ: tên phố, "biển số", "sở hữu" (bỏ dấu đều thành "so")
  [/\bdien bien phu\b/g, " dienbienphu "],
  [/\bbien so\b/g, " bienso "],
  [/\bso huu\b/g, " sohuu "],
  [/\b(grab|be|xanh sm|gojek|shipper|ship hang|giao hang|xe om|xe cong nghe|chay app)\b/g, " xe om cong nghe ung dung "],
  [/\b(vinfast|yadea|pega|dat bike|xe dien|xe may dien|xe dap dien)\b/g, " xe dien "],
  [/\b(ho guom|ho hoan kiem|pho di bo|pho co)\b/g, " khu vuc 1 hoan kiem "],
  [/\b(tien ho tro|tro cap|duoc ho tro|ho tro tien)\b/g, " ho tro "],
  [/\b(cam|bi cam|cam xe)\b/g, " cam "],
  [/\b(nam sau|2027)\b/g, " 2027 "],
  [/\b(ride hailing|delivery|couriers?|app drivers?|grab drivers?)\b/g, " xe om cong nghe ung dung "],
  [/\b(electric (scooter|bike|motorbike|vehicle|moped)s?|e ?bikes?|evs?)\b/g, " xe dien "],
  [/\b(banned|ban|bans|prohibited|forbidden)\b/g, " cam "],
  [/\b(subsidy|subsidies|grant|money to switch)\b/g, " ho tro "],
  [/\b(hoan kiem lake|walking street|old quarter)\b/g, " khu vuc 1 hoan kiem "],
  [/\b(next year)\b/g, " 2027 "]
];
const STOP = new Set(
  ("la co khong toi minh ban thi the nao gi duoc cua va o de nhung neu vay a nhe oi voi cho ve tu den khi luc ma nay do roi se dang con hay " +
    "the an is are am be can could do does i my me you your it its in on at of for to and or what which who when where how will would if with this that there").split(" ")
);

const norm = (t: string) => {
  let f = " " + fold(t).replace(/[^a-z0-9 ]/g, " ") + " ";
  for (const [re, rep] of SYN) f = f.replace(re, rep);
  return f;
};
export const grams = (t: string) => {
  const w = norm(t).split(/\s+/).filter(x => x && !STOP.has(x));
  const g = new Set(w);
  for (let i = 0; i < w.length - 1; i++) g.add(w[i] + "_" + w[i + 1]);
  return g;
};

type Indexed = { d: Knowledge; g: Set<string> };
let INDEX: { docs: Indexed[]; idf: (t: string) => number; df: Record<string, number> } | null = null;
function index() {
  if (INDEX) return INDEX;
  const docs = KNOWLEDGE.map(d => ({ d, g: grams([d.q.vi, d.q.vi, d.q.en, d.q.en, d.keywords || "", d.a.vi, d.a.en].join(" ")) }));
  const df: Record<string, number> = {};
  docs.forEach(x => x.g.forEach(t => (df[t] = (df[t] || 0) + 1)));
  INDEX = { docs, df, idf: t => Math.log(1 + docs.length / (df[t] || 0.5)) };
  return INDEX;
}

export type Hit = { d: Knowledge; score: number; bigrams: number; coverage: number };

export function rank(q: string): Hit[] {
  const ix = index();
  const qg = grams(q);
  let total = 0; // trọng số các từ đơn trong câu hỏi
  qg.forEach(t => { if (!t.includes("_")) total += ix.idf(t); });
  return ix.docs
    .map(x => {
      let score = 0, bigrams = 0, uni = 0;
      qg.forEach(t => {
        if (x.g.has(t)) {
          score += ix.idf(t) * (t.includes("_") ? 2 : 1);
          if (t.includes("_")) bigrams++; else uni += ix.idf(t);
        }
      });
      // coverage: phần "ý chính" của câu hỏi tìm thấy trong đoạn. Thấp nghĩa là câu hỏi nói về điều kho không có.
      return { d: x.d, score, bigrams, coverage: total ? uni / total : 0 };
    })
    .sort((a, b) => b.score - a.score);
}

/** Câu trả lời từ khóa: chỉ trả lời khi đủ chắc, còn lại gợi ý câu gần nhất */
export function keywordAnswer(q: string) {
  const r = rank(q);
  const top = r[0];
  const ok = !!top && top.score >= 4 && (top.bigrams >= 1 || top.score >= 6) && top.coverage >= 0.6;
  return {
    ok,
    top: ok ? top.d : null,
    alt: r.slice(ok ? 1 : 0, 3).filter(x => x.score >= (ok ? 2 : 4)).map(x => x.d)
  };
}

/** Các đoạn đưa cho mô hình AI (bước retrieve). Kho nhỏ nên lấy rộng tay để không sót. */
export function retrieve(q: string, k = 6): Knowledge[] {
  return rank(q).filter(x => x.score > 0).slice(0, k).map(x => x.d);
}

/** Gắn chủ đề cho thống kê: id đoạn kiến thức khớp nhất, hoặc "other" */
export function topicOf(q: string): string {
  const top = rank(q)[0];
  // Chặt hơn trả lời: phải khớp cả cụm từ, tránh gắn nhầm chủ đề làm lệch thống kê
  return top && top.score >= 5 && top.bigrams >= 1 && top.coverage >= 0.6 ? top.d.id : "other";
}
