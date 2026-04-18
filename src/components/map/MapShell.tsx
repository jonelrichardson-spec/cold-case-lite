"use client";

import dynamic from "next/dynamic";

const MapContainer = dynamic(() => import("./MapContainer"), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden="true"
      className="h-full w-full bg-bg"
    />
  ),
});

export function MapShell() {
  return <MapContainer />;
}
