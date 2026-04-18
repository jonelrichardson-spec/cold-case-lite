"use client";

import { useEffect } from "react";
import { computeClusters } from "@/lib/clustering";
import {
  buildStateCentroidMap,
  loadCountyCentroids,
  loadStatesGeoJSON,
} from "@/lib/geo";
import {
  fetchFilteredCases,
  fetchReportingRate,
  fetchStats,
} from "@/lib/queries";
import type { Filters } from "@/lib/types";
import { useFilterStore } from "@/stores/useFilterStore";
import { useMapStore } from "@/stores/useMapStore";

export function MapDataLoader() {
  const state = useFilterStore((s) => s.state);
  const vicSex = useFilterStore((s) => s.vicSex);
  const weapon = useFilterStore((s) => s.weapon);
  const vicRace = useFilterStore((s) => s.vicRace);
  const solveStatus = useFilterStore((s) => s.solveStatus);
  const minClusterSize = useFilterStore((s) => s.minClusterSize);

  const setLoading = useMapStore((s) => s.setLoading);
  const setData = useMapStore((s) => s.setData);
  const setError = useMapStore((s) => s.setError);
  const clearCluster = useMapStore((s) => s.clearCluster);

  useEffect(() => {
    let cancelled = false;
    const filters: Filters = { state, vicSex, weapon, vicRace, solveStatus };
    clearCluster();

    async function run() {
      setLoading(true);
      setError(null);
      try {
        const [stats, centroids, geo, reportingRate] = await Promise.all([
          fetchStats(filters),
          loadCountyCentroids(),
          loadStatesGeoJSON(),
          fetchReportingRate(state),
        ]);
        if (cancelled) return;

        const stateCentroids = buildStateCentroidMap(geo);

        let clusters: ReturnType<typeof computeClusters> = [];
        let capped = false;
        if (state) {
          const { rows, capped: wasCapped } = await fetchFilteredCases(filters);
          if (cancelled) return;
          clusters = computeClusters(
            rows,
            minClusterSize,
            centroids,
            stateCentroids,
          );
          capped = wasCapped;
        }

        setData({
          stats: {
            cases: stats.cases,
            unsolved: stats.unsolved,
            clusters: clusters.length,
          },
          clusters,
          reporting: { state, rate: reportingRate },
          isCapped: capped,
        });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load map data";
        console.error("MapDataLoader error:", err);
        if (!cancelled) setError(message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [
    state,
    vicSex,
    weapon,
    vicRace,
    solveStatus,
    minClusterSize,
    setLoading,
    setData,
    setError,
    clearCluster,
  ]);

  return null;
}
