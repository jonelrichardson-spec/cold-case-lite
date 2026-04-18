import { TopNav } from "@/components/ui/TopNav";
import { AlgorithmSection } from "@/components/methodology/AlgorithmSection";
import { DataSourcesSection } from "@/components/methodology/DataSourcesSection";
import { LimitationsSection } from "@/components/methodology/LimitationsSection";
import { METHODOLOGY_COPY } from "@/lib/constants";

export default function MethodologyPage() {
  return (
    <>
      <TopNav />
      <main
        className="mx-auto pt-16"
        style={{ maxWidth: `${METHODOLOGY_COPY.maxWidthPx}px` }}
      >
        <div className="px-8 pb-[60px] pt-10">
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[9px] uppercase tracking-[3px] text-red">
              {METHODOLOGY_COPY.eyebrow}
            </span>
            <h1 className="font-display text-[30px] tracking-[2px] text-ice">
              {METHODOLOGY_COPY.headline}
            </h1>
          </div>
          <div className="mt-10 flex flex-col gap-6">
            <AlgorithmSection />
            <DataSourcesSection />
            <LimitationsSection />
          </div>
        </div>
      </main>
    </>
  );
}
