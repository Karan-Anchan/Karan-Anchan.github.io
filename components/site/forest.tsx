"use client";

import { useEffect, useState } from "react";

/* The agent's training environment, floating beside the name.
   Loaded lazily after idle so it never blocks first paint. */
export function HeroForest() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    const load = () =>
      import("@google/model-viewer").then(() => {
        if (alive) setReady(true);
      });
    if ("requestIdleCallback" in window) {
      requestIdleCallback(() => load(), { timeout: 3500 });
    } else {
      setTimeout(load, 1800);
    }
    return () => {
      alive = false;
    };
  }, []);

  if (!ready) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute right-[-6%] top-1/2 z-[5] hidden h-[580px] w-[580px] -translate-y-1/2 animate-[fade-in_1.2s_ease_both] lg:block xl:right-[-2%]"
    >
      <model-viewer
        src="/models/forest.glb"
        alt=""
        auto-rotate
        auto-rotate-delay="0"
        rotation-per-second="7deg"
        interaction-prompt="none"
        disable-zoom
        shadow-intensity="0"
        exposure="1.15"
        camera-orbit="35deg 72deg 105%"
        style={{ width: "100%", height: "100%", background: "transparent" }}
      />
      <div className="absolute bottom-8 left-10 font-mono text-[0.56rem] lowercase tracking-[0.18em] text-[var(--faint)]">
        env: forest-v0 · the agent trains here
      </div>
    </div>
  );
}
