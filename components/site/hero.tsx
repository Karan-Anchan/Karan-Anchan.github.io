"use client";

import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import BeamsBackground from "@/components/kokonutui/beams-background";
import ShimmerText from "@/components/kokonutui/shimmer-text";
import { FlipText } from "@/components/ui/flip-text";

const NAME = "Karan Anchan";

export function Hero() {
  const nameRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const letters = nameRef.current?.querySelectorAll("span[data-letter]");
    if (!letters?.length) return;
    animate(letters, {
      translateY: ["1.1em", "0em"],
      opacity: [0, 1],
      duration: 900,
      delay: stagger(42, { start: 250 }),
      ease: "outExpo",
    });
  }, []);

  return (
    <section id="top" className="relative min-h-svh overflow-hidden">
      <BeamsBackground
        intensity="medium"
        className="absolute inset-0 h-full min-h-0"
      />
      <div className="pointer-events-none absolute inset-0 dot-grid opacity-40" />
      <div className="pointer-events-none absolute inset-0 glow-lime" />

      <div className="relative z-10 mx-auto flex min-h-svh max-w-6xl flex-col justify-center px-5 pt-14">
        <ShimmerText
          text="M.Sc. Computer Science · AI — Universität Freiburg"
          className="font-mono text-[0.7rem] uppercase tracking-[0.24em]"
        />

        <h1
          ref={nameRef}
          aria-label={NAME}
          className="mt-2 text-6xl font-light leading-[0.95] tracking-tighter text-zinc-50 sm:text-8xl lg:text-[9rem]"
        >
          {NAME.split("").map((ch, i) =>
            ch === " " ? (
              <br key={i} />
            ) : (
              <span
                key={i}
                data-letter
                className={`inline-block will-change-transform ${
                  i > 5 ? "font-serif-accent italic" : ""
                }`}
              >
                {ch}
              </span>
            ),
          )}
          <span data-letter className="inline-block text-[var(--lime)]">
            .
          </span>
        </h1>

        <div className="mt-8 max-w-xl text-base font-light leading-relaxed text-zinc-400 sm:text-lg">
          I train agents, compress models, and measure everything — from{" "}
          <em className="font-serif-accent italic text-zinc-200">
            offline-to-online RL
          </em>{" "}
          on humanoids to detectors shipped to three runtimes. Paper →
          reproduction → ablation → deployment.
        </div>

        <div className="mt-4 flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-zinc-500">
          <span>field:</span>
          <FlipText className="text-[var(--lime)]" duration={2.4}>
            Reinforcement Learning
          </FlipText>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href="#work"
            className="rounded-full bg-[var(--lime)] px-6 py-3 font-mono text-[0.72rem] uppercase tracking-[0.16em] text-zinc-950 transition-transform hover:scale-[1.03] active:scale-95"
          >
            View the work ↗
          </a>
          <a
            href="/CVKaranAnchan.pdf"
            target="_blank"
            rel="noopener"
            className="rounded-full border border-white/15 px-6 py-3 font-mono text-[0.72rem] uppercase tracking-[0.16em] text-zinc-200 transition-colors hover:border-[var(--lime)]/60 hover:text-[var(--lime)]"
          >
            Curriculum vitae
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

        <div className="mt-16 flex items-center gap-3 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-zinc-500">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[var(--lime)]" />
          Open to research collaborations · Freiburg im Breisgau, DE
        </div>
      </div>
    </section>
  );
}
