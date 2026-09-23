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
  { id: "method", label: "Setup" },
  { id: "results", label: "Results" },
  { id: "humanoid", label: "Humanoid" },
  { id: "ablations", label: "Replay ablation" },
  { id: "coverage", label: "Coverage" },
  { id: "evidence", label: "Limitations" },
] as const;

const benchmarkResults = [
  {
    task: "Hopper-v5",
    short: "Hopper",
    rollout: "/rlpd/rollout-hopper.mp4",
    poster: "/rlpd/rollout-hopper.webp",
    note: "At 245k steps, the RLPD mean exceeds the IQL mean by 22.4 normalized-return points (n = 3 seeds per method).",
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
    note: "RLPD attains 89.6 ± 0.7 across three seeds, the lowest observed between-seed dispersion in the locomotion evaluation.",
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
    note: "The RLPD mean exceeds the IQL mean by 2.6 points; the corresponding standard deviations are 1.6 and 7.8 (n = 3).",
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
    title: "Equal-source replay sampling",
    copy: "Each update samples 128 online and 128 offline transitions. Offline data therefore enter through replay composition rather than a separate RLPD pretraining phase.",
    code: "ratio = 0.5 · batch = 256",
    outcome: "Fixes the per-update contribution of each replay source.",
    visual: "mix",
  },
  {
    index: "02",
    label: "Value control",
    value: "LN",
    title: "Layer-normalized critic",
    copy: "Layer normalization was included to mitigate critic-scale instability under distribution shift. In the Humanoid ablation without it, mean Q reached 8.9×10¹⁰ by 15k steps.",
    code: "layernorm = true",
    outcome: "Provides an explicit control on critic activation scale.",
    visual: "bound",
  },
  {
    index: "03",
    label: "Update pressure",
    value: "10 × 20",
    title: "Critic ensemble and high UTD",
    copy: "The implementation uses ten critics and twenty gradient updates per environment step, increasing optimization effort per newly collected transition.",
    code: "ensemble = 10 · utd = 20",
    outcome: "Defines the optimization budget and ensemble estimator.",
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
  ["Locomotion · medium", "27 completed runs", "3 algorithms × 3 tasks × 3 random seeds"],
  ["Locomotion · expert", "seed 0 completed", "seeds 1–2 terminate at 57.5k and are reported as incomplete"],
  ["Humanoid · IQL / RLPD", "n = 3 · 1M steps", "IQL additionally receives one million offline updates before online training"],
  ["Humanoid · SACfD", "2 of 3 divergent", "non-finite seeds stop at 430k and 550k; later curve values reflect the surviving seed"],
  ["Replay ablation", "n = 3 per condition", "online-only and 50/50 replay compared at the same 495k evaluation"],
  ["Expert Humanoid RLPD", "n = 1 · 1M steps", "single-seed result; excluded from aggregate conclusions"],
  ["State-distribution analysis", "4 tasks · n = 3", "PCA is descriptive; full-space nearest-neighbor metrics are primary"],
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
    caption: "Comparative critic-value trajectories for RLPD, IQL, and SACfD across locomotion tasks",
    width: 2939,
    height: 886,
  },
  humanoid: {
    src: "/rlpd/fig-humanoid.png",
    alt: "Humanoid normalized return and critic mean Q for RLPD, IQL, and SACfD",
    title: "Humanoid-v5 extension",
    caption: "Final scheduled evaluation at 995k · IQL includes 1M offline updates before online step 0 · two SACfD seeds diverged early",
    width: 2656,
    height: 939,
  },
  ablations: {
    src: "/rlpd/fig-ablations.png",
    alt: "Humanoid component, critic-scale, replay-ratio, and clipped double-Q ablations",
    title: "Humanoid-v5 ablation results",
    caption: "Matched 500k-step horizon · the 50/50 and online-only conditions each include three independent seeds",
    width: 4374,
    height: 1004,
  },
  ratio: {
    src: "/rlpd/fig-ratio-curve.png",
    alt: "Humanoid return across offline-to-online replay ratios",
    title: "Exploratory replay-ratio plot",
    caption: "Mixed-seed display, not a dose-response estimate: solid 90% online is seed 1; other solid points are seed 0. The dotted point retains seed 0 at 90%.",
    width: 2147,
    height: 1218,
  },
  coverage: {
    src: "/rlpd/offline-coverage.png",
    alt: "Offline-state coverage for Hopper, Walker2d, HalfCheetah, and Humanoid",
    title: "Cross-task offline-state coverage",
    caption: "Offline-standardized nearest-neighbor coverage · three seeds per task",
    width: 3021,
    height: 1482,
  },
  pca: {
    src: "/rlpd/pca-state-overlap.png",
    alt: "Four PCA scatter plots comparing offline medium-dataset states in indigo with online RLPD replay states in red for Hopper, Walker2d, HalfCheetah, and Humanoid; the locomotion distributions overlap substantially while the Humanoid distributions separate",
    title: "Offline and online states in a shared PCA basis",
    caption: "Offline-standardized · PCA fitted on 20k offline states per task · seed 0 · 4k points per distribution displayed · qualitative projection",
    width: 2384,
    height: 650,
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
    caption: "Coverage and normalized distance are observational diagnostics and do not establish a causal mechanism",
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
  const [active, setActive] = useState<string>("");

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
  return <div className={className}>{children}</div>;
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

function EvidenceFigure({
  figure,
  compact = false,
  panoramic = false,
}: {
  figure: FigureData;
  compact?: boolean;
  panoramic?: boolean;
}) {
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
        className={cx(styles.figureCard, compact && styles.figureCompact, panoramic && styles.figurePanoramic)}
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
                className={cx(styles.lightboxDialog, panoramic && styles.lightboxPanoramic)}
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
          controls
          muted
          loop
          playsInline
          preload="metadata"
        />
        <span>Recorded RLPD rollout · {result.task.toLowerCase()}</span>
        <figcaption><small>Qualitative example; the table reports three-seed aggregates.</small></figcaption>
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
          <span>R</span><strong>RLPD</strong>
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
          <div className={styles.heroCopy}>
            <span className={styles.kicker}>PyTorch reproduction · MuJoCo / Minari-v5 · 2026</span>
            <h1 id="hero-title">RLPD: offline-to-online reinforcement learning</h1>
            <p>
              We implemented RLPD in PyTorch, evaluated it against IQL and SACfD on three locomotion tasks, and extended the comparison to Humanoid-v5. Matched replay ablations test whether a fixed offline-data mixture helps online adaptation in that setting.
            </p>
            <div className={styles.heroActions}>
              <a href="#results" className={styles.primaryAction}><span>Results</span><Arrow direction="down" /></a>
              <a href={REPOSITORY} target="_blank" rel="noreferrer">Source code <Arrow /></a>
            </div>
            <div className={styles.teamLine}><span>Research team</span><strong>Karan Anchan</strong><strong>Pranav Prakash Menon</strong><strong>Kandi Sridhar</strong></div>
          </div>
        </div>
        <div className={styles.heroMetrics}>
          <div><span>RLPD locomotion · n = 3</span><strong>88.0–89.6</strong><small>normalized return at 245k steps</small></div>
          <div><span>Matched Humanoid ablation · n = 3</span><strong>+22.0</strong><small>online-only minus 50/50 at 495k</small></div>
          <div><span>Humanoid offline-state coverage</span><strong>6.6%</strong><small>post-hoc nearest-neighbor estimate</small></div>
          <div><span>Core locomotion matrix</span><strong>27 runs</strong><small>3 methods × 3 tasks × 3 seeds</small></div>
        </div>
      </section>

      <section id="method" data-section className={cx(styles.section, styles.sectionTint)}>
        <Reveal>
          <SectionHeader
            index="01"
            eyebrow="Experimental setup"
            title="Data, replay, and optimization"
            copy="The locomotion reproduction uses Minari-v5 medium datasets. RLPD combines each fixed dataset with online transitions; the critic ensemble, LayerNorm, and high update-to-data ratio follow the original method. The Humanoid-v5 extension tests the same design on a larger state space."
          />
          <div className={styles.methodFlow} aria-label="Offline-to-online training loop">
            {[
              ["01", "Minari medium data", "fixed offline transitions"],
              ["02", "Replay batch", "128 offline + 128 online"],
              ["03", "Environment step", "collect one new transition"],
              ["04", "Optimization", "20 critic updates + 1 actor update"],
            ].map(([index, title, detail]) => <div key={index}><span>{index}</span><strong>{title}</strong><small>{detail}</small></div>)}
          </div>
          <div className={styles.methodCards}>
            {methodCards.map((card) => (
              <article key={card.index}>
                <header><span>{card.index} / {card.label}</span><strong>{card.value}</strong></header>
                <div className={cx(styles.methodVisual, styles[card.visual])} aria-hidden>
                  {card.visual === "mix" && <><i /><i /></>}
                  {card.visual === "bound" && <><i /><i /><i /></>}
                  {card.visual === "ensemble" && Array.from({ length: 10 }).map((_, item) => <i key={item} />)}
                </div>
                <h3>{card.title}</h3><p>{card.copy}</p><code>{card.code}</code>
                <footer><span>Experimental role</span><strong>{card.outcome}</strong></footer>
              </article>
            ))}
          </div>
          <div className={styles.studyStrip}>
            <span>PyTorch 2.11</span><i />
            <span>Gymnasium MuJoCo v5</span><i />
            <span>Minari-v5 medium datasets</span><i />
            <span>Weights &amp; Biases</span><i />
            <span>RTX 5070 · 12 GB</span>
          </div>
          <p className={styles.caveat}>Normalized returns use this project&apos;s measured random-policy and Minari-v5 expert anchors (0 and 100), not the original paper&apos;s D4RL scale. Each evaluation averages ten deterministic episodes; locomotion results use the final 245k evaluation of a 250k-step budget. IQL receives one million offline updates before online step 0, so equal interaction counts do not mean equal optimization compute.</p>
          <p className={styles.caveat}>Implementation: <a href={`${REPOSITORY}/blob/main/train.py`} target="_blank" rel="noreferrer">training loop</a> · <a href={`${REPOSITORY}/blob/main/rlpd/replay_buffer.py`} target="_blank" rel="noreferrer">replay sampling</a> · <a href={`${REPOSITORY}/blob/main/analysis/overlap.py`} target="_blank" rel="noreferrer">state-coverage analysis</a>.</p>
        </Reveal>
      </section>

      <section id="results" data-section className={styles.section}>
        <Reveal>
          <SectionHeader
            index="02"
            eyebrow="Locomotion results"
            title="RLPD on three MuJoCo tasks"
            copy="At 245k online steps, mean normalized return was 88.0 on Hopper, 89.6 on Walker2d, and 88.6 on HalfCheetah. Each value is the mean across three seeds; RLPD exceeded the SACfD mean on all three tasks."
          />
          <EvidenceFigure figure={figures.returns} />
          <BenchmarkExplorer />
          <p className={styles.caveat}>The figure shows five-evaluation rolling means with seed-level uncertainty; the displayed endpoint scores come from unsmoothed evaluation CSVs. Recorded rollouts are qualitative examples, not estimates of average performance.</p>
          <div className={styles.failureGrid}>
            <div>
              <span className={styles.kicker}>Critic-scale diagnostic</span>
              <h3>SACfD critic values grew sharply on Walker2d</h3>
              <p>At 245k steps, the recorded SACfD mean Q was approximately 85,300 versus 545 for RLPD. This 156× endpoint gap indicates value-scale instability in the tested SACfD path; it does not by itself explain the return difference.</p>
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
            index="03"
            eyebrow="Humanoid-v5 extension"
            title="Humanoid results"
            copy="State-based Humanoid-v5 has 348 observation dimensions and 17 actions. At the 995k evaluation, IQL had the highest three-seed mean return. RLPD remained numerically stable but achieved a lower return; two of three SACfD seeds diverged before the full horizon."
          />
          <div className={styles.humanoidGrid}>
            <figure className={styles.humanoidVideo}>
              <video src="/rlpd/rollout-humanoid.mp4" poster="/rlpd/rollout-humanoid.webp" aria-label="Selected high-performing IQL Humanoid-v5 rollout" controls muted loop playsInline preload="metadata" />
              <span>Recorded rollout · selected IQL seed 2</span>
              <figcaption><strong>87.8</strong><small>selected-seed last-five return; IQL three-seed mean: 70.1 ± 16.2</small></figcaption>
            </figure>
            <div className={styles.humanoidStats}>
              {[
                ["IQL · n = 3", "70.1", "± 16.2", "highest mean", "1M offline + 1M online"],
                ["RLPD · n = 3", "13.0", "± 13.8", "finite estimates", "no pretraining + 1M online"],
                ["SACfD · n = 3", "2 / 3", "NaN", "divergent", "non-finite runs retained"],
              ].map(([label, value, spread, status, context]) => (
                <article key={label}><header><span>{label}</span><em>{status}</em></header><strong>{value} <small>{spread}</small></strong><footer><span>training context</span><b>{context}</b></footer></article>
              ))}
            </div>
          </div>
          <EvidenceFigure figure={figures.humanoid} />
          <p className={styles.caveat}>IQL received one million offline gradient updates before online step 0; the methods share an online interaction budget, not a compute budget. The rollout is a selected high-performing seed, not an estimate of expected performance. SACfD diverged in two seeds at 430k and 550k, so its reported endpoint summary combines unequal horizons.</p>
        </Reveal>
      </section>

      <section id="ablations" data-section className={styles.section}>
        <Reveal>
          <SectionHeader
            index="04"
            eyebrow="Matched replay ablation"
            title="Online-only versus 50/50 replay"
            copy="At the 495k evaluation of a 500k-step Humanoid-v5 budget, we changed replay composition while keeping the critic architecture, ensemble, LayerNorm, update ratio, and batch size fixed. Each primary condition has three seeds."
          />
          <div className={styles.ablationHero}>
            <div className={styles.ablationCompare}>
              {[
                ["RLPD · 50/50", 5.9, "± 1.9", "128 offline + 128 online per update", "mix"],
                ["Online-only", 28.0, "± 15.2", "256 online samples per update", "online"],
              ].map(([label, value, spread, note, tone]) => (
                <div key={label as string}>
                  <header><span>{label}</span><strong>{Number(value).toFixed(1)} <small>{spread}</small></strong></header>
                  <div><motion.i className={styles[tone as "mix" | "online"]} initial={reduced ? false : { scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.65, ease: EASE_OUT }} style={{ width: `${(Number(value) / 30) * 100}%` }} /></div>
                  <p>{note}</p>
                </div>
              ))}
            </div>
            <aside><span>Observed mean difference</span><strong>+22.0</strong><small>normalized-return points</small><p>Online-only minus 50/50 replay at the matched 495k evaluation. This is descriptive, not a significance claim.</p></aside>
          </div>
          <div className={styles.ablationFindings}>
            {[
              ["No LayerNorm", "diverged", "Seed 0 produced non-finite values by about 15k steps."],
              ["Offline-only replay", "−0.65", "Seed-0 last-five return at the 495k evaluation."],
              ["UTD 1 instead of 20", "3.26", "Seed-0 last-five return versus 7.24 for the 50/50 reference."],
              ["2 critics instead of 10", "4.61", "Seed-0 last-five return versus 7.24 for the 50/50 reference."],
            ].map(([label, value, copy]) => <article key={label}><span>{label}</span><strong>{value}</strong><p>{copy}</p></article>)}
          </div>
          <div className={styles.figurePair}>
            <EvidenceFigure figure={figures.ablations} compact />
            <EvidenceFigure figure={figures.ratio} compact />
          </div>
          <div className={styles.caveatBox}><span>Scope of inference</span><p>Online-only seed means were 23.11, 44.97, and 15.81; the matched 50/50 seed means were 7.24, 3.79, and 6.74. The resulting +22.0-point mean difference is descriptive given n = 3 and substantial variance. The replay-ratio figure is exploratory: most ratios have one seed, and its solid 90%-online point uses seed 1 while other solid points use seed 0. It is not a seed-uniform dose-response curve.</p></div>
        </Reveal>
      </section>

      <section id="coverage" data-section className={cx(styles.section, styles.sectionTint)}>
        <Reveal>
          <SectionHeader
            index="05"
            eyebrow="State-distribution analysis"
            title="Offline-state coverage"
            copy="We compared states collected in online replay buffers with each task&apos;s fixed offline dataset. PCA provides a two-dimensional view; the reported coverage metric uses all standardized state dimensions and a nearest-neighbor threshold derived from offline states."
          />
          <div id="pca-projection" className={styles.pcaAnalysis}>
            <div className={styles.pcaIntroduction}>
              <div>
                <span>Qualitative projection / seed 0</span>
                <h3>Humanoid online replay states separate in the offline-fitted PCA view</h3>
              </div>
              <p>For each task, PCA is fitted only on standardized offline states. Offline and online states are then transformed through that same basis, so their relative position is directly comparable within a task.</p>
            </div>
            <EvidenceFigure figure={figures.pca} panoramic />
            <div className={styles.pcaProtocol}>
              {[
                ["Projection basis", "Offline fit", "PCA is fitted on 20,000 standardized offline states for each environment; online states do not influence the axes."],
                ["Displayed sample", "4k + 4k", "Four thousand offline and four thousand online states are displayed for the seed-0 RLPD run in each task."],
                ["Projected pattern", "Humanoid separates", "Locomotion clouds retain substantial overlap, whereas Humanoid online replay states are displaced from the main offline cloud."],
                ["Inference boundary", "2D is descriptive", "The projection can hide variance in omitted components. Three-seed nearest-neighbor metrics in the full state space provide the primary evidence."],
              ].map(([label, value, copy]) => (
                <article key={label}><span>{label}</span><strong>{value}</strong><p>{copy}</p></article>
              ))}
            </div>
          </div>
          <div className={styles.quantitativeLead}>
            <span>Full-space verification / three seeds</span>
            <p>Across three seeds per task, the full-space metric counts online replay states inside the offline 95th-percentile nearest-neighbor radius. It samples states accumulated during training, not final-policy rollouts. The offline/offline distance control is 1.04–1.16.</p>
          </div>
          <div className={styles.coverageGrid}>
            <div className={styles.coverageChart} role="img" aria-label="Offline-state coverage by task">
              <header><span>online states within the offline 95th-percentile NN radius</span><strong>coverage estimate · higher indicates greater overlap</strong></header>
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
              <span>Lowest observed overlap</span><strong>6.6%</strong><small>Humanoid coverage · R = 6.64×</small>
              <p>Humanoid-v5 has the lowest estimated coverage and largest normalized distance ratio among the four evaluated tasks. This is consistent with the higher online-only mean in the matched replay ablation.</p>
              <code>R = median d(online, offline) / median d(offline, offline)</code>
              <p><b>Inference boundary:</b> the analysis is post-hoc and compares tasks with different state dimensions and dynamics. It does not establish that distribution mismatch caused the ablation result.</p>
            </aside>
          </div>
          <EvidenceFigure figure={figures.coverage} />
        </Reveal>
      </section>

      <section id="evidence" data-section className={styles.section}>
        <Reveal>
          <SectionHeader
            index="06"
            eyebrow="Reporting and reproducibility"
            title="Limitations"
            copy="The results depend on the stated datasets, environment versions, compute budgets, and normalization anchors. Completed and interrupted runs are separated below; figure viewers retain the source plots at full resolution."
          />
          <div className={styles.auditTable} role="table" aria-label="Experiment coverage and reporting status">
            <div className={styles.auditHead} role="row"><span>#</span><span>Experiment group</span><span>Coverage</span><span>Reporting note</span></div>
            {auditRows.map(([label, count, note], index) => (
              <div className={styles.auditRow} role="row" key={label}><i>{String(index + 1).padStart(2, "0")}</i><span>{label}</span><strong>{count}</strong><em>{note}</em></div>
            ))}
          </div>
          <p className={styles.caveat}>The research repository includes configuration, evaluation CSVs, code, and generated figures. It does not include trained checkpoints or raw replay buffers, so the full training and state-coverage results cannot be regenerated from that checkout alone. The project-specific Minari-v5 normalization also prevents direct numerical comparison with D4RL-normalized scores in the original paper.</p>
          <div className={styles.additionalEvidence}>
            <div><span>Supplementary figures</span><h3>Dataset quality and state coverage</h3></div>
            <EvidenceFigure figure={figures.quality} compact />
            <EvidenceFigure figure={figures.coverageDiagnostic} compact />
          </div>
          <footer className={styles.projectFooter}>
            <div><span>Research team</span><strong>Karan Anchan · Pranav Prakash Menon · Kandi Sridhar</strong><small>PyTorch reproduction and Humanoid-v5 extension · 2026</small></div>
            <div><a href={REPOSITORY} target="_blank" rel="noreferrer">Repository <Arrow /></a><a href={PAPER} target="_blank" rel="noreferrer">Original paper <Arrow /></a><Link href="/">Main portfolio <Arrow /></Link></div>
          </footer>
        </Reveal>
      </section>
    </main>
  );
}
