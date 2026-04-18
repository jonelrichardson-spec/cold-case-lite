import { METHODOLOGY_LIMITATIONS } from "@/lib/constants";
import { MethodologyCard } from "./MethodologyCard";

export function LimitationsSection() {
  return (
    <MethodologyCard
      label={METHODOLOGY_LIMITATIONS.label}
      title={METHODOLOGY_LIMITATIONS.title}
    >
      <ul className="flex flex-col gap-4">
        {METHODOLOGY_LIMITATIONS.bullets.map((bullet, index) => (
          <li key={index} className="flex gap-3">
            <span
              aria-hidden
              className="mt-[9px] block h-1 w-1 shrink-0 rounded-full bg-red"
            />
            <p className="flex-1 font-body text-[13px] font-light leading-[1.78] text-muted2">
              {bullet}
            </p>
          </li>
        ))}
      </ul>
    </MethodologyCard>
  );
}
