"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";

export interface DropdownOption<T> {
  value: T;
  label: string;
}

interface DropdownProps<T> {
  label?: string;
  value: T;
  onChange: (value: T) => void;
  options: readonly DropdownOption<T>[];
  searchable?: boolean;
  placeholder?: string;
}

export function Dropdown<T>(props: DropdownProps<T>) {
  const {
    value,
    onChange,
    options,
    searchable = false,
    placeholder = "Select",
    label,
  } = props;
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();

  const filtered =
    searchable && search.trim()
      ? options.filter((o) =>
          o.label.toLowerCase().includes(search.trim().toLowerCase()),
        )
      : [...options];

  useEffect(() => {
    if (!open) return;
    function handleMouseDown(event: MouseEvent) {
      const node = containerRef.current;
      if (!node) return;
      if (!node.contains(event.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [open]);

  useEffect(() => {
    if (open && searchable && searchRef.current) {
      searchRef.current.focus();
    }
  }, [open, searchable]);

  useEffect(() => {
    const i = filtered.findIndex((o) => Object.is(o.value, value));
    setActiveIndex(i >= 0 ? i : 0);
    // filtered changes when search does; keep cursor within bounds
  }, [filtered.length, value]);

  function selectIndex(index: number) {
    if (index < 0 || index >= filtered.length) return;
    onChange(filtered[index].value);
    setOpen(false);
    setSearch("");
  }

  function handleKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      setActiveIndex((i) => Math.min(filtered.length - 1, i + 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => Math.max(0, i - 1));
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      selectIndex(activeIndex);
    } else if (event.key === "Escape") {
      if (open) {
        event.preventDefault();
        setOpen(false);
        setSearch("");
      }
    } else if (event.key === " " && !open) {
      event.preventDefault();
      setOpen(true);
    }
  }

  const current = options.find((o) => Object.is(o.value, value));
  const displayLabel = current?.label ?? placeholder;

  return (
    <div ref={containerRef} className="relative" onKeyDown={handleKeyDown}>
      {label && (
        <label className="mb-1 block font-mono text-[11px] uppercase tracking-[2.5px] text-muted">
          {label}
        </label>
      )}
      <button
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-haspopup="listbox"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between rounded-[2px] border border-border bg-bg3 px-3 py-2 font-mono text-[12px] text-ice focus:border-[rgba(200,16,46,0.5)] focus:outline-none"
      >
        <span className="truncate text-left">{displayLabel}</span>
        <span aria-hidden="true" className="ml-2 text-muted">
          ▾
        </span>
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-full z-20 mt-1 rounded-[2px] border border-border bg-bg3 shadow-lg">
          {searchable && (
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search..."
              className="w-full border-b border-border bg-transparent px-3 py-2 font-mono text-[12px] text-ice placeholder:text-muted focus:outline-none"
            />
          )}
          <ul
            role="listbox"
            id={listboxId}
            className="max-h-64 overflow-y-auto py-1"
          >
            {filtered.length === 0 && (
              <li className="px-3 py-2 font-mono text-[12px] text-muted">
                No results
              </li>
            )}
            {filtered.map((opt, index) => {
              const isSelected = Object.is(opt.value, value);
              const isActive = index === activeIndex;
              const stateClass = isActive
                ? "bg-red border-transparent"
                : isSelected
                  ? "bg-red-dim border-red"
                  : "border-transparent hover:bg-bg2";
              return (
                <li
                  key={stringifyKey(opt.value, index)}
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => selectIndex(index)}
                  className={`cursor-pointer border-l-2 px-3 py-2 font-mono text-[12px] text-ice ${stateClass}`}
                >
                  {opt.label}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

function stringifyKey<T>(value: T, fallbackIndex: number): string {
  if (value === null || value === undefined) return `null-${fallbackIndex}`;
  if (typeof value === "string" || typeof value === "number") return String(value);
  return `key-${fallbackIndex}`;
}
