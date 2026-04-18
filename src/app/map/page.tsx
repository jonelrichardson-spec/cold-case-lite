import { FilterPanel } from "@/components/map/FilterPanel";
import { MapDataLoader } from "@/components/map/MapDataLoader";
import { MapShell } from "@/components/map/MapShell";
import { ResetViewButton } from "@/components/map/ResetViewButton";
import { StatsBar } from "@/components/map/StatsBar";
import { TopNav } from "@/components/ui/TopNav";

export default function MapPage() {
  return (
    <>
      <TopNav />
      <MapDataLoader />
      <div className="h-screen pt-16">
        <div className="grid h-full grid-cols-[260px_1fr]">
          <FilterPanel />
          <section className="relative h-full">
            <MapShell />
            <StatsBar />
            <ResetViewButton />
          </section>
        </div>
      </div>
    </>
  );
}
