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
    rolloutScore: "96.8",
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
    rolloutScore: "103.1",
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
  ["Humanoid · SACfD", "2 of 3 divergent", "non-finite runs are retained in the experimental record"],
  ["Online-only ablation", "n = 3 · 500k steps", "matched-horizon comparison against 50/50 replay"],
  ["Expert Humanoid RLPD", "n = 1 · 1M steps", "single-seed result; excluded from aggregate conclusions"],
  ["State-distribution analyses", "4 tasks · n = 3", "PCA is descriptive; full-space nearest-neighbor metrics are primary"],
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
    caption: "Three seeds · final evaluation at 995k · IQL includes 1M offline updates before online step 0",
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
    title: "Exploratory replay-composition sweep",
    caption: "Single-seed diagnostic except at 90% online, where seed 1 is shown with the seed 0 observation as a dotted reference",
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
          <span>R</span><strong>RLPD / EMPIRICAL STUDY</strong>
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
            <span className={styles.kicker}><b>2026</b> reproduction and ablation study · offline-to-online RL</span>
            <h1 id="hero-title">An empirical evaluation of RLPD.<em>Reproduction, controlled ablations, and distribution analysis.</em></h1>
            <p>
              We independently implemented RLPD in PyTorch, evaluated it on Minari-v5 locomotion and Humanoid-v5, and conducted replay-composition ablations to isolate the contribution of offline data during online training.
            </p>
            <div className={styles.heroActions}>
              <a href="#results" className={styles.primaryAction}><span><small>Empirical findings</small>Review the results</span><Arrow direction="down" /></a>
              <a href={REPOSITORY} target="_blank" rel="noreferrer">View implementation <Arrow /></a>
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
            <figcaption><span>Matched ablation difference</span><strong>+21.9</strong><small>mean return · online-only minus 50/50 · 500k</small></figcaption>
          </motion.figure>
        </div>
        <div className={styles.heroMetrics}>
          <div><span>Primary experiment matrix</span><strong>27 completed runs</strong></div>
          <div><span>Primary replication count</span><strong>n = 3 seeds</strong></div>
          <div><span>Interaction horizons</span><strong>245k → 1M steps</strong></div>
          <div><span>Evaluated environments</span><strong>4 tasks</strong></div>
        </div>
      </section>

      <section id="study" data-section className={styles.section}>
        <Reveal>
          <SectionHeader
            index="01"
            eyebrow="study / research objectives"
            title="Evaluating offline data as"
            accent="a benefit and a potential constraint."
            copy="The study first assesses whether the reported locomotion behavior is reproducible under an independent PyTorch implementation. It then tests whether the same training protocol transfers to the 348-dimensional Humanoid-v5 observation space."
          />
          <div className={styles.studyGrid}>
            <article className={styles.questionCard}>
              <span>Research question</span>
              <h3>How does replay composition affect online adaptation on Humanoid-v5?</h3>
              <p>RLPD combines a fixed offline dataset with transitions collected by the current policy. We evaluate whether this mixture improves sample efficiency and whether its effect changes when the online state distribution is poorly represented by the offline dataset.</p>
              <div><span>Reproduced proposition</span><strong>Sample-efficient online adaptation</strong></div>
              <div><span>Study contribution</span><strong>Humanoid-v5 ablations + support analysis</strong></div>
            </article>
            <div className={styles.protocolGrid}>
              {[
                ["01", "Reproduce", "Evaluate RLPD, IQL, and SACfD on three Minari-v5 medium datasets using three seeds."],
                ["02", "Extend", "Apply the comparison to Humanoid-v5, increasing the observation dimension from 11–17 to 348."],
                ["03", "Ablate", "Hold architecture, update schedule, and training horizon fixed while varying replay composition."],
                ["04", "Analyze", "Quantify overlap between online states and the offline dataset using a nearest-neighbor criterion."],
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
            eyebrow="method / experimental implementation"
            title="The evaluated protocol is defined by"
            accent="replay, normalization, and update intensity."
            copy="These implementation choices specify how offline transitions enter optimization, how critic activations are normalized, and how many gradient updates are performed per environment interaction."
          />
          <div className={styles.methodFlow} aria-label="Offline-to-online training loop">
            {[
              ["01", "Offline dataset", "fixed transition set"],
              ["02", "Replay sampling", "128 offline + 128 online"],
              ["03", "Environment interaction", "policy-generated transition"],
              ["04", "Online-buffer update", "append observed transition"],
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
                <footer><span>Experimental role</span><strong>{card.outcome}</strong></footer>
              </motion.article>
            ))}
          </div>
        </Reveal>
      </section>

      <section id="results" data-section className={styles.section}>
        <Reveal>
          <SectionHeader
            index="03"
            eyebrow="locomotion / reproduction results"
            title="RLPD reproduced strong final performance"
            accent="across all three locomotion tasks."
            copy="At 245k environment steps, the RLPD mean normalized return ranged from 88.0 to 89.6 across Hopper, Walker2d, and HalfCheetah. It exceeded the SACfD mean in every evaluated task; all summary statistics use three independent seeds."
          />
          <EvidenceFigure figure={figures.returns} />
          <BenchmarkExplorer />
          <div className={styles.interpretationBand}>
            <span>Across-task summary</span>
            <p><strong>RLPD produced similar task-level means.</strong> Its final means span 1.6 normalized-return points across the three environments. This is a descriptive reproducibility result; uncertainty is reported as the standard deviation across three seeds.</p>
          </div>
          <div className={styles.failureGrid}>
            <div>
              <span className={styles.kicker}><b>04</b> stability analysis / critic scale</span>
              <h3>Policy return alone is insufficient to characterize numerical stability.</h3>
              <p>On Walker2d, the recorded SACfD mean Q increases from 0.1 at the first valid log to 85,300 at 245k steps, whereas RLPD ends at 545. The resulting 156× endpoint ratio is reported as evidence of critic-scale instability.</p>
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
            eyebrow="out-of-domain extension / Humanoid-v5"
            title="Humanoid-v5 changed the relative"
            accent="performance of the evaluated methods."
            copy="Humanoid-v5 increases the observation dimension to 348 and uses 17 actuators. Under the evaluated training budgets, IQL attained the highest three-seed mean return, RLPD retained finite critic estimates but achieved a lower mean return, and two of three SACfD runs diverged."
          />
          <div className={styles.humanoidGrid}>
            <figure className={styles.humanoidVideo}>
              <video src="/rlpd/rollout-humanoid.mp4" poster="/rlpd/rollout-humanoid.webp" aria-label="Selected high-performing IQL Humanoid-v5 rollout" autoPlay muted loop playsInline preload="metadata" />
              <span>representative high-performing run · IQL seed 2</span>
              <figcaption><strong>87.8</strong><small>last-five normalized return · three-seed mean 70.1 ± 16.2</small></figcaption>
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
          <p className={styles.caveat}>The rollout is a qualitative example from a selected high-performing seed and is not an estimator of expected performance. Quantitative conclusions are based on the reported three-seed aggregates.</p>
        </Reveal>
      </section>

      <section id="ablations" data-section className={styles.section}>
        <Reveal>
          <SectionHeader
            index="05"
            eyebrow="controlled replay ablation / 500k steps"
            title="Replay composition produced distinct"
            accent="Humanoid-v5 outcomes."
            copy="We held the critic architecture, ensemble size, layer normalization, update-to-data ratio, batch size, and 500k-step horizon fixed while changing the source composition of each replay batch. The primary 50/50 and online-only conditions each include three seeds; intermediate ratios are exploratory single-seed diagnostics."
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
            <aside><span>Observed mean difference</span><strong>+21.9</strong><small>normalized-return points</small><p>Online-only minus 50/50 replay at the matched 500k-step horizon.</p></aside>
          </div>
          <div className={styles.ablationFindings}>
            {[
              ["No LayerNorm", "8.9×10¹⁰", "Mean Q reached this value by 15k steps, indicating numerical divergence."],
              ["Offline-only", "−0.6", "The evaluated run showed no positive Humanoid return at 500k steps."],
              ["50% online", "7.2", "Seed-0 return in the exploratory replay-composition sweep."],
              ["Online-only", "23.1", "Seed-1 return in the exploratory replay-composition sweep."],
            ].map(([label, value, copy]) => <article key={label}><span>{label}</span><strong>{value}</strong><p>{copy}</p></article>)}
          </div>
          <div className={styles.figurePair}>
            <EvidenceFigure figure={figures.ablations} compact />
            <EvidenceFigure figure={figures.ratio} compact />
          </div>
          <div className={styles.caveatBox}><span>Scope of inference</span><p>The online-only condition comprises three independent seeds: 23.1, 45.0, and 15.8, yielding 28.0 ± 15.2. Given this variance and sample size, the +21.9-point difference is reported descriptively rather than as a formal significance claim. The replay-ratio curve is not a uniform dose-response estimate because most ratios contain one seed and the 90% condition contains observations from two seeds.</p></div>
        </Reveal>
      </section>

      <section id="coverage" data-section className={cx(styles.section, styles.sectionTint)}>
        <Reveal>
          <SectionHeader
            index="06"
            eyebrow="state-distribution analysis / PCA + nearest neighbors"
            title="Humanoid-v5 exhibited limited offline coverage"
            accent="under the specified distance criterion."
            copy="We first visualize offline and online state distributions in a common PCA basis, then quantify their overlap in the complete standardized state space using nearest-neighbor coverage and normalized distance."
          />
          <div id="pca-projection" className={styles.pcaAnalysis}>
            <div className={styles.pcaIntroduction}>
              <div>
                <span>Qualitative projection / seed 0</span>
                <h3>The locomotion distributions overlap; Humanoid separates in the offline-fitted projection.</h3>
              </div>
              <p>For each task, PCA is fitted only on standardized offline states. Offline and online states are then transformed through that same basis, so their relative position is directly comparable within a task.</p>
            </div>
            <EvidenceFigure figure={figures.pca} panoramic />
            <div className={styles.pcaProtocol}>
              {[
                ["Projection basis", "Offline fit", "PCA is fitted on 20,000 standardized offline states for each environment; online states do not influence the axes."],
                ["Displayed sample", "4k + 4k", "Four thousand offline and four thousand online states are displayed for the seed-0 RLPD run in each task."],
                ["Projected pattern", "Humanoid separates", "Locomotion clouds retain substantial overlap, whereas the Humanoid online trajectory is displaced from the main offline cloud."],
                ["Inference boundary", "2D is descriptive", "The projection can hide variance in omitted components. Three-seed nearest-neighbor metrics in the full state space provide the primary evidence."],
              ].map(([label, value, copy]) => (
                <article key={label}><span>{label}</span><strong>{value}</strong><p>{copy}</p></article>
              ))}
            </div>
          </div>
          <div className={styles.quantitativeLead}>
            <span>Full-space verification / three seeds</span>
            <p>The quantitative analysis uses all standardized state dimensions rather than the two displayed principal components. The offline/offline control remains close to one (1.04–1.16), indicating that the normalized distance ratio is not explained solely by dimensionality.</p>
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
              <p>Humanoid-v5 has the lowest coverage estimate and the largest normalized distance ratio among the four evaluated tasks. This association is consistent with the higher online-only mean observed in the replay ablation.</p>
              <code>R = median d(online, offline) / median d(offline, offline)</code>
              <p><b>Inference boundary:</b> this post-hoc analysis identifies an association between limited offline support and the ablation result; it does not establish distribution mismatch as a causal mechanism.</p>
            </aside>
          </div>
          <EvidenceFigure figure={figures.coverage} />
        </Reveal>
      </section>

      <section id="evidence" data-section className={styles.section}>
        <Reveal>
          <SectionHeader
            index="07"
            eyebrow="reporting / provenance and limitations"
            title="Results are reported with"
            accent="replication counts and scope."
            copy="Completed and incomplete runs are distinguished explicitly, qualitative rollouts are separated from aggregate estimates, and all supporting figures remain available at full resolution."
          />
          <div className={styles.auditTable} role="table" aria-label="Experiment coverage and reporting status">
            <div className={styles.auditHead} role="row"><span>#</span><span>Experiment group</span><span>Coverage</span><span>Reporting note</span></div>
            {auditRows.map(([label, count, note], index) => (
              <div className={styles.auditRow} role="row" key={label}><i>{String(index + 1).padStart(2, "0")}</i><span>{label}</span><strong>{count}</strong><em>{note}</em></div>
            ))}
          </div>
          <div className={styles.lessonGrid}>
            {[
              ["01", "Between-seed variance is reported explicitly.", "Three-seed aggregates characterize variability that cannot be inferred from a selected rollout."],
              ["02", "Implementation details define the comparison.", "Layer normalization, ensemble size, update-to-data ratio, and pretraining budget are treated as part of each experimental condition."],
              ["03", "The ablation isolates replay composition.", "The matched 50/50 and online-only comparison shifts the analysis from method-level performance to the contribution of offline samples."],
              ["04", "Distribution analysis combines complementary evidence.", "PCA visualizes projected geometry, while three-seed full-space metrics estimate coverage: 56.2–71.6% for locomotion and 6.6% for Humanoid."],
            ].map(([index, title, copy]) => <article key={index}><span>{index}</span><h3>{title}</h3><p>{copy}</p></article>)}
          </div>
          <div className={styles.additionalEvidence}>
            <div><span>Supplementary analyses</span><h3>Dataset-quality and state-support diagnostics.</h3></div>
            <EvidenceFigure figure={figures.quality} compact />
            <EvidenceFigure figure={figures.coverageDiagnostic} compact />
          </div>
          <footer className={styles.projectFooter}>
            <div><span>Research team</span><strong>Karan Anchan · Pranav Prakash Menon · Kandi Sridhar</strong><small>Empirical reproduction and ablation study · 2026</small></div>
            <div><a href={REPOSITORY} target="_blank" rel="noreferrer">Repository <Arrow /></a><a href={PAPER} target="_blank" rel="noreferrer">Original paper <Arrow /></a><Link href="/">Main portfolio <Arrow /></Link></div>
          </footer>
        </Reveal>
      </section>
    </main>
  );
}
