import type { ReactNode } from "react";

interface InsightsCardProps {
  findingNumber: string;
  title: string;
  children: ReactNode;
}

export function InsightsCard({
  findingNumber,
  title,
  children,
}: InsightsCardProps) {
  return (
    <article className="rounded-[2px] border border-border bg-bg2 p-6">
      <header className="mb-5 flex items-baseline gap-3">
        <span className="font-mono text-[9px] uppercase tracking-[3px] text-red">
          {findingNumber}
        </span>
        <h2 className="font-display text-[18px] tracking-[1.5px] text-ice">
          {title}
        </h2>
      </header>
      {children}
    </article>
  );
}
