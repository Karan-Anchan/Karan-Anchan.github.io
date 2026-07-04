"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { sound } from "@/lib/sound";

/* Minecraft-style toast when the reader reaches the final checkpoint. */
export function Achievement() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = document.getElementById("contact");
    if (!el) return;
    let fired = false;
    const io = new IntersectionObserver(
      ([en]) => {
        if (en.isIntersecting && !fired) {
          fired = true;
          setShow(true);
          sound.xp();
          setTimeout(() => setShow(false), 5200);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: -24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -24, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          role="status"
          className="glass-deep fixed right-4 top-20 z-[150] flex items-center gap-3 rounded-xl border border-[var(--accent-3)]/40 px-4 py-3"
        >
          {/* pixel trophy */}
          <svg width="26" height="26" viewBox="0 0 13 13" aria-hidden shapeRendering="crispEdges">
            {[
              [2,1],[3,1],[4,1],[5,1],[6,1],[7,1],[8,1],[9,1],[10,1],
              [2,2],[10,2],[3,3],[9,3],[1,2],[11,2],
              [3,2],[4,2],[5,2],[6,2],[7,2],[8,2],[9,2],
              [3,4],[4,4],[5,4],[6,4],[7,4],[8,4],[9,4],
              [4,5],[5,5],[6,5],[7,5],[8,5],
              [5,6],[6,6],[7,6],[6,7],[6,8],
              [4,9],[5,9],[6,9],[7,9],[8,9],
              [3,10],[4,10],[5,10],[6,10],[7,10],[8,10],[9,10],
            ].map(([x, y], i) => (
              <rect key={i} x={x} y={y} width="1" height="1" fill="var(--accent-3)" />
            ))}
          </svg>
          <div className="leading-tight">
            <div className="font-pixel text-[0.72rem] text-[var(--accent-3)]">
              Achievement Get!
            </div>
            <div className="font-mono text-[0.6rem] lowercase tracking-[0.1em] text-[var(--dim)]">
              training complete — say hello?
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
