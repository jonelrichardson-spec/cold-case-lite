import { LANDING_COPY } from "@/lib/constants";

export function Hero() {
  return (
    <div className="flex flex-col items-center gap-8 text-center">
      <p className="animate-fadeup [animation-delay:0.1s] font-mono text-[10px] uppercase tracking-[4px] text-muted2">
        {LANDING_COPY.eyebrow}
      </p>
      <h1 className="animate-fadeup [animation-delay:0.2s] font-display text-[clamp(52px,8vw,88px)] uppercase leading-[0.95] tracking-[3px]">
        <span className="text-ice">{LANDING_COPY.headline.lead}</span>
        <br />
        <span className="text-red">{LANDING_COPY.headline.accent}</span>
      </h1>
      <div className="animate-fadeup [animation-delay:0.35s] flex flex-col gap-1 font-body text-[14px] font-light text-muted2">
        <p>{LANDING_COPY.subtext.line1}</p>
        <p>{LANDING_COPY.subtext.line2}</p>
      </div>
    </div>
  );
}
