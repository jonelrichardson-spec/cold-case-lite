import { supabase } from "@/lib/supabase";
import {
  CASES_FETCH_CAP,
  CASES_TABLE,
  REPORTING_RATES_TABLE,
  SUPABASE_PAGE_SIZE,
} from "@/lib/constants";
import type { CaseDetail, CaseForCluster, Filters } from "@/lib/types";

function baseCountQuery(filters: Filters, forceSolved?: "Yes" | "No") {
  let q = supabase.from(CASES_TABLE).select("*", { count: "exact", head: true });
  if (filters.state) q = q.eq("state", filters.state);
  if (filters.vicSex) q = q.eq("vic_sex", filters.vicSex);
  if (filters.weapon) q = q.eq("weapon", filters.weapon);
  if (filters.vicRace) q = q.eq("vic_race", filters.vicRace);
  if (forceSolved !== undefined) {
    q = q.eq("solved", forceSolved);
  } else if (filters.solveStatus) {
    q = q.eq("solved", filters.solveStatus);
  }
  return q;
}

function baseRowsQuery(filters: Filters, offset: number, limit: number) {
  let q = supabase
    .from(CASES_TABLE)
    .select("county_fips, solved, state")
    .range(offset, offset + limit - 1);
  if (filters.state) q = q.eq("state", filters.state);
  if (filters.vicSex) q = q.eq("vic_sex", filters.vicSex);
  if (filters.weapon) q = q.eq("weapon", filters.weapon);
  if (filters.vicRace) q = q.eq("vic_race", filters.vicRace);
  if (filters.solveStatus) q = q.eq("solved", filters.solveStatus);
  return q;
}

export async function fetchStats(
  filters: Filters,
): Promise<{ cases: number; unsolved: number }> {
  const totalResult = await baseCountQuery(filters);
  if (totalResult.error) throw totalResult.error;

  const unsolvedResult = await baseCountQuery(
    { ...filters, solveStatus: null },
    "No",
  );
  if (unsolvedResult.error) throw unsolvedResult.error;

  return {
    cases: totalResult.count ?? 0,
    unsolved: unsolvedResult.count ?? 0,
  };
}

export async function fetchFilteredCases(
  filters: Filters,
): Promise<{ rows: CaseForCluster[]; capped: boolean }> {
  const rows: CaseForCluster[] = [];
  let offset = 0;
  let capped = false;
  while (offset < CASES_FETCH_CAP) {
    const limit = Math.min(SUPABASE_PAGE_SIZE, CASES_FETCH_CAP - offset);
    const { data, error } = await baseRowsQuery(filters, offset, limit);
    if (error) throw error;
    if (!data || data.length === 0) break;
    rows.push(...(data as CaseForCluster[]));
    if (data.length < limit) break;
    offset += data.length;
    if (offset >= CASES_FETCH_CAP) {
      capped = true;
      break;
    }
  }
  return { rows, capped };
}

const CLUSTER_DETAIL_COLUMNS =
  "id, year, vic_age, vic_sex, vic_race, weapon, solved, agency";

export async function fetchClusterCases(
  filters: Filters,
  countyFips: string,
): Promise<{ rows: CaseDetail[]; capped: boolean }> {
  const rows: CaseDetail[] = [];
  let offset = 0;
  let capped = false;
  while (offset < CASES_FETCH_CAP) {
    const limit = Math.min(SUPABASE_PAGE_SIZE, CASES_FETCH_CAP - offset);
    let q = supabase
      .from(CASES_TABLE)
      .select(CLUSTER_DETAIL_COLUMNS)
      .eq("county_fips", countyFips)
      .order("year", { ascending: false })
      .range(offset, offset + limit - 1);
    if (filters.state) q = q.eq("state", filters.state);
    if (filters.vicSex) q = q.eq("vic_sex", filters.vicSex);
    if (filters.weapon) q = q.eq("weapon", filters.weapon);
    if (filters.vicRace) q = q.eq("vic_race", filters.vicRace);
    if (filters.solveStatus) q = q.eq("solved", filters.solveStatus);
    const { data, error } = await q;
    if (error) throw error;
    if (!data || data.length === 0) break;
    rows.push(...(data as CaseDetail[]));
    if (data.length < limit) break;
    offset += data.length;
    if (offset >= CASES_FETCH_CAP) {
      capped = true;
      break;
    }
  }
  return { rows, capped };
}

export async function fetchReportingRate(
  state: string | null,
): Promise<number | null> {
  if (!state) return null;
  const { data, error } = await supabase
    .from(REPORTING_RATES_TABLE)
    .select("reporting_rate")
    .eq("state", state)
    .maybeSingle();
  if (error) throw error;
  const rate = (data as { reporting_rate: number } | null)?.reporting_rate;
  return rate ?? null;
}
