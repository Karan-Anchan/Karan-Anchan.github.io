"use client";

import { useState } from "react";
import { motion, useScroll, useMotionValueEvent, useSpring } from "motion/react";

/* The page is a training run: scrolling = epochs, loss decays as you read. */
export function TrainingHud() {
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });
  const [p, setP] = useState(0);

  useMotionValueEvent(smooth, "change", (v) => setP(Math.min(1, Math.max(0, v))));

  const loss = 2.312 * Math.exp(-3.6 * p) + 0.041;
  const ckpt = Math.min(6, Math.max(0, Math.floor(p * 6.999)));
  const lr = (3e-4 * (1 - 0.82 * p)).toExponential(1);

  return (
    <motion.aside
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.6, duration: 0.7 }}
      aria-hidden
      className="fixed bottom-4 left-4 z-[100] hidden select-none rounded-lg border border-white/10 bg-zinc-950/80 px-3.5 py-2.5 font-mono text-[0.6rem] leading-relaxed tracking-[0.08em] text-zinc-400 backdrop-blur-md lg:block"
    >
      <div className="mb-1 flex items-center gap-2 text-[0.55rem] uppercase tracking-[0.18em] text-zinc-500">
        <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--lime)]" />
        run: karan-v3 · live
      </div>
      <div>
        ckpt <span className="text-zinc-100">{String(ckpt).padStart(2, "0")}/06</span>
        {"  ·  "}loss{" "}
        <span className="text-[var(--lime)]">{loss.toFixed(3)}</span> ↓
        {"  ·  "}lr <span className="text-zinc-100">{lr}</span>
      </div>
      <div className="mt-1.5 h-0.5 w-full overflow-hidden rounded bg-white/10">
        <div
          className="h-full bg-[var(--lime)] transition-[width] duration-150"
          style={{ width: `${p * 100}%` }}
        />
      </div>
    </motion.aside>
  );
}
