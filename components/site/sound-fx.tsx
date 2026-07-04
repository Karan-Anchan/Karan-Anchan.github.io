"use client";

import { useEffect, useState } from "react";
import { sound } from "@/lib/sound";

/* Toggle pill — sits next to the theme switch. */
export function SoundToggle({ className = "" }: { className?: string }) {
  const [on, setOn] = useState<boolean | null>(null);

  useEffect(() => {
    sound.sync();
    setOn(sound.isEnabled());
  }, []);

  const flip = () => {
    const next = !sound.isEnabled();
    sound.setEnabled(next);
    setOn(next);
    if (next) {
      sound.unlock();
      sound.chime(true);
    }
  };

  return (
    <button
      type="button"
      onClick={flip}
      aria-label="Toggle interface sounds"
      className={`group flex items-center gap-2 rounded-full border border-[var(--line)] px-3.5 py-1.5 font-mono text-[0.62rem] lowercase tracking-[0.14em] text-[var(--dim)] transition-colors hover:border-[var(--accent-4)]/60 hover:text-[var(--fg)] ${className}`}
    >
      <span
        className={`inline-block h-2 w-2 rounded-full transition-all duration-500 ${
          on
            ? "bg-[var(--accent-4)] shadow-[0_0_8px_var(--accent-4)]"
            : "bg-[var(--faint)]"
        }`}
      />
      snd: <span className="text-[var(--fg)]">{on === null ? "…" : on ? "on" : "off"}</span>
    </button>
  );
}

/* Invisible wiring: unlock on first gesture, tactile tick on hovers. */
export function SoundFx() {
  useEffect(() => {
    sound.sync();

    const unlock = () => {
      sound.unlock();
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
    window.addEventListener("pointerdown", unlock, { passive: true });
    window.addEventListener("keydown", unlock);

    let last = 0;
    const over = (e: Event) => {
      const t = e.target as Element | null;
      if (!t?.closest?.("a, button")) return;
      const now = performance.now();
      if (now - last < 90) return;
      last = now;
      sound.tick();
    };
    document.addEventListener("pointerover", over, { passive: true });

    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
      document.removeEventListener("pointerover", over);
    };
  }, []);

  return null;
}
