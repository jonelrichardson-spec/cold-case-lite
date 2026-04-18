"use client";

import { useEffect } from "react";
import { buildNationalStateMarkers, computeClusters } from "@/lib/clustering";
import {
  buildStateCentroidMap,
  loadCountyCentroids,
  loadNationalStates,
  loadStatesGeoJSON,
} from "@/lib/geo";
import {
  fetchFilteredCases,
  fetchReportingRate,
  fetchStats,
} from "@/lib/queries";
import type { Filters } from "@/lib/types";
import { hasActiveFilters, useFilterStore } from "@/stores/useFilterStore";
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
    const filtersActive = hasActiveFilters(filters);
    clearCluster();

    async function run() {
      setLoading(true);
      setError(null);
      try {
        const [centroids, geo] = await Promise.all([
          loadCountyCentroids(),
          loadStatesGeoJSON(),
        ]);
        if (cancelled) return;
        const stateCentroids = buildStateCentroidMap(geo);

        if (!filtersActive) {
          const national = await loadNationalStates();
          if (cancelled) return;
          const stateMarkers = buildNationalStateMarkers(
            national.states,
            stateCentroids,
          );
          setData({
            stats: {
              cases: national.total_cases,
              unsolved: national.total_unsolved,
              clusters: national.total_clusters,
            },
            clusters: [],
            stateMarkers,
            reporting: { state: null, rate: null },
            isCapped: false,
          });
          return;
        }

        const [stats, reportingRate, caseRows] = await Promise.all([
          fetchStats(filters),
          fetchReportingRate(state),
          fetchFilteredCases(filters),
        ]);
        if (cancelled) return;

        const clusters = computeClusters(
          caseRows.rows,
          minClusterSize,
          centroids,
          stateCentroids,
        );

        setData({
          stats: {
            cases: stats.cases,
            unsolved: stats.unsolved,
            clusters: clusters.length,
          },
          clusters,
          stateMarkers: [],
          reporting: { state, rate: reportingRate },
          isCapped: caseRows.capped,
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
