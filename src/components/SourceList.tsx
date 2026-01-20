type Source = {
  title: string;
  link: string;
  source: string;
};

type SourceListProps = {
  sources: Source[];
};

export const SourceList = ({ sources }: SourceListProps) => {
  return (
    <ul className="space-y-2 text-sm text-slate-600">
      {sources.map((source) => (
        <li key={source.link} className="flex flex-col">
          <a
            className="font-medium text-slate-700 hover:text-slate-900"
            href={source.link}
            rel="noreferrer"
            target="_blank"
          >
            {source.title}
          </a>
          <span className="text-xs text-slate-400">{source.source}</span>
        </li>
      ))}
    </ul>
  );
};
