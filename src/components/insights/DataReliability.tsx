import {
  DATA_RELIABILITY_DATA,
  INSIGHTS_FINDING_LABELS,
  RELIABILITY_TIER_LABELS,
  type ReliabilityCell,
  type ReliabilityTier,
} from "@/lib/constants";
import { InsightsCard } from "./InsightsCard";

const TIER_TEXT_COLOR: Record<ReliabilityTier, string> = {
  low: "text-red",
  medium: "text-amber",
  high: "text-green",
};

function ReliabilityCellView({ cell }: { cell: ReliabilityCell }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 border border-border bg-bg3 px-3 py-5">
      <span
        className={`font-display text-[28px] tracking-[1px] ${TIER_TEXT_COLOR[cell.tier]}`}
      >
        {cell.reportingPct}%
      </span>
      <span className="font-mono text-[11px] uppercase tracking-[1.5px] text-ice">
        {cell.stateCode}
      </span>
      <span
        className={`font-mono text-[7px] uppercase tracking-[2px] ${TIER_TEXT_COLOR[cell.tier]}`}
      >
        {RELIABILITY_TIER_LABELS[cell.tier]}
      </span>
    </div>
  );
}

export function DataReliability() {
  const labels = INSIGHTS_FINDING_LABELS.reliability;
  return (
    <InsightsCard findingNumber={labels.number} title={labels.title}>
      <div className="grid grid-cols-5 gap-2">
        {DATA_RELIABILITY_DATA.map((cell) => (
          <ReliabilityCellView key={cell.stateCode} cell={cell} />
        ))}
      </div>
    </InsightsCard>
  );
}
