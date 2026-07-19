"use client";

import { useEffect, useRef, useState } from "react";

/* Full-page intro. The wordmark decodes out of pixel noise while a spectrum
   hairline fills along the bottom edge. Shown on every visit for at least
   a minimum hold (full on first visit, brief on repeats), then — once the
   page has actually loaded — it auto-exits with a
   two-layer wipe: the panel slides up, a spectrum flash trails it. */

const NAME = "KARAN·ANCHAN";
const GLYPHS = "<>/\\#%&@+=*?KARANCHN013";
const MESSAGES = [
  "planting pixels",
  "growing the forest",
  "loading chunks",
  "compiling shaders",
];

const MIN_MS_FIRST = 4000; // full decode on the first visit of a session
const MIN_MS_REPEAT = 1200; // fast-path once the intro has been seen
const HARD_MS = 9000; // never longer than this, even if `load` misfires
const EXIT_MS = 950; // wipe duration before unmount

export function Preloader() {
  const [display, setDisplay] = useState<string[]>(() =>
    NAME.split("").map((c) => (c === "·" ? "·" : "#"))
  );
  const [progress, setProgress] = useState(0);
  const [msg, setMsg] = useState(0);
  const [done, setDone] = useState(false); // hit 100%, brief hold
  const [exiting, setExiting] = useState(false); // wipe running
  const [hidden, setHidden] = useState(false); // unmounted
  const reduced = useRef(false);

  // scroll lock while visible
  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // time-based progress, gated on the real load signal + a minimum hold:
  // the full 4s decode on a session's first visit, a fast-path after that
  useEffect(() => {
    let minMs = MIN_MS_FIRST;
    try {
      if (sessionStorage.getItem("kn-intro-seen")) minMs = MIN_MS_REPEAT;
      sessionStorage.setItem("kn-intro-seen", "1");
    } catch {
      /* privacy mode — keep the full intro */
    }
    const start = performance.now();
    let loaded = document.readyState === "complete";
    const onLoad = () => (loaded = true);
    window.addEventListener("load", onLoad, { once: true });
    document.fonts?.ready.then(onLoad);

    let raf = 0,
      alive = true,
      lastScramble = 0;

    const tick = () => {
      if (!alive) return;
      // wall clock, not the rAF timestamp — the latter can skew in
      // throttled/headless frames and on the very first callback
      const now = performance.now();
      const elapsed = Math.max(0, now - start);
      const canFinish = elapsed >= minMs && (loaded || elapsed > HARD_MS);
      const pct = Math.min((elapsed / minMs) * 100, canFinish ? 100 : 96);
      setProgress(pct);

      // decode: letters resolve left→right with the bar; the rest churn
      const resolved = Math.floor((pct / 100) * NAME.length);
      if (reduced.current) {
        setDisplay(NAME.split(""));
      } else if (now - lastScramble > 70 || pct >= 100) {
        lastScramble = now;
        setDisplay(
          NAME.split("").map((c, i) =>
            c === "·" || i < resolved || pct >= 100
              ? c
              : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
          )
        );
      }

      if (pct >= 100) {
        setDone(true);
        return; // hold handled below
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  // cycle status lines while loading
  useEffect(() => {
    if (done) return;
    const id = window.setInterval(() => setMsg((m) => (m + 1) % MESSAGES.length), 900);
    return () => clearInterval(id);
  }, [done]);

  // short hold at 100%, then the wipe, then unmount
  useEffect(() => {
    if (!done) return;
    const hold = window.setTimeout(() => setExiting(true), 450);
    const gone = window.setTimeout(() => {
      document.body.style.overflow = "";
      setHidden(true);
    }, 450 + EXIT_MS);
    return () => {
      clearTimeout(hold);
      clearTimeout(gone);
    };
  }, [done]);

  if (hidden) return null;

  const pct = Math.floor(progress);
  const resolved = Math.floor((progress / 100) * NAME.length);
  const wipe = reduced.current
    ? { transition: "opacity .5s ease", opacity: exiting ? 0 : 1 }
    : {
        transition: "transform .8s cubic-bezier(.76,0,.24,1)",
        transform: exiting ? "translateY(-100%)" : "none",
      };

  return (
    <>
      {/* spectrum flash that trails the panel during the wipe */}
      <div
        aria-hidden
        className="fixed inset-0 z-[99]"
        style={{
          background:
            "linear-gradient(115deg, var(--lime), var(--accent-4) 35%, var(--accent-2) 70%, var(--accent-5))",
          ...wipe,
          ...(reduced.current
            ? {}
            : { transition: "transform .8s cubic-bezier(.76,0,.24,1) .12s" }),
        }}
      />

      <div
        id="ka-preloader"
        role="status"
        aria-label="Loading Karan Anchan's portfolio"
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-[var(--bg)]"
        style={wipe}
      >
        {/* the site's dot grid, faded toward the edges */}
        <div
          className="dot-grid pointer-events-none absolute inset-0"
          style={{
            maskImage: "radial-gradient(ellipse 75% 62% at 50% 46%, #000, transparent)",
            WebkitMaskImage:
              "radial-gradient(ellipse 75% 62% at 50% 46%, #000, transparent)",
          }}
        />

        <div
          className="relative flex flex-col items-center px-6 text-center"
          style={{ opacity: exiting ? 0 : 1, transition: "opacity .3s ease" }}
        >
          {/* decoding wordmark */}
          <div
            aria-hidden
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "clamp(26px, 7.5vw, 76px)",
              lineHeight: 1,
              whiteSpace: "nowrap",
            }}
          >
            {display.map((c, i) =>
              NAME[i] === "·" ? (
                <span
                  key={i}
                  className={done ? "blink" : ""}
                  style={{
                    display: "inline-block",
                    width: ".45em",
                    color: "var(--accent-5)",
                  }}
                >
                  ·
                </span>
              ) : (
                <span
                  key={i}
                  style={{
                    display: "inline-block",
                    width: ".62em",
                    color: done
                      ? "var(--lime)"
                      : i < resolved
                        ? "var(--fg)"
                        : "var(--faint)",
                    transition: "color .25s ease",
                  }}
                >
                  {c}
                </span>
              )
            )}
          </div>

          {/* status line */}
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: ".26em",
              textTransform: "uppercase",
              color: done ? "var(--lime)" : "var(--dim)",
              transition: "color .25s ease",
              minHeight: 15,
              marginTop: 26,
            }}
          >
            {done ? "ready — entering world" : `${MESSAGES[msg]}…`}
          </div>
        </div>

        {/* footer row */}
        <div
          className="absolute inset-x-0 bottom-0 flex items-end justify-between px-5 pb-4 sm:px-7 sm:pb-5"
          style={{ opacity: exiting ? 0 : 1, transition: "opacity .3s ease" }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: ".2em",
              textTransform: "uppercase",
              color: "var(--faint)",
            }}
          >
            karan-anchan.github.io
          </span>
          <span
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "clamp(20px, 3vw, 30px)",
              lineHeight: 1,
              color: done ? "var(--lime)" : "var(--fg2)",
              transition: "color .25s ease",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {pct}%
          </span>
        </div>

        {/* spectrum hairline — the actual progress bar */}
        <div className="absolute inset-x-0 bottom-0 h-[3px] bg-[var(--line)]">
          <div
            style={{
              height: "100%",
              width: `${pct}%`,
              background:
                "linear-gradient(90deg, var(--lime), var(--accent-4) 35%, var(--accent-2) 70%, var(--accent-5))",
              backgroundSize: "100vw 100%",
              transition: "width .15s linear",
            }}
          />
        </div>
      </div>
    </>
  );
}
