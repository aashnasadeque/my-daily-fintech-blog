export type RssItem = {
  title: string;
  link: string;
  published: string;
  source: string;
  snippet: string;
};

export type BriefBlock = {
  section: string;
  what_happened: string;
  why_it_matters: string;
  watchlist: string[];
  sources: { title: string; link: string; source: string }[];
};

export type DailyBrief = {
  date: string;
  title: string;
  summary: string;
  blocks: BriefBlock[];
  disclaimer: string;
  mode?: "mock" | "llm";
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === "string");

const isSource = (value: unknown): value is { title: string; link: string; source: string } => {
  if (!isRecord(value)) {
    return false;
  }
  return (
    typeof value.title === "string" &&
    typeof value.link === "string" &&
    typeof value.source === "string"
  );
};

export const isBriefBlock = (value: unknown): value is BriefBlock => {
  if (!isRecord(value)) {
    return false;
  }
  return (
    typeof value.section === "string" &&
    typeof value.what_happened === "string" &&
    typeof value.why_it_matters === "string" &&
    isStringArray(value.watchlist) &&
    Array.isArray(value.sources) &&
    value.sources.every(isSource)
  );
};

export const isRssItem = (value: unknown): value is RssItem => {
  if (!isRecord(value)) {
    return false;
  }
  return (
    typeof value.title === "string" &&
    typeof value.link === "string" &&
    typeof value.published === "string" &&
    typeof value.source === "string" &&
    typeof value.snippet === "string"
  );
};

export const isDailyBrief = (value: unknown): value is DailyBrief => {
  if (!isRecord(value)) {
    return false;
  }
  return (
    typeof value.date === "string" &&
    typeof value.title === "string" &&
    typeof value.summary === "string" &&
    typeof value.disclaimer === "string" &&
    Array.isArray(value.blocks) &&
    value.blocks.every(isBriefBlock)
  );
};
