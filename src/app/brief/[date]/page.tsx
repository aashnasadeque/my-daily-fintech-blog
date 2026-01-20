"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { BriefCard } from "@/components/BriefCard";
import { BriefHeader } from "@/components/BriefHeader";
import type { DailyBrief } from "@/lib/schema";

const STORAGE_KEY = "fintech-brief-archive";

const loadBrief = (date: string): DailyBrief | null => {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as DailyBrief[]) : [];
    if (!Array.isArray(parsed)) {
      return null;
    }
    return parsed.find((item) => item.date === date) ?? null;
  } catch {
    return null;
  }
};

export default function BriefPage() {
  const params = useParams<{ date: string }>();
  const [brief, setBrief] = useState<DailyBrief | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (params?.date) {
      setBrief(loadBrief(params.date));
    }
  }, [params]);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-12">
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-slate-500">
            Loading brief...
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-12">
        <Link className="text-sm font-semibold text-slate-500 hover:text-slate-700" href="/">
          ← Back to home
        </Link>

        {brief ? (
          <div className="space-y-6">
            <BriefHeader brief={brief} />
            <div className="grid gap-6 md:grid-cols-2">
              {brief.blocks.map((block, index) => (
                <BriefCard key={`${block.section}-${index}`} block={block} />
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-slate-500">
            We couldn't find that brief in local storage. Generate it from the home
            page to add it to your archive.
          </div>
        )}
      </main>
    </div>
  );
}
