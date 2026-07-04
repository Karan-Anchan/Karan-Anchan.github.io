"use client";

import { AnimatedNumber } from "@/components/ui/animated-number";
import { Reveal, SectionHead } from "@/components/site/reveal";
import { useEffect, useRef, useState } from "react";

function StatOnView({
  value,
  suffix,
  label,
}: {
  value: number;
  suffix?: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([en]) => {
        if (en.isIntersecting) {
          setShown(value);
          io.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="border-r border-white/5 px-6 py-5 last:border-r-0">
      <div className="flex items-baseline text-3xl font-light text-zinc-50 sm:text-4xl">
        <AnimatedNumber value={shown} />
        {suffix ? (
          <span className="ml-1 font-serif-accent text-xl italic text-[var(--lime)]">
            {suffix}
          </span>
        ) : null}
      </div>
      <div className="mt-1 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-zinc-500">
        {label}
      </div>
    </div>
  );
}

export function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-5 py-24">
      <SectionHead index="§01" title="About the" accent="author" side="Freiburg im Breisgau · DE" />
      <div className="max-w-3xl space-y-6 text-xl font-light leading-relaxed text-zinc-400 sm:text-2xl">
        <Reveal>
          <p>
            I&apos;m an AI researcher-engineer doing my{" "}
            <strong className="font-medium text-zinc-100">
              M.Sc. in Computer Science (AI)
            </strong>{" "}
            at the{" "}
            <strong className="font-medium text-zinc-100">
              University of Freiburg
            </strong>{" "}
            — after a B.E. in Computer Science finished at{" "}
            <em className="font-serif-accent italic text-[var(--lime)]">
              GPA 9.33/10
            </em>
            .
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <p>
            My default mode is{" "}
            <strong className="font-medium text-zinc-100">
              reproduce, then extend
            </strong>
            : take a strong paper, rebuild it honestly, ablate what the authors
            didn&apos;t, and ship the result.
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="text-sm leading-relaxed text-zinc-500">
            Previously: ML intern building production RAG systems at WiZdom Ed.
            Currently: coursework in deep learning, PGMs and robot mechanics,
            plus the 2026 research roadmap below. English C2 · Hindi native ·
            German A2→B1.
          </p>
        </Reveal>
      </div>

      <Reveal delay={0.2} className="mt-12">
        <div className="grid grid-cols-1 rounded-2xl border border-white/5 bg-zinc-900/30 sm:grid-cols-3">
          <StatOnView value={9} suffix=".33 / 10" label="B.E. GPA · German 1,3" />
          <StatOnView value={20} suffix=" projects" label="2026 roadmap scope" />
          <StatOnView value={5} suffix="+ yrs" label="Python & PyTorch" />
        </div>
      </Reveal>
    </section>
  );
}
