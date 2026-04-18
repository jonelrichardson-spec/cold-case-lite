import { CLUSTER_UNSOLVED_THRESHOLD } from "@/lib/constants";
import type { CaseForCluster, Cluster } from "@/lib/types";

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
    if (agg.total < minClusterSize) continue;
    const unsolvedRatio = agg.unsolved / agg.total;
    if (unsolvedRatio < CLUSTER_UNSOLVED_THRESHOLD) continue;
    const solveRate = 1 - unsolvedRatio;
    const countyCenter = countyCentroids[countyFips];
    const center = countyCenter ?? stateCentroids[agg.state];
    if (!center) continue;
    out.push({
      countyFips,
      state: agg.state,
      total: agg.total,
      unsolved: agg.unsolved,
      solveRate,
      center,
      isFallback: !countyCenter,
    });
  }
  return out;
}
