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
}
