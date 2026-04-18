import { METHODOLOGY_ALGORITHM } from "@/lib/constants";
import { MethodologyCard } from "./MethodologyCard";

export function AlgorithmSection() {
  return (
    <MethodologyCard
      label={METHODOLOGY_ALGORITHM.label}
      title={METHODOLOGY_ALGORITHM.title}
    >
      <p className="font-body text-[13px] font-light leading-[1.78] text-muted2">
        {METHODOLOGY_ALGORITHM.intro}
      </p>
      <div className="mt-4 flex flex-col gap-2 rounded-[2px] border border-border bg-bg3 p-4">
        {METHODOLOGY_ALGORITHM.conditions.map((condition) => (
          <div
            key={condition.label}
            className="font-mono text-[12px] leading-relaxed"
          >
            <span className="text-amber">{condition.label}</span>{" "}
            <span className="text-ice">{condition.expression}</span>
          </div>
        ))}
      </div>
      <p className="mt-4 font-body text-[13px] font-light leading-[1.78] text-muted2">
        {METHODOLOGY_ALGORITHM.notes}
      </p>
    </MethodologyCard>
  );
}
