import { NextResponse } from "next/server";
import { supabaseOn, topTopics } from "@/lib/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const CACHE = { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=3600" }; // CDN giữ 10 phút

/* Thống kê chủ đề được hỏi nhiều nhất trong 14 ngày.
   Chưa đủ MIN_TOTAL câu thì không công bố, tránh số liệu lệch. */
const MIN_TOTAL = Number(process.env.TOP_QUESTIONS_MIN || 10);

export async function GET() {
  if (!supabaseOn()) return NextResponse.json({ enabled: false, total: 0, items: [] });
  try {
    const t = await topTopics(14);
    if (!t || t.total < MIN_TOTAL) return NextResponse.json({ enabled: true, total: t?.total || 0, items: [], min: MIN_TOTAL }, { headers: CACHE });
    return NextResponse.json({ enabled: true, ...t }, { headers: CACHE });
  } catch (e) {
    console.error("[top-questions]", e instanceof Error ? e.message : e);
    return NextResponse.json({ enabled: true, total: 0, items: [], error: true });
  }
}
