import {
  INSIGHTS_FINDING_LABELS,
  JURISDICTIONAL_DATA,
  type JurisdictionalRow,
} from "@/lib/constants";
import { InsightsCard } from "./InsightsCard";

function JurisdictionRow({ row }: { row: JurisdictionalRow }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[1.5px]">
        <span className="text-ice">{row.location}</span>
        <span className="text-muted2">
          {row.caseCount.toLocaleString()} cases
        </span>
      </div>
      <div className="relative h-[20px] bg-bg3">
        <div
          className="flex h-full items-center bg-red pl-2"
          style={{ width: `${row.solveRatePct}%` }}
        >
          <span className="font-mono text-[10px] tracking-[1px] text-ice">
            {row.solveRatePct.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
}

export function JurisdictionalAccountability() {
  const labels = INSIGHTS_FINDING_LABELS.jurisdictional;
  return (
    <InsightsCard findingNumber={labels.number} title={labels.title}>
      <div className="flex flex-col gap-5">
        {JURISDICTIONAL_DATA.map((row) => (
          <JurisdictionRow key={row.location} row={row} />
        ))}
      </div>
    </InsightsCard>
  );
}
