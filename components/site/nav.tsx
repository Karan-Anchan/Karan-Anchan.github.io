"use client";

import { Link001 } from "@/components/ui/skiper-ui/skiper40";

const links = [
  { href: "#work", label: "Work" },
  { href: "#roadmap", label: "Roadmap" },
  { href: "#record", label: "Record" },
  { href: "#contact", label: "Contact" },
];

export function SiteNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-zinc-950/70 backdrop-blur-md">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
        <a
          href="#top"
          className="font-serif-accent text-lg italic tracking-tight"
        >
          K<span className="text-[var(--lime)]">·</span>A
        </a>
        <div className="hidden items-center gap-7 sm:flex">
          {links.map((l) => (
            <Link001
              key={l.href}
              href={l.href}
              className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-zinc-400 hover:text-zinc-100"
            >
              {l.label}
            </Link001>
          ))}
        </div>
        <a
          href="mailto:kar.anchan02@gmail.com"
          className="rounded-full border border-[var(--lime)]/40 px-4 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-[var(--lime)] transition-colors hover:bg-[var(--lime)] hover:text-zinc-950"
        >
          Say hello
        </a>
      </nav>
    </header>
  );
}
