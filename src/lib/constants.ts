export const DATE_RANGE = {
  start: 1980,
  end: 2000,
} as const;

export const GREEN_RIVER_FILTER = {
  state: "Washington",
  vicSex: "Female",
  weapon: "Strangulation - hanging",
} as const;

export const MAP_DEFAULT_VIEW = {
  longitude: -98.5795,
  latitude: 39.8283,
  zoom: 3.5,
} as const;

export const MAPBOX_STYLE = "mapbox://styles/mapbox/dark-v11";

export const LOW_REPORTING_STATES: Record<string, number> = {
  Mississippi: 24,
  Florida: 48,
  Iowa: 59,
};

export const REPORTING_CONFIDENCE_THRESHOLDS = {
  high: 75,
  medium: 50,
} as const;

export const CASES_TABLE = "cases";
export const REPORTING_RATES_TABLE = "state_reporting_rates";

export const SUPABASE_PAGE_SIZE = 1000;
export const CASES_FETCH_CAP = 25000;

export const VIC_SEX_OPTIONS = [
  { value: null, label: "All" },
  { value: "Female", label: "Female" },
  { value: "Male", label: "Male" },
] as const;

export const WEAPON_OPTIONS = [
  { value: null, label: "All Weapons" },
  { value: "Handgun - pistol, revolver, etc", label: "Handgun - pistol, revolver, etc" },
  { value: "Knife or cutting instrument", label: "Knife or cutting instrument" },
  { value: "Strangulation - hanging", label: "Strangulation - hanging" },
  { value: "Blunt object - hammer, club, etc", label: "Blunt object - hammer, club, etc" },
  { value: "Shotgun", label: "Shotgun" },
  { value: "Firearm, type not stated", label: "Firearm, type not stated" },
  { value: "Personal weapons, includes beating", label: "Personal weapons, includes beating" },
  { value: "Other or type unknown", label: "Other or type unknown" },
] as const;

export const VIC_RACE_OPTIONS = [
  { value: null, label: "All Races" },
  { value: "White", label: "White" },
  { value: "Black", label: "Black" },
  { value: "Asian", label: "Asian" },
  {
    value: "American Indian or Alaskan Native",
    label: "American Indian or Alaskan Native",
  },
] as const;

export const SOLVE_STATUS_OPTIONS = [
  { value: null, label: "All" },
  { value: "No", label: "Unsolved Only" },
  { value: "Yes", label: "Solved Only" },
] as const;

export const MIN_CLUSTER_SIZE = {
  default: 10,
  min: 5,
  max: 50,
  step: 5,
} as const;

// A county becomes a cluster when at least this fraction of its cases are unsolved.
// Tuned from 0.67 to 0.50 so the Green River pattern surfaces (King/Pierce/Spokane
// WA sit at 50–57% unsolved for 1980–2000 strangulation cases).
export const CLUSTER_UNSOLVED_THRESHOLD = 0.5;

// State-bubble markers on the default (no-filters) national view.
// Diameter range + area-proportional sqrt scaling. The 0.50 threshold flips
// the bubble red -> amber; it matches CLUSTER_UNSOLVED_THRESHOLD conceptually
// (same "mostly unsolved" cutoff, just read at state granularity).
export const STATE_MARKER = {
  minPx: 30,
  maxPx: 80,
  redSolveRateThreshold: 0.5,
} as const;

export const REPORTING_GREEN_THRESHOLD = 70;

export const STATE_NAMES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "District of Columbia",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
] as const;

export const CENTROID_DATA_PATH = "/data/county-centroids.json";
export const STATES_GEOJSON_PATH = "/data/us-states.geojson";
export const NATIONAL_CLUSTERS_PATH = "/data/national-clusters.json";

export const ROUTES = {
  landing: "/",
  map: "/map",
  insights: "/insights",
  methodology: "/methodology",
} as const;

export const NAV_ITEMS = [
  { label: "Map", href: ROUTES.map },
  { label: "Insights", href: ROUTES.insights },
  { label: "Methodology", href: ROUTES.methodology },
] as const;

export const TOP_NAV_HEIGHT_PX = 64;

export const LANDING_COPY = {
  eyebrow: "INTELLIGENCE PLATFORM",
  headline: {
    lead: "COLD CASE",
    accent: "NETWORK.",
  },
  subtext: {
    line1: "What the data sees. What detectives missed.",
    line2: "The map they never made.",
  },
  stat: {
    value: "237,000+",
    label: "UNSOLVED HOMICIDES SINCE 1980",
  },
  enterLabel: "ENTER",
  enterAriaLabel: "Enter Cold Case Network map",
} as const;

export const INSIGHTS_COPY = {
  eyebrow: "DATA INSIGHTS",
  headline: "WHAT THE DATA SEES",
  maxWidthPx: 1100,
} as const;

export const INSIGHTS_FINDING_LABELS = {
  racial: {
    number: "FINDING 01",
    title: "RACIAL SOLVE RATE GAP",
    legendBlack: "Black Victims",
    legendWhite: "White Victims",
  },
  jurisdictional: {
    number: "FINDING 02",
    title: "JURISDICTIONAL ACCOUNTABILITY",
  },
  trend: {
    number: "FINDING 03",
    title: "NATIONAL TREND",
    peakLabel: "2022 PEAK",
    latestLabel: "2024 LATEST",
  },
  reliability: {
    number: "FINDING 04",
    title: "DATA RELIABILITY BY STATE",
  },
} as const;

export type RacialSolveRateRow = {
  decade: string;
  blackPct: number;
  whitePct: number;
  gapPp: number;
};

