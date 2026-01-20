import type { BriefBlock, DailyBrief, RssItem } from "./schema";
import { isDailyBrief } from "./schema";

const SECTION_RULES: { section: string; keywords: string[] }[] = [
  {
    section: "Markets & Macro",
    keywords: ["market", "rates", "treasury", "liquidity", "ipo", "valuation"],
  },
  {
    section: "Regulation",
    keywords: ["regulator", "policy", "guidance", "compliance", "capital", "sec"],
  },
  {
    section: "Payments & Banking",
    keywords: ["payment", "card", "merchant", "bank", "open-banking", "rtp"],
  },
  {
    section: "Crypto & Digital Assets",
    keywords: ["crypto", "token", "digital asset", "custody", "wallet", "blockchain"],
  },
  {
    section: "Fraud & Risk",
    keywords: ["fraud", "risk", "aml", "identity", "mule", "chargeback"],
  },
];

const MAX_ITEMS = 8;

const normalize = (value: string): string => value.toLowerCase();

const getSectionForItem = (item: RssItem): string => {
  const haystack = normalize(`${item.title} ${item.snippet}`);
  for (const rule of SECTION_RULES) {
    if (rule.keywords.some((keyword) => haystack.includes(keyword))) {
      return rule.section;
    }
  }
  return "Industry Signals";
};

const buildWatchlist = (items: RssItem[]): string[] => {
  const base = items.slice(0, 4).map((item) => {
    return item.title.replace(/\.$/, "");
  });
  return base.length >= 2 ? base : [...base, "Monitor follow-up filings and product rollouts"];
};

const buildSources = (items: RssItem[]) => {
  return items.slice(0, 4).map((item) => ({
    title: item.title,
    link: item.link,
    source: item.source,
  }));
};

const buildBlock = (section: string, items: RssItem[]): BriefBlock => {
  const headlines = items.map((item) => item.title).slice(0, 3);
  const whatHappened =
    headlines.length > 1
      ? `${headlines.join("; ")}.`
      : `${headlines[0] ?? "Key developments emerged across the sector."}`;

  const whyItMatters =
    "These moves signal shifting priorities for fintech operators and their partners.";

  return {
    section,
    what_happened: whatHappened,
    why_it_matters: whyItMatters,
    watchlist: buildWatchlist(items),
    sources: buildSources(items),
  };
};

const buildSummary = (blocks: BriefBlock[]): string => {
  const sections = blocks.map((block) => block.section).join(", ");
  return `Today’s brief spans ${sections}. Momentum is building across core fintech rails while risk and policy themes tighten execution. Expect continued focus on speed, compliance readiness, and resilient operations.`;
};

/**
 * Generate a structured daily brief using mock RSS items.
 */
export const generateBriefFromMock = (items: RssItem[], date: string): DailyBrief => {
  const sorted = [...items].sort(
    (a, b) => new Date(b.published).getTime() - new Date(a.published).getTime(),
  );
  const selected = sorted.slice(0, MAX_ITEMS);

  const grouped = selected.reduce<Record<string, RssItem[]>>((acc, item) => {
    const section = getSectionForItem(item);
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(item);
    return acc;
  }, {});

  const blocks = Object.entries(grouped)
    .map(([section, sectionItems]) => buildBlock(section, sectionItems))
    .slice(0, 5);

  const fallbackSections = ["Industry Signals", "Operational Focus", "Strategic Watch"];
  const briefBlocks = [...blocks];
  let fallbackIndex = 0;

  while (briefBlocks.length < 3 && fallbackIndex < fallbackSections.length) {
    briefBlocks.push(
      buildBlock(fallbackSections[fallbackIndex], selected.slice(0, 3)),
    );
    fallbackIndex += 1;
  }

  return {
    date,
    title: `Fintech Daily Brief — ${date}`,
    summary: buildSummary(briefBlocks),
    blocks: briefBlocks.slice(0, 5),
    disclaimer: "Not financial advice.",
    mode: "mock",
  };
};

// HOW TO ENABLE REAL CHATGPT CALLS
// 1) Add OPENAI_API_KEY to .env.local
// 2) Set USE_LLM=true to call generateBriefWithChatGPT
// 3) The implementation uses fetch; no SDK dependency required
/**
 * Placeholder for a real LLM-powered generator.
 */
export async function generateBriefWithChatGPT(
  items: RssItem[],
  date: string,
): Promise<DailyBrief> {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY is missing. Add it to .env.local before enabling real generation.",
    );
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are a fintech analyst writing concise daily briefs. Respond with valid JSON only.",
        },
        {
          role: "user",
          content: JSON.stringify({
            instructions:
              "Return ONLY a JSON object that matches the DailyBrief schema. Do not include markdown, comments, or extra keys. Keep it concise and professional.",
            schema: {
              date: "YYYY-MM-DD",
              title: "string",
              summary: "2-4 sentences string",
              blocks: [
                {
                  section: "string",
                  what_happened: "1-3 sentences string",
                  why_it_matters: "1 sentence string",
                  watchlist: ["2-5 short bullet strings"],
                  sources: [
                    { title: "string", link: "string", source: "string" },
                  ],
                },
              ],
              disclaimer: "Not financial advice.",
            },
            date,
            sections: SECTION_RULES.map((rule) => rule.section),
            items,
          }),
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    if (response.status === 401) {
      throw new Error(
        "OpenAI auth failed (401). Double-check OPENAI_API_KEY and restart the dev server.",
      );
    }
    throw new Error(`OpenAI request failed (${response.status}): ${errorText}`);
  }

  const payload = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = payload.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("OpenAI response was empty or malformed.");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("OpenAI response did not contain valid JSON.");
  }

  if (!isDailyBrief(parsed)) {
    // Fall back to mock generation to keep the app working.
    return generateBriefFromMock(items, date);
  }

  return {
    ...parsed,
    date,
    title: parsed.title || `Fintech Daily Brief — ${date}`,
    disclaimer: parsed.disclaimer || "Not financial advice.",
    mode: "llm",
  };
}
