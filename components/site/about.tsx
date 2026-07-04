"use client";

import { AnimatedNumber } from "@/components/ui/animated-number";
import { Reveal, SectionHead } from "@/components/site/reveal";
import { GiantTitle } from "@/components/site/giant-title";
import { useEffect, useRef, useState } from "react";

function StatOnView({
  value,
  suffix,
  label,
  hue = "var(--lime)",
}: {
  value: number;
  suffix?: string;
  label: string;
  hue?: string;
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
    <div ref={ref} className="border-r border-[var(--line)] px-6 py-5 last:border-r-0">
      <div className="flex items-baseline text-3xl font-light text-[var(--fg)] sm:text-4xl">
        <AnimatedNumber value={shown} />
        {suffix ? (
          <span className="ml-1 font-serif-accent text-xl italic" style={{ color: hue }}>
            {suffix}
          </span>
        ) : null}
      </div>
      <div className="mt-1 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-[var(--faint)]">
        {label}
      </div>
    </div>
  );
}

export function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-5 py-24">
      <GiantTitle word="AUTHOR" className="-mt-10 mb-2 opacity-70" />
      <SectionHead hue="var(--accent-5)" index="§01" title="About the" accent="author" side="ckpt 01 — bio loaded" />
      <div className="max-w-3xl space-y-6 text-xl font-light leading-relaxed text-[var(--dim)] sm:text-2xl">
        <Reveal>
          <p>
            I&apos;m an AI researcher-engineer doing my{" "}
            <strong className="font-medium text-[var(--fg)]">
              M.Sc. in Computer Science (AI)
            </strong>{" "}
            at the{" "}
            <strong className="font-medium text-[var(--fg)]">
              University of Freiburg
            </strong>{" "}
            — after a B.E. in Computer Science finished at{" "}
            <em className="font-serif-accent italic text-[var(--accent-3)]">
              GPA 9.33/10
            </em>
            .
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <p>
            Hand me a strong paper and I&apos;ll{" "}
            <strong className="font-medium text-[var(--fg)]">
              rebuild it, then push past it
            </strong>
            . Hand me a vague problem and I&apos;ll scope it, build the
            pipeline, and ship the unglamorous parts too — data, evals,
            deployment, automation.{" "}
            <em className="font-serif-accent italic text-[var(--accent-4)]">
              The whole stack of making models useful
            </em>
            , not just the fun layer.
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="text-sm leading-relaxed text-[var(--faint)]">
            Previously: ML intern building production RAG systems at WiZdom Ed.
            Currently: coursework in deep learning, PGMs and robot mechanics,
            plus the 2026 research roadmap below. English C2 · Hindi native ·
            German A2→B1. Off the clock: over-engineering n8n automations for
            my own life and defending masala chai against German filter coffee
            — a study with n=1 and strong priors.
          </p>
        </Reveal>
      </div>

      <Reveal delay={0.2} className="mt-12">
        <div className="grid grid-cols-1 rounded-2xl border border-[var(--line)] bg-[var(--card)] sm:grid-cols-3">
          <StatOnView value={9} suffix=".33 / 10" label="B.E. GPA · German 1,3" hue="var(--accent-3)" />
          <StatOnView value={20} suffix=" projects" label="2026 roadmap scope" hue="var(--accent-4)" />
          <StatOnView value={5} suffix="+ yrs" label="Python & PyTorch" hue="var(--accent-2)" />
        </div>
      </Reveal>
    </section>
  );
}
