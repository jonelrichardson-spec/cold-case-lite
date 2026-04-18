import type {
  Feature,
  FeatureCollection,
  MultiPolygon,
  Polygon,
} from "geojson";
import { CENTROID_DATA_PATH, STATES_GEOJSON_PATH } from "@/lib/constants";

export type CountyCentroids = Record<string, [number, number]>;
export interface StateProps {
  name: string;
}
export type StateFeature = Feature<Polygon | MultiPolygon, StateProps>;
export type StatesCollection = FeatureCollection<
  Polygon | MultiPolygon,
  StateProps
>;

let centroidsCache: CountyCentroids | null = null;
let statesCache: StatesCollection | null = null;

export async function loadCountyCentroids(): Promise<CountyCentroids> {
  if (centroidsCache) return centroidsCache;
  const res = await fetch(CENTROID_DATA_PATH);
  if (!res.ok) {
    throw new Error(`Failed to load county centroids: ${res.status}`);
  }
  const data = (await res.json()) as CountyCentroids;
  centroidsCache = data;
  return data;
}

export async function loadStatesGeoJSON(): Promise<StatesCollection> {
  if (statesCache) return statesCache;
  const res = await fetch(STATES_GEOJSON_PATH);
  if (!res.ok) {
    throw new Error(`Failed to load states GeoJSON: ${res.status}`);
  }
  const data = (await res.json()) as StatesCollection;
  statesCache = data;
  return data;
}

export function computeStateBounds(
  feature: StateFeature,
): [[number, number], [number, number]] {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  const visit = (position: number[]) => {
    const [x, y] = position;
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
  };
  const walk = (node: unknown): void => {
    if (!Array.isArray(node)) return;
    if (typeof node[0] === "number") {
      visit(node as number[]);
      return;
    }
    for (const child of node) walk(child);
  };
  walk(feature.geometry.coordinates);
  return [
    [minX, minY],
    [maxX, maxY],
  ];
}

export function computeStateCentroid(feature: StateFeature): [number, number] {
  const [[minX, minY], [maxX, maxY]] = computeStateBounds(feature);
  return [(minX + maxX) / 2, (minY + maxY) / 2];
}

export function buildStateCentroidMap(
  geojson: StatesCollection,
): Record<string, [number, number]> {
  const out: Record<string, [number, number]> = {};
  for (const feature of geojson.features) {
    out[feature.properties.name] = computeStateCentroid(feature);
  }
  return out;
}

export function findStateFeature(
  geojson: StatesCollection,
  name: string,
): StateFeature | null {
  return geojson.features.find((f) => f.properties.name === name) ?? null;
}
