"use client";

import { Dropdown } from "@/components/ui/Dropdown";
import { Stepper } from "@/components/ui/Stepper";
import {
  MIN_CLUSTER_SIZE,
  REPORTING_GREEN_THRESHOLD,
  SOLVE_STATUS_OPTIONS,
  STATE_NAMES,
  VIC_RACE_OPTIONS,
  VIC_SEX_OPTIONS,
  WEAPON_OPTIONS,
} from "@/lib/constants";
import { useFilterStore } from "@/stores/useFilterStore";
import { useMapStore } from "@/stores/useMapStore";

type StateOption = { value: string | null; label: string };
const STATE_OPTIONS: StateOption[] = [
  { value: null, label: "All States" },
  ...STATE_NAMES.map((s) => ({ value: s, label: s })),
];

export function FilterPanel() {
  const state = useFilterStore((s) => s.state);
  const vicSex = useFilterStore((s) => s.vicSex);
  const weapon = useFilterStore((s) => s.weapon);
  const vicRace = useFilterStore((s) => s.vicRace);
  const solveStatus = useFilterStore((s) => s.solveStatus);
  const minClusterSize = useFilterStore((s) => s.minClusterSize);
  const setState = useFilterStore((s) => s.setState);
  const setVicSex = useFilterStore((s) => s.setVicSex);
  const setWeapon = useFilterStore((s) => s.setWeapon);
  const setVicRace = useFilterStore((s) => s.setVicRace);
  const setSolveStatus = useFilterStore((s) => s.setSolveStatus);
  const setMinClusterSize = useFilterStore((s) => s.setMinClusterSize);
  const reset = useFilterStore((s) => s.reset);

  const reporting = useMapStore((s) => s.reporting);
  const hasStateSelection = reporting.state !== null && reporting.rate !== null;
  const isAdequate =
    !hasStateSelection || (reporting.rate ?? 100) >= REPORTING_GREEN_THRESHOLD;

  return (
    <aside
      aria-label="Filters"
      className="flex h-full w-[260px] flex-col border-r border-border bg-bg2"
    >
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <span className="font-mono text-[11px] uppercase tracking-[2.5px] text-muted">
          &lt; FILTERS
        </span>
        <button
          type="button"
          onClick={reset}
          className="font-mono text-[11px] uppercase tracking-[2.5px] text-red hover:brightness-125 focus:outline-none"
        >
          RESET ALL
        </button>
      </header>
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 py-4">
        <Dropdown
          label="State / Region"
          value={state}
          onChange={setState}
          options={STATE_OPTIONS}
          searchable
        />
        <Dropdown
          label="Victim Sex"
          value={vicSex}
          onChange={setVicSex}
          options={VIC_SEX_OPTIONS}
        />
        <Dropdown
          label="Weapon Type"
          value={weapon}
          onChange={setWeapon}
          options={WEAPON_OPTIONS}
        />
        <Dropdown
          label="Victim Race"
          value={vicRace}
          onChange={setVicRace}
          options={VIC_RACE_OPTIONS}
        />
        <Dropdown
          label="Solve Status"
          value={solveStatus}
          onChange={setSolveStatus}
          options={SOLVE_STATUS_OPTIONS}
        />
        <Stepper
          label="Min Cluster Size"
          value={minClusterSize}
          min={MIN_CLUSTER_SIZE.min}
          max={MIN_CLUSTER_SIZE.max}
          step={MIN_CLUSTER_SIZE.step}
          onChange={setMinClusterSize}
        />
      </div>
      <footer className="mt-auto flex shrink-0 items-center gap-2 overflow-hidden border-t border-border px-3 py-2">
        <span
          aria-hidden="true"
          className={`h-[6px] w-[6px] shrink-0 rounded-full ${
            isAdequate ? "bg-green" : "bg-amber"
          }`}
        />
        <span
          className={`truncate font-mono text-[9px] uppercase tracking-[1.5px] ${
            isAdequate ? "text-green" : "text-amber"
          }`}
        >
          {isAdequate ? "ADEQUATE REPORTING COVERAGE" : "LOW REPORTING COVERAGE"}
          {hasStateSelection && reporting.rate !== null
            ? ` \u2014 ${Math.round(reporting.rate)}%`
            : ""}
        </span>
      </footer>
    </aside>
  );
}
