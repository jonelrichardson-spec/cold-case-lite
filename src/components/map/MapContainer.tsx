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
import type { Cluster } from "@/lib/types";
import { useFilterStore } from "@/stores/useFilterStore";
import { useMapStore } from "@/stores/useMapStore";

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
      const element = createClusterMarker(cluster);
      const marker = new mapboxgl.Marker({ element })
        .setLngLat(cluster.center)
        .addTo(map);
      markersRef.current.push(marker);
    }
  }, [clusters]);

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

function createClusterMarker(cluster: Cluster): HTMLElement {
  const outer = clampSize(30 + (cluster.total - 5) * 0.15, 30, 68);
  const inner = Math.round(outer * 0.55);

  const wrapper = document.createElement("div");
  wrapper.setAttribute("role", "img");
  wrapper.setAttribute(
    "aria-label",
    `${cluster.countyFips}: ${cluster.total} cases, ${cluster.unsolved} unsolved`,
  );
  wrapper.title = `${cluster.countyFips} — ${cluster.total} cases · ${cluster.unsolved} unsolved`;
  wrapper.style.width = `${outer}px`;
  wrapper.style.height = `${outer}px`;
  wrapper.style.borderRadius = "50%";
  wrapper.style.background = "rgba(200, 16, 46, 0.12)";
  wrapper.style.border = "1px solid rgba(200, 16, 46, 0.35)";
  wrapper.style.boxShadow = "0 0 28px rgba(200, 16, 46, 0.15)";
  wrapper.style.display = "flex";
  wrapper.style.alignItems = "center";
  wrapper.style.justifyContent = "center";
  wrapper.style.cursor = "pointer";

  const core = document.createElement("div");
  core.style.width = `${inner}px`;
  core.style.height = `${inner}px`;
  core.style.borderRadius = "50%";
  core.style.background = "rgba(200, 16, 46, 0.65)";
  core.style.border = "1px solid #C8102E";
  wrapper.appendChild(core);

  return wrapper;
}

function clampSize(value: number, min: number, max: number): number {
  return Math.round(Math.max(min, Math.min(max, value)));
}
