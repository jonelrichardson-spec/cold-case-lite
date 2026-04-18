import {
  INSIGHTS_FINDING_LABELS,
  RACIAL_SOLVE_RATE_DATA,
  type RacialSolveRateRow,
} from "@/lib/constants";
import { InsightsCard } from "./InsightsCard";

function DecadeRow({ row }: { row: RacialSolveRateRow }) {
  return (
    <div className="grid grid-cols-[48px_1fr_56px] items-center gap-4">
      <span className="font-mono text-[11px] uppercase tracking-[1.5px] text-muted2">
        {row.decade}
      </span>
      <div className="flex flex-col gap-1.5">
        <Bar colorClass="bg-red" valuePct={row.blackPct} />
        <Bar colorClass="bg-muted" valuePct={row.whitePct} />
      </div>
      <span className="text-right font-mono text-[11px] tracking-[1px] text-amber">
        +{row.gapPp.toFixed(1)}pp
      </span>
    </div>
  );
}

interface BarProps {
  colorClass: string;
  valuePct: number;
}

function Bar({ colorClass, valuePct }: BarProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-[6px] flex-1 bg-bg3">
        <div
          className={`h-full ${colorClass}`}
          style={{ width: `${valuePct}%` }}
        />
      </div>
      <span className="w-[40px] text-right font-mono text-[10px] tracking-[0.5px] text-ice">
        {valuePct.toFixed(1)}%
      </span>
    </div>
  );
}

export function RacialSolveGap() {
  const labels = INSIGHTS_FINDING_LABELS.racial;
  return (
    <InsightsCard findingNumber={labels.number} title={labels.title}>
      <div className="flex flex-col gap-3">
        {RACIAL_SOLVE_RATE_DATA.map((row) => (
          <DecadeRow key={row.decade} row={row} />
        ))}
      </div>
      <div className="mt-5 flex items-center gap-5 border-t border-border pt-4">
        <LegendSwatch colorClass="bg-red" label={labels.legendBlack} />
        <LegendSwatch colorClass="bg-muted" label={labels.legendWhite} />
      </div>
    </InsightsCard>
  );
}

function LegendSwatch({
  colorClass,
  label,
}: {
  colorClass: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className={`block h-[8px] w-[8px] ${colorClass}`} aria-hidden />
      <span className="font-mono text-[10px] uppercase tracking-[1.5px] text-muted2">
        {label}
      </span>
    </div>
  );
}
