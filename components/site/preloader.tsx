"use client";

import { useEffect, useRef, useState } from "react";
import { sound } from "@/lib/sound";

/* Full-page Minecraft-flavoured intro. Covers the site while assets load,
   fills a terrain bar to 100%, then waits for a click / Enter to play the
   "enter the world" sound and slide up, revealing the (already-loaded) page.
   The hero is a real grass block (Blender → GLB) that rotates slowly and
   bounces very slightly. Shown once per tab session. */
const MESSAGES = [
  "Building terrain",
  "Growing the forest",
  "Loading chunks",
  "Spawning agents",
  "Compiling shaders",
  "Measuring everything",
];

export function Preloader() {
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [done, setDone] = useState(false);
  const [msg, setMsg] = useState(0);
  const [blockReady, setBlockReady] = useState(false);
  const start = useRef(0);
  const loaded = useRef(false);

  // session gate + scroll lock
  useEffect(() => {
    if (sessionStorage.getItem("ka-entered")) {
      setDone(true);
      return;
    }
    start.current = performance.now();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // register the <model-viewer> element for the spinning block
  useEffect(() => {
    if (done) return;
    let alive = true;
    import("@google/model-viewer")
      .then(() => alive && setBlockReady(true))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [done]);

  // time-based progress; real load signals let it finish sooner
  useEffect(() => {
    if (done) return;
    if (!start.current) start.current = performance.now();
    const MIN = 1400;
    const onLoad = () => (loaded.current = true);
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });
    document.fonts?.ready.then(onLoad);

    const DURATION = 2200;
    let raf = 0,
      alive = true;
    const tick = () => {
      if (!alive) return;
      const elapsed = performance.now() - start.current;
      const canFinish = elapsed > MIN && (loaded.current || elapsed > 2800);
      const ceiling = canFinish ? 100 : 90;
      const p = Math.min(ceiling, (elapsed / DURATION) * 100);
      if (p >= 100 && canFinish) {
        setProgress(100);
        setReady(true);
        return;
      }
      setProgress(p);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("load", onLoad);
    };
  }, [done]);

  // cycle status lines while loading
  useEffect(() => {
    if (done || ready) return;
    const id = window.setInterval(() => setMsg((m) => (m + 1) % MESSAGES.length), 850);
    return () => clearInterval(id);
  }, [done, ready]);

  const enter = () => {
    if (!ready || exiting) return;
    try {
      sound.unlock();
      sound.enter();
    } catch {}
    sessionStorage.setItem("ka-entered", "1");
    setExiting(true);
    window.setTimeout(() => {
      document.body.style.overflow = "";
      setDone(true);
    }, 900);
  };

  useEffect(() => {
    if (!ready) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") enter();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, exiting]);

  if (done) return null;

  const pct = Math.floor(progress);

  return (
    <div
      id="ka-preloader"
      role="dialog"
      aria-label="Loading Karan Anchan's portfolio"
      onClick={enter}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden ${
        ready ? "cursor-pointer" : ""
      }`}
      style={{
        background: "radial-gradient(120% 90% at 50% 42%, #12140f 0%, #09090b 60%, #060705 100%)",
        transform: exiting ? "translateY(-100%)" : "none",
        transition: "transform .85s cubic-bezier(.76,0,.24,1)",
      }}
    >
      {/* pixel grid, faded at the edges */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(199,242,132,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(199,242,132,.04) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
          maskImage: "radial-gradient(ellipse 78% 68% at 50% 46%, #000, transparent)",
          WebkitMaskImage: "radial-gradient(ellipse 78% 68% at 50% 46%, #000, transparent)",
        }}
      />

      <div
        className="relative flex flex-col items-center px-6 text-center"
        style={{ opacity: exiting ? 0 : 1, transition: "opacity .4s ease" }}
      >
        {/* rotating + softly-floating grass block */}
        <div className="relative flex h-[168px] w-[168px] items-center justify-center">
          {/* grass-green glow behind the block */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(circle at 50% 55%, rgba(140,195,74,.18), transparent 62%)" }}
          />
          <div
            style={{
              width: 150,
              height: 150,
              pointerEvents: "none",
              animation: "mcFloat 2.6s ease-in-out infinite",
              filter: "drop-shadow(0 16px 20px rgba(0,0,0,.55))",
            }}
          >
            {blockReady ? (
              <model-viewer
                src="/models/grass.glb"
                auto-rotate
                auto-rotate-delay="0"
                rotation-per-second="30deg"
                interaction-prompt="none"
                disable-zoom
                disable-tap
                disable-pan
                camera-orbit="30deg 62deg auto"
                exposure="1.15"
                shadow-intensity="0"
                style={{ width: "100%", height: "100%", background: "transparent" }}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <div
                  className="animate-pulse"
                  style={{ width: 52, height: 52, background: "#6ea92f", opacity: 0.4 }}
                />
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            fontFamily: "var(--font-pixel)",
            color: "#c7f284",
            fontSize: "clamp(22px,4vw,40px)",
            letterSpacing: ".1em",
            lineHeight: 1,
            marginTop: 4,
          }}
        >
          KARAN ANCHAN
        </div>

        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11.5,
            letterSpacing: ".24em",
            textTransform: "uppercase",
            color: ready ? "#c7f284" : "#7c8070",
            minHeight: 15,
            marginTop: 20,
          }}
        >
          {ready ? "▶ Press start" : `${MESSAGES[msg]}…`}
        </div>

        {/* blocky terrain bar */}
        <div
          style={{
            width: "min(340px,72vw)",
            height: 16,
            background: "rgba(0,0,0,.55)",
            border: "3px solid #2b3320",
            padding: 3,
            marginTop: 16,
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${pct}%`,
              background: "#c7f284",
              transition: "width .12s linear",
            }}
          />
        </div>
        <div style={{ fontFamily: "var(--font-pixel)", fontSize: 14, color: "#9aa88a", marginTop: 12 }}>
          {pct}%
        </div>

        <div
          className={ready ? "animate-pulse" : ""}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: ".2em",
            textTransform: "uppercase",
            color: "#5a5f50",
            marginTop: 18,
            opacity: ready ? 1 : 0,
            transition: "opacity .4s ease",
          }}
        >
          click anywhere · or press enter
        </div>
      </div>
    </div>
  );
}
