export type CostInput = {
  kmDay: number; daysMonth: number; battery: number; subsidy: number; resale: number;
  gasPrice: number; gasUse: number; evPrice: number; evUse: number; elecPrice: number; busPass: number; maint: number;
};
export const DEFAULT_COST: CostInput = {
  kmDay: 20, daysMonth: 26, battery: 0, subsidy: 0, resale: 0,
  gasPrice: 21000, gasUse: 2, evPrice: 20000000, evUse: 3, elecPrice: 3000, busPass: 200000, maint: 50000
};
export const CO2_PER_LITRE = 2.3;

export function computeCost(i: CostInput) {
  const v = (n: number) => Math.max(0, Number.isFinite(n) ? n : 0);
  const km = v(i.kmDay) * v(i.daysMonth);
  const litres = (km / 100) * v(i.gasUse);
  const gasMonth = litres * v(i.gasPrice) + v(i.maint);
  const evMonth = (km / 100) * v(i.evUse) * v(i.elecPrice) + v(i.battery);
  const busMonth = v(i.busPass);
  const evUpfront = Math.max(0, v(i.evPrice) - v(i.subsidy) - v(i.resale));
  const save = gasMonth - evMonth;
  const months = save > 0 && evUpfront > 0 ? Math.ceil(evUpfront / save) : 0;
  return {
    km, litres, gasMonth, evMonth, busMonth, evUpfront, save, months,
    litresYear: Math.round(litres * 12),
    co2Year: Math.round(litres * 12 * CO2_PER_LITRE),
    busCheapest: km > 0 && busMonth < Math.min(gasMonth, evMonth)
  };
}
