"use client";

import { useEffect, useRef, useState } from "react";

/* "Forest Demo" © patrix (sketchfab.com/patrix), CC-BY-SA-4.0 —
   full license at /models/forest-LICENSE.txt.
   A quiet hero backdrop: low opacity, desaturated, sitting under the dot-grid
   and glow overlays. It streams in behind the intro preloader, so by the time
   the site is revealed it is usually ready; on `load` it fades in gently rather
   than popping. */
export function ForestBackdrop() {
  const [ready, setReady] = useState(false);
  const [shown, setShown] = useState(false);
  const mvRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    let alive = true;
    const load = () =>
      import("@google/model-viewer").then(() => {
        if (alive) setReady(true);
      });
    if ("requestIdleCallback" in window) {
      requestIdleCallback(() => load(), { timeout: 1500 });
    } else {
      setTimeout(load, 600);
    }
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    const el = mvRef.current;
    if (!el) return;
    const onLoad = () => setShown(true);
    el.addEventListener("load", onLoad);
    return () => el.removeEventListener("load", onLoad);
  }, [ready]);

  if (!ready) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-[-9%] z-[2] hidden h-[168%] md:block"
      style={{
        opacity: shown ? 0.95 : 0,
        filter: "saturate(1.18) contrast(1.05)",
        transition: "opacity 1s ease",
      }}
    >
      <model-viewer
        ref={mvRef}
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
      >
        {/* suppress model-viewer's default progress bar — the intro covers loading */}
        <div slot="progress-bar" style={{ display: "none" }} />
      </model-viewer>
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
