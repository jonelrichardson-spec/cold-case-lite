import { LANDING_COPY } from "@/lib/constants";

export function StatBlock() {
  return (
    <div className="animate-fadeup [animation-delay:0.45s] flex flex-col items-center gap-2 text-center">
      <span className="font-display text-[52px] leading-none text-ice">
        {LANDING_COPY.stat.value}
      </span>
      <span className="font-mono text-[9px] uppercase tracking-[3px] text-muted">
        {LANDING_COPY.stat.label}
      </span>
    </div>
  );
}
