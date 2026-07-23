"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import styles from "./rlpd.module.css";

const REPOSITORY =
  "https://github.com/Karan-Anchan/rlpd-offline-to-online-rl";

const chapters = [
  { id: "overview", index: "01", label: "Overview", hint: "The premise", tone: "amber" },
  { id: "method", index: "02", label: "Method", hint: "Three guardrails", tone: "mint" },
  { id: "benchmarks", index: "03", label: "Benchmarks", hint: "Three tasks", tone: "violet" },
  { id: "critic", index: "04", label: "Critic", hint: "Failure trace", tone: "coral" },
  { id: "humanoid", index: "05", label: "Humanoid", hint: "Beyond paper", tone: "mint" },
  { id: "ablation", index: "06", label: "Ablation", hint: "The twist", tone: "amber" },
  { id: "evidence", index: "07", label: "Evidence", hint: "Audit & team", tone: "violet" },
] as const;

const results = [
  {
    task: "Hopper-v5",
    short: "Hopper",
    rollout: "/rlpd/rollout-hopper.webp",
    rolloutScore: "97.1",
    values: [
      { method: "RLPD", value: 88.0, spread: 6.8, tone: "rlpd" },
      { method: "IQL", value: 65.6, spread: 29.2, tone: "iql" },
      { method: "SACfD", value: 41.9, spread: 11.3, tone: "sac" },
    ],
  },
  {
    task: "Walker2d-v5",
    short: "Walker2d",
    rollout: "/rlpd/rollout-walker.webp",
    rolloutScore: "96.8",
    values: [
      { method: "RLPD", value: 89.6, spread: 0.7, tone: "rlpd" },
      { method: "IQL", value: 84.3, spread: 6.6, tone: "iql" },
      { method: "SACfD", value: 8.1, spread: 2.1, tone: "sac" },
    ],
  },
  {
    task: "HalfCheetah-v5",
    short: "HalfCheetah",
    rollout: "/rlpd/rollout-halfcheetah.webp",
    rolloutScore: "103.1",
    values: [
      { method: "RLPD", value: 88.6, spread: 1.6, tone: "rlpd" },
      { method: "IQL", value: 86.0, spread: 7.8, tone: "iql" },
      { method: "SACfD", value: 18.5, spread: 3.4, tone: "sac" },
    ],
  },
] as const;

const criticRLPD: Array<[number, number]> = [
  [25, 382.3], [50, 452.1], [75, 477.2], [100, 498.4], [125, 516.7],
  [150, 521.2], [175, 537.9], [200, 543.4], [225, 539.0], [245, 545.4],
];

const criticSACfD: Array<[number, number]> = [
  [25, 688.2], [50, 2241.6], [75, 5995.6], [100, 11129.7], [125, 20473.9],
  [150, 35123.8], [175, 53155.0], [200, 71850.4], [225, 81460.8], [245, 85300.2],
];

const auditRows = [
  ["Locomotion · medium", "27 complete", "primary comparison"],
  ["Locomotion · expert", "seed 0 complete", "seeds 1–2 stop at 57.5k"],
  ["Humanoid · IQL / RLPD", "3 seeds · 1M", "different pretraining budgets"],
  ["Humanoid · SACfD", "2 of 3 NaN", "divergence retained"],
  ["Online-only", "3 seeds · 500k", "matched-horizon ablation"],
  ["RLPD · expert Humanoid", "n = 1 · 1M", "4.0 last-five"],
] as const;

const sparkles = [
  [5, 18, 0.2, 4.8], [11, 56, 1.1, 5.6], [17, 33, 2.4, 4.2],
  [23, 72, 0.8, 6.1], [29, 12, 3.1, 5.2], [36, 48, 1.8, 4.5],
  [43, 25, 0.4, 5.8], [51, 66, 2.8, 4.9], [58, 9, 1.5, 6.4],
  [64, 41, 3.6, 5.1], [71, 77, 0.9, 4.6], [78, 29, 2.1, 5.9],
  [85, 60, 3.2, 4.7], [92, 16, 1.4, 5.4], [97, 44, 2.6, 6.2],
] as const;

function cx(...values: Array<string | false | undefined>) {
  return values.filter(Boolean).join(" ");
}

