"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Map as LMap, CircleMarker } from "leaflet";
import { ZONES } from "@/lib/data";
import { zoneOf } from "@/lib/zones";
import { useI18n } from "@/lib/i18n";
import type { Picked } from "./Home";

type Props = {
  fitArea: { area: string; n: number } | null;
  onPick: (area: string, info: { name?: string; here?: boolean }) => void;
  onStatus: (p: Picked) => void;
  children: ReactNode;
};
const LEGEND: [string, string][] = [["kv1", "#b5352a"], ["kv2", "#d9a03a"], ["kv3", "#2e6b57"], ["vd1", "transparent"]];

/* Bản đồ chọn điểm đến. Ranh giới GẦN ĐÚNG, xem data/zones.json. */
export default function ZoneMap({ fitArea, onPick, onStatus, children }: Props) {
  const { t, lang } = useI18n();
  const box = useRef<HTMLDivElement>(null);
  const map = useRef<LMap | null>(null);
  const marker = useRef<CircleMarker | null>(null);
  const L = useRef<typeof import("leaflet") | null>(null);
  const [ready, setReady] = useState(false);
  const [q, setQ] = useState("");
  const langRef = useRef(lang);
  langRef.current = lang;
  const cb = useRef({ onPick, onStatus });
  cb.current = { onPick, onStatus };

  const choose = async (pt: [number, number], name?: string, here?: boolean) => {
    const area = zoneOf(pt);
    const Lf = L.current, m = map.current;
    if (!Lf || !m) return;
    if (marker.current) marker.current.setLatLng(pt);
    else marker.current = Lf.circleMarker(pt, { radius: 9, color: "#fff", weight: 3, fillColor: "#1d3b33", fillOpacity: 1 }).addTo(m);
    cb.current.onPick(area, { name, here });
    if (!name && !here) {
      try {
        const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=17&accept-language=${langRef.current}&lat=${pt[0]}&lon=${pt[1]}`).then(x => x.json());
        const a = r.address || {};
        const n = a.road || a.pedestrian || a.neighbourhood || a.suburb;
        const cur = marker.current?.getLatLng();
        if (n && cur && cur.lat === pt[0]) cb.current.onPick(area, { name: n });
      } catch { /* giữ tên khu vực */ }
    }
  };

  useEffect(() => {
    let dead = false;
    import("leaflet").then(mod => {
      if (dead || !box.current || map.current) return;
      const Lf = (mod as unknown as { default?: typeof import("leaflet") }).default || mod;
      L.current = Lf;
      const m = Lf.map(box.current, { scrollWheelZoom: false });
      m.fitBounds(Lf.polygon(ZONES.polygons.kv3).getBounds(), { padding: [10, 10] });
      Lf.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        maxZoom: 19, subdomains: "abcd",
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
      }).addTo(m);
      ["vd1", "kv3", "kv2", "kv1"].forEach(id => Lf.polygon(ZONES.polygons[id], { ...(ZONES.style[id] as object), interactive: false }).addTo(m));
      m.on("click", e => choose([e.latlng.lat, e.latlng.lng]));
      map.current = m;
      setReady(true);
      setTimeout(() => m.invalidateSize(), 0);
    }).catch(() => {});
    return () => { dead = true; map.current?.remove(); map.current = null; marker.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Chọn từ danh sách hoặc mở từ link: bỏ điểm đánh dấu, phóng tới khu vực
  useEffect(() => {
    if (!fitArea || !ready || !map.current || !L.current) return;
    if (marker.current) { map.current.removeLayer(marker.current); marker.current = null; }
    const poly = ZONES.polygons[fitArea.area];
    if (poly) map.current.fitBounds(L.current.polygon(poly).getBounds(), { padding: [12, 12] });
  }, [fitArea, ready]);

  const search = async () => {
    const s = q.trim();
    if (!s || !map.current) return;
    onStatus({ kind: "searching" });
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&accept-language=${lang}&countrycodes=vn&bounded=1&viewbox=105.78,21.08,105.90,20.98&q=` + encodeURIComponent(s + ", Hà Nội");
      const r = await fetch(url).then(x => x.json());
      if (!r.length) { onStatus({ kind: "notFound", q: s }); return; }
      const pt: [number, number] = [+r[0].lat, +r[0].lon];
      choose(pt, r[0].name || s);
      map.current.setView(pt, 16);
    } catch { onStatus({ kind: "searchFail" }); }
  };
  const locate = () => {
    if (!navigator.geolocation) { onStatus({ kind: "noGeo" }); return; }
    onStatus({ kind: "locating" });
    navigator.geolocation.getCurrentPosition(
      p => { const pt: [number, number] = [p.coords.latitude, p.coords.longitude]; choose(pt, undefined, true); map.current?.setView(pt, 16); },
      () => onStatus({ kind: "geoFail" }),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <>
      <div className="mapbox">
        <div className="map-tools">
          <label className="sr" htmlFor="placeSearch">{t("check.searchLabel")}</label>
          <input type="search" id="placeSearch" placeholder={t("check.searchPh")} autoComplete="off" value={q}
            onChange={e => setQ(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); search(); } }} />
          <button type="button" onClick={search}>{t("check.find")}</button>
          <button type="button" onClick={locate}>{t("check.locate")}</button>
        </div>
        <div id="map" ref={box} role="application" aria-labelledby="placeLabel" />
      </div>
      {ready && (
        <>
          <ul className="legend">
            {LEGEND.map(([id, c]) => (
              <li key={id}><i style={id === "vd1" ? { background: c, border: "1.5px dashed #5b6763" } : { background: c }} />{t(`check.zone_${id}`)}</li>
            ))}
          </ul>
          {children}
        </>
      )}
    </>
  );
}
