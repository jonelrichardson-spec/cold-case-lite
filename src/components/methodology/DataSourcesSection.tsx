import { METHODOLOGY_DATA_SOURCES, type DataSource } from "@/lib/constants";
import { MethodologyCard } from "./MethodologyCard";

function SourceCard({ source }: { source: DataSource }) {
  return (
    <div className="rounded-[2px] border border-border bg-bg3 p-4">
      <p className="font-mono text-[12px] tracking-[0.5px] text-ice">
        {source.name}
      </p>
      <div className="mt-2 flex items-baseline gap-3 font-mono text-[10px] tracking-[1px]">
        <span className="text-amber">{source.records}</span>
        <span className="text-muted">{source.years}</span>
      </div>
      <p className="mt-3 font-body text-[12px] font-light leading-[1.6] text-muted2">
        {source.role}
      </p>
    </div>
  );
}

export function DataSourcesSection() {
  return (
    <MethodologyCard
      label={METHODOLOGY_DATA_SOURCES.label}
      title={METHODOLOGY_DATA_SOURCES.title}
    >
      <div className="grid grid-cols-2 gap-4">
        {METHODOLOGY_DATA_SOURCES.sources.map((source) => (
          <SourceCard key={source.name} source={source} />
        ))}
      </div>
    </MethodologyCard>
  );
}
