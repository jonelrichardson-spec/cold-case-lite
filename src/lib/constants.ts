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