function Arrow({ direction = "up-right" }: { direction?: "up-right" | "left" | "right" }) {
  const path =
    direction === "left"
      ? "M13 8H3M7 4 3 8l4 4"
      : direction === "right"
        ? "M3 8h10M9 4l4 4-4 4"
        : "M3 13 13 3M6 3h7v7";

  return (
    <svg aria-hidden viewBox="0 0 16 16" className={styles.arrowIcon}>
      <path d={path} />
    </svg>
  );
}

function Atmosphere() {
  return (
    <div className={styles.atmosphere} aria-hidden>
      <div className={styles.atmosphereGlow} />
      {sparkles.map(([x, y, delay, duration], index) => (
        <i
          key={`${x}-${y}`}
          className={index % 4 === 0 ? styles.sparkleBright : undefined}
          style={{
            "--spark-x": `${x}%`,
            "--spark-y": `${y}%`,
            "--spark-delay": `${delay}s`,
            "--spark-duration": `${duration}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

function PanelHeader({
  index,
  eyebrow,
  title,
  accent,
  copy,
}: {
  index: string;
  eyebrow: string;
  title: React.ReactNode;
  accent?: React.ReactNode;
  copy: string;
}) {
  return (
    <header className={styles.panelHeader}>
      <div>
        <span className={styles.eyebrow}><b>{index}</b>{eyebrow}</span>
        <h2>{title}{accent && <em>{accent}</em>}</h2>
      </div>
      <p>{copy}</p>
    </header>
  );
}

function OverviewPanel({ onExplore }: { onExplore: () => void }) {
  const reduced = useReducedMotion();

  return (
    <div className={styles.overviewLayout}>
      <div className={styles.overviewCopy}>
        <span className={styles.eyebrow}><b>01</b>research reproduction / 2026</span>
        <h1>
          We rebuilt RLPD.
          <em>The ablation changed the story.</em>
        </h1>
        <p>
          A three-person PyTorch reproduction of offline-to-online reinforcement
          learning—extended to Humanoid-v5, stress-tested across three seeds,
          and forced to explain a result the paper did not predict.
        </p>
        <div className={styles.overviewActions}>
          <motion.button type="button" onClick={onExplore} whileTap={reduced ? undefined : { scale: 0.97 }}>
            Explore the method <Arrow direction="right" />
          </motion.button>
          <a href={REPOSITORY} target="_blank" rel="noreferrer">
            View repository <Arrow />
          </a>
        </div>
        <div className={styles.teamLine}>
          <span>Research team</span>
          <strong>Karan Anchan</strong>
          <strong>Pranav Menon</strong>
          <strong>Sridhar Kandi</strong>
        </div>
      </div>

      <motion.div
        className={styles.heroStage}
        initial={reduced ? false : { opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <img
          src="/rlpd/hero-robot-v2.jpg"
          alt="Humanoid training agent walking through a dark observation field"
          width={1024}
          height={1536}
          fetchPriority="high"
        />
        <div className={styles.stageWash} aria-hidden />
        <div className={styles.stageReadout}>
          <span>policy / humanoid-v5</span>
          <span>step 995,000</span>
        </div>
        <div className={styles.heroFinding}>
          <span>unexpected result</span>
          <strong>+21.9</strong>
          <small>online-only vs 50/50 · matched 500k</small>
        </div>
      </motion.div>

      <div className={styles.overviewMetrics}>
        <div><span>Primary study</span><strong>27 complete runs</strong></div>
        <div><span>Budget</span><strong>245k → 1M steps</strong></div>
        <div><span>Compute</span><strong>RTX 5070 · 12 GB</strong></div>
      </div>
    </div>
  );
}

function MixGlyph() {
  return (
    <div className={styles.mixGlyph} aria-hidden>
      {Array.from({ length: 24 }).map((_, index) => (
        <motion.i
          key={index}
          className={index < 12 ? styles.offlineSample : styles.onlineSample}
          initial={{ scaleY: 0.2, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: index * 0.015 }}
        />
      ))}
    </div>
  );
}

function BoundGlyph() {
  return (
    <svg className={styles.boundGlyph} viewBox="0 0 360 92" preserveAspectRatio="none" aria-hidden>
      <line x1="0" x2="360" y1="15" y2="15" />
      <line x1="0" x2="360" y1="77" y2="77" />
      <path className={styles.boundGhost} d="M4 71 C45 66 63 22 102 39 S162 70 202 47 S262 21 293 44 S329 61 356 32" />
      <motion.path
        className={styles.boundTrace}
        d="M4 71 C45 66 63 22 102 39 S162 70 202 47 S262 21 293 44 S329 61 356 32"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.9 }}
      />
    </svg>
  );
}

function EnsembleGlyph() {
  return (
    <div className={styles.ensembleGlyph} aria-hidden>
      {Array.from({ length: 10 }).map((_, index) => (
        <motion.i
          key={index}
          initial={{ opacity: 0, y: 7 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.035 }}
        ><span /></motion.i>
      ))}
    </div>
  );
}

function MethodPanel() {
  const guardrails = [
    {
      code: "ratio = 0.5 · batch = 256",
      label: "01 / mix",
      value: "50 / 50",
      title: "Symmetric sampling",
      copy: "Every update draws 128 online and 128 offline transitions. The dataset enters through the sampler—there is no RLPD pretraining phase.",
      glyph: <MixGlyph />,
    },
    {
      code: "layernorm = true",
      label: "02 / bound",
      value: "LN",
      title: "LayerNorm critic",
      copy: "Normalization limits extrapolation on actions the offline data never covered. Removing it on Humanoid sent mean Q to 8.9×10¹⁰.",
      glyph: <BoundGlyph />,
    },
    {
      code: "ensemble = 10 · utd = 20",
      label: "03 / push",
      value: "10 × 20",
      title: "Ensemble + high UTD",
      copy: "Ten critics and twenty gradient updates per environment step trade compute for sample efficiency and reduce single-critic overestimation.",
      glyph: <EnsembleGlyph />,
    },
  ];

  return (
    <div className={styles.panelStack}>
      <PanelHeader
        index="02"
        eyebrow="method / three guardrails"
        title="A small method."
        accent="Implementation carries the weight."
        copy="One motion language connects all three: sample, bound, update. Each value comes directly from the checked configuration."
      />
      <div className={styles.methodFlow} aria-label="Offline-to-online learning loop">
        {[
          ["01", "offline data", "fixed demonstrations"],
          ["02", "critic update", "50 / 50 sampling"],
          ["03", "online action", "new experience"],
          ["04", "policy shift", "behavior evolves"],
        ].map(([index, title, detail]) => (
          <div key={index}><span>{index}</span><strong>{title}</strong><small>{detail}</small></div>
        ))}
      </div>
      <div className={styles.guardrailGrid}>
        {guardrails.map((guardrail, index) => (
          <motion.article
            className={styles.guardrail}
            key={guardrail.title}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
          >
            <div className={styles.guardrailMeta}><span>{guardrail.label}</span><strong>{guardrail.value}</strong></div>
            {guardrail.glyph}
            <h3>{guardrail.title}</h3>
            <p>{guardrail.copy}</p>
            <code>{guardrail.code}</code>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

function BenchmarksPanel() {
  const [selectedTask, setSelectedTask] = useState(0);
  const reduced = useReducedMotion();
  const result = results[selectedTask];

  return (
    <div className={styles.panelStack}>
      <PanelHeader
        index="03"
        eyebrow="locomotion / medium data"
        title="The reproduction held."
        accent="Consistency was stronger."
        copy="RLPD was the only method to finish between 88 and 90 on every task. Select an environment to connect the aggregate score to observed policy behavior."
      />
      <div className={styles.taskTabs} role="tablist" aria-label="Benchmark environment">
        {results.map((task, index) => (
          <button
            type="button"
            role="tab"
            aria-selected={selectedTask === index}
            key={task.task}
            onClick={() => setSelectedTask(index)}
          >
            <span>0{index + 1}</span>{task.short}<strong>{task.values[0].value.toFixed(1)}</strong>
          </button>
        ))}
      </div>
      <div className={styles.benchmarkLayout}>
        <div className={styles.scoreBoard}>
          <div className={styles.scoreHead}>
            <span>{result.task}</span>
            <span>normalized return · mean ± seed std</span>
          </div>
          <div className={styles.scoreScale}><span>0</span><span>50</span><span>100 · expert</span></div>
          <AnimatePresence mode="wait">
            <motion.div
              className={styles.scoreRows}
              key={result.task}
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -8 }}
            >
              {result.values.map((item, index) => (
                <div className={styles.scoreRow} key={item.method}>
                  <span>{item.method}</span>
                  <div><motion.i
                    className={styles[item.tone]}
                    initial={reduced ? false : { scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.65, delay: index * 0.08 }}
                    style={{ width: `${item.value}%` }}
                  /></div>
                  <strong>{item.value.toFixed(1)} <small>± {item.spread.toFixed(1)}</small></strong>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
          <p>Three complete seeds at 245k environment steps · Minari v5 normalization.</p>
        </div>

        <AnimatePresence mode="wait">
          <motion.figure
            className={styles.policyCard}
            key={result.rollout}
            initial={reduced ? false : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduced ? undefined : { opacity: 0, scale: 0.98 }}
          >
            <img src={result.rollout} alt={`${result.task} RLPD policy rollout`} width={720} height={560} />
            <span>policy replay · expert-data seed 0</span>
            <figcaption>
              <div><strong>{result.task}</strong><small>RLPD · observed behavior</small></div>
              <div><strong>{result.rolloutScore}</strong><small>normalized</small></div>
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>
    </div>
  );
}

function chartPoint([step, q]: [number, number]) {
  const x = 52 + (step / 245) * 596;
  const normalized = (Math.log10(q) - 2) / 3;
  const y = 246 - normalized * 192;
  return { x, y };
}

function linePath(values: Array<[number, number]>) {
  return values.map((point, index) => {
    const { x, y } = chartPoint(point);
    return `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
}

function CriticPanel() {
  const [activeSeries, setActiveSeries] = useState<"both" | "rlpd" | "sacfd">("both");
  const reduced = useReducedMotion();
  const sacEnd = chartPoint(criticSACfD[criticSACfD.length - 1]);
  const rlpdEnd = chartPoint(criticRLPD[criticRLPD.length - 1]);

  return (
    <div className={styles.panelStack}>
      <PanelHeader
        index="04"
        eyebrow="Walker2d / critic redline"
        title="The failure was not subtle."
        accent="The trace reached 85,300."
        copy="SACfD’s critic climbed two orders of magnitude while RLPD stayed bounded near 545 on the same medium data and three-seed budget."
      />
      <div className={styles.criticLayout}>
        <div className={styles.criticChart}>
          <div className={styles.chartToolbar}>
            <span>mean Q · log scale</span>
            <div>
              {(["both", "rlpd", "sacfd"] as const).map((series) => (
                <button
                  type="button"
                  key={series}
                  aria-pressed={activeSeries === series}
                  onClick={() => setActiveSeries(series)}
                >
                  {series === "both" ? "Both" : series === "sacfd" ? "SACfD" : "RLPD"}
                </button>
              ))}
            </div>
          </div>
          <svg viewBox="0 0 700 282" role="img" aria-labelledby="critic-title critic-desc">
            <title id="critic-title">Walker2d critic values</title>
            <desc id="critic-desc">SACfD rises to 85,300 while RLPD remains bounded near 545.</desc>
            {[2, 3, 4, 5].map((tick) => {
              const y = 246 - ((tick - 2) / 3) * 192;
              return <g key={tick}><line x1="52" x2="648" y1={y} y2={y} /><text x="8" y={y + 4}>10^{tick}</text></g>;
            })}
            {[0, 50, 100, 150, 200, 245].map((tick) => {
              const x = 52 + (tick / 245) * 596;
              return <text key={tick} x={x} y="274" textAnchor="middle">{tick}k</text>;
            })}
            <path d={linePath(criticSACfD)} className={cx(styles.sacCurve, styles.curveUnderlay)} />
            <path d={linePath(criticRLPD)} className={cx(styles.rlpdCurve, styles.curveUnderlay)} />
            <motion.path
              d={linePath(criticSACfD)}
              className={cx(styles.sacCurve, activeSeries === "rlpd" && styles.curveMuted)}
              initial={reduced ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.85 }}
            />
            <motion.path
              d={linePath(criticRLPD)}
              className={cx(styles.rlpdCurve, activeSeries === "sacfd" && styles.curveMuted)}
              initial={reduced ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.75, delay: 0.08 }}
            />
            {criticSACfD.slice(0, -1).map((point) => {
              const { x, y } = chartPoint(point);
              return <circle key={`s-${point[0]}`} cx={x} cy={y} r="2.7" className={cx(styles.sacPoint, activeSeries === "rlpd" && styles.curveMuted)}><title>{`SACfD · ${point[0]}k · ${Math.round(point[1]).toLocaleString()}`}</title></circle>;
            })}
            {criticRLPD.slice(0, -1).map((point) => {
              const { x, y } = chartPoint(point);
              return <circle key={`r-${point[0]}`} cx={x} cy={y} r="2.7" className={cx(styles.rlpdPoint, activeSeries === "sacfd" && styles.curveMuted)}><title>{`RLPD · ${point[0]}k · ${Math.round(point[1]).toLocaleString()}`}</title></circle>;
            })}
            <circle cx={sacEnd.x} cy={sacEnd.y} r="5" className={styles.sacPoint} />
            <circle cx={rlpdEnd.x} cy={rlpdEnd.y} r="5" className={styles.rlpdPoint} />
          </svg>
        </div>
        <aside className={styles.failureReadout}>
          <span>245k endpoint</span>
          <div><strong>85,300</strong><small>SACfD mean Q</small></div>
          <div><strong>545</strong><small>RLPD mean Q</small></div>
          <p>
            The unbounded critic coincides with a final return of 8.1 ± 2.1.
            A later no-LayerNorm ablation reproduced the same explosion inside RLPD.
          </p>
          <em>Hover any plotted point for its recorded three-seed mean.</em>
        </aside>
      </div>
    </div>
  );
}

function FigureLauncher({
  src,
  alt,
  caption,
  label,
}: {
  src: string;
  alt: string;
  caption: string;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setZoomed(false);
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <motion.button
        type="button"
        className={styles.figureLauncher}
        onClick={() => setOpen(true)}
        whileTap={reduced ? undefined : { scale: 0.98 }}
      >
        <span>{label}</span>
        <small>{caption}</small>
        <Arrow />
      </motion.button>
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              className={styles.figureOverlay}
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduced ? undefined : { opacity: 0 }}
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                  setOpen(false);
                  setZoomed(false);
                }
              }}
            >
              <motion.div
                className={styles.figureDialog}
                role="dialog"
                aria-modal="true"
                aria-label={caption}
                initial={reduced ? false : { opacity: 0, scale: 0.96, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, scale: 0.97, y: 12 }}
              >
                <button
                  type="button"
                  ref={closeRef}
                  onClick={() => { setOpen(false); setZoomed(false); }}
                  aria-label="Close figure"
                >Close ×</button>
                <div className={cx(styles.figureMedia, zoomed && styles.figureZoomed)}>
                  <button
                    type="button"
                    onClick={() => setZoomed((current) => !current)}
                    aria-label={zoomed ? "Fit figure to window" : "Inspect figure at full resolution"}
                  >
                    <img src={src} alt={alt} />
                  </button>
                  <span>{zoomed ? "Fit to window −" : "Inspect 1:1 +"}</span>
                </div>
                <p>{caption}</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}

function HumanoidPanel() {
  return (
    <div className={styles.panelStack}>
      <PanelHeader
        index="05"
        eyebrow="beyond the paper / Humanoid-v5"
        title="A harder body exposed"
        accent="a different advantage."
        copy="Humanoid expands the problem to 348 observations and 17 actuators. Every method ran to one million environment steps; divergent runs stayed in the record."
      />
      <div className={styles.humanoidLayout}>
        <figure className={styles.humanoidMedia}>
          <img src="/rlpd/rollout-humanoid.webp" alt="Best individual IQL Humanoid-v5 rollout, seed 2" width={900} height={700} />
          <span>best individual visualization</span>
          <figcaption>IQL · seed 2 · 87.8 last-five normalized</figcaption>
        </figure>
        <div className={styles.humanoidStats}>
          <article><span>IQL · 3 seeds</span><strong>70.1 <small>± 16.2</small></strong><p>Starts with 1M offline updates already completed.</p></article>
          <article><span>RLPD · 3 seeds</span><strong>13.0 <small>± 13.8</small></strong><p>Bounded critic; little locomotion emerged.</p></article>
          <article><span>SACfD</span><strong>2 / 3 <small>NaN</small></strong><p>Divergence recorded, not retried.</p></article>
        </div>
        <div className={styles.figureActions}>
          <FigureLauncher
            src="/rlpd/humanoid-results.webp"
            alt="Humanoid normalized return and critic mean Q"
            label="Open full result figure"
            caption="Humanoid-v5 · three seeds · return and mean Q · IQL includes 1M offline updates before step 0"
          />
          <p>The moving policy is a best-seed visualization. The 70.1 ± 16.2 aggregate is the result.</p>
        </div>
      </div>
    </div>
  );
}

function AblationPanel() {
  const reduced = useReducedMotion();
  const bars = [
    { label: "RLPD · 50/50", value: 6.024, display: "6.0 ± 2.0", className: styles.mixBar },
    { label: "Online-only", value: 27.966, display: "28.0 ± 15.2", className: styles.onlineBar },
  ];

  return (
    <div className={styles.panelStack}>
      <PanelHeader
        index="06"
        eyebrow="matched-horizon ablation / 500k"
        title="We turned off the offline data."
        accent="The policy got better."
        copy="LayerNorm, the critic ensemble, and high UTD stayed intact. Only the sampling ratio changed from 50/50 to online-only."
      />
      <div className={styles.ablationLayout}>
        <div className={styles.ablationBars}>
          {bars.map((bar, index) => (
            <div className={styles.ablationRow} key={bar.label}>
              <div><span>{bar.label}</span><strong>{bar.display}</strong></div>
              <div><motion.i
                className={bar.className}
                initial={reduced ? false : { scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.75, delay: index * 0.1 }}
                style={{ width: `${(bar.value / 32) * 100}%` }}
              /></div>
            </div>
          ))}
          <div className={styles.calculation}>
            <span>online-only: 23.1 · 45.0 · 15.8 → 28.0</span>
            <span>RLPD: 7.8 · 3.8 · 6.4 → 6.0</span>
          </div>
        </div>
        <div className={styles.deltaCard}>
          <span>Δ matched horizon</span>
          <strong>+21.9</strong>
          <small>normalized points</small>
        </div>
        <article className={styles.ablationReading}>
          <h3>The architecture survived. The prior data became the constraint.</h3>
          <p>
            The result does not invalidate offline-to-online RL. It makes the premise conditional:
            data quality, policy coverage, tuning, and the handoff between learning regimes can matter
            more than the mere presence of a dataset.
          </p>
          <FigureLauncher
            src="/rlpd/ablation-results.webp"
            alt="Humanoid ablation curves"
            label="Inspect ablation curves"
            caption="Humanoid ablations · 500k horizon · online-only is the only three-seed ablation"
          />
        </article>
      </div>
    </div>
  );
}

function EvidencePanel() {
  const lessons = [
    "Variance is part of the result.",
    "Implementation choices become research claims.",
    "Ablations can change the question.",
    "Behavior needs numeric context.",
  ];

  return (
    <div className={styles.panelStack}>
      <PanelHeader
        index="07"
        eyebrow="evidence audit / provenance"
        title="Every conclusion carries"
        accent="its sample count."
        copy="Incomplete runs stay visible. Best seeds never masquerade as aggregates, and every figure remains available at full resolution."
      />
      <div className={styles.evidenceLayout}>
        <div className={styles.auditTable} role="table" aria-label="Experiment coverage">
          {auditRows.map(([label, count, note]) => (
            <div className={styles.auditRow} role="row" key={label}>
              <span role="cell">{label}</span><strong role="cell">{count}</strong><em role="cell">{note}</em>
            </div>
          ))}
        </div>
        <aside className={styles.evidenceAside}>
          <div className={styles.lessonGrid}>
            {lessons.map((lesson, index) => <div key={lesson}><span>0{index + 1}</span><p>{lesson}</p></div>)}
          </div>
          <div className={styles.figureActions}>
            <FigureLauncher
              src="/rlpd/data-quality.webp"
              alt="RLPD return across simple, medium, and expert datasets"
              label="Data-quality figure"
              caption="Locomotion data quality · expert curves become single-seed after 57.5k"
            />
            <FigureLauncher
              src="/rlpd/humanoid-results.webp"
              alt="Humanoid return and critic mean Q"
              label="Humanoid figure"
              caption="Humanoid-v5 · three-seed return and mean Q"
            />
          </div>
        </aside>
        <footer className={styles.evidenceFooter}>
          <div><span>Research team</span><strong>Karan Anchan · Pranav Menon · Sridhar Kandi</strong></div>
          <div>
            <a href={REPOSITORY} target="_blank" rel="noreferrer">Repository <Arrow /></a>
            <a href="https://arxiv.org/abs/2302.02948" target="_blank" rel="noreferrer">Original paper <Arrow /></a>
            <Link href="/">Portfolio <Arrow /></Link>
          </div>
        </footer>
      </div>
    </div>
  );
}

const panelVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 48 : -48,
    filter: "blur(8px)",
  }),
  center: { opacity: 1, x: 0, filter: "blur(0px)" },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -36 : 36,
    filter: "blur(6px)",
  }),
};

