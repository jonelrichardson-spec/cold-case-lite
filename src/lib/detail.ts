import type { CaseDetail } from "@/lib/types";

export interface Breakdown {
  label: string;
  count: number;
  share: number;
}

export interface DetailAggregates {
  total: number;
  unsolved: number;
  solveRate: number;
  yearMin: number | null;
  yearMax: number | null;
  weapons: Breakdown[];
  vicSex: Breakdown[];
  vicRace: Breakdown[];
  solveStatus: Breakdown[];
}

export function aggregateDetail(rows: CaseDetail[]): DetailAggregates {
  const total = rows.length;
  let unsolved = 0;
  let yearMin: number | null = null;
  let yearMax: number | null = null;
  const weaponCounts = new Map<string, number>();
  const sexCounts = new Map<string, number>();
  const raceCounts = new Map<string, number>();
  const solveCounts = new Map<string, number>();

  for (const row of rows) {
    if (row.solved === "No") unsolved += 1;
    if (typeof row.year === "number") {
      if (yearMin === null || row.year < yearMin) yearMin = row.year;
      if (yearMax === null || row.year > yearMax) yearMax = row.year;
    }
    bump(weaponCounts, normalizeWeapon(row.weapon));
    bump(sexCounts, normalizeSex(row.vic_sex));
    bump(raceCounts, normalizeRace(row.vic_race));
    bump(solveCounts, row.solved === "Yes" ? "Solved" : "Unsolved");
  }

  const solveRate = total > 0 ? (total - unsolved) / total : 0;

  return {
    total,
    unsolved,
    solveRate,
    yearMin,
    yearMax,
    weapons: toBreakdown(weaponCounts, total),
    vicSex: toBreakdown(sexCounts, total),
    vicRace: toBreakdown(raceCounts, total),
    solveStatus: toBreakdown(solveCounts, total),
  };
}

function bump(map: Map<string, number>, key: string): void {
  map.set(key, (map.get(key) ?? 0) + 1);
}

function toBreakdown(
  counts: Map<string, number>,
  total: number,
): Breakdown[] {
  const entries = Array.from(counts.entries());
  entries.sort((a, b) => b[1] - a[1]);
  return entries.map(([label, count]) => ({
    label,
    count,
    share: total > 0 ? count / total : 0,
  }));
}

function normalizeWeapon(value: string): string {
  if (!value) return "Unknown";
  const trimmed = value.trim();
  if (!trimmed) return "Unknown";
  const hyphen = trimmed.indexOf(" - ");
  return hyphen === -1 ? trimmed : trimmed.slice(0, hyphen);
}

function normalizeSex(value: string): string {
  if (!value) return "Unknown";
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : "Unknown";
}

function normalizeRace(value: string): string {
  if (!value) return "Unknown";
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : "Unknown";
}

export function parseCountyDisplay(
  countyFips: string,
): { county: string; stateCode: string | null } {
  const comma = countyFips.lastIndexOf(",");
  if (comma === -1) return { county: countyFips, stateCode: null };
  return {
    county: countyFips.slice(0, comma).trim(),
    stateCode: countyFips.slice(comma + 1).trim() || null,
  };
}

export function formatYearSpan(
  yearMin: number | null,
  yearMax: number | null,
): string {
  if (yearMin === null || yearMax === null) return "";
  if (yearMin === yearMax) return String(yearMin);
  return `${yearMin}\u2013${yearMax}`;
}

export function buildStoryBrief(
  countyFips: string,
  aggregates: DetailAggregates,
): string {
  const { county } = parseCountyDisplay(countyFips);
  const { total, unsolved, solveRate, yearMin, yearMax, weapons, vicSex } =
    aggregates;

  if (total === 0) {
    return `${county} has no cases matching the current filters.`;
  }

  const span = formatYearSpan(yearMin, yearMax);
  const whenPhrase =
    yearMin !== null && yearMax !== null
      ? yearMin === yearMax
        ? `in ${yearMin}`
        : `between ${span}`
      : "in the selected period";

  const caseWord = total === 1 ? "homicide case" : "homicide cases";
  const unsolvedSentence =
    unsolved === 0
      ? "All cases in this period are marked solved."
      : `${formatInt(unsolved)} remain unsolved, a solve rate of ${formatPercent(
          solveRate,
        )}.`;

  const weaponSentence =
    weapons.length > 0 && weapons[0].count > 0
      ? `The most common weapon was ${weapons[0].label.toLowerCase()}.`
      : "";

  const topSex = vicSex[0];
  const sexSentence =
    topSex && topSex.count > 0 && topSex.label !== "Unknown"
      ? `${formatPercent(topSex.share)} of victims were ${topSex.label.toLowerCase()}.`
      : "";

  return [
    `${county} recorded ${formatInt(total)} ${caseWord} ${whenPhrase}.`,
    unsolvedSentence,
    weaponSentence,
    sexSentence,
  ]
    .filter(Boolean)
    .join(" ");
}

export function formatPercent(share: number): string {
  return `${Math.round(share * 100)}%`;
}

export function formatInt(n: number): string {
  return n.toLocaleString("en-US");
}
