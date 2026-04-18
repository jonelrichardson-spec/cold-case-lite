"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/constants";

export function TopNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 top-0 z-50 h-16 border-b border-border bg-bg2">
      <div className="flex h-full items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="block h-[9px] w-[9px] rounded-full bg-red"
          />
          <span className="font-display text-[18px] tracking-[2px]">
            <span className="text-ice">COLD CASE </span>
            <span className="text-red">NETWORK</span>
          </span>
        </div>
        <ul className="flex h-full items-stretch gap-8">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href} className="flex">
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex h-full items-center border-b-2 font-mono text-[11px] uppercase tracking-[2.5px] transition-colors ${
                    isActive
                      ? "border-red text-ice"
                      : "border-transparent text-muted hover:text-ice"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
