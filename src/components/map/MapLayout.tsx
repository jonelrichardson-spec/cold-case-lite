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
  const detailExpanded = useMapStore((s) => s.detailExpanded);
  const showSide = hasDetail && !detailExpanded;

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
  const gridColsClass = showSide
    ? "grid-cols-[260px_1fr_340px]"
    : "grid-cols-[260px_1fr]";

  // NOTE: padding-top (not margin-top) here is load-bearing. Body has no BFC
  // trigger, so a margin-top on this root would collapse through body and push
  // the document scroll root down by 64px, creating a page-level scrollbar on
  // /map. Padding lives inside this div and can't collapse.
  //
  // DetailPanel is rendered as a fixed overlay OUTSIDE the grid so fetch state
  // survives the minimize/expand toggle (single mount, two render modes). When
  // minimized, the 340px grid track is kept empty so the map still resizes —
  // the fixed aside sits over that reserved space.
  return (
    <div className="h-screen overflow-hidden pt-16">
      <div className={`grid h-full min-h-0 grid-rows-1 ${gridColsClass}`}>
        {filterPanel}
        <section className="relative h-full min-h-0 overflow-hidden">
          {mapSection}
        </section>
      </div>
      {hasDetail && <DetailPanel />}
    </div>
  );
}
