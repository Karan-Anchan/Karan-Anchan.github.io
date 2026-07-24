"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { createPortal } from "react-dom";
import { useCallback, useEffect, useRef, useState } from "react";
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
  [5000, 3.955], [10000, 488.588], [15000, 407.693], [20000, 377.341],
  [25000, 382.275], [30000, 390.081], [35000, 409.505], [40000, 433.985],
  [45000, 442.057], [50000, 452.137], [55000, 455.703], [60000, 469.826],
  [65000, 467.76], [70000, 476.291], [75000, 477.207], [80000, 483.933],
  [85000, 484.362], [90000, 492.654], [95000, 497.464], [100000, 498.353],
  [105000, 508.027], [110000, 511.258], [115000, 505.269], [120000, 514.607],
  [125000, 516.739], [130000, 512.839], [135000, 517.299], [140000, 519.888],
  [145000, 522.137], [150000, 521.183], [155000, 527.762], [160000, 529.273],
  [165000, 525.931], [170000, 523.108], [175000, 537.949], [180000, 531.47],
  [185000, 533.566], [190000, 534.335], [195000, 535.677], [200000, 543.408],
  [205000, 541.577], [210000, 537.8], [215000, 540.638], [220000, 541.96],
  [225000, 539.044], [230000, 541.761], [235000, 543.517], [240000, 550.552],
  [245000, 545.352],
];

