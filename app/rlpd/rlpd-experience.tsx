"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import styles from "./rlpd.module.css";

const REPOSITORY = "https://github.com/Karan-Anchan/rlpd-offline-to-online-rl";
const PAPER = "https://arxiv.org/abs/2302.02948";
const EASE_OUT = [0.23, 1, 0.32, 1] as const;

const sections = [
  { id: "study", label: "Study" },
  { id: "method", label: "Method" },
  { id: "results", label: "Results" },
  { id: "humanoid", label: "Humanoid" },
  { id: "ablations", label: "Ablations" },
  { id: "coverage", label: "Coverage" },
  { id: "evidence", label: "Evidence" },
] as const;

const benchmarkResults = [
  {
    task: "Hopper-v5",
    short: "Hopper",
    rollout: "/rlpd/rollout-hopper.mp4",
    poster: "/rlpd/rollout-hopper.webp",
    rolloutScore: "97.1",
    note: "RLPD leads IQL by 22.4 points, with all three seeds complete.",
    values: [
      { method: "RLPD", value: 88.0, spread: 6.8, tone: "blue" },
      { method: "IQL", value: 65.6, spread: 29.2, tone: "amber" },
      { method: "SACfD", value: 41.9, spread: 11.3, tone: "coral" },
    ],
  },
  {
    task: "Walker2d-v5",
    short: "Walker2d",
    rollout: "/rlpd/rollout-walker.mp4",
    poster: "/rlpd/rollout-walker.webp",
    rolloutScore: "96.8",
    note: "The ±0.7 spread is the strongest consistency signal in the reproduction.",
    values: [
      { method: "RLPD", value: 89.6, spread: 0.7, tone: "blue" },
      { method: "IQL", value: 84.3, spread: 6.6, tone: "amber" },
      { method: "SACfD", value: 8.1, spread: 2.1, tone: "coral" },
    ],
  },
  {
    task: "HalfCheetah-v5",
    short: "HalfCheetah",
    rollout: "/rlpd/rollout-halfcheetah.mp4",
    poster: "/rlpd/rollout-halfcheetah.webp",
    rolloutScore: "103.1",
    note: "RLPD edges IQL by 2.6 points and stays inside the same 88–90 band.",
    values: [
      { method: "RLPD", value: 88.6, spread: 1.6, tone: "blue" },
      { method: "IQL", value: 86.0, spread: 7.8, tone: "amber" },
      { method: "SACfD", value: 18.5, spread: 3.4, tone: "coral" },
    ],
  },
] as const;

const methodCards = [
  {
    index: "01",
    label: "Replay mix",
    value: "50 / 50",
    title: "Symmetric sampling",
    copy: "Every update draws 128 online and 128 offline transitions. The dataset enters through the sampler; there is no separate RLPD pretraining phase.",
    code: "ratio = 0.5 · batch = 256",
    outcome: "Neither replay source can silently dominate an update.",
    visual: "mix",
  },
  {
    index: "02",
    label: "Value control",
    value: "LN",
    title: "LayerNorm critic",
    copy: "LayerNorm constrains extrapolation on actions the dataset never covered. Removing it on Humanoid drove mean Q to 8.9×10¹⁰ after only 15k steps.",
    code: "layernorm = true",
    outcome: "Unseen-action estimates remain numerically controlled.",
    visual: "bound",
  },
  {
    index: "03",
    label: "Update pressure",
    value: "10 × 20",
    title: "Ensemble + high UTD",
    copy: "Ten critics and twenty gradient updates per environment step exchange compute for sample efficiency and reduce dependence on any single critic.",
    code: "ensemble = 10 · utd = 20",
    outcome: "More compute is spent on every new online transition.",
    visual: "ensemble",
  },
] as const;

const coverageResults = [
  { task: "Hopper", coverage: 56.2, ratio: 1.79, dimensions: 11 },
  { task: "Walker2d", coverage: 69.2, ratio: 1.89, dimensions: 17 },
  { task: "HalfCheetah", coverage: 71.6, ratio: 1.45, dimensions: 17 },
  { task: "Humanoid", coverage: 6.6, ratio: 6.64, dimensions: 348 },
] as const;

