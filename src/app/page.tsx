import { BullseyeBackground } from "@/components/landing/BullseyeBackground";
import { EnterButton } from "@/components/landing/EnterButton";
import { Hero } from "@/components/landing/Hero";
import { StatBlock } from "@/components/landing/StatBlock";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0C0A0A]">
      <BullseyeBackground />
      <div aria-hidden="true" className="absolute inset-0 z-[1] bg-vignette" />
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 z-[2] h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 bg-center-glow"
      />
      <div className="relative z-[3] flex min-h-screen flex-col items-center justify-center gap-12 px-8">
        <Hero />
        <StatBlock />
        <EnterButton />
      </div>
    </main>
  );
}
