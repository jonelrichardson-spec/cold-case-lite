"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { DetailPanel } from "@/components/map/DetailPanel";
import { useMapStore } from "@/stores/useMapStore";

interface MapLayoutProps {
  filterPanel: ReactNode;
  mapSection: ReactNode;
}

export function MapLayout({ filterPanel, mapSection }: MapLayoutProps) {
  const hasDetail = useMapStore((s) => s.selectedCluster !== null);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    html.classList.add("no-scroll");
    body.classList.add("no-scroll");
    return () => {
      html.classList.remove("no-scroll");
      body.classList.remove("no-scroll");
    };
  }, []);
  const gridColsClass = hasDetail
    ? "grid-cols-[260px_1fr_340px]"
    : "grid-cols-[260px_1fr]";

  return (
    <div className="mt-16 h-[calc(100vh-64px)] overflow-hidden">
      <div className={`grid h-full min-h-0 grid-rows-1 ${gridColsClass}`}>
        {filterPanel}
        <section className="relative h-full min-h-0 overflow-hidden">
          {mapSection}
        </section>
        {hasDetail && <DetailPanel />}
      </div>
    </div>
  );
}
