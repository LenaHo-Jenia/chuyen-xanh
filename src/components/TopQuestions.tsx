"use client";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import type { Text } from "@/lib/types";

type Top = { enabled: boolean; total: number; items: { topic: string; count: number; share: number; label: Text | null }[] };

/* Câu hỏi nổi bật: tự thống kê từ câu hỏi người dân gửi (Supabase), 14 ngày gần nhất */
export default function TopQuestions() {
  const { t, pick } = useI18n();
  const [data, setData] = useState<Top | null>(null);
  useEffect(() => { fetch("/api/top-questions").then(r => r.json()).then(setData).catch(() => setData(null)); }, []);
  const items = data?.items || [];
  const max = Math.max(1, ...items.map(x => x.count));

  return (
    <section className="section voice" id="voice">
      <div className="container">
        <div className="section-head">
          <h2>{t("top.title")}</h2>
          <p>{t("top.sub")}</p>
        </div>
        <div className="faq-wrap">
          {items.length ? (
            <div>
              <p style={{ margin: "0 0 8px", color: "rgba(255,255,255,.75)" }}>{t("top.period", { n: data!.total })}</p>
              {items.map(x => (
                <div className="qrow" key={x.topic}>
                  <div>{x.label ? pick(x.label) : t("top.other")}<div className="bar"><i style={{ width: `${((x.count / max) * 100).toFixed(1)}%` }} /></div></div>
                  <b>{Math.round(x.share * 100)}%</b>
                </div>
              ))}
            </div>
          ) : <div className="empty">{t("top.empty")}</div>}
          <p className="privacy">{t("top.privacy")}</p>
        </div>
      </div>
    </section>
  );
}
