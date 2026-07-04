"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "motion/react";

export function Cursor() {
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [hot, setHot] = useState(false);

  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);
  const rx = useSpring(mx, { stiffness: 260, damping: 24, mass: 0.6 });
  const ry = useSpring(my, { stiffness: 260, damping: 24, mass: 0.6 });

  useEffect(() => {
    if (reduced) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!fine.matches) return;
    setEnabled(true);
    document.documentElement.classList.add("custom-cursor-on");

    const move = (e: PointerEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
    };
    const over = (e: PointerEvent) => {
      setHot(!!(e.target as Element | null)?.closest?.("a, button"));
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.documentElement.classList.remove("custom-cursor-on");
    };
  }, [reduced, mx, my]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[200] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--lime)]"
        style={{ x: mx, y: my }}
      />
      <motion.div
        aria-hidden
        animate={{
          width: hot ? 52 : 32,
          height: hot ? 52 : 32,
          backgroundColor: hot ? "rgba(199,242,132,0.08)" : "rgba(199,242,132,0)",
        }}
        transition={{ duration: 0.25 }}
        className="pointer-events-none fixed left-0 top-0 z-[199] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--lime)]/50"
        style={{ x: rx, y: ry }}
      />
    </>
  );
}
