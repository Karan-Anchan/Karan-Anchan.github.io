"use client";

import { Link001 } from "@/components/ui/skiper-ui/skiper40";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { SoundToggle } from "@/components/site/sound-fx";

const links = [
  { href: "#work", label: "Work" },
  { href: "#roadmap", label: "Roadmap" },
  { href: "#record", label: "Record" },
  { href: "#contact", label: "Contact" },
];

export function SiteNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--line)] glass backdrop-blur-md">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
        <a
          href="#top"
          className="font-serif-accent text-lg italic tracking-tight"
        >
          K<span className="text-[var(--accent-5)]">·</span>A
        </a>
        <div className="hidden items-center gap-7 sm:flex">
          {links.map((l) => (
            <Link001
              key={l.href}
              href={l.href}
              className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-[var(--dim)] hover:text-[var(--fg)]"
            >
              {l.label}
            </Link001>
          ))}
        </div>
        <div className="flex items-center gap-2.5">
        <SoundToggle className="hidden md:flex" />
        <ThemeToggle />
        <a
          href="mailto:kar.anchan02@gmail.com"
          className="rounded-full border border-[var(--accent-2)]/40 px-4 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[var(--accent-2)] transition-colors hover:bg-[var(--accent-2)] hover:text-[var(--on-accent)]"
        >
          Say hello
        </a>
        </div>
      </nav>
    </header>
  );
}
