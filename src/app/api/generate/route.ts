import { NextResponse } from "next/server";

import { generateBriefFromMock, generateBriefWithChatGPT } from "@/lib/briefGenerator";
import { formatDate } from "@/lib/date";
import { mockRssItems } from "@/lib/mockRss";

const USE_LLM = process.env.USE_LLM === "true";

/**
 * POST /api/generate
 * Generates a DailyBrief from mock RSS items.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const dateValue = typeof body?.date === "string" ? body.date : formatDate(new Date());

    if (typeof dateValue !== "string" || dateValue.length < 10) {
      return NextResponse.json(
        { error: "Invalid date format. Use YYYY-MM-DD." },
        { status: 400 },
      );
    }

    const brief = USE_LLM
      ? await generateBriefWithChatGPT(mockRssItems, dateValue)
      : generateBriefFromMock(mockRssItems, dateValue);

    return NextResponse.json(brief, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to generate the brief.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
