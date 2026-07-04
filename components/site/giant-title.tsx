"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

/* Oversized outlined word drifting behind each section — awwwards staple. */
export function GiantTitle({
  word,
  className = "",
}: {
  word: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const x = useTransform(scrollYProgress, [0, 1], ["4%", "-14%"]);

  return (
    <div
      ref={ref}
      aria-hidden
      className={`pointer-events-none select-none overflow-hidden ${className}`}
    >
      <motion.div
        style={{ x }}
        className="relative whitespace-nowrap text-[16vw] font-black uppercase leading-[0.85] tracking-tighter"
      >
        <span
          aria-hidden
          className="text-spectrum-shimmer absolute inset-0 select-none opacity-[0.22] blur-[7px]"
        >
          {word}&nbsp;{word}
        </span>
        <span className="text-outline-faint relative">
          {word}&nbsp;{word}
        </span>
      </motion.div>
    </div>
  );
}
