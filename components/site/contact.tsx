"use client";

import { Link003 } from "@/components/ui/skiper-ui/skiper40";
import ParticleButton from "@/components/kokonutui/particle-button";
import { Reveal } from "@/components/site/reveal";

export function Contact() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden border-t border-[var(--line)]"
    >
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-[radial-gradient(ellipse_at_50%_100%,rgba(199,242,132,0.12),transparent_65%)]" />

      {/* giant marquee CTA — the whole strip is a mailto */}
      <a
        href="mailto:kar.anchan02@gmail.com"
        className="brand-marquee group block overflow-hidden border-b border-[var(--line)] py-6"
        aria-label="Email Karan"
      >
        <div className="brand-marquee-track flex w-max items-center gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <span
              key={i}
              className="flex items-center gap-8 whitespace-nowrap text-[10vw] font-black uppercase leading-none tracking-tighter"
            >
              <span className="text-outline transition-colors duration-300 group-hover:text-[var(--lime)]">
                let&apos;s talk
              </span>
              <span className="text-[0.35em] text-[var(--lime)]">✳</span>
            </span>
          ))}
        </div>
      </a>

      <div className="relative mx-auto flex min-h-[52svh] max-w-6xl flex-col justify-between px-5 pb-8 pt-16">
        <div>
          <Reveal>
            <div className="mb-4 font-mono text-[0.68rem] uppercase tracking-[0.24em] text-[var(--lime)]">
              ckpt 06/06 · training complete — deploy me somewhere interesting
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <a
              href="mailto:kar.anchan02@gmail.com"
              className="font-serif-accent break-all text-3xl italic tracking-tight text-[var(--fg)] transition-colors hover:text-[var(--lime)] sm:text-5xl"
            >
              kar.anchan02@gmail.com
            </a>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-xl text-sm font-light leading-relaxed text-[var(--dim)]">
              Research collaborations, working-student roles, and problems that
              are interesting at 2am. Based in Freiburg — I usually reply
              before the next training run finishes.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <ParticleButton
                className="rounded-full bg-[var(--lime)] px-6 py-2.5 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-[var(--on-accent)] hover:bg-[var(--lime)]/90"
                onClick={() => {
                  window.location.href = "mailto:kar.anchan02@gmail.com";
                }}
              >
                Say hello
              </ParticleButton>
              <Link003
                href="https://github.com/Karan-Anchan"
                className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-[var(--fg2)]"
              >
                GitHub
              </Link003>
              <Link003
                href="https://linkedin.com/in/karan-anchan"
                className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-[var(--fg2)]"
              >
                LinkedIn
              </Link003>
              <Link003
                href="/CVKaranAnchan.pdf"
                className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-[var(--fg2)]"
              >
                CV · PDF
              </Link003>
            </div>
          </Reveal>
        </div>

        <footer className="mt-16 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] pt-6 font-mono text-[0.58rem] lowercase tracking-[0.16em] text-[var(--faint)]">
          <span>© 2026 karan anchan</span>
          <span>handcrafted at 2am between training runs — no template, some libraries</span>
          <a href="#top" className="transition-colors hover:text-[var(--lime)]">
            back to epoch 0 ↑
          </a>
        </footer>
      </div>
    </section>
  );
}
