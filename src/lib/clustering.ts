import { CLUSTER_UNSOLVED_THRESHOLD, STATE_MARKER } from "@/lib/constants";
import type {
  CaseForCluster,
  Cluster,
  NationalStateAggregate,
  StateMarker,
} from "@/lib/types";

interface CountyAggregate {
  state: string;
  total: number;
  unsolved: number;
}

export function computeClusters(
  cases: CaseForCluster[],
  minClusterSize: number,
  countyCentroids: Record<string, [number, number]>,
  stateCentroids: Record<string, [number, number]>,
): Cluster[] {
  const groups = new Map<string, CountyAggregate>();
  for (const row of cases) {
    const key = row.county_fips;
    if (!key) continue;
    const current = groups.get(key) ?? {
      state: row.state,
      total: 0,
      unsolved: 0,
    };
    current.total += 1;
    if (row.solved === "No") {
      current.unsolved += 1;
    }
    groups.set(key, current);
  }

  const out: Cluster[] = [];
  for (const [countyFips, agg] of groups) {
    const countyCenter = countyCentroids[countyFips];
    const center = countyCenter ?? stateCentroids[agg.state];
    if (!center) continue;
    const unsolvedRatio = agg.total > 0 ? agg.unsolved / agg.total : 0;
    const solveRate = 1 - unsolvedRatio;
    const meetsThreshold =
      agg.total >= minClusterSize &&
      unsolvedRatio >= CLUSTER_UNSOLVED_THRESHOLD;
    out.push({
      countyFips,
      state: agg.state,
      total: agg.total,
      unsolved: agg.unsolved,
      solveRate,
      center,
      isFallback: !countyCenter,
      tone: meetsThreshold ? "red" : "amber",
    });
  }
  return out;
}

// National path: one bubble per state, sized by sqrt(total) so AREA is
// proportional to case volume (standard bubble-map convention — keeps the
// smallest states legible when the largest is 300x bigger).
export function buildNationalStateMarkers(
  aggregates: NationalStateAggregate[],
  stateCentroids: Record<string, [number, number]>,
): StateMarker[] {
  const withCenter = aggregates.filter((a) => stateCentroids[a.state]);
  if (withCenter.length === 0) return [];

  const sqrtTotals = withCenter.map((a) => Math.sqrt(a.total));
  const minSqrt = Math.min(...sqrtTotals);
  const maxSqrt = Math.max(...sqrtTotals);
  const sqrtRange = maxSqrt - minSqrt || 1;
  const { minPx, maxPx, redSolveRateThreshold } = STATE_MARKER;
  const pxRange = maxPx - minPx;

  const out: StateMarker[] = [];
  for (const agg of withCenter) {
    const t = (Math.sqrt(agg.total) - minSqrt) / sqrtRange;
    const sizePx = Math.round(minPx + t * pxRange);
    const tone: "red" | "amber" =
      agg.solve_rate <= redSolveRateThreshold ? "red" : "amber";
    out.push({
      state: agg.state,
      total: agg.total,
      unsolved: agg.unsolved,
      solveRate: agg.solve_rate,
      clusterCount: agg.cluster_count,
      center: stateCentroids[agg.state],
      sizePx,
      tone,
    });
  }
  return out;
}
