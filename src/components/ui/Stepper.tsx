"use client";

interface StepperProps {
  label?: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}

export function Stepper(props: StepperProps) {
  const { label, value, min, max, step, onChange } = props;

  function clamp(next: number): number {
    return Math.max(min, Math.min(max, next));
  }

  function handleDecrement() {
    onChange(clamp(value - step));
  }

  function handleIncrement() {
    onChange(clamp(value + step));
  }

  return (
    <div>
      {label && (
        <label className="mb-1 block font-mono text-[11px] uppercase tracking-[2.5px] text-muted">
          {label}
        </label>
      )}
      <div className="flex items-stretch rounded-[2px] border border-border bg-bg3">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={value <= min}
          aria-label="Decrease"
          className="px-3 py-2 font-mono text-[12px] text-ice hover:text-red disabled:cursor-not-allowed disabled:text-muted focus:outline-none"
        >
          −
        </button>
        <span className="flex flex-1 items-center justify-center border-x border-border px-3 font-mono text-[12px] text-ice">
          {value}
        </span>
        <button
          type="button"
          onClick={handleIncrement}
          disabled={value >= max}
          aria-label="Increase"
          className="px-3 py-2 font-mono text-[12px] text-ice hover:text-red disabled:cursor-not-allowed disabled:text-muted focus:outline-none"
        >
          +
        </button>
      </div>
    </div>
  );
}
