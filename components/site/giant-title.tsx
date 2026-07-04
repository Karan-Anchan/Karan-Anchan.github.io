"use client";

import { useId, useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

const STOPS = [
  "var(--lime)",
  "var(--accent-4)",
  "var(--accent-2)",
  "var(--accent-5)",
  "var(--accent-3)",
];

/* Oversized section word — the shimmer lives ONLY in the letter borders:
   SVG text with fill="none" and an animated gradient stroke. */
export function GiantTitle({
  word,
  className = "",
}: {
  word: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const gradId = "gt" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const x = useTransform(scrollYProgress, [0, 1], ["4%", "-14%"]);
  const text = `${word} ${word}`;

  /* one word ~= 95vw on phones; the two-copy strip on larger screens */
  const mobileSize = `${(152 / word.length).toFixed(1)}vw`;

  const textStyle: React.CSSProperties = {
    fontFamily: "var(--font-geist-sans), sans-serif",
    fontWeight: 900,
    letterSpacing: "-0.05em",
    textTransform: "uppercase",
    fill: "none",
  };

  return (
    <div
      ref={ref}
      aria-hidden
      style={{ ["--gts" as string]: mobileSize }}
      className={`pointer-events-none select-none overflow-hidden ${className}`}
    >
      <motion.div style={{ x }}>
        <svg className="block h-[calc(var(--gts)*0.9)] w-[300vw] overflow-visible sm:h-[13vw]">
          <defs>
            <linearGradient
              id={gradId}
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1="0"
              x2="900"
              y2="0"
              spreadMethod="reflect"
            >
              {STOPS.map((c, i) => (
                <stop
                  key={i}
                  offset={i / (STOPS.length - 1)}
                  stopColor={c}
                />
              ))}
              {!reduced && (
                <animateTransform
                  attributeName="gradientTransform"
                  type="translate"
                  from="0 0"
                  to="1800 0"
                  dur="11s"
                  repeatCount="indefinite"
                />
              )}
            </linearGradient>
          </defs>
          {/* soft aura hugging the border */}
          <text
            x="0"
            y="96%"
            className="text-[length:var(--gts)] sm:text-[length:15vw]"
            style={{
              ...textStyle,
              stroke: `url(#${gradId})`,
              strokeWidth: 5,
              opacity: 0.09,
              filter: "blur(5px)",
            }}
          >
            {text}
          </text>
          {/* crisp gradient outline */}
          <text
            x="0"
            y="96%"
            className="text-[length:var(--gts)] sm:text-[length:15vw]"
            style={{
              ...textStyle,
              stroke: `url(#${gradId})`,
              strokeWidth: 1.4,
              opacity: 0.42,
            }}
          >
            {text}
          </text>
        </svg>
      </motion.div>
    </div>
  );
}
