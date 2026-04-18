"use client";

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef } from "react";
import { MAP_DEFAULT_VIEW, MAPBOX_STYLE } from "@/lib/constants";

export default function MapContainer() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) {
      return;
    }

    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) {
      console.error(
        "Missing NEXT_PUBLIC_MAPBOX_TOKEN — map cannot initialize",
      );
      return;
    }
    mapboxgl.accessToken = token;

    let map: mapboxgl.Map | undefined;
    try {
      map = new mapboxgl.Map({
        container: node,
        style: MAPBOX_STYLE,
        center: [MAP_DEFAULT_VIEW.longitude, MAP_DEFAULT_VIEW.latitude],
        zoom: MAP_DEFAULT_VIEW.zoom,
      });
    } catch (error) {
      console.error("Failed to initialize Mapbox:", error);
      return;
    }

    return () => {
      map?.remove();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-label="Cold case map"
      className="h-full w-full"
    />
  );
}
