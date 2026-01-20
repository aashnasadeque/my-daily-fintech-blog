import type { BriefBlock } from "@/lib/schema";

import { SourceList } from "./SourceList";

type BriefCardProps = {
  block: BriefBlock;
};

export const BriefCard = ({ block }: BriefCardProps) => {
  return (
    <article className="flex h-full flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
          {block.section}
        </span>
      </div>
      <div className="space-y-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            What happened
          </p>
          <p className="text-sm text-slate-700">{block.what_happened}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Why it matters
          </p>
          <p className="text-sm text-slate-700">{block.why_it_matters}</p>
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Watchlist
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
          {block.watchlist.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <div className="pt-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Sources
        </p>
        <SourceList sources={block.sources} />
      </div>
    </article>
  );
};
