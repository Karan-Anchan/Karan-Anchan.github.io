"use client";

import { useEffect, useState } from "react";

/* "Forest Demo" © patrix (sketchfab.com/patrix), CC-BY-SA-4.0 —
   full license at /models/forest-LICENSE.txt.
   Rendered as a quiet background element: low opacity, desaturated,
   sitting underneath the dot-grid and glow overlays so it melts into
   the hero instead of floating on top of it. */
export function ForestBackdrop() {
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
      className="pointer-events-none absolute bottom-[-12%] right-[-14%] hidden h-[82vh] w-[82vh] opacity-0 transition-opacity duration-[2000ms] md:block"
      style={{
        opacity: 0.26,
        filter: "saturate(0.65) contrast(0.95)",
        maskImage:
          "radial-gradient(ellipse 70% 70% at 55% 55%, black 40%, transparent 78%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 70% 70% at 55% 55%, black 40%, transparent 78%)",
      }}
    >
      <model-viewer
        src="/models/forest.glb"
        alt=""
        auto-rotate
        auto-rotate-delay="0"
        rotation-per-second="4deg"
        interaction-prompt="none"
        disable-zoom
        shadow-intensity="0"
        exposure="0.9"
        camera-orbit="40deg 68deg 110%"
        style={{ width: "100%", height: "100%", background: "transparent" }}
      />
    </div>
  );
}
