import type { Level } from "./types";

/* Ảnh kết quả 4:5 để chia sẻ, file lịch nhắc .ics và link chia sẻ */

export type CardData = {
  brand: string; sub: string; levelText: string; level: Level; title: string; meta: string;
  aheadLabel: string; stages: { label: string; level: Level; title: string }[]; foot: string;
};
const COLORS: Record<Level, string> = { ok: "#3f9a73", limit: "#d9a03a", cond: "#d9a03a", ban: "#b32d22" };

function wrap(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxW: number, lh: number, maxLines = 6) {
  const words = text.split(" ");
  let line = "";
  let lines: string[] = [];
  for (const w of words) {
    const t = line ? line + " " + w : w;
    if (ctx.measureText(t).width > maxW && line) { lines.push(line); line = w; } else line = t;
  }
  if (line) lines.push(line);
  lines = lines.slice(0, maxLines);
  lines.forEach((l, i) => ctx.fillText(l, x, y + i * lh));
  return y + lines.length * lh;
}

export async function drawCard(c: CardData): Promise<Blob | null> {
  try { await document.fonts.ready; } catch {}
  const W = 1080, H = 1350, P = 84, cv = document.createElement("canvas");
  cv.width = W; cv.height = H;
  const x = cv.getContext("2d");
  if (!x) return null;
  const serif = '"Merriweather", Georgia, serif', sans = '"Archivo", Arial, sans-serif';
  x.fillStyle = "#10251f"; x.fillRect(0, 0, W, H);
  x.fillStyle = "#fff"; x.font = `900 40px ${serif}`; x.fillText(c.brand, P, P + 30);
  x.fillStyle = "rgba(255,255,255,.6)"; x.font = `500 28px ${sans}`; x.fillText(c.sub, P, P + 76);
  let y = 300;
  x.fillStyle = COLORS[c.level]; x.beginPath(); x.arc(P + 34, y - 12, 34, 0, Math.PI * 2); x.fill();
  x.fillStyle = "#fff"; x.font = `600 34px ${sans}`; x.fillText(c.levelText, P + 92, y);
  y += 96;
  x.font = `900 64px ${serif}`; y = wrap(x, c.title, P, y, W - P * 2, 84, 4);
  y += 24;
  x.fillStyle = "rgba(255,255,255,.82)"; x.font = `400 32px ${sans}`;
  y = wrap(x, c.meta, P, y, W - P * 2, 46, 3);
  y += 56;
  x.strokeStyle = "rgba(255,255,255,.18)"; x.lineWidth = 2; x.beginPath(); x.moveTo(P, y); x.lineTo(W - P, y); x.stroke();
  y += 64;
  x.fillStyle = "rgba(255,255,255,.6)"; x.font = `600 28px ${sans}`; x.fillText(c.aheadLabel, P, y); y += 54;
  for (const st of c.stages) {
    x.fillStyle = COLORS[st.level]; x.beginPath(); x.arc(P + 12, y - 10, 12, 0, Math.PI * 2); x.fill();
    x.fillStyle = "rgba(255,255,255,.6)"; x.font = `500 26px ${sans}`; x.fillText(st.label, P + 44, y);
    x.fillStyle = "#fff"; x.font = `600 30px ${sans}`;
    y = wrap(x, st.title, P + 44, y + 42, W - P * 2 - 44, 40, 2) + 26;
  }
  x.fillStyle = "rgba(255,255,255,.5)"; x.font = `400 24px ${sans}`;
  wrap(x, c.foot, P, H - P - 30, W - P * 2, 34, 2);
  return new Promise(res => cv.toBlob(b => res(b), "image/png"));
}

export async function shareOrDownload(blob: Blob, name: string, title: string) {
  const file = new File([blob], name, { type: blob.type });
  try {
    if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title }); return; }
  } catch { return; }
  download(blob, name);
}

export function download(blob: Blob, name: string) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob); a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

export type IcsEvent = { date: string; summary: string; description: string; uid: string };
export function buildIcs(events: IcsEvent[], alarm: string, lang: string) {
  const esc = (t: string) => t.replace(/\\/g, "\\\\").replace(/[,;]/g, m => "\\" + m).replace(/\n/g, "\\n");
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "");
  const next = (d: string) => {
    const y = +d.slice(0, 4), m = +d.slice(4, 6), dd = +d.slice(6, 8);
    const n = new Date(Date.UTC(y, m - 1, dd + 1));
    return n.toISOString().slice(0, 10).replace(/-/g, "");
  };
  const ev = (e: IcsEvent) => [
    "BEGIN:VEVENT", `UID:${e.uid}@chuyenxanh`, `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${e.date}`, `DTEND;VALUE=DATE:${next(e.date)}`,
    `SUMMARY:${esc(e.summary)}`, `DESCRIPTION:${esc(e.description)}`,
    "BEGIN:VALARM", "TRIGGER:-P7D", "ACTION:DISPLAY", `DESCRIPTION:${esc(alarm)}`, "END:VALARM",
    "END:VEVENT"
  ].join("\r\n");
  return ["BEGIN:VCALENDAR", "VERSION:2.0", `PRODID:-//Chuyen Xanh//${lang.toUpperCase()}`, "CALSCALE:GREGORIAN", ...events.map(ev), "END:VCALENDAR"].join("\r\n");
}

/* Link chia sẻ: ?v=xe&a=khu-vuc&d=YYYY-MM-DD&t=HH:MM&old=1&lang=en */
export function deepLink(p: { vehicle: string; area: string; date: string; time: string; old: boolean }, lang: string) {
  const s = new URLSearchParams({ v: p.vehicle, a: p.area });
  if (p.date) s.set("d", p.date);
  if (p.time) s.set("t", p.time);
  if (p.old && p.vehicle === "xm_xang") s.set("old", "1");
  if (lang !== "vi") s.set("lang", lang);
  return `${location.origin}${location.pathname}?${s.toString()}#result`;
}
export function readDeepLink(search: string) {
  const p = new URLSearchParams(search);
  const d = p.get("d") || "", t = p.get("t") || "";
  return {
    vehicle: p.get("v"), area: p.get("a"),
    date: /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : null,
    time: /^\d{2}:\d{2}$/.test(t) ? t : null,
    old: p.get("old") === "1"
  };
}
