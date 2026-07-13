"use client";

import { useEffect, useRef, useState } from "react";
import { sound } from "@/lib/sound";

/* Full-page Minecraft-flavoured intro. Covers the site while fonts + assets
   load, fills a terrain bar to 100%, then waits for a click / Enter to play
   the "enter the world" sound and slide up, revealing the (already-loaded)
   page. Shown once per tab session. */
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

  // real load signals accelerate the bar; a hard time-cap guarantees completion
  useEffect(() => {
    if (done) return;
    if (!start.current) start.current = performance.now();
    const MIN = 1400; // never blink past this
    const onLoad = () => (loaded.current = true);
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });
    document.fonts?.ready.then(onLoad);

    const DURATION = 2200; // baseline time to fill
    let raf = 0,
      alive = true;
    const tick = () => {
      if (!alive) return;
      const elapsed = performance.now() - start.current;
      const canFinish = elapsed > MIN && (loaded.current || elapsed > 2800);
      // time-based (not accumulated) so it can't stall if this effect re-runs
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
        background: "#09090b",
        transform: exiting ? "translateY(-100%)" : "none",
        transition: "transform .85s cubic-bezier(.76,0,.24,1)",
      }}
    >
      {/* blueprint / pixel grid */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(199,242,132,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(199,242,132,.045) 1px, transparent 1px)",
          backgroundSize: "34px 34px",
          maskImage: "radial-gradient(ellipse 80% 70% at 50% 45%, #000, transparent)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 45%, #000, transparent)",
        }}
      />

      <div
        className="relative flex flex-col items-center gap-6 px-6 text-center"
        style={{ opacity: exiting ? 0 : 1, transition: "opacity .4s ease" }}
      >
        {/* bobbing pixel oak */}
        <svg
          width="58"
          height="62"
          viewBox="0 0 14 15"
          shapeRendering="crispEdges"
          style={{ animation: "mcBob 1.6s ease-in-out infinite" }}
        >
          <rect x="4" y="0" width="6" height="2" fill="#a4d65e" />
          <rect x="2" y="2" width="10" height="3" fill="#8bc34a" />
          <rect x="3" y="5" width="8" height="2" fill="#6ea92f" />
          <rect x="5" y="7" width="4" height="2" fill="#a4d65e" />
          <rect x="6" y="9" width="2" height="4" fill="#6d4c33" />
          <rect x="4" y="13" width="6" height="1" fill="#6ea92f" />
        </svg>

        <div
          style={{
            fontFamily: "var(--font-pixel)",
            color: "#c7f284",
            fontSize: "clamp(24px,4.4vw,44px)",
            letterSpacing: ".07em",
            lineHeight: 1,
          }}
        >
          KARAN ANCHAN
        </div>

        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            letterSpacing: ".22em",
            textTransform: "uppercase",
            color: ready ? "#c7f284" : "#8a8577",
            minHeight: 16,
          }}
        >
          {ready ? "▶ Press start" : `${MESSAGES[msg]}…`}
        </div>

        {/* blocky terrain bar */}
        <div
          style={{
            width: "min(360px,74vw)",
            height: 18,
            background: "rgba(0,0,0,.6)",
            border: "3px solid #2b3320",
            padding: 3,
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
        <div style={{ fontFamily: "var(--font-pixel)", fontSize: 15, color: "#9aa88a" }}>{pct}%</div>

        <div
          className={ready ? "animate-pulse" : ""}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: ".2em",
            textTransform: "uppercase",
            color: "#5a5f50",
            marginTop: 2,
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
