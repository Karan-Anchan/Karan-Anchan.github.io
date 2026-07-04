"use client";

import { useEffect, useRef, useState } from "react";
import { sound } from "@/lib/sound";
import { motion, useScroll, useMotionValueEvent, useSpring } from "motion/react";

const HEART = [
  [1, 0], [2, 0], [4, 0], [5, 0],
  [0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1],
  [0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2],
  [1, 3], [2, 3], [3, 3], [4, 3], [5, 3],
  [2, 4], [3, 4], [4, 4],
  [3, 5],
];

function PixelHeart({ lit }: { lit: boolean }) {
  return (
    <svg width="12" height="11" viewBox="0 0 7 6" aria-hidden shapeRendering="crispEdges">
      {HEART.map(([x, y], i) => (
        <rect
          key={i}
          x={x}
          y={y}
          width="1"
          height="1"
          fill={lit ? "var(--accent-5)" : "color-mix(in srgb, var(--faint) 40%, transparent)"}
        />
      ))}
    </svg>
  );
}

/* The page is a training run: scrolling = epochs, loss decays as you read. */
export function TrainingHud() {
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });
  const [p, setP] = useState(0);

  useMotionValueEvent(smooth, "change", (v) => setP(Math.min(1, Math.max(0, v))));

  const loss = 2.312 * Math.exp(-3.6 * p) + 0.041;
  const ckpt = Math.min(6, Math.max(0, Math.floor(p * 6.999)));
  const lr = (3e-4 * (1 - 0.82 * p)).toExponential(1);

  const prevCkpt = useRef(0);
  useEffect(() => {
    if (ckpt > prevCkpt.current) sound.ckpt(ckpt);
    prevCkpt.current = ckpt;
  }, [ckpt]);

  return (
    <motion.aside
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.6, duration: 0.7 }}
      aria-hidden
      className="fixed bottom-4 left-4 z-[100] hidden select-none rounded-lg border border-[var(--line)] glass px-3.5 py-2.5 font-mono text-[0.6rem] leading-relaxed tracking-[0.08em] text-[var(--dim)] backdrop-blur-md lg:block"
    >
      <div className="mb-1 flex items-center justify-between gap-4 text-[0.55rem] uppercase tracking-[0.18em] text-[var(--faint)]">
        <span>
          <span className="mr-1.5 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--accent-5)]" />
          run: karan-v3 · live
        </span>
        <span className="flex gap-0.5" title="reader hp">
          {Array.from({ length: 5 }).map((_, i) => (
            <PixelHeart key={i} lit={p * 5 >= i + 0.5} />
          ))}
        </span>
      </div>
      <div>
        ckpt <span className="text-[var(--accent-2)]">{String(ckpt).padStart(2, "0")}/06</span>
        {"  ·  "}loss{" "}
        <span className="text-[var(--accent-3)]">{loss.toFixed(3)}</span> ↓
        {"  ·  "}lr <span className="text-[var(--accent-4)]">{lr}</span>
      </div>
      <div className="xp-track relative mt-1.5 h-[7px] w-full overflow-hidden rounded-sm">
        <div
          className="xp-fill h-full transition-[width] duration-150"
          style={{ width: `${p * 100}%` }}
        />
        <div className="xp-notches absolute inset-0" />
      </div>
    </motion.aside>
  );
}
