import BentoGrid from "@/components/kokonutui/bento-grid";
import { SectionHead } from "@/components/site/reveal";
import { GiantTitle } from "@/components/site/giant-title";

export function Roadmap() {
  return (
    <section id="roadmap" className="border-y border-[var(--line)] bg-[var(--card)] py-24">
      <div className="mx-auto max-w-6xl px-5">
        <GiantTitle word="ROADMAP" className="-mt-10 mb-2 opacity-70" />
      <SectionHead hue="var(--accent-2)"
          index="§03"
          title="2026 research"
          accent="roadmap"
          side="ckpt 03 — a menu, not a mandate"
        />
      </div>
      <BentoGrid />
    </section>
  );
}
