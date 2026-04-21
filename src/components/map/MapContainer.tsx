"use client";

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef } from "react";
import { MAP_DEFAULT_VIEW, MAPBOX_STYLE } from "@/lib/constants";
import {
  computeStateBounds,
  findStateFeature,
  loadStatesGeoJSON,
  type StatesCollection,
} from "@/lib/geo";
import type { Cluster, StateMarker } from "@/lib/types";
import { useFilterStore } from "@/stores/useFilterStore";
import { useMapStore } from "@/stores/useMapStore";

const COMPACT_INT = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

// Hardcoded font stack for mapbox marker DOM elements. Using var(--font-mono)
// here was fragile in Tailwind v4 + Next.js prod builds: the @theme inline
// block re-emits `--font-mono: var(--font-mono)` in the theme layer, and in
// some cascade orders the inline style fails to resolve the actual IBM Plex
// Mono stack. Hardcoding sidesteps the variable lookup entirely — the font is
// still loaded by next/font, we just reference it by its real family name.
const MARKER_FONT =
  '"IBM Plex Mono", "IBM Plex Mono Fallback", ui-monospace, SFMono-Regular, Menlo, monospace';

const STATE_MARKER_COLORS = {
  red: {
    fill: "rgba(200, 16, 46, 0.42)",
    ring: "rgba(200, 16, 46, 0.85)",
    text: "#FFD9DF",
    glow: "0 0 24px rgba(200, 16, 46, 0.35)",
  },
  amber: {
    fill: "rgba(232, 160, 32, 0.38)",
    ring: "rgba(232, 160, 32, 0.85)",
    text: "#FFF3D6",
    glow: "0 0 24px rgba(232, 160, 32, 0.30)",
  },
} as const;

const COUNTY_MARKER_COLORS = {
  red: {
    fill: "rgba(200, 16, 46, 0.42)",
    ring: "rgba(200, 16, 46, 0.90)",
    text: "#FFD9DF",
    glow: "0 0 24px rgba(200, 16, 46, 0.40)",
  },
  amber: {
    fill: "rgba(232, 160, 32, 0.34)",
    ring: "rgba(232, 160, 32, 0.80)",
    text: "#FFF3D6",
    glow: "0 0 22px rgba(232, 160, 32, 0.28)",
  },
} as const;

const STATE_SOURCE_ID = "us-states";
const STATE_FILL_LAYER = "us-states-fill";
const STATE_OUTLINE_LAYER = "us-states-outline";
const DEFAULT_CENTER: [number, number] = [
  MAP_DEFAULT_VIEW.longitude,
  MAP_DEFAULT_VIEW.latitude,
];

