interface StatsBarProps {
  cases: number;
  unsolved: number;
  clusters: number;
}

const formatter = new Intl.NumberFormat("en-US");

export function StatsBar({ cases, unsolved, clusters }: StatsBarProps) {
  return (
    <div
      aria-live="polite"
      className="absolute right-6 top-6 z-10 rounded-[2px] border border-border bg-[rgba(11,13,18,0.9)] px-4 py-2 font-mono text-[12px] tracking-[1px] text-muted backdrop-blur-[6px]"
    >
      <span className="text-ice">{formatter.format(cases)}</span> cases{" "}
      <span className="px-1 text-muted">·</span>{" "}
      <span className="text-red">{formatter.format(unsolved)}</span> unsolved{" "}
      <span className="px-1 text-muted">·</span>{" "}
      <span className="text-ice">{formatter.format(clusters)}</span> clusters
    </div>
  );
}