const criticSACfD: Array<[number, number]> = [
  [5000, 0.1], [10000, 187.206], [15000, 361.775], [20000, 516.609],
  [25000, 688.225], [30000, 889.962], [35000, 1130.521], [40000, 1421.03],
  [45000, 1773.719], [50000, 2241.607], [55000, 2891.569], [60000, 3619.731],
  [65000, 4241.652], [70000, 5108.083], [75000, 5995.565], [80000, 6841.607],
  [85000, 7752.195], [90000, 8899.011], [95000, 9900.35], [100000, 11129.675],
  [105000, 12625.935], [110000, 14433.163], [115000, 16431.955], [120000, 18772.285],
  [125000, 20473.886], [130000, 22761.16], [135000, 25717.467], [140000, 28889.486],
  [145000, 31927.663], [150000, 35123.775], [155000, 37857.192], [160000, 42043.068],
  [165000, 44952.309], [170000, 49545.659], [175000, 53154.97], [180000, 57612.642],
  [185000, 60300.689], [190000, 64113.395], [195000, 66675.384], [200000, 71850.415],
  [205000, 76049.427], [210000, 75151.358], [215000, 77635.658], [220000, 78442.116],
  [225000, 81460.81], [230000, 83725.026], [235000, 84531.951], [240000, 85041.897],
  [245000, 85300.175],
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
        <Image
          src="/rlpd/hero-robot-v3.webp"
          alt="Humanoid training agent walking through a dark observation field"
          fill
          sizes="(max-width: 680px) calc(100vw - 50px), (max-width: 980px) 42vw, 34vw"
          priority
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
  const [activeGuardrail, setActiveGuardrail] = useState(0);
  const guardrailGridRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const guardrails = [
    {
      code: "ratio = 0.5 · batch = 256",
      label: "01 / mix",
      value: "50 / 50",
      title: "Symmetric sampling",
      copy: "Every update draws 128 online and 128 offline transitions. The dataset enters through the sampler—there is no RLPD pretraining phase.",
      labels: ["128 offline", "128 online"],
      outcome: "Neither source can silently dominate an update.",
      glyph: <MixGlyph />,
    },
    {
      code: "layernorm = true",
      label: "02 / bound",
      value: "LN",
      title: "LayerNorm critic",
      copy: "Normalization limits extrapolation on actions the offline data never covered. Removing it on Humanoid sent mean Q to 8.9×10¹⁰.",
      labels: ["action estimate", "normalized critic path"],
      outcome: "Unseen-action values stay numerically controlled.",
      glyph: <BoundGlyph />,
    },
    {
      code: "ensemble = 10 · utd = 20",
      label: "03 / push",
      value: "10 × 20",
      title: "Ensemble + high UTD",
      copy: "Ten critics and twenty gradient updates per environment step trade compute for sample efficiency and reduce single-critic overestimation.",
      labels: ["10 critic heads", "20 updates / step"],
      outcome: "More compute is exchanged for faster online adaptation.",
      glyph: <EnsembleGlyph />,
    },
  ];

  const revealGuardrail = (nextIndex: number) => {
    const bounded = Math.max(0, Math.min(guardrails.length - 1, nextIndex));
    const grid = guardrailGridRef.current;
    const card = grid?.children[bounded] as HTMLElement | undefined;
    if (grid && card) {
      grid.scrollTo({
        left: card.offsetLeft - grid.offsetLeft,
        behavior: reduced ? "auto" : "smooth",
      });
    }
    setActiveGuardrail(bounded);
  };

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
      <div className={styles.methodMobileControls} aria-label="Method guardrail controls">
        <span aria-live="polite">{activeGuardrail + 1} of {guardrails.length} guardrails</span>
        <div>
          <button
            type="button"
            onClick={() => revealGuardrail(activeGuardrail - 1)}
            disabled={activeGuardrail === 0}
            aria-label="Previous guardrail"
          ><Arrow direction="left" /> Previous</button>
          <button
            type="button"
            onClick={() => revealGuardrail(activeGuardrail + 1)}
            disabled={activeGuardrail === guardrails.length - 1}
            aria-label="Next guardrail"
          >Next <Arrow direction="right" /></button>
        </div>
      </div>
      <div
        className={styles.guardrailGrid}
        ref={guardrailGridRef}
        onScroll={(event) => {
          const grid = event.currentTarget;
          const cardWidth = grid.firstElementChild?.getBoundingClientRect().width ?? grid.clientWidth;
          const gap = 8;
          setActiveGuardrail(Math.max(0, Math.min(guardrails.length - 1, Math.round(grid.scrollLeft / (cardWidth + gap)))));
        }}
      >
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
            <div className={styles.glyphCaption}>
              <span>{guardrail.labels[0]}</span>
              <span>{guardrail.labels[1]}</span>
            </div>
            <h3>{guardrail.title}</h3>
            <p>{guardrail.copy}</p>
            <code>{guardrail.code}</code>
            <footer className={styles.guardrailOutcome}>
              <span>Design role</span>
              <strong>{guardrail.outcome}</strong>
            </footer>
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
  const lead = result.values[0].value - result.values[1].value;

  return (
    <div className={cx(styles.panelStack, styles.benchmarkPanel)}>
      <PanelHeader
        index="03"
        eyebrow="locomotion / medium data"
        title="The reproduction held."
        accent="Consistency was stronger."
          copy="RLPD alone finished between 88 and 90 on all three tasks. Select an environment to pair its score with observed policy behavior."
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
          <div className={styles.resultInsight}>
            <div><span>RLPD lead</span><strong>+{lead.toFixed(1)}</strong></div>
            <div><span>seed spread</span><strong>±{result.values[0].spread.toFixed(1)}</strong></div>
            <div><span>coverage</span><strong>3 / 3 runs</strong></div>
          </div>
          <p>245k environment steps · Minari v5 normalization · expert score = 100.</p>
        </div>

        <AnimatePresence mode="wait">
          <motion.figure
            className={styles.policyCard}
            key={result.rollout}
            initial={reduced ? false : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduced ? undefined : { opacity: 0, scale: 0.98 }}
          >
            <Image
              src={result.rollout}
              alt={`${result.task} RLPD policy rollout`}
              fill
              sizes="(max-width: 680px) calc(100vw - 50px), (max-width: 980px) 40vw, 30vw"
            />
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
  const x = 58 + (step / 245000) * 538;
  const normalized = (Math.log10(Math.max(q, 0.1)) + 1) / 6;
  const y = 236 - normalized * 190;
  return { x, y };
}

function linePath(values: Array<[number, number]>) {
  return values.map((point, index) => {
    const { x, y } = chartPoint(point);
    return `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
}

function visibleCriticPoints(values: Array<[number, number]>) {
  return values.filter((_, index) =>
    index === 0 || (index + 1) % 5 === 0 || index === values.length - 1,
  );
}

function formatCriticStep(step: number) {
  return `${step / 1000}k`;
}

function CriticPanel() {
  const [activeSeries, setActiveSeries] = useState<"both" | "rlpd" | "sacfd">("both");
  const reduced = useReducedMotion();
  const sacEnd = chartPoint(criticSACfD[criticSACfD.length - 1]);
  const rlpdEnd = chartPoint(criticRLPD[criticRLPD.length - 1]);
  const firstLogX = chartPoint(criticSACfD[0]).x;

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
            <div className={styles.chartContext}>
              <strong>mean Q · log scale</strong>
              <span>three-seed mean · every 5k steps</span>
            </div>
            <div>
              {(["both", "rlpd", "sacfd"] as const).map((series) => (
                <button
                  type="button"
                  key={series}
                  aria-pressed={activeSeries === series}
                  onClick={() => setActiveSeries(series)}
                >
                  {series !== "both" && <i className={series === "sacfd" ? styles.sacSwatch : styles.rlpdSwatch} />}
                  {series === "both" ? "Both" : series === "sacfd" ? "SACfD" : "RLPD"}
                </button>
              ))}
            </div>
          </div>
          <svg viewBox="0 0 700 282" role="img" aria-labelledby="critic-title critic-desc">
            <title id="critic-title">Walker2d critic values</title>
            <desc id="critic-desc">
              The first recorded critic statistic is at 5,000 environment steps.
              SACfD rises from 0.1 to 85,300 while RLPD ends near 545.
            </desc>
            <rect
              x="58"
              y="46"
              width={firstLogX - 58}
              height="190"
              className={styles.unloggedBand}
            />
            <text x="62" y="35" className={styles.firstLogNote}>first critic log → 5k</text>
            {[-1, 1, 3, 5].map((tick) => {
              const y = 236 - ((tick + 1) / 6) * 190;
              return <g key={tick}><line x1="58" x2="596" y1={y} y2={y} /><text x="10" y={y + 4}>10^{tick}</text></g>;
            })}
            {[0, 50000, 100000, 150000, 200000, 245000].map((tick) => {
              const x = 58 + (tick / 245000) * 538;
              return <text key={tick} x={x} y="260" textAnchor="middle">{formatCriticStep(tick)}</text>;
            })}
            <text x="327" y="279" textAnchor="middle" className={styles.axisTitle}>environment steps</text>
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
            {visibleCriticPoints(criticSACfD).map((point) => {
              const { x, y } = chartPoint(point);
              const label = `SACfD · ${formatCriticStep(point[0])} · ${Math.round(point[1]).toLocaleString()}`;
              return (
                <g key={`s-${point[0]}`} tabIndex={0} role="img" aria-label={label}>
                  <circle cx={x} cy={y} r="10" className={styles.pointHit} />
                  <circle cx={x} cy={y} r={point[0] === 245000 ? "5" : "3.1"} className={cx(styles.sacPoint, activeSeries === "rlpd" && styles.curveMuted)} />
                  <title>{label}</title>
                </g>
              );
            })}
            {visibleCriticPoints(criticRLPD).map((point) => {
              const { x, y } = chartPoint(point);
              const label = `RLPD · ${formatCriticStep(point[0])} · ${Math.round(point[1]).toLocaleString()}`;
              return (
                <g key={`r-${point[0]}`} tabIndex={0} role="img" aria-label={label}>
                  <circle cx={x} cy={y} r="10" className={styles.pointHit} />
                  <circle cx={x} cy={y} r={point[0] === 245000 ? "5" : "3.1"} className={cx(styles.rlpdPoint, activeSeries === "sacfd" && styles.curveMuted)} />
                  <title>{label}</title>
                </g>
              );
            })}
            <line x1={sacEnd.x + 6} x2="621" y1={sacEnd.y} y2={sacEnd.y} className={styles.sacLabelLine} />
            <text x="688" y={sacEnd.y + 4} textAnchor="end" className={styles.sacDirectLabel}>SACfD 85.3k</text>
            <line x1={rlpdEnd.x + 6} x2="621" y1={rlpdEnd.y} y2={rlpdEnd.y} className={styles.rlpdLabelLine} />
            <text x="688" y={rlpdEnd.y + 4} textAnchor="end" className={styles.rlpdDirectLabel}>RLPD 545</text>
          </svg>
          <div className={styles.srOnly}>
            <table>
              <caption>Walker2d three-seed mean critic values at every 5,000 environment steps</caption>
              <thead><tr><th>Environment steps</th><th>RLPD mean Q</th><th>SACfD mean Q</th></tr></thead>
              <tbody>
                {criticRLPD.map(([step, q], index) => (
                  <tr key={step}><td>{step}</td><td>{q.toFixed(3)}</td><td>{criticSACfD[index][1].toFixed(3)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <aside className={styles.failureReadout}>
          <span>5k first log → 245k endpoint</span>
          <div><strong>85,300</strong><small>SACfD mean Q</small></div>
          <div><strong>545</strong><small>RLPD mean Q</small></div>
          <p>
            The unbounded critic coincides with a final return of 8.1 ± 2.1.
            Mean Q is not recorded at step 0; the log trace begins at the first
            valid positive three-seed mean at 5k.
          </p>
          <em>Solid coral = SACfD · dashed blue = RLPD · focus or hover a marker for its exact mean.</em>
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
  width,
  height,
}: {
  src: string;
  alt: string;
  caption: string;
  label: string;
  width: number;
  height: number;
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
                    <Image src={src} alt={alt} width={width} height={height} sizes="95vw" />
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
          <Image
            src="/rlpd/rollout-humanoid.webp"
            alt="Best individual IQL Humanoid-v5 rollout, seed 2"
            fill
            sizes="(max-width: 680px) calc(100vw - 50px), (max-width: 980px) 52vw, 46vw"
          />
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
            width={1742}
            height={627}
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
            width={1736}
            height={627}
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
              width={2060}
              height={594}
            />
            <FigureLauncher
              src="/rlpd/humanoid-results.webp"
              alt="Humanoid return and critic mean Q"
              label="Humanoid figure"
              caption="Humanoid-v5 · three-seed return and mean Q"
              width={1742}
              height={627}
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
  const chapterButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const reduced = useReducedMotion();
  const activeChapter = chapters[activeIndex];
  const previousChapter = chapters[activeIndex - 1];
  const nextChapter = chapters[activeIndex + 1];

  const navigate = useCallback((nextIndex: number, updateHistory = true) => {
    const bounded = Math.max(0, Math.min(chapters.length - 1, nextIndex));
    if (bounded === activeIndex) return;
    setDirection(bounded > activeIndex ? 1 : -1);
    setActiveIndex(bounded);
    if (updateHistory) {
      window.history.pushState(null, "", `#${chapters[bounded].id}`);
    }
  }, [activeIndex]);

  useEffect(() => {
    const syncFromHash = () => {
      const chapterIndex = chapters.findIndex((chapter) => chapter.id === window.location.hash.slice(1));
      if (chapterIndex < 0) return;
      setActiveIndex((current) => {
        setDirection(chapterIndex >= current ? 1 : -1);
        return chapterIndex;
      });
    };
    syncFromHash();
    window.addEventListener("popstate", syncFromHash);
    return () => window.removeEventListener("popstate", syncFromHash);
  }, []);

  useEffect(() => {
    chapterButtonRefs.current[activeIndex]?.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeIndex, reduced]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (target.closest("button, a")) return;
      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault();
        navigate(activeIndex + 1);
      }
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault();
        navigate(activeIndex - 1);
      }
      const numeric = Number(event.key);
      if (numeric >= 1 && numeric <= chapters.length) {
        navigate(numeric - 1);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, navigate]);

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
          <span>Select a chapter · arrow keys also work</span>
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
              ref={(element) => { chapterButtonRefs.current[index] = element; }}
              title={`Open chapter ${chapter.index}: ${chapter.label}`}
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
            <button
              type="button"
              onClick={() => navigate(activeIndex - 1)}
              disabled={!previousChapter}
              aria-label={previousChapter ? `Previous chapter: ${previousChapter.label}` : "No previous chapter"}
            >
              <Arrow direction="left" />
              <span className={styles.controlCopy}>
                <small>Previous</small>
                <strong>{previousChapter?.label ?? "Start"}</strong>
              </span>
            </button>
            <div className={styles.deckProgress} aria-hidden>
              {chapters.map((chapter, index) => <i key={chapter.id} className={index <= activeIndex ? styles.progressActive : undefined} />)}
            </div>
            <div className={styles.deckInstruction}>
              <span>Chapter {activeChapter.index} of 07</span>
              <strong>{nextChapter ? `Continue to ${nextChapter.label}` : "Research record complete"}</strong>
            </div>
            <button
              type="button"
              onClick={() => navigate(activeIndex + 1)}
              disabled={!nextChapter}
              aria-label={nextChapter ? `Next chapter: ${nextChapter.label}` : "No next chapter"}
            >
              <span className={styles.controlCopy}>
                <small>Next</small>
                <strong>{nextChapter?.label ?? "Complete"}</strong>
              </span>
              <Arrow direction="right" />
            </button>
          </footer>
        </section>
      </div>
    </main>
  );
}
