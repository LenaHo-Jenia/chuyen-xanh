export type Lang = "vi" | "en";
export type Text = { vi: string; en: string };
export type Level = "ok" | "limit" | "cond" | "ban";

export type Vehicle = { id: string; label: Text; note: Text; canBeOld: boolean };
export type Area = { id: string; from: number; label: Text };
export type Outcome = { level: Level; title: Text; detail: Text };
export type Phase = { id: number; name: Text; year?: number; label?: Text; sample?: string };

export type MatrixCell = string | { old: string; default: string };
export type Rules = {
  updated: string;
  source: string;
  pilotStart: string;
  phases: Phase[];
  vehicles: Vehicle[];
  areas: Area[];
  curfew: { area: string; days: number[]; fromHour: number; outcome: string };
  notYet: Record<string, string>;
  matrix: Record<string, Record<string, MatrixCell>>;
  outcomes: Record<string, Outcome>;
  levels: Record<Level, Text>;
};

export type Source = { url: string; title: Text; date: string };
export type Knowledge = {
  id: string;
  faq: boolean;
  q: Text;
  a: Text;
  basis: Text;
  source: string;
  keywords?: string;
};

export type CheckInput = { vehicle: string; area: string; old: boolean; date: string; time: string };