const auditRows = [
  ["Locomotion · medium", "27 complete", "3 algorithms × 3 seeds × 3 tasks"],
  ["Locomotion · expert", "seed 0 complete", "seeds 1–2 stop at 57.5k and remain labeled"],
  ["Humanoid · IQL / RLPD", "3 seeds · 1M", "IQL starts after one million offline updates"],
  ["Humanoid · SACfD", "2 of 3 NaN", "divergent runs remain in the aggregate record"],
  ["Online-only", "3 seeds · 500k", "only ablation with matched three-seed coverage"],
  ["Expert Humanoid RLPD", "n = 1 · 1M", "single seed; excluded from aggregate claims"],
  ["State coverage", "4 tasks · 3 seeds", "nearest-neighbor audit; evidence, not sole-cause proof"],
] as const;

type FigureData = {
  src: string;
  alt: string;
  title: string;
  caption: string;
  width: number;
  height: number;
};

const figures = {
  returns: {
    src: "/rlpd/fig-returns.png",
    alt: "Normalized return curves for RLPD, IQL, and SACfD on Hopper, Walker2d, and HalfCheetah",
    title: "Locomotion reproduction",
    caption: "Minari-v5 medium data · three-seed mean ± standard deviation · 245k online steps",
    width: 2937,
    height: 886,
  },
  meanQ: {
    src: "/rlpd/fig-mean_q.png",
    alt: "Mean critic Q curves for RLPD, IQL, and SACfD on the three locomotion tasks",
    title: "Critic-scale diagnostics",
    caption: "The bounded RLPD critic versus unstable SACfD value estimates across locomotion",
    width: 2939,
    height: 886,
  },
  humanoid: {
    src: "/rlpd/fig-humanoid.png",
    alt: "Humanoid normalized return and critic mean Q for RLPD, IQL, and SACfD",
    title: "Humanoid-v5 extension",
    caption: "Three seeds · final evaluation at 995k · IQL includes 1M offline updates before online step 0",
    width: 2656,
    height: 939,
  },
  ablations: {
    src: "/rlpd/fig-ablations.png",
    alt: "Humanoid component, critic-scale, replay-ratio, and clipped double-Q ablations",
    title: "Prioritized Humanoid ablations",
    caption: "Matched 500k horizon · online-only is the only ablation independently replicated across three seeds",
    width: 4374,
    height: 1004,
  },
  ratio: {
    src: "/rlpd/fig-ratio-curve.png",
    alt: "Humanoid return across offline-to-online replay ratios",
    title: "Replay composition sweep",
    caption: "Solid: seed 1 at 90% online · dotted: seed 0 alternative · other ratios use seed 0",
    width: 2147,
    height: 1218,
  },
  coverage: {
    src: "/rlpd/offline-coverage.png",
    alt: "Offline-state coverage for Hopper, Walker2d, HalfCheetah, and Humanoid",
    title: "Cross-task state coverage",
    caption: "Offline-standardized nearest-neighbor coverage · three seeds per task",
    width: 3021,
    height: 1482,
  },
  quality: {
    src: "/rlpd/fig-quality.png",
    alt: "RLPD return across simple, medium, and expert locomotion datasets",
    title: "Dataset-quality sensitivity",
    caption: "Expert curves become single-seed after 57.5k steps and remain explicitly labeled",
    width: 2937,
    height: 886,
  },
  coverageDiagnostic: {
    src: "/rlpd/fig-offline-coverage.png",
    alt: "Offline-state coverage and normalized nearest-neighbor distance across four tasks",
    title: "Coverage diagnostic",
    caption: "Coverage and distance ratio shown together · observational evidence, not causal proof",
    width: 3021,
    height: 1482,
  },
} satisfies Record<string, FigureData>;

function cx(...values: Array<string | false | undefined>) {
  return values.filter(Boolean).join(" ");
}

function Arrow({ direction = "up-right" }: { direction?: "up-right" | "left" | "down" }) {
  const path = direction === "left"
    ? "M13 8H3M7 4 3 8l4 4"
    : direction === "down"
      ? "M8 3v10M4 9l4 4 4-4"
      : "M3 13 13 3M6 3h7v7";
  return <svg aria-hidden viewBox="0 0 16 16" className={styles.arrow}><path d={path} /></svg>;
}

