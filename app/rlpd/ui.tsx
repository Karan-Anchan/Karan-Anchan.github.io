"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";
import { Reveal } from "@/components/site/reveal";

/* ---------- section shell ---------- */

export function Sect({
  id,
  brow,
  title,
  children,
  className = "",
}: {
  id?: string;
  brow: string;
  title: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`rl-sec ${className}`}>
      <Reveal>
        <p className="rl-brow">{brow}</p>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="rl-h2">{title}</h2>
      </Reveal>
      {children}
    </section>
  );
}

/* ---------- animated number ---------- */

export function CountUp({
  to,
  decimals = 0,
  prefix = "",
  suffix = "",
}: {
  to: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const reduced = useReducedMotion();
  const [v, setV] = useState(reduced ? to : 0);
  useEffect(() => {
    if (!inView || reduced) return;
    const c = animate(0, to, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (x) => setV(x),
    });
    return () => c.stop();
  }, [inView, reduced, to]);
  return (
    <span ref={ref} className="rl-tnum">
      {prefix}
      {(reduced ? to : v).toFixed(decimals)}
      {suffix}
    </span>
  );
}

/* ---------- figure with lightbox ---------- */

export function Fig({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption: string;
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  return (
    <figure className="rl-fig">
      <button
        ref={triggerRef}
        type="button"
        className="rl-figbtn"
        onClick={() => setOpen(true)}
        aria-label={`Enlarge figure: ${caption}`}
      >
        <img src={src} alt={alt} loading="lazy" decoding="async" />
        <span className="rl-figzoom" aria-hidden="true">
          ⤢
        </span>
      </button>
      <figcaption>{caption}</figcaption>
      {open && (
        <div
          className="rl-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={caption}
          onClick={close}
        >
          <img src={src} alt={alt} onClick={(e) => e.stopPropagation()} />
          <p>{caption}</p>
          <button
            ref={closeRef}
            type="button"
            className="rl-lbclose"
            onClick={close}
            aria-label="Close enlarged figure"
          >
            ✕ close
          </button>
        </div>
      )}
    </figure>
  );
}

/* ---------- hero video: poster, offscreen pause, reduced-motion fallback ---------- */

export function HeroVideo({ poster }: { poster: string }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const tryPlay = () => el.play().catch(() => {});
    const io = new IntersectionObserver(
      ([e]) => (e.isIntersecting ? tryPlay() : el.pause()),
      { threshold: 0.05 },
    );
    io.observe(el);
    const onVis = () => (document.hidden ? el.pause() : tryPlay());
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  if (reduced) {
    return <img className="rl-vid" src={poster} alt="" aria-hidden="true" />;
  }
  return (
    <video
      ref={ref}
      className="rl-vid"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      poster={poster}
      aria-hidden="true"
    >
      <source src="/rlpd/hero.webm" type="video/webm" />
      <source src="/rlpd/hero.mp4" type="video/mp4" />
    </video>
  );
}
