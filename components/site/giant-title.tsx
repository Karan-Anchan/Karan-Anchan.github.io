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
        className="text-outline-faint whitespace-nowrap text-[16vw] font-black uppercase leading-[0.85] tracking-tighter"
      >
        {word}&nbsp;{word}
      </motion.div>
    </div>
  );
}
