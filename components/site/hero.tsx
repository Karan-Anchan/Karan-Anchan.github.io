"use client";

import { useEffect, useRef, useState } from "react";
import { animate, stagger } from "animejs";
import BeamsBackground from "@/components/kokonutui/beams-background";
import ShimmerText from "@/components/kokonutui/shimmer-text";

const TAGLINES = [
  "I TRAIN AGENTS.",
  "I COMPRESS MODELS.",
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
      <div className="pointer-events-none absolute inset-0 dot-grid opacity-40" />
      <div className="pointer-events-none absolute inset-0 glow-lime" />

      {/* corner meta — awwwards furniture */}
      <div className="absolute inset-x-0 top-16 z-10 mx-auto flex max-w-6xl justify-between px-5 font-mono text-[0.58rem] uppercase tracking-[0.2em] text-zinc-500">
        <span>
          <span className="mr-2 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--lime)]" />
          open to collaborations
        </span>
        <span className="hidden sm:block">freiburg · de — {time} cet</span>
        <span className="hidden md:block">portfolio v3 · run 2026</span>
      </div>

      <div className="relative z-10 mx-auto flex min-h-svh max-w-6xl flex-col justify-center px-5 pt-14">
        <ShimmerText
          text="M.Sc. Computer Science · AI — Universität Freiburg"
          className="font-mono text-[0.7rem] uppercase tracking-[0.24em]"
        />

        <h1
          ref={nameRef}
          aria-label="Karan Anchan"
          className="mt-3 font-black uppercase leading-[0.86] tracking-tighter"
        >
          <span className="block text-[clamp(3.5rem,13vw,10.5rem)] text-zinc-50">
            {"KARAN".split("").map((ch, i) => (
              <span key={i} data-letter className="inline-block will-change-transform">
                {ch}
              </span>
            ))}
          </span>
          <span className="text-outline block text-[clamp(3.5rem,13vw,10.5rem)]">
            {"ANCHAN".split("").map((ch, i) => (
              <span key={i} data-letter className="inline-block will-change-transform">
                {ch}
              </span>
            ))}
            <span data-letter className="inline-block text-[var(--lime)]" style={{ WebkitTextStroke: "0px" }}>
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
                i === 2 ? "text-[var(--lime)]" : "text-zinc-300"
              }`}
            >
              {t}
            </div>
          ))}
        </div>

        <p className="mt-6 max-w-lg text-sm font-light leading-relaxed text-zinc-500">
          From offline-to-online RL on humanoids to NMS-free detectors in the
          browser — paper → reproduction → ablation → deployment. The loss
          curve in the corner is your reading progress.
          <span className="text-zinc-400"> yes, it converges.</span>
        </p>

        <div className="mt-9 flex flex-wrap gap-3">
          <a
            href="#work"
            className="rounded-full bg-[var(--lime)] px-6 py-3 font-mono text-[0.72rem] uppercase tracking-[0.16em] text-zinc-950 transition-transform hover:scale-[1.03] active:scale-95"
          >
            Start the run ↓
          </a>
          <a
            href="/CVKaranAnchan.pdf"
            target="_blank"
            rel="noopener"
            className="rounded-full border border-white/15 px-6 py-3 font-mono text-[0.72rem] uppercase tracking-[0.16em] text-zinc-200 transition-colors hover:border-[var(--lime)]/60 hover:text-[var(--lime)]"
          >
            CV · PDF
          </a>
          <a
            href="https://github.com/Karan-Anchan"
            target="_blank"
            rel="noopener"
            className="rounded-full border border-white/15 px-6 py-3 font-mono text-[0.72rem] uppercase tracking-[0.16em] text-zinc-200 transition-colors hover:border-[var(--lime)]/60 hover:text-[var(--lime)]"
          >
            GitHub
          </a>
        </div>

        <div className="mt-14 font-mono text-[0.6rem] lowercase tracking-[0.2em] text-zinc-600">
          scroll — the good stuff converges below ↓
        </div>
      </div>
    </section>
  );
}
