"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const NOW = [
  "training RLPD on Humanoid-v5 — seed 2 still hates me",
  "re-reading the Dreamer 4 paper. it holds up",
  "calibrating INT8 on the RTX 5070 (again)",
  "teaching n8n to triage my inbox so I don't have to",
  "somewhere between masala chai and filter coffee no. 3",
  "waiting for a W&B run — you're reading this because of it",
];

export function NowTicker() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % NOW.length), 3400);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="border-b border-white/5 bg-zinc-950">
      <div className="mx-auto flex max-w-6xl items-baseline gap-3 overflow-hidden px-5 py-3">
        <span className="shrink-0 font-mono text-[0.6rem] uppercase tracking-[0.22em] text-[var(--lime)]">
          now ⟶
        </span>
        <div className="relative h-[1.4em] flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.span
              key={i}
              initial={{ y: "110%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "-110%", opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-0 font-mono text-[0.68rem] lowercase tracking-[0.1em] text-zinc-400"
            >
              {NOW[i]}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