function useActiveSection() {
  const [active, setActive] = useState<string>(sections[0].id);

  useEffect(() => {
    const nodes = sections
      .map((section) => document.getElementById(section.id))
      .filter((node): node is HTMLElement => Boolean(node));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-22% 0px -62% 0px", threshold: [0, 0.1, 0.35] },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return active;
}

function Reveal({ children, className }: { children: React.ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}

function SectionHeader({
  index,
  eyebrow,
  title,
  accent,
  copy,
}: {
  index: string;
  eyebrow: string;
  title: string;
  accent?: string;
  copy: string;
}) {
  return (
    <header className={styles.sectionHeader}>
      <div>
        <span><b>{index}</b>{eyebrow}</span>
        <h2>{title}{accent && <em>{accent}</em>}</h2>
      </div>
      <p>{copy}</p>
    </header>
  );
}

function EvidenceFigure({ figure, compact = false }: { figure: FigureData; compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      trigger?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        ref={triggerRef}
        className={cx(styles.figureCard, compact && styles.figureCompact)}
        onClick={() => setOpen(true)}
        aria-label={`Open full-resolution figure: ${figure.title}`}
      >
        <span className={styles.figureViewport} style={{ aspectRatio: `${figure.width} / ${figure.height}` }}>
          <Image src={figure.src} alt={figure.alt} width={figure.width} height={figure.height} sizes="(max-width: 760px) 94vw, 1200px" />
        </span>
        <span className={styles.figureCaption}>
          <span><b>{figure.title}</b><small>{figure.caption}</small></span>
          <span>Inspect <Arrow /></span>
        </span>
      </button>
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              className={styles.lightbox}
              role="presentation"
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduced ? undefined : { opacity: 0 }}
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) setOpen(false);
              }}
            >
              <motion.div
                className={styles.lightboxDialog}
                role="dialog"
                aria-modal="true"
                aria-label={figure.title}
                initial={reduced ? false : { opacity: 0, y: 18, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reduced ? undefined : { opacity: 0, y: 8, scale: 0.99 }}
                transition={{ duration: 0.24, ease: EASE_OUT }}
              >
                <header>
                  <div><span>Full-resolution evidence</span><strong>{figure.title}</strong></div>
                  <button ref={closeRef} type="button" onClick={() => setOpen(false)}>Close ×</button>
                </header>
                <div className={styles.lightboxMedia}>
                  <Image src={figure.src} alt={figure.alt} width={figure.width} height={figure.height} sizes="96vw" />
                </div>
                <p>{figure.caption}</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}

function BenchmarkExplorer() {
  const [selected, setSelected] = useState(0);
  const result = benchmarkResults[selected];
  const reduced = useReducedMotion();

  return (
    <div className={styles.benchmarkExplorer}>
      <div className={styles.benchmarkScores}>
        <div className={styles.taskTabs} role="tablist" aria-label="Benchmark environment">
          {benchmarkResults.map((task, index) => (
            <button
              type="button"
              role="tab"
              aria-selected={selected === index}
              key={task.task}
              onClick={() => setSelected(index)}
            >
              <span>0{index + 1}</span>{task.short}<strong>{task.values[0].value.toFixed(1)}</strong>
            </button>
          ))}
        </div>
        <div className={styles.scorePanel} role="tabpanel" aria-label={`${result.task} scores`}>
          <header><strong>{result.task}</strong><span>normalized return · mean ± seed std</span></header>
          <div className={styles.scoreScale}><span>0</span><span>50</span><span>100 · expert</span></div>
          {result.values.map((item, index) => (
            <div className={styles.scoreRow} key={item.method}>
              <span>{item.method}</span>
              <div><motion.i
                className={styles[item.tone]}
                initial={reduced ? false : { scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5, delay: index * 0.07, ease: EASE_OUT }}
                style={{ width: `${item.value}%` }}
              /></div>
              <strong>{item.value.toFixed(1)} <small>± {item.spread.toFixed(1)}</small></strong>
            </div>
          ))}
          <p>{result.note}</p>
        </div>
      </div>
      <figure className={styles.rolloutCard}>
        <video
          key={result.task}
          src={result.rollout}
          poster={result.poster}
          aria-label={`${result.task} RLPD policy rollout`}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
        <span>policy replay · {result.task.toLowerCase()}</span>
        <figcaption><strong>{result.rolloutScore}</strong><small>best-seed last-five normalized return</small></figcaption>
      </figure>
    </div>
  );
}

export function RlpdExperience() {
  const activeSection = useActiveSection();
  const reduced = useReducedMotion();

  useEffect(() => {
    const activeLink = document.querySelector<HTMLAnchorElement>(
      `nav[aria-label="Project sections"] a[href="#${activeSection}"]`,
    );
    activeLink?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "nearest", inline: "center" });
  }, [activeSection, reduced]);

  return (
    <main className={styles.app}>
      <header className={styles.topbar}>
        <Link className={styles.brand} href="/" aria-label="Back to Karan Anchan’s portfolio">
          <span>R</span><strong>RLPD / FIELD REPORT</strong>
        </Link>
        <nav className={styles.sectionNav} aria-label="Project sections">
          {sections.map((section) => (
            <a key={section.id} href={`#${section.id}`} aria-current={activeSection === section.id ? "location" : undefined}>
              {section.label}
            </a>
          ))}
        </nav>
        <div className={styles.topActions}>
          <Link href="/" className={styles.portfolioLink}><Arrow direction="left" /><span>Portfolio</span></Link>
          <a href={REPOSITORY} target="_blank" rel="noreferrer"><span>Repository</span><Arrow /></a>
        </div>
      </header>

      <section className={styles.hero} aria-labelledby="hero-title">
        <div className={styles.heroGrid}>
          <motion.div
            className={styles.heroCopy}
            initial={reduced ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: EASE_OUT }}
          >
            <span className={styles.kicker}><b>2026</b> reproduction study · offline-to-online RL</span>
            <h1 id="hero-title">We reproduced RLPD.<em>Then the offline data became the constraint.</em></h1>
            <p>
              A three-person PyTorch reproduction across Minari-v5 locomotion, extended to Humanoid-v5 and followed by a replay-composition ablation the original paper did not report.
            </p>
            <div className={styles.heroActions}>
              <a href="#results" className={styles.primaryAction}><span><small>Start with the evidence</small>Explore the results</span><Arrow direction="down" /></a>
              <a href={REPOSITORY} target="_blank" rel="noreferrer">View source <Arrow /></a>
            </div>
            <div className={styles.teamLine}><span>Research team</span><strong>Karan Anchan</strong><strong>Pranav Prakash Menon</strong><strong>Kandi Sridhar</strong></div>
          </motion.div>

          <motion.figure
            className={styles.heroVisual}
            initial={reduced ? false : { opacity: 0, scale: 0.975 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.08, ease: EASE_OUT }}
          >
            <Image src="/rlpd/hero-robot-v3.webp" alt="Humanoid research agent in a field of policy trajectories" fill priority sizes="(max-width: 800px) 94vw, 48vw" />
            <span className={styles.visualLabel}>Humanoid-v5 · final eval 995k</span>
            <figcaption><span>Unexpected result</span><strong>+21.9</strong><small>online-only vs 50/50 · matched 500k</small></figcaption>
          </motion.figure>
        </div>
        <div className={styles.heroMetrics}>
          <div><span>Primary matrix</span><strong>27 complete runs</strong></div>
          <div><span>Core reporting</span><strong>3 seeds</strong></div>
          <div><span>Training budget</span><strong>245k → 1M</strong></div>
          <div><span>Cross-task audit</span><strong>4 environments</strong></div>
        </div>
      </section>

      <section id="study" data-section className={styles.section}>
        <Reveal>
          <SectionHeader
            index="01"
            eyebrow="study / the question"
            title="Can offline data accelerate learning"
            accent="without anchoring the policy?"
            copy="We first tested whether the paper’s locomotion result survived an independent PyTorch implementation. Then we moved to a 348-dimensional Humanoid task where dataset-policy mismatch is much harder to ignore."
          />
          <div className={styles.studyGrid}>
            <article className={styles.questionCard}>
              <span>Research question</span>
              <h3>When does prior experience help—and when does it become a constraint?</h3>
              <p>RLPD mixes a fixed offline dataset with newly collected online transitions. The central promise is faster online improvement without an offline pretraining stage.</p>
              <div><span>Paper claim</span><strong>Sample-efficient adaptation</strong></div>
              <div><span>Our extension</span><strong>Humanoid-v5 + replay-ratio sweep</strong></div>
            </article>
            <div className={styles.protocolGrid}>
              {[
                ["01", "Reproduce", "RLPD, IQL, and SACfD on three Minari-v5 medium datasets."],
                ["02", "Stress-test", "Extend the comparison from 11–17D locomotion states to 348D Humanoid."],
                ["03", "Ablate", "Hold architecture and horizon fixed while changing replay composition."],
                ["04", "Audit", "Measure whether online states remain inside the offline dataset’s support."],
              ].map(([index, title, copy]) => (
                <article key={index}><span>{index}</span><h3>{title}</h3><p>{copy}</p></article>
              ))}
            </div>
          </div>
          <div className={styles.studyStrip}>
            <span>PyTorch 2.11</span><i />
            <span>Gymnasium MuJoCo v5</span><i />
            <span>Minari datasets</span><i />
            <span>Weights & Biases</span><i />
            <span>RTX 5070 · 12 GB</span>
          </div>
        </Reveal>
      </section>

      <section id="method" data-section className={cx(styles.section, styles.sectionTint)}>
        <Reveal>
          <SectionHeader
            index="02"
            eyebrow="method / implementation guardrails"
            title="Three choices define"
            accent="the method we tested."
            copy="These are not incidental hyperparameters. Together they determine how offline evidence enters the learner, how value estimates are controlled, and how aggressively each online transition is reused."
          />
          <div className={styles.methodFlow} aria-label="Offline-to-online training loop">
            {[
              ["01", "Offline buffer", "fixed demonstrations"],
              ["02", "Mixed update", "128 offline + 128 online"],
              ["03", "Policy action", "new environment data"],
              ["04", "Replay refresh", "online support expands"],
            ].map(([index, title, detail]) => <div key={index}><span>{index}</span><strong>{title}</strong><small>{detail}</small></div>)}
          </div>
          <div className={styles.methodCards}>
            {methodCards.map((card, index) => (
              <motion.article
                key={card.index}
                initial={reduced ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-70px" }}
                transition={{ duration: 0.45, delay: index * 0.07, ease: EASE_OUT }}
              >
                <header><span>{card.index} / {card.label}</span><strong>{card.value}</strong></header>
                <div className={cx(styles.methodVisual, styles[card.visual])} aria-hidden>
                  {card.visual === "mix" && <><i /><i /></>}
                  {card.visual === "bound" && <><i /><i /><i /></>}
                  {card.visual === "ensemble" && Array.from({ length: 10 }).map((_, item) => <i key={item} />)}
                </div>
                <h3>{card.title}</h3><p>{card.copy}</p><code>{card.code}</code>
                <footer><span>Design role</span><strong>{card.outcome}</strong></footer>
              </motion.article>
            ))}
          </div>
        </Reveal>
      </section>

      <section id="results" data-section className={styles.section}>
        <Reveal>
          <SectionHeader
            index="03"
            eyebrow="locomotion / reproduction"
            title="The core result reproduced."
            accent="RLPD finished at 88–90."
            copy="Across Hopper, Walker2d, and HalfCheetah, RLPD reached a narrow final-return band and outperformed SACfD on every task. The interactive panel pairs aggregate scores with representative behavior."
          />
          <EvidenceFigure figure={figures.returns} />
          <BenchmarkExplorer />
          <div className={styles.interpretationBand}>
            <span>Reading the reproduction</span>
            <p><strong>Consistency matters more than one peak.</strong> RLPD’s three final means sit within 1.6 points of each other; the baselines either vary widely by seed or fail to approach the same return.</p>
          </div>
          <div className={styles.failureGrid}>
            <div>
              <span className={styles.kicker}><b>04</b> failure analysis / critic scale</span>
              <h3>A high return is not the only stability signal.</h3>
              <p>SACfD’s Walker2d mean Q rises from 0.1 at the first valid log to 85,300 at 245k. RLPD ends at 545. The 156× endpoint gap makes the value failure visible before relying on return alone.</p>
              <dl>
                <div><dt>SACfD endpoint</dt><dd>85,300</dd></div>
                <div><dt>RLPD endpoint</dt><dd>545</dd></div>
                <div><dt>Scale gap</dt><dd>156×</dd></div>
              </dl>
            </div>
            <EvidenceFigure figure={figures.meanQ} compact />
          </div>
        </Reveal>
      </section>

      <section id="humanoid" data-section className={cx(styles.section, styles.sectionTint)}>
        <Reveal>
          <SectionHeader
            index="04"
            eyebrow="extension / Humanoid-v5"
            title="A harder body exposed"
            accent="a different advantage."
            copy="Humanoid expands the observation space to 348 dimensions and the action space to 17 actuators. IQL achieved the best aggregate return; RLPD remained numerically bounded but learned slowly; two SACfD seeds diverged."
          />
          <div className={styles.humanoidGrid}>
            <figure className={styles.humanoidVideo}>
              <video src="/rlpd/rollout-humanoid.mp4" poster="/rlpd/rollout-humanoid.webp" aria-label="Best individual IQL Humanoid-v5 rollout" autoPlay muted loop playsInline preload="metadata" />
              <span>best individual behavior · IQL seed 2</span>
              <figcaption><strong>87.8</strong><small>last-five normalized return · aggregate remains 70.1 ± 16.2</small></figcaption>
            </figure>
            <div className={styles.humanoidStats}>
              {[
                ["IQL · 3 seeds", "70.1", "± 16.2", "best aggregate", "1M offline + 1M online"],
                ["RLPD · 3 seeds", "13.0", "± 13.8", "bounded critic", "no pretrain + 1M online"],
                ["SACfD · 3 seeds", "2 / 3", "NaN", "failure retained", "divergent runs not retried"],
              ].map(([label, value, spread, status, context]) => (
                <article key={label}><header><span>{label}</span><em>{status}</em></header><strong>{value} <small>{spread}</small></strong><footer><span>training context</span><b>{context}</b></footer></article>
              ))}
            </div>
          </div>
          <EvidenceFigure figure={figures.humanoid} />
          <p className={styles.caveat}>The looping video is a best-seed behavior sample. The three-seed aggregate—not the cleanest rollout—is the reported result.</p>
        </Reveal>
      </section>

      <section id="ablations" data-section className={styles.section}>
        <Reveal>
          <SectionHeader
            index="05"
            eyebrow="matched-horizon ablations / 500k"
            title="Removing offline samples"
            accent="improved the policy."
            copy="The critic architecture, ensemble, LayerNorm, update ratio, and 500k horizon stayed fixed. Only replay composition changed. Online-only is the decisive three-seed comparison; intermediate ratios remain single-seed diagnostics."
          />
          <div className={styles.ablationHero}>
            <div className={styles.ablationCompare}>
              {[
                ["RLPD · 50/50", 6.0, "± 2.0", "128 offline + 128 online per update", "mix"],
                ["Online-only", 28.0, "± 15.2", "256 online samples per update", "online"],
              ].map(([label, value, spread, note, tone]) => (
                <div key={label as string}>
                  <header><span>{label}</span><strong>{Number(value).toFixed(1)} <small>{spread}</small></strong></header>
                  <div><motion.i className={styles[tone as "mix" | "online"]} initial={reduced ? false : { scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.65, ease: EASE_OUT }} style={{ width: `${(Number(value) / 30) * 100}%` }} /></div>
                  <p>{note}</p>
                </div>
              ))}
            </div>
            <aside><span>Δ matched horizon</span><strong>+21.9</strong><small>normalized points</small><p>One controlled change removed the prior data from each online update.</p></aside>
          </div>
          <div className={styles.ablationFindings}>
            {[
              ["LayerNorm", "8.9×10¹⁰", "Removing critic normalization diverged by 15k steps."],
              ["Offline-only", "−0.6", "No online transitions meant no useful Humanoid adaptation."],
              ["RLPD mix", "7.2", "The seed-0 midpoint at a 50% online replay fraction."],
              ["Online-only", "23.1", "The strongest seed-1 point in the ratio sweep."],
            ].map(([label, value, copy]) => <article key={label}><span>{label}</span><strong>{value}</strong><p>{copy}</p></article>)}
          </div>
          <div className={styles.figurePair}>
            <EvidenceFigure figure={figures.ablations} compact />
            <EvidenceFigure figure={figures.ratio} compact />
          </div>
          <div className={styles.caveatBox}><span>Reporting boundary</span><p>Online-only is independently replicated across three seeds: 23.1, 45.0, and 15.8 → 28.0 ± 15.2. The connected replay-ratio curve mixes seeds at 90% online and is descriptive, not a uniform dose-response estimate.</p></div>
        </Reveal>
      </section>

      <section id="coverage" data-section className={cx(styles.section, styles.sectionTint)}>
        <Reveal>
          <SectionHeader
            index="06"
            eyebrow="distribution audit / nearest neighbors"
            title="Humanoid visited states"
            accent="the offline data scarcely covered."
            copy="We standardized states using the offline dataset, set a coverage radius from offline-to-offline nearest-neighbor distances, and measured how often online states fell inside it."
          />
          <div className={styles.coverageGrid}>
            <div className={styles.coverageChart} role="img" aria-label="Offline-state coverage by task">
              <header><span>online states inside offline 95th-percentile NN radius</span><strong>coverage · higher is closer support</strong></header>
              <div className={styles.coverageScale}><span>0</span><span>40</span><span>80%</span></div>
              {coverageResults.map((row, index) => (
                <div className={cx(styles.coverageRow, row.task === "Humanoid" && styles.coverageOutlier)} key={row.task}>
                  <div><span>{row.task}<small>{row.dimensions}D state</small></span><strong>{row.coverage.toFixed(1)}%</strong></div>
                  <div><motion.i initial={reduced ? false : { scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.06, ease: EASE_OUT }} style={{ width: `${(row.coverage / 80) * 100}%` }} /></div>
                  <footer><span>distance ratio R</span><strong>{row.ratio.toFixed(2)}×</strong></footer>
                </div>
              ))}
            </div>
            <aside className={styles.coverageReading}>
              <span>Cross-task outlier</span><strong>6.6%</strong><small>Humanoid covered · R = 6.64×</small>
              <p>The online Humanoid policy moves through a region far outside the medium dataset’s typical neighborhood. That is consistent with the online-only advantage.</p>
              <code>R = median d(online, offline) / median d(offline, offline)</code>
              <p><b>Interpret carefully:</b> the audit supports distribution mismatch as an explanation; it does not prove mismatch is the only cause.</p>
            </aside>
          </div>
          <EvidenceFigure figure={figures.coverage} />
        </Reveal>
      </section>

      <section id="evidence" data-section className={styles.section}>
        <Reveal>
          <SectionHeader
            index="07"
            eyebrow="evidence / provenance"
            title="Every result carries"
            accent="its sample count."
            copy="Incomplete experiments remain visible, best-seed videos never replace aggregate results, and the supporting figures can be inspected at full resolution."
          />
          <div className={styles.auditTable} role="table" aria-label="Experiment coverage and reporting status">
            <div className={styles.auditHead} role="row"><span>#</span><span>Experiment group</span><span>Coverage</span><span>Reporting note</span></div>
            {auditRows.map(([label, count, note], index) => (
              <div className={styles.auditRow} role="row" key={label}><i>{String(index + 1).padStart(2, "0")}</i><span>{label}</span><strong>{count}</strong><em>{note}</em></div>
            ))}
          </div>
          <div className={styles.lessonGrid}>
            {[
              ["01", "Variance is part of the result.", "Three seeds expose instability that a polished single rollout conceals."],
              ["02", "Implementation shapes the claim.", "LayerNorm, ensemble size, UTD, and pretraining budget define the comparison."],
              ["03", "Ablations can change the question.", "Online-only shifts attention from architecture to dataset compatibility."],
              ["04", "Coverage qualifies transfer.", "Locomotion coverage is 56–72%; Humanoid is 6.6%. Evidence, not proof."],
            ].map(([index, title, copy]) => <article key={index}><span>{index}</span><h3>{title}</h3><p>{copy}</p></article>)}
          </div>
          <div className={styles.additionalEvidence}>
            <div><span>Additional figures</span><h3>Inspect the evidence beyond the headline.</h3></div>
            <EvidenceFigure figure={figures.quality} compact />
            <EvidenceFigure figure={figures.coverageDiagnostic} compact />
          </div>
          <footer className={styles.projectFooter}>
            <div><span>Research team</span><strong>Karan Anchan · Pranav Prakash Menon · Kandi Sridhar</strong><small>Reproduction study · 2026</small></div>
            <div><a href={REPOSITORY} target="_blank" rel="noreferrer">Repository <Arrow /></a><a href={PAPER} target="_blank" rel="noreferrer">Original paper <Arrow /></a><Link href="/">Main portfolio <Arrow /></Link></div>
          </footer>
        </Reveal>
      </section>
    </main>
  );
}
