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
  zoom: 3.8,
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
