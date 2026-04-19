export type SolvedStatus = "Yes" | "No";

export interface Case {
  id: string;
  county_fips: string | null;
  ori: string;
  state: string;
  agency: string;
  agency_type: string;
  source: string;
  solved: SolvedStatus;
  year: number;
  month: string;
  incident: number | null;
  action_type: string;
  homicide: string;
  situation: string;
  vic_age: number | null;
  vic_sex: string;
  vic_race: string;
  vic_ethnic: string;
  off_age: number | null;
  off_sex: string;
  off_race: string;
  off_ethnic: string;
  weapon: string;
  relationship: string;
  circumstance: string;
  subcircum: string | null;
  vic_count: number | null;
  off_count: number | null;
  file_date: string | null;
  msa: string | null;
}

export type CaseForCluster = Pick<Case, "county_fips" | "solved" | "state">;

export type CaseDetail = Pick<
  Case,
  "id" | "year" | "vic_age" | "vic_sex" | "vic_race" | "weapon" | "solved" | "agency"
>;

export interface Filters {
  state: string | null;
  vicSex: "Female" | "Male" | null;
  weapon: string | null;
  vicRace: string | null;
  solveStatus: SolvedStatus | null;
}

export interface Cluster {
  countyFips: string;
  state: string;
  total: number;
  unsolved: number;
  solveRate: number;
  center: [number, number];
  isFallback: boolean;
  // "red" = county meets the cluster threshold (total >= minClusterSize AND
  // unsolvedRatio >= CLUSTER_UNSOLVED_THRESHOLD). "amber" = below threshold but
  // still rendered so users see the full distribution as they add filters.
  tone: "red" | "amber";
}

export interface NationalStateAggregate {
  state: string;
  total: number;
  unsolved: number;
  solve_rate: number;
  cluster_count: number;
}

export interface NationalStatesFile {
  total_cases: number;
  total_unsolved: number;
  total_clusters: number;
  states: NationalStateAggregate[];
}

export interface StateMarker {
  state: string;
  total: number;
  unsolved: number;
  solveRate: number;
  clusterCount: number;
  center: [number, number];
  sizePx: number;
  tone: "red" | "amber";
}
