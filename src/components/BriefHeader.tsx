import type { DailyBrief } from "@/lib/schema";
import { formatDisplayDate } from "@/lib/date";

type BriefHeaderProps = {
  brief: DailyBrief;
};

export const BriefHeader = ({ brief }: BriefHeaderProps) => {
  return (
    <header className="space-y-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold text-slate-900">{brief.title}</h1>
          {brief.mode ? (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
              {brief.mode === "llm" ? "LLM mode" : "Mock mode"}
            </span>
          ) : null}
        </div>
        <span className="text-sm font-medium text-slate-500">
          {formatDisplayDate(brief.date)}
        </span>
      </div>
      <p className="text-base text-slate-700">{brief.summary}</p>
      <p className="text-xs text-slate-400">{brief.disclaimer}</p>
    </header>
  );
};
