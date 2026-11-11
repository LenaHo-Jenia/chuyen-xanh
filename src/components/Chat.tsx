"use client";
import { useEffect, useRef, useState } from "react";
import { KNOWLEDGE, SOURCES } from "@/lib/data";
import { keywordAnswer } from "@/lib/retrieval";
import { useI18n } from "@/lib/i18n";

type AskResponse = { mode: "ai" | "keyword"; answered: boolean; answer: string; sources: string[]; related: string[]; failed?: boolean };
type Msg =
  | { who: "me"; text: string }
  | { who: "bot"; kind: "hello" | "thinking" }
  | { who: "bot"; kind: "answer"; res: AskResponse; offline?: boolean };

const byId = (id: string) => KNOWLEDGE.find(k => k.id === id);

/* Trợ lý: gọi /api/ask (Gemini + kho văn bản). Mất mạng thì tìm từ khóa ngay trên máy. */
export default function Chat() {
  const { t, pick, lang, messages } = useI18n();
  const [open, setOpen] = useState(false);
  const [log, setLog] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fabRef = useRef<HTMLButtonElement>(null);

  useEffect(() => { setLog([]); }, [lang]);
  useEffect(() => { if (open && !log.length) setLog([{ who: "bot", kind: "hello" }]); }, [open, log.length]);
  useEffect(() => { logRef.current?.scrollTo({ top: logRef.current.scrollHeight }); }, [log]);
  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape" && open) close(); };
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  });

  const close = () => { setOpen(false); setTimeout(() => fabRef.current?.focus(), 0); };
  const ask = async (q: string) => {
    q = q.trim();
    if (!q || busy) return;
    setBusy(true);
    setLog(l => [...l, { who: "me", text: q }, { who: "bot", kind: "thinking" }]);
    let res: AskResponse, offline = false;
    try {
      const r = await fetch("/api/ask", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ q, lang }) });
      if (!r.ok) throw new Error(String(r.status));
      res = await r.json();
    } catch {
      const k = keywordAnswer(q);
      res = { mode: "keyword", answered: k.ok, answer: k.top ? pick(k.top.a) : "", sources: k.top ? [k.top.id] : [], related: k.alt.map(d => d.id) };
      offline = true;
    }
    setLog(l => [...l.filter(m => !(m.who === "bot" && m.kind === "thinking")), { who: "bot", kind: "answer", res, offline }]);
    setBusy(false);
  };

  const chips = (ids: string[]) => (
    <div className="chips">
      {ids.map(id => byId(id)).filter(Boolean).map(d => <button key={d!.id} type="button" onClick={() => ask(pick(d!.q))}>{pick(d!.q)}</button>)}
    </div>
  );

  const render = (m: Msg, i: number) => {
    if (m.who === "me") return <div key={i} className="msg me"><p>{m.text}</p></div>;
    if (m.kind === "hello") return (
      <div key={i}>
        <div className="msg bot"><p>{t("chat.hello")}</p></div>
        <div className="chips" style={{ marginTop: 10 }}>{messages.chat.chips.map(c => <button key={c} type="button" onClick={() => ask(c)}>{c}</button>)}</div>
      </div>
    );
    if (m.kind === "thinking") return <div key={i} className="msg bot thinking"><p>{t("chat.thinking")}</p></div>;
    if (m.kind !== "answer") return null;
    const { res } = m;
    if (!res.answered) return (
      <div key={i}>
        <div className="msg bot unsure"><p>{t("chat.unsure")}</p><p>{t("chat.unsureNext")}</p></div>
        {res.related.length > 0 && <><div className="msg bot" style={{ marginTop: 10 }}><p>{t("chat.maybe")}</p></div><div style={{ marginTop: 10 }}>{chips(res.related)}</div></>}
      </div>
    );
    const srcs = res.sources.map(byId).filter((d): d is NonNullable<typeof d> => !!d);
    return (
      <div key={i}>
        {res.failed && <div className="msg bot unsure" style={{ marginBottom: 10 }}><p>{t("chat.error")}</p></div>}
        <div className="msg bot">
          <p>{res.answer}</p>
          {srcs.length > 0 && (
            <p className="cite">{t("chat.basis")}: {srcs.map((d, j) => (
              <span key={d.id}>{j > 0 && "; "}{pick(d.basis)} (<a href={SOURCES[d.source].url} target="_blank" rel="noopener">{t("result.source")}</a>)</span>
            ))}</p>
          )}
          {res.mode === "ai" && <p className="ai-note">{t("chat.ai")}</p>}
        </div>
        {res.related.length > 0 && <div style={{ marginTop: 10 }}>{chips(res.related)}</div>}
      </div>
    );
  };

  return (
    <>
      <button className="chat-fab" type="button" aria-controls="chat" hidden={open} ref={fabRef} onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 0); }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z" /></svg>
        {t("chat.fab")}
      </button>
      <section className="chat" id="chat" role="dialog" aria-label={t("chat.dialog")} hidden={!open}>
        <div className="chat-head">
          <div><b>{t("chat.title")}</b><span>{t("chat.tagline")}</span></div>
          <button className="chat-close" type="button" aria-label={t("chat.close")} onClick={close}>×</button>
        </div>
        <div className="chat-log" ref={logRef} aria-live="polite">{log.map(render)}</div>
        <form className="chat-form" onSubmit={e => { e.preventDefault(); const q = text; setText(""); ask(q); }}>
          <label className="sr" htmlFor="chatInput">{t("chat.inputLabel")}</label>
          <input ref={inputRef} type="text" id="chatInput" placeholder={t("chat.inputPh")} autoComplete="off" maxLength={500} value={text} onChange={e => setText(e.target.value)} />
          <button type="submit" disabled={busy}>{t("chat.send")}</button>
        </form>
        <p className="chat-note">{t("chat.footer")} {t("chat.privacy")}</p>
      </section>
    </>
  );
}
