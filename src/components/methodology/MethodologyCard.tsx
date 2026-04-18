import type { ReactNode } from "react";

interface MethodologyCardProps {
  label: string;
  title: string;
  children: ReactNode;
}

export function MethodologyCard({
  label,
  title,
  children,
}: MethodologyCardProps) {
  return (
    <article className="rounded-[2px] border border-border bg-bg2 p-6">
      <header className="mb-5 flex flex-col gap-2">
        <span className="font-mono text-[8px] uppercase tracking-[2.5px] text-red">
          {label}
        </span>
        <h2 className="font-display text-[22px] tracking-[2px] text-ice">
          {title}
        </h2>
      </header>
      {children}
    </article>
  );
}