export const RACIAL_SOLVE_RATE_DATA: readonly RacialSolveRateRow[] = [
  { decade: "1980s", blackPct: 73.0, whitePct: 73.3, gapPp: 0.3 },
  { decade: "1990s", blackPct: 64.9, whitePct: 72.3, gapPp: 7.4 },
  { decade: "2000s", blackPct: 62.7, whitePct: 75.2, gapPp: 12.5 },
  { decade: "2010s", blackPct: 61.4, whitePct: 79.1, gapPp: 17.8 },
] as const;

export type JurisdictionalRow = {
  location: string;
  solveRatePct: number;
  caseCount: number;
};

export const JURISDICTIONAL_DATA: readonly JurisdictionalRow[] = [
  { location: "Washington, DC", solveRatePct: 34.2, caseCount: 7108 },
  { location: "San Mateo, CA", solveRatePct: 32.9, caseCount: 283 },
  { location: "Los Angeles, CA", solveRatePct: 38.3, caseCount: 1113 },
] as const;

export const NATIONAL_TREND_DATA = {
  peak: { year: 2022, value: 20306 },
  latest: { year: 2024, value: 15795 },
  declinePct: 22,
  maxBarHeightPx: 120,
} as const;

export type ReliabilityTier = "low" | "medium" | "high";

export type ReliabilityCell = {
  stateCode: string;
  reportingPct: number;
  tier: ReliabilityTier;
};

export const DATA_RELIABILITY_DATA: readonly ReliabilityCell[] = [
  { stateCode: "MS", reportingPct: 24, tier: "low" },
  { stateCode: "FL", reportingPct: 48, tier: "low" },
  { stateCode: "IA", reportingPct: 59, tier: "medium" },
  { stateCode: "WA", reportingPct: 92, tier: "high" },
  { stateCode: "VA", reportingPct: 100, tier: "high" },
] as const;

export const RELIABILITY_TIER_LABELS: Record<ReliabilityTier, string> = {
  low: "LOW",
  medium: "MEDIUM",
  high: "HIGH",
};

export const LOADER_DATA_QUALITY = {
  unmatchedOriCount: 252,
  unmatchedOriPct: 0.04,
  rhodeIslandTypoCount: 1211,
} as const;

export const METHODOLOGY_COPY = {
  eyebrow: "METHODOLOGY",
  headline: "HOW IT WORKS",
  maxWidthPx: 900,
} as const;

export type MethodologyCondition = {
  label: string;
  expression: string;
};

export const METHODOLOGY_ALGORITHM = {
  label: "ALGORITHM",
  title: "CLUSTER DETECTION",
  intro:
    "Cases are grouped by county FIPS code, weapon type, and victim demographic profile. A geographic cluster is flagged when the group meets both conditions:",
  conditions: [
    {
      label: "Condition 1:",
      expression: "total_cases >= min_cluster_size",
    },
    {
      label: "Condition 2:",
      expression: `unsolved_rate >= ${CLUSTER_UNSOLVED_THRESHOLD.toFixed(2)}`,
    },
  ] satisfies readonly MethodologyCondition[],
  notes: `The minimum cluster size is user-adjustable (default ${MIN_CLUSTER_SIZE.default}, range ${MIN_CLUSTER_SIZE.min}-${MIN_CLUSTER_SIZE.max}, step ${MIN_CLUSTER_SIZE.step}). Unsolved rate is defined as the proportion of cases where the offender sex is not known (OFFSEX = 'U'). Clusters are ranked by unsolved case count descending.`,
} as const;

export type DataSource = {
  name: string;
  records: string;
  years: string;
  role: string;
};

export const METHODOLOGY_DATA_SOURCES = {
  label: "DATA SOURCES",
  title: "WHERE THE DATA COMES FROM",
  sources: [
    {
      name: "SHR65_23.csv",
      records: "894,636",
      years: "1976-2023",
      role: "Primary case-level dataset. Single source of truth for all cluster analysis.",
    },
    {
      name: "UCR65_23a.sav",
      records: "180,298",
      years: "1965-2023",
      role: "Agency-level clearance rates. ORI to county FIPS mapping.",
    },
    {
      name: "State_Reporting_Rates_2022.xlsx",
      records: "51",
      years: "2022",
      role: "Data confidence badges. Flags low-reporting states.",
    },
    {
      name: "expanded-homicide-2024.zip",
      records: "Aggregate",
      years: "2020-2024",
      role: "National trend line context. Not case-level data.",
    },
  ] satisfies readonly DataSource[],
} as const;

const LOW_CONFIDENCE_STATES_LIST = (() => {
  const entries = Object.entries(LOW_REPORTING_STATES).map(
    ([state, pct]) => `${state} (${pct}%)`,
  );
  if (entries.length <= 1) return entries.join("");
  if (entries.length === 2) return entries.join(" and ");
  return `${entries.slice(0, -1).join(", ")}, and ${entries[entries.length - 1]}`;
})();

export const METHODOLOGY_LIMITATIONS = {
  label: "LIMITATIONS",
  title: "KNOWN LIMITATIONS",
  bullets: [
    `Low-confidence states: ${LOW_CONFIDENCE_STATES_LIST} have chronically low reporting rates. Clusters in these states may undercount the true number of cases.`,
    `${LOADER_DATA_QUALITY.unmatchedOriCount} unmatched ORI codes (${LOADER_DATA_QUALITY.unmatchedOriPct}% of cases) could not be mapped to a county FIPS code. These cases are included in national totals but excluded from geographic clustering.`,
    `Rhode Island data: ${LOADER_DATA_QUALITY.rhodeIslandTypoCount.toLocaleString("en-US")} records were originally recorded as 'Rhodes Island' in the source data. These have been corrected in the loader.`,
    "Solve rate definition: A case is considered solved when the offender sex field contains a known value. Cases where offender information is unknown or unreported are classified as unsolved.",
  ] satisfies readonly string[],
} as const;
