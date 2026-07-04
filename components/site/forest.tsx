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
      className="pointer-events-none absolute inset-x-0 bottom-[-9%] z-[2] hidden h-[168%] md:block"
      style={{ opacity: 0.95, filter: "saturate(1.18) contrast(1.05)" }}
    >
      <model-viewer
        src="/models/forest.glb"
        alt=""
        auto-rotate
        auto-rotate-delay="0"
        rotation-per-second="3deg"
        interaction-prompt="none"
        disable-zoom
        environment-image="/env/studio.hdr"
        shadow-intensity="1.2"
        shadow-softness="0.9"
        exposure="1.15"
        tone-mapping="aces"
        camera-orbit="30deg 78deg 66%"
        style={{ width: "100%", height: "100%", background: "transparent" }}
      />
      {/* faux volumetric god rays from the sun corner - shader-pack flavor */}
      <div
        aria-hidden
        className="rays-sway pointer-events-none absolute inset-0"
        style={{
          background:
            "repeating-linear-gradient(112deg, rgba(255,210,140,0.09) 0px, rgba(255,210,140,0) 70px, rgba(255,210,140,0) 170px), radial-gradient(ellipse 42% 34% at 14% 6%, rgba(255,195,110,0.30), transparent 72%)",
          mixBlendMode: "screen",
        }}
      />
    </div>
  );
}
