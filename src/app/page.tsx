"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { BriefCard } from "@/components/BriefCard";
import { BriefHeader } from "@/components/BriefHeader";
import { formatDate, formatDisplayDate } from "@/lib/date";
import type { DailyBrief } from "@/lib/schema";

const STORAGE_KEY = "fintech-brief-archive";

const loadArchive = (): DailyBrief[] => {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as DailyBrief[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveArchive = (briefs: DailyBrief[]) => {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(briefs));
};

export default function Home() {
  const [archive, setArchive] = useState<DailyBrief[]>([]);
  const [latest, setLatest] = useState<DailyBrief | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const stored = loadArchive();
    setArchive(stored);
    if (stored.length > 0) {
      setLatest(stored[0]);
    }
  }, []);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: formatDate(new Date()) }),
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error || "Unable to generate the brief.");
      }

      const brief = (await response.json()) as DailyBrief;
      setLatest(brief);

      const nextArchive = [brief, ...archive.filter((item) => item.date !== brief.date)];
      setArchive(nextArchive);
      saveArchive(nextArchive);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12 lg:flex-row lg:gap-12">
          <section className="flex-1 space-y-6">
            <div className="space-y-4">
              <span className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                Fintech Daily Brief
              </span>
              <h1 className="text-3xl font-semibold leading-tight text-slate-900 md:text-4xl">
                A daily, concise briefing for fintech operators and investors.
              </h1>
              <p className="max-w-2xl text-base text-slate-600">
                Generate a curated summary across markets, regulation, payments, digital
                assets, and risk.
              </p>
            </div>
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-slate-500">
              Loading your brief archive...
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12 lg:flex-row lg:gap-12">
        <section className="flex-1 space-y-6">
          <div className="space-y-4">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              Fintech Daily Brief
            </span>
            <h1 className="text-3xl font-semibold leading-tight text-slate-900 md:text-4xl">
              A daily, concise briefing for fintech operators and investors.
            </h1>
            <p className="max-w-2xl text-base text-slate-600">
              Generate a curated summary across markets, regulation, payments, digital
              assets, and risk. Built with mock RSS data so it runs instantly.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              onClick={handleGenerate}
              disabled={isLoading}
              type="button"
            >
              {isLoading ? "Generating..." : "Generate Today’s Brief"}
            </button>
            {error ? <span className="text-sm text-rose-600">{error}</span> : null}
          </div>

          {latest ? (
            <div className="space-y-6">
              <BriefHeader brief={latest} />
              <div className="grid gap-6 md:grid-cols-2">
                {latest.blocks.map((block, index) => (
                  <BriefCard key={`${block.section}-${index}`} block={block} />
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-slate-500">
              Generate your first brief to see the daily summary and sections.
            </div>
          )}
        </section>

        <aside className="w-full space-y-4 lg:w-80">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Archive</h2>
            <p className="text-sm text-slate-500">
              Recent briefs saved in your browser.
            </p>
            <div className="mt-4 space-y-3">
              {archive.length === 0 ? (
                <p className="text-sm text-slate-400">No briefs yet.</p>
              ) : (
                archive.map((brief) => (
                  <Link
                    key={brief.date}
                    href={`/brief/${brief.date}`}
                    className="block rounded-xl border border-slate-100 px-4 py-3 transition hover:border-slate-200 hover:bg-slate-50"
                  >
                    <p className="text-sm font-semibold text-slate-800">
                      {brief.title}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatDisplayDate(brief.date)}
                    </p>
                  </Link>
                ))
              )}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
