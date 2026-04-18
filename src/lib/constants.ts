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

export const SUPABASE_PAGE_SIZE = 1000;

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
