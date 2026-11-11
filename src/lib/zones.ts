import { ZONES } from "./data";

export function inside([lat, lng]: [number, number], poly: [number, number][]): boolean {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [yi, xi] = poly[i], [yj, xj] = poly[j];
    if ((yi > lat) !== (yj > lat) && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
}

/** Khu vực nhỏ nhất chứa điểm, theo thứ tự kv1 → kv2 → kv3 → vd1 */
export function zoneOf(pt: [number, number]): string {
  for (const id of ZONES.order) if (inside(pt, ZONES.polygons[id])) return id;
  return "out";
}
