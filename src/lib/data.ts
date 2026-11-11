import rulesJson from "../../data/rules.json";
import zonesJson from "../../data/zones.json";
import knowledgeJson from "../../data/knowledge.json";
import sourcesJson from "../../data/sources.json";
import documentsJson from "../../data/documents.json";
import type { Knowledge, Rules, Source, Text } from "./types";

export const RULES = rulesJson as unknown as Rules;
export const KNOWLEDGE = knowledgeJson as Knowledge[];
export const SOURCES = sourcesJson as Record<string, Source>;
export const DOCUMENTS = documentsJson as Text[];
export const ZONES = zonesJson as unknown as {
  note: string;
  order: string[];
  polygons: Record<string, [number, number][]>;
  style: Record<string, Record<string, string | number>>;
};
