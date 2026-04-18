import { FilterPanel } from "@/components/map/FilterPanel";
import { MapDataLoader } from "@/components/map/MapDataLoader";
import { MapLayout } from "@/components/map/MapLayout";
import { MapShell } from "@/components/map/MapShell";
import { ResetViewButton } from "@/components/map/ResetViewButton";
import { StatsBar } from "@/components/map/StatsBar";
import { TopNav } from "@/components/ui/TopNav";

export default function MapPage() {
  return (
    <>
      <TopNav />
      <MapDataLoader />
      <MapLayout
        filterPanel={<FilterPanel />}
        mapSection={
          <>
            <MapShell />
            <StatsBar />
            <ResetViewButton />
          </>
        }
      />
    </>
  );
}
