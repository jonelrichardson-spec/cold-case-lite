"use client";

import { useFilterStore } from "@/stores/useFilterStore";
import { useMapStore } from "@/stores/useMapStore";

export function ResetViewButton() {
  const resetFilters = useFilterStore((s) => s.reset);
  const triggerReset = useMapStore((s) => s.triggerReset);

  function handleClick() {
    resetFilters();
    triggerReset();
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Reset map view"
      className="absolute bottom-12 right-8 z-10 flex h-[52px] w-[52px] items-center justify-center rounded-full border border-[rgba(232,160,32,0.25)] bg-[rgba(232,160,32,0.08)] transition hover:brightness-110 focus:outline-none"
    >
      <span
        aria-hidden="true"
        className="flex h-[34px] w-[34px] items-center justify-center rounded-full border-[1.5px] border-amber bg-[rgba(232,160,32,0.35)] font-mono text-[14px] text-amber"
      >
        &#x27F3;
      </span>
    </button>
  );
}
