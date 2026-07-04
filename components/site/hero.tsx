"use client";

import { useEffect, useRef, useState } from "react";
import { animate, stagger } from "animejs";
import BeamsBackground from "@/components/kokonutui/beams-background";
import ShimmerText from "@/components/kokonutui/shimmer-text";
import { ForestBackdrop } from "@/components/site/forest";
import { Magnetic } from "@/components/site/magnetic";

const TAGLINES = [
  "I TRAIN AGENTS.",
  "I COMPRESS MODELS.",
  "I SHIP SYSTEMS.",
  "I MEASURE EVERYTHING.",
];

export function Hero() {
  const nameRef = useRef<HTMLHeadingElement>(null);
  const [time, setTime] = useState("--:--");

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Europe/Berlin",
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const letters = nameRef.current?.querySelectorAll("span[data-letter]");
    if (letters?.length) {
      animate(letters, {
        translateY: ["1.05em", "0em"],
        opacity: [0, 1],
        duration: 850,
        delay: stagger(38, { start: 200 }),
        ease: "outExpo",
      });
    }
    const lines = document.querySelectorAll("[data-tagline]");
    if (lines.length) {
      animate(lines, {
        translateX: [-18, 0],
        opacity: [0, 1],
        duration: 700,
        delay: stagger(140, { start: 900 }),
        ease: "outQuart",
      });
    }
  }, []);

  return (
    <section id="top" className="relative min-h-svh overflow-hidden">
      <BeamsBackground
        intensity="medium"
        className="absolute inset-0 h-full min-h-0"
      />
      <ForestBackdrop />
      <div className="pointer-events-none absolute inset-0 dot-grid opacity-40" />
      <div className="pointer-events-none absolute inset-0 glow-mesh" />

      {/* corner meta — awwwards furniture */}
      <div className="absolute inset-x-0 top-16 z-10 mx-auto flex max-w-6xl justify-between px-5 font-mono text-[0.58rem] uppercase tracking-[0.2em] text-[var(--faint)]">
        <span>
          <span className="mr-2 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--accent-3)]" />
          open to collaborations
        </span>
        <span className="hidden sm:block">freiburg · de — {time} cet</span>
        <span className="hidden md:block">portfolio v3 · run 2026</span>
      </div>

      <div className="relative z-10 mx-auto flex min-h-svh max-w-6xl flex-col justify-center px-5 pt-14">
        <div className="glass-deep max-w-3xl rounded-3xl border border-[var(--line)] p-7 sm:p-10">
        <ShimmerText
          text="M.Sc. Computer Science · AI — Universität Freiburg"
          className="font-mono text-[0.7rem] uppercase tracking-[0.24em]"
        />

        <h1
          ref={nameRef}
          aria-label="Karan Anchan"
          className="mt-3 font-black uppercase leading-[0.86] tracking-tighter"
        >
          <span className="block text-[clamp(3rem,10vw,8rem)] text-[var(--fg)]">
            {"KARAN".split("").map((ch, i) => (
              <span key={i} data-letter className="inline-block will-change-transform">
                {ch}
              </span>
            ))}
          </span>
          <span className="text-outline block text-[clamp(3rem,10vw,8rem)]">
            {"ANCHAN".split("").map((ch, i) => (
              <span key={i} data-letter className="inline-block will-change-transform">
                {ch}
              </span>
            ))}
            <span data-letter className="text-spectrum inline-block" style={{ WebkitTextStroke: "0px" }}>
              .
            </span>
          </span>
        </h1>

        <div className="mt-8 space-y-1">
          {TAGLINES.map((t, i) => (
            <div
              key={t}
              data-tagline
              className={`font-mono text-sm tracking-[0.18em] opacity-0 sm:text-base ${
                ["text-[var(--lime)]", "text-[var(--accent-4)]", "text-[var(--accent-2)]", "text-[var(--accent-5)]"][i]
              }`}
            >
              {t}
            </div>
          ))}
        </div>

        <p className="mt-6 max-w-lg text-sm font-light leading-relaxed text-[var(--faint)]">
          RL on humanoids, detectors running in a browser tab, RAG in
          production, and agents that watch my training runs while I sleep —
          research-grade when it needs rigor, product-grade when it needs to
          ship. The loss curve in the corner is your reading progress.
          <span className="text-[var(--dim)]"> yes, it converges.</span>
        </p>

        <div className="mt-9 flex flex-wrap gap-3">
          <Magnetic><a
            href="#work"
            className="btn-spectrum rounded-full px-6 py-3 font-mono text-[0.72rem] uppercase tracking-[0.16em] transition-transform hover:scale-[1.03] active:scale-95"
          >
            Start the run ↓
          </a></Magnetic>
          <Magnetic><a
            href="/CVKaranAnchan.pdf"
            target="_blank"
            rel="noopener"
            className="rounded-full border border-[var(--line)] px-6 py-3 font-mono text-[0.72rem] uppercase tracking-[0.16em] text-[var(--fg2)] transition-colors hover:border-[var(--accent-4)]/60 hover:text-[var(--accent-4)]"
          >
            CV · PDF
          </a></Magnetic>
          <Magnetic><a
            href="https://github.com/Karan-Anchan"
            target="_blank"
            rel="noopener"
            className="rounded-full border border-[var(--line)] px-6 py-3 font-mono text-[0.72rem] uppercase tracking-[0.16em] text-[var(--fg2)] transition-colors hover:border-[var(--accent-2)]/60 hover:text-[var(--accent-2)]"
          >
            GitHub
          </a></Magnetic>
        </div>

        <div className="mt-12 font-mono text-[0.6rem] lowercase tracking-[0.2em] text-[var(--faint)]">
          scroll — the good stuff converges below ↓
        </div>
        </div>
      </div>
    </section>
  );
}