export function RlpdExperience() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const reduced = useReducedMotion();
  const activeChapter = chapters[activeIndex];

  const navigate = (nextIndex: number) => {
    const bounded = Math.max(0, Math.min(chapters.length - 1, nextIndex));
    if (bounded === activeIndex) return;
    setDirection(bounded > activeIndex ? 1 : -1);
    setActiveIndex(bounded);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (target.closest("button, a")) return;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault();
        setDirection(1);
        setActiveIndex((current) => Math.min(chapters.length - 1, current + 1));
      }
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault();
        setDirection(-1);
        setActiveIndex((current) => Math.max(0, current - 1));
      }
      const numeric = Number(event.key);
      if (numeric >= 1 && numeric <= chapters.length) {
        setDirection(numeric - 1 > activeIndex ? 1 : -1);
        setActiveIndex(numeric - 1);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex]);

  const panels = [
    <OverviewPanel key="overview" onExplore={() => navigate(1)} />,
    <MethodPanel key="method" />,
    <BenchmarksPanel key="benchmarks" />,
    <CriticPanel key="critic" />,
    <HumanoidPanel key="humanoid" />,
    <AblationPanel key="ablation" />,
    <EvidencePanel key="evidence" />,
  ];

  return (
    <main className={styles.app} data-tone={activeChapter.tone}>
      <Atmosphere />
      <header className={styles.topbar}>
        <button type="button" className={styles.wordmark} onClick={() => navigate(0)} aria-label="RLPD overview">
          <span>R</span><strong>RLPD / OBSERVATORY</strong>
        </button>
        <div className={styles.topStatus}>
          <span>Interactive research record</span>
          <strong>{activeChapter.index} / 07</strong>
        </div>
        <a href={REPOSITORY} target="_blank" rel="noreferrer">Repository <Arrow /></a>
      </header>

      <div className={styles.shell}>
        <nav className={styles.chapterRail} aria-label="RLPD chapters" role="tablist">
          {chapters.map((chapter, index) => (
            <button
              type="button"
              role="tab"
              aria-selected={activeIndex === index}
              aria-controls="rlpd-active-panel"
              key={chapter.id}
              onClick={() => navigate(index)}
            >
              <span>{chapter.index}</span>
              <span><strong>{chapter.label}</strong><small>{chapter.hint}</small></span>
              <i />
            </button>
          ))}
        </nav>

        <section className={styles.stage}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.article
              id="rlpd-active-panel"
              role="tabpanel"
              aria-label={activeChapter.label}
              key={activeChapter.id}
              className={cx(styles.panel, activeChapter.id === "ablation" && styles.lightPanel)}
              custom={direction}
              variants={panelVariants}
              initial={reduced ? false : "enter"}
              animate="center"
              exit={reduced ? undefined : "exit"}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {panels[activeIndex]}
            </motion.article>
          </AnimatePresence>

          <footer className={styles.deckControls}>
            <button type="button" onClick={() => navigate(activeIndex - 1)} disabled={activeIndex === 0}>
              <Arrow direction="left" /> Previous
            </button>
            <div className={styles.deckProgress} aria-hidden>
              {chapters.map((chapter, index) => <i key={chapter.id} className={index <= activeIndex ? styles.progressActive : undefined} />)}
            </div>
            <span>Arrow keys or chapter tabs</span>
            <button type="button" onClick={() => navigate(activeIndex + 1)} disabled={activeIndex === chapters.length - 1}>
              Next <Arrow direction="right" />
            </button>
          </footer>
        </section>
      </div>
    </main>
  );
}
