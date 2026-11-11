import { NextResponse } from "next/server";
import { clientIp, rateLimited, sanitize, saveQuestion, supabaseOn } from "@/lib/server";
import { topicOf } from "@/lib/retrieval";

export const runtime = "nodejs";

/* Người dân gửi câu hỏi ở mục Hỏi đáp. Lưu ẩn danh, tự gắn chủ đề. */
export async function POST(req: Request) {
  if (!supabaseOn()) return NextResponse.json({ error: "disabled" }, { status: 503 });
  if (rateLimited(clientIp(req), 5)) return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  let body: { text?: string; lang?: string; website?: string };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "bad_request" }, { status: 400 }); }
  if (body.website) return NextResponse.json({ ok: true }); // bẫy bot: ô ẩn mà có chữ là bot
  const text = sanitize(String(body.text || ""));
  if (text.length < 5) return NextResponse.json({ error: "too_short" }, { status: 400 });
  const ok = await saveQuestion({ text, lang: body.lang === "en" ? "en" : "vi", topic: topicOf(text), source: "form", answered: false });
  return ok ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "save_failed" }, { status: 502 });
}

export async function GET() {
  return NextResponse.json({ enabled: supabaseOn() });
}
