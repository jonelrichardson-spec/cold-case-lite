"use client";

import { useEffect, useState } from "react";
import {
  aggregateDetail,
  buildStoryBrief,
  formatInt,
  formatPercent,
  formatYearSpan,
  parseCountyDisplay,
  type Breakdown,
} from "@/lib/detail";
import { fetchClusterCases } from "@/lib/queries";
import type { CaseDetail, Cluster, Filters } from "@/lib/types";
import { useFilterStore } from "@/stores/useFilterStore";
import { useMapStore } from "@/stores/useMapStore";

const BREAKDOWN_ROW_LIMIT = 4;
const TABLE_TRUNCATE_CH = 16;

type FetchState =
  | { status: "loading" }
  | { status: "success"; rows: CaseDetail[] }
  | { status: "error"; message: string };

export function DetailPanel() {
  const cluster = useMapStore((s) => s.selectedCluster);
  if (!cluster) return null;
  return <DetailPanelBody key={cluster.countyFips} cluster={cluster} />;
}

function DetailPanelBody({ cluster }: { cluster: Cluster }) {
  const clearCluster = useMapStore((s) => s.clearCluster);
  const state = useFilterStore((s) => s.state);
  const vicSex = useFilterStore((s) => s.vicSex);
  const weapon = useFilterStore((s) => s.weapon);
  const vicRace = useFilterStore((s) => s.vicRace);
  const solveStatus = useFilterStore((s) => s.solveStatus);

  const [fetchState, setFetchState] = useState<FetchState>({ status: "loading" });

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") clearCluster();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [clearCluster]);

  useEffect(() => {
    let cancelled = false;
    const filters: Filters = { state, vicSex, weapon, vicRace, solveStatus };
    fetchClusterCases(filters, cluster.countyFips)
      .then((result) => {
        if (cancelled) return;
        setFetchState({ status: "success", rows: result.rows });
      })
      .catch((err) => {
        if (cancelled) return;
        const message =
          err instanceof Error ? err.message : "Failed to load case detail";
        console.error("DetailPanel fetch failed:", err);
        setFetchState({ status: "error", message });
      });
    return () => {
      cancelled = true;
    };
  }, [cluster.countyFips, state, vicSex, weapon, vicRace, solveStatus]);

  const rows = fetchState.status === "success" ? fetchState.rows : null;
  const error = fetchState.status === "error" ? fetchState.message : null;
  const isLoading = fetchState.status === "loading";

  const { county, stateCode } = parseCountyDisplay(cluster.countyFips);
  const aggregates = rows ? aggregateDetail(rows) : null;
  const span = aggregates
    ? formatYearSpan(aggregates.yearMin, aggregates.yearMax)
    : "";
  const story = rows && aggregates
    ? buildStoryBrief(cluster.countyFips, aggregates)
    : "";

  return (
    <aside
      aria-label={`Case detail for ${cluster.countyFips}`}
      className="relative flex h-full w-[340px] flex-col border-l border-border bg-bg2"
    >
      <div className="h-[3px] w-full shrink-0 bg-red" aria-hidden="true" />
      <button
        type="button"
        onClick={clearCluster}
        aria-label="Close case detail"
        className="absolute right-3 top-[14px] flex h-7 w-7 items-center justify-center text-muted2 transition-colors hover:text-ice focus:outline-none focus:text-ice"
      >
        <CloseIcon />
      </button>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <header className="border-b border-border px-5 pb-4 pt-4">
          <div className="font-mono text-[8px] uppercase tracking-[3px] text-red">
            Investigative Case File
          </div>
          <h2 className="mt-2 font-display text-[22px] leading-none tracking-[2px] text-ice">
            {county.toUpperCase()}
            {stateCode ? ` COUNTY, ${stateCode}` : " COUNTY"}
          </h2>
          <div className="mt-3 flex items-baseline justify-between gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[2px] text-muted">
              {cluster.state}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[2px] text-amber">
              {span || "\u2014"}
            </span>
          </div>
        </header>

        <section className="grid grid-cols-3 gap-3 border-b border-border px-5 py-4">
          <HeadStat
            label="Cases"
            value={aggregates ? formatInt(aggregates.total) : "\u2014"}
            tone="ice"
          />
          <HeadStat
            label="Unsolved"
            value={aggregates ? formatInt(aggregates.unsolved) : "\u2014"}
            tone="red"
          />
          <HeadStat
            label="Solve Rate"
            value={aggregates ? formatPercent(aggregates.solveRate) : "\u2014"}
            tone="amber"
          />
        </section>

        <section className="border-b border-border px-5 py-4">
          <SectionLabel>Generated Story Brief</SectionLabel>
          <p className="mt-2 font-body text-[13px] font-light leading-[1.55] text-muted2">
            {story || (isLoading ? "Loading case brief\u2026" : "\u2014")}
          </p>
        </section>

        <section className="grid grid-cols-2 gap-3 border-b border-border px-5 py-4">
          <BreakdownCard
            label="Top Weapons"
            rows={aggregates?.weapons ?? []}
            transform={shortenWeapon}
          />
          <BreakdownCard
            label="Victim Sex"
            rows={aggregates?.vicSex ?? []}
          />
          <BreakdownCard
            label="Victim Race"
            rows={aggregates?.vicRace ?? []}
          />
          <BreakdownCard
            label="Solve Status"
            rows={aggregates?.solveStatus ?? []}
          />
        </section>

        <section className="px-5 py-4">
          <SectionLabel>Case Rows</SectionLabel>
          <div className="mt-2 overflow-hidden border border-border bg-bg3">
            <div className="grid grid-cols-[44px_36px_28px_1fr_38px] gap-2 border-b border-border bg-bg3 px-2 py-2 font-mono text-[8px] uppercase tracking-[1.5px] text-muted">
              <span>Year</span>
              <span>Sex</span>
              <span className="text-right">Age</span>
              <span>Weapon</span>
              <span className="text-right">Solv</span>
            </div>
            <div className="max-h-[216px] overflow-y-auto">
              {error && (
                <TableMessage>Error: {error}</TableMessage>
              )}
              {!error && isLoading && (
                <TableMessage>{"Loading case rows\u2026"}</TableMessage>
              )}
              {!error && !isLoading && rows && rows.length === 0 && (
                <TableMessage>No cases match these filters.</TableMessage>
              )}
              {!error && rows && rows.map((row) => (
                <div
                  key={row.id}
                  className="grid grid-cols-[44px_36px_28px_1fr_38px] gap-2 border-b border-border px-2 py-[7px] font-mono text-[10px] text-ice last:border-b-0"
                >
                  <span className="tabular-nums">{row.year}</span>
                  <span className="text-muted2">{shortSex(row.vic_sex)}</span>
                  <span className="text-right tabular-nums text-muted2">
                    {row.vic_age ?? "\u2014"}
                  </span>
                  <span className="truncate text-muted2" title={row.weapon}>
                    {shortenWeapon(row.weapon)}
                  </span>
                  <span
                    className={`text-right ${row.solved === "No" ? "text-red" : "text-green"}`}
                  >
                    {row.solved}
                  </span>
                </div>
              ))}
            </div>
          </div>
          {rows && rows.length > 0 && (
            <div className="mt-2 font-mono text-[9px] uppercase tracking-[2px] text-muted">
              {`${
                rows.length === 1 ? "1 row" : `${formatInt(rows.length)} rows`
              } \u00b7 agency: ${shortAgency(rows[0].agency)}`}
            </div>
          )}
        </section>
      </div>
    </aside>
  );
}

function HeadStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "ice" | "red" | "amber";
}) {
  const toneClass =
    tone === "red" ? "text-red" : tone === "amber" ? "text-amber" : "text-ice";
  return (
    <div className="flex flex-col gap-1">
      <span className="font-mono text-[8px] uppercase tracking-[2.5px] text-muted">
        {label}
      </span>
      <span
        className={`font-display text-[28px] leading-none tracking-[1px] ${toneClass}`}
      >
        {value}
      </span>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[9px] uppercase tracking-[2.5px] text-muted">
      {children}
    </span>
  );
}

function BreakdownCard({
  label,
  rows,
  transform,
}: {
  label: string;
  rows: Breakdown[];
  transform?: (value: string) => string;
}) {
  const visible = rows.slice(0, BREAKDOWN_ROW_LIMIT);
  return (
    <div className="border border-border bg-bg3 px-3 py-3">
      <SectionLabel>{label}</SectionLabel>
      <ul className="mt-2 flex flex-col gap-[6px]">
        {visible.length === 0 && (
          <li className="font-mono text-[10px] text-muted">{"\u2014"}</li>
        )}
        {visible.map((row) => (
          <li
            key={row.label}
            className="flex items-baseline justify-between gap-2 font-mono text-[10px] text-ice"
          >
            <span
              className="truncate text-ice"
              title={row.label}
            >
              {transform ? transform(row.label) : row.label}
            </span>
            <span className="shrink-0 tabular-nums text-amber">
              {formatPercent(row.share)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TableMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-3 py-3 font-mono text-[10px] uppercase tracking-[1.5px] text-muted">
      {children}
    </div>
  );
}

function shortSex(value: string): string {
  if (!value) return "\u2014";
  if (value === "Female") return "F";
  if (value === "Male") return "M";
  return value.slice(0, 1).toUpperCase();
}

function shortenWeapon(value: string): string {
  if (!value) return "Unknown";
  const trimmed = value.trim();
  if (!trimmed) return "Unknown";
  const hyphen = trimmed.indexOf(" - ");
  const head = hyphen === -1 ? trimmed : trimmed.slice(0, hyphen);
  if (head.length <= TABLE_TRUNCATE_CH) return head;
  return `${head.slice(0, TABLE_TRUNCATE_CH - 1)}\u2026`;
}

function shortAgency(value: string): string {
  if (!value) return "\u2014";
  const trimmed = value.trim();
  if (trimmed.length <= 28) return trimmed;
  return `${trimmed.slice(0, 27)}\u2026`;
}

function CloseIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M3 3 L11 11 M11 3 L3 11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
        fill="none"
      />
    </svg>
  );
}

