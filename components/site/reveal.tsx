"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHead({
  index,
  title,
  accent,
  side,
  hue = "var(--lime)",
  sprite,
}: {
  index: string;
  title: string;
  accent: string;
  side?: string;
  hue?: string;
  sprite?: string;
}) {
  return (
    <Reveal className="mb-12 flex flex-wrap items-baseline gap-x-5 gap-y-2">
      <span className="font-mono text-xs tracking-[0.2em]" style={{ color: hue }}>
        {index}
      </span>
      <h2 className="text-4xl font-light tracking-tight text-[var(--fg)] sm:text-5xl">
        {title}{" "}
        <em className="font-serif-accent italic" style={{ color: hue }}>{accent}</em>
      </h2>
      {side ? (
        <span className="ml-auto flex items-center gap-3 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-[var(--faint)]">
          {sprite ? (
            <img
              src={sprite}
              alt=""
              aria-hidden
              loading="lazy"
              className="bob pixelated h-9 w-9 object-contain drop-shadow-[0_0_10px_rgba(255,200,120,0.35)]"
            />
          ) : null}
          {side}
        </span>
      ) : null}
    </Reveal>
  );
}
