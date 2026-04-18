import { FilterPanel } from "@/components/map/FilterPanel";
import { MapShell } from "@/components/map/MapShell";
import { StatsBar } from "@/components/map/StatsBar";
import { TopNav } from "@/components/ui/TopNav";

export default function MapPage() {
  return (
    <>
      <TopNav />
      <div className="h-screen pt-16">
        <div className="grid h-full grid-cols-[260px_1fr]">
          <FilterPanel />
          <section className="relative h-full">
            <MapShell />
            <StatsBar cases={0} unsolved={0} clusters={0} />
          </section>
        </div>
      </div>
    </>
  );
}