export default function MapContainer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const stateMarkersRef = useRef<mapboxgl.Marker[]>([]);
  const statesRef = useRef<StatesCollection | null>(null);
  const styleLoadedRef = useRef(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) {
      console.error(
        "Missing NEXT_PUBLIC_MAPBOX_TOKEN — map cannot initialize",
      );
      return;
    }
    mapboxgl.accessToken = token;

    let map: mapboxgl.Map;
    try {
      map = new mapboxgl.Map({
        container: node,
        style: MAPBOX_STYLE,
        center: DEFAULT_CENTER,
        zoom: MAP_DEFAULT_VIEW.zoom,
      });
    } catch (err) {
      console.error("Failed to initialize Mapbox:", err);
      return;
    }
    mapRef.current = map;

    map.on("load", () => {
      styleLoadedRef.current = true;
      loadStatesGeoJSON()
        .then((states) => {
          statesRef.current = states;
          if (!mapRef.current) return;
          mapRef.current.addSource(STATE_SOURCE_ID, {
            type: "geojson",
            data: states,
          });
          mapRef.current.addLayer({
            id: STATE_FILL_LAYER,
            type: "fill",
            source: STATE_SOURCE_ID,
            paint: { "fill-color": "#ffffff", "fill-opacity": 0 },
          });
          mapRef.current.addLayer({
            id: STATE_OUTLINE_LAYER,
            type: "line",
            source: STATE_SOURCE_ID,
            paint: {
              "line-color": "#E8A020",
              "line-width": 2,
              "line-opacity": 0,
              "line-opacity-transition": { duration: 600, delay: 0 },
            },
            filter: ["==", ["get", "name"], "__none__"],
          });
          mapRef.current.on("click", STATE_FILL_LAYER, (event) => {
            const feature = event.features?.[0];
            const name = feature?.properties?.name;
            if (typeof name === "string") {
              useFilterStore.getState().setState(name);
            }
          });
          mapRef.current.on("mouseenter", STATE_FILL_LAYER, () => {
            if (mapRef.current) {
              mapRef.current.getCanvas().style.cursor = "pointer";
            }
          });
          mapRef.current.on("mouseleave", STATE_FILL_LAYER, () => {
            if (mapRef.current) {
              mapRef.current.getCanvas().style.cursor = "";
            }
          });

          applySelectedState(useFilterStore.getState().state);
        })
        .catch((err) => {
          console.error("Failed to load state boundaries:", err);
        });
    });

    return () => {
      for (const marker of markersRef.current) marker.remove();
      markersRef.current = [];
      for (const marker of stateMarkersRef.current) marker.remove();
      stateMarkersRef.current = [];
      map.remove();
      mapRef.current = null;
      statesRef.current = null;
      styleLoadedRef.current = false;
    };
  }, []);

  function applySelectedState(selectedState: string | null) {
    const map = mapRef.current;
    const states = statesRef.current;
    if (!map || !states || !styleLoadedRef.current) return;
    if (!map.getLayer(STATE_OUTLINE_LAYER)) return;

    if (selectedState) {
      const feature = findStateFeature(states, selectedState);
      if (feature) {
        const bounds = computeStateBounds(feature);
        map.fitBounds(bounds, { padding: 80, duration: 800 });
      }
      map.setFilter(STATE_OUTLINE_LAYER, [
        "==",
        ["get", "name"],
        selectedState,
      ]);
      map.setPaintProperty(STATE_OUTLINE_LAYER, "line-opacity", 1);
    } else {
      map.setPaintProperty(STATE_OUTLINE_LAYER, "line-opacity", 0);
    }
  }

  const selectedState = useFilterStore((s) => s.state);
  useEffect(() => {
    applySelectedState(selectedState);
  }, [selectedState]);

  const clusters = useMapStore((s) => s.clusters);
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    for (const marker of markersRef.current) marker.remove();
    markersRef.current = [];
    for (const cluster of clusters) {
      const element = createClusterMarker(cluster, handleClusterClick);
      const marker = new mapboxgl.Marker({ element })
        .setLngLat(cluster.center)
        .addTo(map);
      markersRef.current.push(marker);
    }
  }, [clusters]);

  const stateMarkers = useMapStore((s) => s.stateMarkers);
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    for (const marker of stateMarkersRef.current) marker.remove();
    stateMarkersRef.current = [];
    for (const sm of stateMarkers) {
      const element = createStateMarker(sm, handleStateMarkerClick);
      const marker = new mapboxgl.Marker({ element })
        .setLngLat(sm.center)
        .addTo(map);
      stateMarkersRef.current.push(marker);
    }
  }, [stateMarkers]);

  const hasDetailOpen = useMapStore((s) => s.selectedCluster !== null);
  const detailExpanded = useMapStore((s) => s.detailExpanded);
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const raf = requestAnimationFrame(() => {
      if (mapRef.current) mapRef.current.resize();
    });
    return () => cancelAnimationFrame(raf);
  }, [hasDetailOpen, detailExpanded]);

  const resetSignal = useMapStore((s) => s.resetSignal);
  const isFirstResetRef = useRef(true);
  useEffect(() => {
    if (isFirstResetRef.current) {
      isFirstResetRef.current = false;
      return;
    }
    const map = mapRef.current;
    if (!map) return;
    map.flyTo({
      center: DEFAULT_CENTER,
      zoom: MAP_DEFAULT_VIEW.zoom,
      duration: 800,
    });
  }, [resetSignal]);

  return (
    <div
      ref={containerRef}
      aria-label="Cold case map"
      className="h-full w-full"
    />
  );
}

