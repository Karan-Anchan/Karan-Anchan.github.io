"use client";

import { Link003 } from "@/components/ui/skiper-ui/skiper40";
import ParticleButton from "@/components/kokonutui/particle-button";
import { Reveal } from "@/components/site/reveal";

export function Contact() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden border-t border-white/5"
    >
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-[radial-gradient(ellipse_at_50%_100%,rgba(199,242,132,0.12),transparent_65%)]" />
      <div className="relative mx-auto flex min-h-[70svh] max-w-6xl flex-col justify-between px-5 pb-8 pt-24">
        <div>
          <Reveal>
            <div className="mb-5 font-mono text-[0.68rem] uppercase tracking-[0.24em] text-[var(--lime)]">
              §06 · Correspondence — open
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <a
              href="mailto:kar.anchan02@gmail.com"
              className="font-serif-accent break-all text-4xl italic tracking-tight text-zinc-50 transition-colors hover:text-[var(--lime)] sm:text-6xl lg:text-7xl"
            >
              kar.anchan02@gmail.com
            </a>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-xl text-sm font-light leading-relaxed text-zinc-400">
              Research collaborations, working-student roles, and interesting
              problems in RL, efficient deep learning, or multimodal systems.
              Based in Freiburg — happy to talk anywhere in CET ± a lot.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <ParticleButton
                className="rounded-full bg-[var(--lime)] px-6 py-2.5 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-zinc-950 hover:bg-[var(--lime)]/90"
                onClick={() => {
                  window.location.href = "mailto:kar.anchan02@gmail.com";
                }}
              >
                Say hello
              </ParticleButton>
              <Link003
                href="https://github.com/Karan-Anchan"
                className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-zinc-300"
              >
                GitHub
              </Link003>
              <Link003
                href="https://linkedin.com/in/karan-anchan"
                className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-zinc-300"
              >
                LinkedIn
              </Link003>
              <Link003
                href="/CVKaranAnchan.pdf"
                className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-zinc-300"
              >
                CV · PDF
              </Link003>
            </div>
          </Reveal>
        </div>

        <footer className="mt-20 flex flex-wrap items-center justify-between gap-3 border-t border-white/5 pt-6 font-mono text-[0.58rem] uppercase tracking-[0.16em] text-zinc-600">
          <span>© 2026 Karan Anchan</span>
          <span>Freiburg im Breisgau · DE</span>
          <a href="#top" className="transition-colors hover:text-[var(--lime)]">
            Back to top ↑
          </a>
        </footer>
      </div>
    </section>
  );
}
