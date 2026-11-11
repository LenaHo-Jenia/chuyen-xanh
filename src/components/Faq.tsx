"use client";
import { useEffect, useState } from "react";
import { KNOWLEDGE, SOURCES } from "@/lib/data";
import { fold } from "@/lib/retrieval";
import { useI18n } from "@/lib/i18n";

const FAQ = KNOWLEDGE.filter(k => k.faq);

export default function Faq() {
  const { t, pick } = useI18n();
  const [q, setQ] = useState("");
  const f = fold(q.trim());
  const items = FAQ.filter(x => !f || fold([x.q.vi, x.a.vi, x.q.en, x.a.en].join(" ")).includes(f));

  return (
    <section className="section" id="faq">
      <div className="container">
        <div className="section-head">
          <h2>{t("faq.title")}</h2>
          <p>{t("faq.sub")}</p>
        </div>
        <div className="faq-wrap">
          <div className="search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
            <label className="sr" htmlFor="faqSearch">{t("faq.search")}</label>
            <input type="search" id="faqSearch" placeholder={t("faq.searchPh")} value={q} onChange={e => setQ(e.target.value)} />
          </div>
          <div>
            {items.length ? items.map(x => (
              <details className="qa" key={x.id} id={`faq-${x.id}`}>
                <summary>{pick(x.q)}</summary>
                <div className="ans">
                  <p>{pick(x.a)}</p>
                  <p className="basis">{t("faq.basis")}: {pick(x.basis)}. <a href={SOURCES[x.source].url} target="_blank" rel="noopener">{t("result.source")}</a></p>
                </div>
              </details>
            )) : <div className="empty">{t("faq.empty")}</div>}
          </div>
          <AskForm />
        </div>
      </div>
    </section>
  );
}

/* Gửi câu hỏi: lưu ẩn danh vào Supabase qua /api/questions. Chưa bật Supabase thì ẩn. */
function AskForm() {
  const { t, lang } = useI18n();
  const [enabled, setEnabled] = useState(false);
  const [text, setText] = useState("");
  const [hp, setHp] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "fail">("idle");

  useEffect(() => {
    fetch("/api/questions").then(r => r.json()).then(j => setEnabled(!!j.enabled)).catch(() => setEnabled(false));
  }, []);
  if (!enabled) return null;

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim().length < 5) return;
    setState("sending");
    try {
      const r = await fetch("/api/questions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text, lang, website: hp }) });
      if (!r.ok) throw new Error();
      setState("done"); setText("");
    } catch { setState("fail"); }
  };

  return (
    <div className="ask">
      <p><b>{t("faq.askTitle")}</b> {t("faq.askBody")}</p>
      <form className="ask-form" onSubmit={send}>
        <label className="sr" htmlFor="askText">{t("faq.askPh")}</label>
        <textarea id="askText" maxLength={500} placeholder={t("faq.askPh")} value={text} onChange={e => { setText(e.target.value); setState("idle"); }} />
        <div className="hp" aria-hidden="true"><input tabIndex={-1} autoComplete="off" value={hp} onChange={e => setHp(e.target.value)} name="website" /></div>
        <div className="row">
          <button className="btn btn-line" type="submit" disabled={state === "sending"}>{state === "sending" ? t("faq.askSending") : t("faq.askSend")}</button>
          {state === "done" && <p className="status" role="status">{t("faq.askThanks")}</p>}
          {state === "fail" && <p className="status" role="status">{t("faq.askFail")}</p>}
        </div>
      </form>
    </div>
  );
}
