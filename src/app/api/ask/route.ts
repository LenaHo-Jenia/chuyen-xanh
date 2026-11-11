import { NextResponse } from "next/server";
import { askGemini, clientIp, geminiOn, rateLimited, sanitize, saveQuestion } from "@/lib/server";
import { keywordAnswer, retrieve, topicOf } from "@/lib/retrieval";
import { KNOWLEDGE } from "@/lib/data";
import type { Lang } from "@/lib/types";

export const runtime = "nodejs";

/* Trợ lý hỏi đáp (RAG):
   1. Tìm các đoạn văn bản liên quan trong kho (data/knowledge.json)
   2. Đưa đúng các đoạn đó cho Gemini, yêu cầu chỉ trả lời từ đó và ghi id nguồn
   3. Không có khóa Gemini hoặc Gemini lỗi: trả lời bằng cách tìm từ khóa như cũ */
export async function POST(req: Request) {
  if (rateLimited(clientIp(req), 12)) return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  let body: { q?: string; lang?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "bad_request" }, { status: 400 }); }
  const q = sanitize(String(body.q || ""));
  const lang: Lang = body.lang === "en" ? "en" : "vi";
  if (q.length < 2) return NextResponse.json({ error: "empty" }, { status: 400 });

  const kw = keywordAnswer(q);
  const fallback = {
    mode: "keyword" as const,
    answered: kw.ok,
    answer: kw.top ? kw.top.a[lang] : "",
    sources: kw.top ? [kw.top.id] : [],
    related: kw.alt.map(d => d.id)
  };

  let result: typeof fallback | { mode: "ai"; answered: boolean; answer: string; sources: string[]; related: string[] } = fallback;
  let failed = false;
  if (geminiOn()) {
    try {
      const docs = retrieve(q, 6);
      const ai = await askGemini(q, docs, lang);
      const related = ai.answered ? [] : kw.alt.map(d => d.id);
      result = { mode: "ai", ...ai, sources: ai.answered ? ai.sources : [], related };
    } catch (e) {
      console.error("[ask]", e instanceof Error ? e.message : e);
      failed = true;
    }
  }

  const topic = result.sources[0] && KNOWLEDGE.some(d => d.id === result.sources[0]) ? result.sources[0] : topicOf(q);
  await saveQuestion({ text: q, lang, topic, source: "chat", answered: result.answered });
  return NextResponse.json({ ...result, failed });
}
