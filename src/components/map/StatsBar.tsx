"use client";

import { useMapStore } from "@/stores/useMapStore";

const formatter = new Intl.NumberFormat("en-US");

export function StatsBar() {
  const stats = useMapStore((s) => s.stats);
  const isLoading = useMapStore((s) => s.isLoading);

  return (
    <div
      aria-live="polite"
      className="absolute right-6 top-6 z-10 rounded-[2px] border border-border bg-[rgba(11,13,18,0.9)] px-4 py-2 font-mono text-[12px] tracking-[1px] text-muted backdrop-blur-[6px]"
    >
      {isLoading && (
        <span className="mr-2 text-muted2" aria-hidden="true">
          loading\u2026
        </span>
      )}
      <span className="text-ice">{formatter.format(stats.cases)}</span> cases
      <span className="px-2 text-muted">·</span>
      <span className="text-red">{formatter.format(stats.unsolved)}</span>{" "}
      unsolved
      <span className="px-2 text-muted">·</span>
      <span className="text-ice">{formatter.format(stats.clusters)}</span>{" "}
      clusters
    </div>
  );
}
