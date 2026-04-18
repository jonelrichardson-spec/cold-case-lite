import Link from "next/link";
import { LANDING_COPY, ROUTES } from "@/lib/constants";

export function EnterButton() {
  return (
    <Link
      href={ROUTES.map}
      aria-label={LANDING_COPY.enterAriaLabel}
      className="animate-fadeup [animation-delay:0.55s] group relative inline-flex items-center justify-center overflow-hidden rounded-[2px] border border-red px-12 py-3 font-display text-[14px] uppercase tracking-[4px] text-ice focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ice"
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 -translate-x-full bg-red transition-transform duration-300 ease-out group-hover:translate-x-0"
      />
      <span className="relative">{LANDING_COPY.enterLabel}</span>
    </Link>
  );
}
