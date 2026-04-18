"use client";

import type { CSSProperties } from "react";

const COLS = 16;
const ROWS = 12;

interface Cell {
  key: string;
  color: string;
}

function computeCellColor(col: number, row: number): string {
  const cx = (COLS - 1) / 2;
  const cy = (ROWS - 1) / 2;
  const maxDist = Math.sqrt(cx * cx + cy * cy);
  const dist = Math.sqrt((col - cx) ** 2 + (row - cy) ** 2);
  const proximity = 1 - dist / maxDist;
  const r = Math.round(55 + proximity * 80);
  const g = Math.round(8 + proximity * 10);
  const b = Math.round(10 + proximity * 12);
  const alpha = 0.55 + proximity * 0.4;
  return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`;
}

const CELLS: Cell[] = Array.from({ length: ROWS * COLS }, (_unused, index) => {
  const row = Math.floor(index / COLS);
  const col = index % COLS;
  return {
    key: `${row}-${col}`,
    color: computeCellColor(col, row),
  };
});

interface CellStyle extends CSSProperties {
  "--cell-color": string;
}

export function BullseyeBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-[-60px] z-0 grid grid-cols-[repeat(16,58px)] grid-rows-[repeat(12,58px)] place-content-center"
    >
      {CELLS.map((cell) => {
        const cellStyle: CellStyle = { "--cell-color": cell.color };
        return (
          <div
            key={cell.key}
            style={cellStyle}
            className="relative flex items-center justify-center"
          >
            <span className="absolute h-[50px] w-[50px] rounded-full border border-[color:var(--cell-color)]" />
            <span className="absolute h-[34px] w-[34px] rounded-full border border-[color:var(--cell-color)]" />
            <span className="absolute h-[18px] w-[18px] rounded-full border border-[color:var(--cell-color)]" />
            <span className="absolute h-[4px] w-[4px] rounded-full bg-[var(--cell-color)]" />
          </div>
        );
      })}
    </div>
  );
}
