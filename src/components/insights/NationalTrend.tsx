import { INSIGHTS_FINDING_LABELS, NATIONAL_TREND_DATA } from "@/lib/constants";
import { InsightsCard } from "./InsightsCard";

interface TrendBarProps {
  year: number;
  value: number;
  heightPx: number;
  barColorClass: string;
  valueColorClass: string;
  yearLabel: string;
}

function TrendBar({
  year,
  value,
  heightPx,
  barColorClass,
  valueColorClass,
  yearLabel,
}: TrendBarProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="flex w-[72px] items-end justify-center"
        style={{ height: `${NATIONAL_TREND_DATA.maxBarHeightPx}px` }}
      >
        <div
          className={`w-full ${barColorClass}`}
          style={{ height: `${heightPx}px` }}
          aria-label={`${year}: ${value.toLocaleString()}`}
        />
      </div>
      <div className="flex flex-col items-center gap-1">
        <span className={`font-display text-[28px] tracking-[1px] ${valueColorClass}`}>
          {value.toLocaleString()}
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[2.5px] text-muted">
          {yearLabel}
        </span>
      </div>
    </div>
  );
}

export function NationalTrend() {
  const labels = INSIGHTS_FINDING_LABELS.trend;
  const { peak, latest, declinePct, maxBarHeightPx } = NATIONAL_TREND_DATA;
  const latestHeightPx = Math.round((latest.value / peak.value) * maxBarHeightPx);

  return (
    <InsightsCard findingNumber={labels.number} title={labels.title}>
      <div className="flex items-end justify-center gap-10">
        <TrendBar
          year={peak.year}
          value={peak.value}
          heightPx={maxBarHeightPx}
          barColorClass="bg-red"
          valueColorClass="text-ice"
          yearLabel={labels.peakLabel}
        />
        <TrendBar
          year={latest.year}
          value={latest.value}
          heightPx={latestHeightPx}
          barColorClass="bg-muted"
          valueColorClass="text-ice"
          yearLabel={labels.latestLabel}
        />
        <div className="flex flex-col items-center gap-1 self-center">
          <span className="font-display text-[30px] tracking-[1px] text-amber">
            {"\u25BC"} {declinePct}%
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[2.5px] text-muted">
            Decline
          </span>
        </div>
      </div>
    </InsightsCard>
  );
}
