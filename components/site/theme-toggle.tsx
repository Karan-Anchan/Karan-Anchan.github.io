"use client";

import { useEffect, useState } from "react";
import { sound } from "@/lib/sound";

/* lab (dark, 2am training) ↔ paper (light, the published write-up) */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const [dark, setDark] = useState<boolean | null>(null);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const flip = () => {
    const next = !document.documentElement.classList.contains("dark");
    const apply = () => {
      document.documentElement.classList.toggle("dark", next);
      try {
        localStorage.setItem("theme", next ? "dark" : "light");
      } catch {}
      setDark(next);
      sound.chime(!next); // paper = bright, lab = dark
    };
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => void;
    };
    if (doc.startViewTransition) {
      doc.startViewTransition(apply);
    } else {
      document.documentElement.classList.add("theme-anim");
      apply();
      setTimeout(
        () => document.documentElement.classList.remove("theme-anim"),
        700,
      );
    }
  };

  return (
    <button
      type="button"
      onClick={flip}
      aria-label="Toggle light / dark theme"
      className={`group flex items-center gap-2 rounded-full border border-[var(--line)] px-3.5 py-1.5 font-mono text-[0.62rem] lowercase tracking-[0.14em] text-[var(--dim)] transition-colors hover:border-[var(--accent-3)]/60 hover:text-[var(--fg)] ${className}`}
    >
      <span className="relative inline-block h-2 w-2">
        <span
          className={`absolute inset-0 rounded-full transition-all duration-500 ${
            dark === false
              ? "bg-[var(--accent-3)] shadow-[0_0_8px_var(--accent-3)]"
              : "bg-[var(--lime)] shadow-[0_0_8px_var(--lime)]"
          }`}
        />
      </span>
      mode:{" "}
      <span className="text-[var(--fg)]">
        {dark === null ? "…" : dark ? "lab" : "paper"}
      </span>
    </button>
  );
}