function handleClusterClick(cluster: Cluster): void {
  useMapStore.getState().selectCluster(cluster);
}

function handleStateMarkerClick(marker: StateMarker): void {
  useFilterStore.getState().setState(marker.state);
}

function createStateMarker(
  sm: StateMarker,
  onClick: (marker: StateMarker) => void,
): HTMLElement {
  const palette = STATE_MARKER_COLORS[sm.tone];

  const wrapper = document.createElement("button");
  wrapper.type = "button";
  wrapper.setAttribute(
    "aria-label",
    `${sm.state}: ${sm.total.toLocaleString("en-US")} cases, ${sm.clusterCount} clusters. Drill into state.`,
  );
  wrapper.title = `${sm.state} \u2014 ${sm.total.toLocaleString("en-US")} cases \u00b7 ${sm.clusterCount} clusters`;
  wrapper.style.width = `${sm.sizePx}px`;
  wrapper.style.height = `${sm.sizePx}px`;
  wrapper.style.padding = "0";
  wrapper.style.borderRadius = "50%";
  wrapper.style.background = palette.fill;
  wrapper.style.border = `1px solid ${palette.ring}`;
  wrapper.style.boxShadow = palette.glow;
  wrapper.style.display = "flex";
  wrapper.style.alignItems = "center";
  wrapper.style.justifyContent = "center";
  wrapper.style.cursor = "pointer";
  wrapper.addEventListener("click", (event) => {
    event.stopPropagation();
    onClick(sm);
  });

  const label = document.createElement("span");
  label.textContent = COMPACT_INT.format(sm.total);
  label.style.color = palette.text;
  label.style.fontFamily = MARKER_FONT;
  label.style.fontSize = `${Math.max(11, Math.round(sm.sizePx * 0.24))}px`;
  label.style.fontWeight = "700";
  label.style.letterSpacing = "0.5px";
  label.style.textShadow = "0 1px 2px rgba(0, 0, 0, 0.65)";
  label.style.pointerEvents = "none";
  wrapper.appendChild(label);

  return wrapper;
}

function createClusterMarker(
  cluster: Cluster,
  onClick: (cluster: Cluster) => void,
): HTMLElement {
  const palette = COUNTY_MARKER_COLORS[cluster.tone];
  const outer = clampSize(30 + (cluster.total - 5) * 0.15, 30, 68);
  const toneLabel = cluster.tone === "red" ? "cluster" : "county";

  const wrapper = document.createElement("button");
  wrapper.type = "button";
  wrapper.setAttribute(
    "aria-label",
    `${cluster.countyFips}: ${cluster.total} cases, ${cluster.unsolved} unsolved (${toneLabel}). Open detail panel.`,
  );
  wrapper.title = `${cluster.countyFips} — ${cluster.total} cases · ${cluster.unsolved} unsolved`;
  wrapper.style.width = `${outer}px`;
  wrapper.style.height = `${outer}px`;
  wrapper.style.padding = "0";
  wrapper.style.borderRadius = "50%";
  wrapper.style.background = palette.fill;
  wrapper.style.border = `1px solid ${palette.ring}`;
  wrapper.style.boxShadow = palette.glow;
  wrapper.style.display = "flex";
  wrapper.style.alignItems = "center";
  wrapper.style.justifyContent = "center";
  wrapper.style.cursor = "pointer";
  wrapper.addEventListener("click", (event) => {
    event.stopPropagation();
    onClick(cluster);
  });

  const label = document.createElement("span");
  label.textContent = COMPACT_INT.format(cluster.total);
  label.style.color = palette.text;
  label.style.fontFamily = MARKER_FONT;
  label.style.fontSize = `${Math.max(11, Math.round(outer * 0.30))}px`;
  label.style.fontWeight = "700";
  label.style.letterSpacing = "0.5px";
  label.style.textShadow = "0 1px 2px rgba(0, 0, 0, 0.65)";
  label.style.pointerEvents = "none";
  wrapper.appendChild(label);

  return wrapper;
}

function clampSize(value: number, min: number, max: number): number {
  return Math.round(Math.max(min, Math.min(max, value)));
}
