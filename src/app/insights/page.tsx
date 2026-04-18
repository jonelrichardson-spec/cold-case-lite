import { TopNav } from "@/components/ui/TopNav";
import { DataReliability } from "@/components/insights/DataReliability";
import { JurisdictionalAccountability } from "@/components/insights/JurisdictionalAccountability";
import { NationalTrend } from "@/components/insights/NationalTrend";
import { RacialSolveGap } from "@/components/insights/RacialSolveGap";
import { INSIGHTS_COPY } from "@/lib/constants";

export default function InsightsPage() {
  return (
    <>
      <TopNav />
      <main
        className="mx-auto pt-16"
        style={{ maxWidth: `${INSIGHTS_COPY.maxWidthPx}px` }}
      >
        <div className="px-8 pb-[60px] pt-10">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[9px] uppercase tracking-[3px] text-red">
              {INSIGHTS_COPY.eyebrow}
            </span>
            <h1 className="font-display text-[30px] tracking-[2px] text-ice">
              {INSIGHTS_COPY.headline}
            </h1>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-5">
            <RacialSolveGap />
            <JurisdictionalAccountability />
            <NationalTrend />
            <DataReliability />
          </div>
        </div>
      </main>
    </>
  );
}
