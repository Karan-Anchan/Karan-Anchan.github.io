"use client";

import { useEffect, useRef, useState } from "react";

/* "Forest Demo" © patrix (sketchfab.com/patrix), CC-BY-SA-4.0 —
   full license at /models/forest-LICENSE.txt.
   Rendered as a quiet background element: low opacity, desaturated,
   sitting underneath the dot-grid and glow overlays so it melts into
   the hero instead of floating on top of it.

   The .glb is ~2.3 MB, so while it streams+decodes we show a
   Minecraft-flavoured "growing the forest" loader (pixel tree + blocky
   terrain bar) that tracks real progress and fades out on load — no
   empty gap, no pop-in. */
export function ForestBackdrop() {
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fading, setFading] = useState(false);
  const [gone, setGone] = useState(false);
  const mvRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    let alive = true;
    const load = () =>
      import("@google/model-viewer").then(() => {
        if (alive) setReady(true);
      });
    if ("requestIdleCallback" in window) {
      requestIdleCallback(() => load(), { timeout: 2500 });
    } else {
      setTimeout(load, 1200);
    }
    return () => {
      alive = false;
    };
  }, []);

  // track model-viewer load progress → drive the terrain bar, fade out on load
  useEffect(() => {
    if (!ready) return;
    const el = mvRef.current;
    if (!el) return;
    const onProgress = (e: Event) => {
      const p = (e as CustomEvent<{ totalProgress: number }>).detail?.totalProgress;
      if (typeof p === "number") setProgress(p);
    };
    const onLoad = () => {
      setProgress(1);
      setFading(true);
      window.setTimeout(() => setGone(true), 700);
    };
    el.addEventListener("progress", onProgress);
    el.addEventListener("load", onLoad);
    return () => {
      el.removeEventListener("progress", onProgress);
      el.removeEventListener("load", onLoad);
    };
  }, [ready]);

  const pct = Math.round(Math.max(3, Math.min(100, progress * 100)));

  return (
    <>
      {ready && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-[-9%] z-[2] hidden h-[168%] md:block"
          style={{ opacity: 0.95, filter: "saturate(1.18) contrast(1.05)" }}
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
            {/* suppress model-viewer's default progress bar — we draw our own */}
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
      )}

      {/* ── Minecraft-flavoured terrain loader (fades out on load) ── */}
      {!gone && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-[3.5%] z-20 hidden justify-center md:flex"
          style={{ opacity: fading ? 0 : 1, transition: "opacity .55s ease" }}
        >
          <div
            className="flex items-center gap-3 px-4 py-2"
            style={{
              background: "rgba(9,9,11,.74)",
              border: "2px solid rgba(199,242,132,.28)",
              borderRadius: 6,
              backdropFilter: "blur(6px)",
            }}
          >
            {/* bobbing pixel oak */}
            <svg
              width="22"
              height="24"
              viewBox="0 0 14 15"
              shapeRendering="crispEdges"
              style={{ animation: "mcBob 1.5s ease-in-out infinite" }}
            >
              <rect x="4" y="0" width="6" height="2" fill="#a4d65e" />
              <rect x="2" y="2" width="10" height="3" fill="#8bc34a" />
              <rect x="3" y="5" width="8" height="2" fill="#6ea92f" />
              <rect x="5" y="7" width="4" height="2" fill="#a4d65e" />
              <rect x="6" y="9" width="2" height="4" fill="#6d4c33" />
              <rect x="4" y="13" width="6" height="1" fill="#6ea92f" />
            </svg>
            <span
              style={{
                fontFamily: "var(--font-pixel)",
                fontSize: 13,
                letterSpacing: "0.12em",
                color: "#c7f284",
                textTransform: "uppercase",
              }}
            >
              Growing the forest
            </span>
            {/* blocky terrain bar */}
            <div style={{ width: 120, height: 12, background: "rgba(0,0,0,.55)", border: "2px solid #2b3320", padding: 2 }}>
              <div style={{ height: "100%", width: `${pct}%`, background: "#c7f284", transition: "width .25s ease-out" }} />
            </div>
            <span style={{ fontFamily: "var(--font-pixel)", fontSize: 11, color: "#9aa88a", minWidth: 30 }}>
              {pct}%
            </span>
          </div>
        </div>
      )}
    </>
  );
}
