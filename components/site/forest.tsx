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
      className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] hidden h-[132%] md:block"
      style={{ opacity: 0.95, filter: "saturate(0.95)" }}
    >
      <model-viewer
        src="/models/forest.glb"
        alt=""
        auto-rotate
        auto-rotate-delay="0"
        rotation-per-second="3deg"
        interaction-prompt="none"
        disable-zoom
        shadow-intensity="0"
        exposure="1.9"
        camera-orbit="30deg 62deg 80%"
        style={{ width: "100%", height: "100%", background: "transparent" }}
      />
    </div>
  );
}
