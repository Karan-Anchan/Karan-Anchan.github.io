"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { createPortal } from "react-dom";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { sound } from "@/lib/sound";
import styles from "./rlpd.module.css";

const REPOSITORY =
  "https://github.com/Karan-Anchan/rlpd-offline-to-online-rl";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;

const subscribeToHydration = () => () => {};

function useStableMotionPreference() {
  const reduced = useReducedMotion();
  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );

  return !hydrated || Boolean(reduced);
}

const SOUND_CHANGE_EVENT = "rlpd:sound-change";

function subscribeToSoundPreference(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(SOUND_CHANGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(SOUND_CHANGE_EVENT, onStoreChange);
  };
}

function readSoundPreference() {
  return sound.isEnabled();
}

function SoundGlyph({ on }: { on: boolean }) {
  return (
    <svg aria-hidden viewBox="0 0 20 20">
      <path d="M3.5 8h3l3.5-3v10l-3.5-3h-3V8Z" />
      {on ? (
        <>
          <path d="M13 7.1c.9.8 1.3 1.7 1.3 2.9s-.4 2.1-1.3 2.9" />
          <path d="M15.5 4.8c1.5 1.4 2.2 3.1 2.2 5.2s-.7 3.8-2.2 5.2" />
        </>
      ) : (
        <path d="m13.2 8 4 4m0-4-4 4" />
      )}
    </svg>
  );
}

function RlpdSoundToggle() {
  const on = useSyncExternalStore(
    subscribeToSoundPreference,
    readSoundPreference,
    () => true,
  );

  const toggle = () => {
    const next = !sound.isEnabled();
    sound.setEnabled(next);
    if (next) {
      sound.unlock();
      sound.chime(true);
    }
    window.dispatchEvent(new Event(SOUND_CHANGE_EVENT));
  };

  return (
    <button
      type="button"
      className={styles.soundToggle}
      data-sound="toggle"
      aria-pressed={on}
      aria-label={`Interface sounds ${on ? "on" : "off"}. Toggle interface sounds.`}
      title={`Interface sounds: ${on ? "on" : "off"}`}
      onClick={toggle}
    >
      <SoundGlyph on={on} />
    </button>
  );
}

function RlpdSoundLayer() {
  useEffect(() => {
    sound.sync();

    const root = document.querySelector("[data-rlpd-sound-root]");
    if (!root) return;

    const findInteractive = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return null;
      const interactive = target.closest<HTMLElement>("a, button, [role='tab']");
      return interactive && root.contains(interactive) ? interactive : null;
    };

    let audioUnlocked = false;
    let lastHover = 0;
    const onPointerOver = (event: PointerEvent) => {
      if (!audioUnlocked || event.pointerType !== "mouse") return;
      const interactive = findInteractive(event.target);
      if (!interactive || (interactive instanceof HTMLButtonElement && interactive.disabled)) return;
      const previous = findInteractive(event.relatedTarget);
      if (previous === interactive) return;
      const now = performance.now();
      if (now - lastHover < 110) return;
      lastHover = now;
      sound.tick();
    };

    const onPointerDown = (event: PointerEvent) => {
      const interactive = findInteractive(event.target);
      if (!interactive || (interactive instanceof HTMLButtonElement && interactive.disabled)) return;
      sound.unlock();
      audioUnlocked = true;
      const cue = interactive.dataset.sound;
      if (cue === "toggle" || cue === "silent") return;
      if (cue === "chapter") {
        sound.chapter(Number(interactive.dataset.soundIndex ?? 0));
        return;
      }
      if (cue === "reveal") {
        sound.reveal();
        return;
      }
      if (cue === "dismiss") {
        sound.dismiss();
        return;
      }
      sound.tap();
    };

    root.addEventListener("pointerover", onPointerOver as EventListener, { passive: true });
    root.addEventListener("pointerdown", onPointerDown as EventListener, { passive: true });
    return () => {
      root.removeEventListener("pointerover", onPointerOver as EventListener);
      root.removeEventListener("pointerdown", onPointerDown as EventListener);
    };
  }, []);

  return null;
}

const chapters = [
  { id: "overview", index: "01", label: "Overview", hint: "Study scope", tone: "amber" },
  { id: "method", index: "02", label: "Method", hint: "Three guardrails", tone: "mint" },
  { id: "benchmarks", index: "03", label: "Benchmarks", hint: "Three tasks", tone: "violet" },
  { id: "critic", index: "04", label: "Critic", hint: "Divergence trace", tone: "coral" },
  { id: "humanoid", index: "05", label: "Humanoid", hint: "Extension", tone: "mint" },
  { id: "ablation", index: "06", label: "Ablation", hint: "Online-only", tone: "amber" },
  { id: "evidence", index: "07", label: "Evidence", hint: "Audit & team", tone: "violet" },
] as const;

const results = [
  {
    task: "Hopper-v5",
    short: "Hopper",
    rollout: "/rlpd/rollout-hopper.mp4",
    poster: "/rlpd/rollout-hopper.webp",
    rolloutScore: "97.1",
    reading: "RLPD holds a 22.4-point lead over IQL while preserving a complete three-seed result.",
    values: [
      { method: "RLPD", value: 88.0, spread: 6.8, tone: "rlpd" },
      { method: "IQL", value: 65.6, spread: 29.2, tone: "iql" },
      { method: "SACfD", value: 41.9, spread: 11.3, tone: "sac" },
    ],
  },
  {
    task: "Walker2d-v5",
    short: "Walker2d",
    rollout: "/rlpd/rollout-walker.mp4",
    poster: "/rlpd/rollout-walker.webp",
    rolloutScore: "96.8",
    reading: "The narrow ±0.7 seed spread is the strongest consistency signal in the locomotion study.",
    values: [
      { method: "RLPD", value: 89.6, spread: 0.7, tone: "rlpd" },
      { method: "IQL", value: 84.3, spread: 6.6, tone: "iql" },
      { method: "SACfD", value: 8.1, spread: 2.1, tone: "sac" },
    ],
  },
  {
    task: "HalfCheetah-v5",
    short: "HalfCheetah",
    rollout: "/rlpd/rollout-halfcheetah.mp4",
    poster: "/rlpd/rollout-halfcheetah.webp",
    rolloutScore: "103.1",
    reading: "RLPD edges IQL by 2.6 points and remains inside the same 88–90 band as the other tasks.",
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
  ["Locomotion · medium", "27 complete", "three algorithms × three seeds × three tasks"],
  ["Locomotion · expert", "seed 0 complete", "seeds 1–2 stop at 57.5k and remain labeled"],
  ["Humanoid · IQL / RLPD", "3 seeds · 1M", "IQL begins after one million offline updates"],
  ["Humanoid · SACfD", "2 of 3 NaN", "divergent runs remain inside the aggregate record"],
  ["Online-only", "3 seeds · 500k", "the only ablation with matched three-seed coverage"],
  ["RLPD · expert Humanoid", "n = 1 · 1M", "single-seed result; excluded from aggregate claims"],
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
  const reduced = useStableMotionPreference();

  return (
    <div className={styles.overviewLayout}>
      <div className={styles.overviewCopy}>
        <span className={styles.eyebrow}><b>01</b>research reproduction / 2026</span>
        <h1>
          We reproduced RLPD.
          <em>The ablation changed the conclusion.</em>
        </h1>
        <p>
          A three-person PyTorch reproduction of offline-to-online reinforcement
          learning, extended to Humanoid-v5 and evaluated across three seeds.
          The final ablation produced a result the original paper did not test.
        </p>
        <div className={styles.overviewActions}>
          <motion.button
            type="button"
            className={styles.primaryAction}
            data-sound="chapter"
            data-sound-index="1"
            onClick={onExplore}
            whileTap={reduced ? undefined : { scale: 0.97 }}
          >
            <span><small>Start here</small>Explore the method</span>
            <Arrow direction="right" />
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
        transition={{ duration: 0.48, ease: EASE_OUT }}
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
  const reduced = useStableMotionPreference();

  return (
    <div className={styles.mixGlyph} aria-hidden>
      {Array.from({ length: 24 }).map((_, index) => (
        <motion.i
          key={index}
          className={index < 12 ? styles.offlineSample : styles.onlineSample}
          initial={reduced ? false : { scaleY: 0.2, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={reduced ? undefined : {
            duration: 0.66,
            delay: index * 0.025,
            ease: EASE_OUT,
          }}
        />
      ))}
    </div>
  );
}

function BoundGlyph() {
  const reduced = useStableMotionPreference();

  return (
    <svg className={styles.boundGlyph} viewBox="0 0 360 92" preserveAspectRatio="none" aria-hidden>
      <line x1="0" x2="360" y1="15" y2="15" />
      <line x1="0" x2="360" y1="77" y2="77" />
      <path className={styles.boundGhost} d="M4 71 C45 66 63 22 102 39 S162 70 202 47 S262 21 293 44 S329 61 356 32" />
      <motion.path
        className={styles.boundTrace}
        d="M4 71 C45 66 63 22 102 39 S162 70 202 47 S262 21 293 44 S329 61 356 32"
        initial={reduced ? false : { pathLength: 0, opacity: 0.55 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={reduced ? undefined : {
          duration: 1.1,
          ease: EASE_OUT,
        }}
      />
    </svg>
  );
}

function EnsembleGlyph() {
  const reduced = useStableMotionPreference();

  return (
    <div className={styles.ensembleGlyph} aria-hidden>
      {Array.from({ length: 10 }).map((_, index) => (
        <motion.i
          key={index}
          initial={reduced ? false : { opacity: 0, y: 7 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={reduced ? undefined : {
            duration: 0.55,
            delay: index * 0.045,
            ease: EASE_OUT,
          }}
        ><span /></motion.i>
      ))}
    </div>
  );
}

function MethodPanel() {
  const [activeGuardrail, setActiveGuardrail] = useState(0);
  const guardrailGridRef = useRef<HTMLDivElement>(null);
  const reduced = useStableMotionPreference();
  const guardrails = [
    {
      code: "ratio = 0.5 · batch = 256",
      label: "01 / mix",
      value: "50 / 50",
      title: "Symmetric sampling",
      copy: "Every update draws 128 online and 128 offline transitions. The dataset enters through the sampler; RLPD has no separate pretraining phase.",
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
        title="Three implementation choices"
        accent="define the method."
        copy="The method samples evenly, constrains the critic, and performs more updates per environment step. Each value comes from the checked configuration."
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
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32, delay: index * 0.06, ease: EASE_OUT }}
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
  const reduced = useStableMotionPreference();
  const result = results[selectedTask];
  const lead = result.values[0].value - result.values[1].value;

  return (
    <div className={cx(styles.panelStack, styles.benchmarkPanel)}>
      <PanelHeader
        index="03"
        eyebrow="locomotion / medium data"
        title="The locomotion results reproduced."
        accent="RLPD was the most consistent."
          copy="RLPD finished between 88 and 90 on all three tasks. Select an environment to compare its scores and policy behavior."
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
              transition={{ duration: 0.22, ease: EASE_OUT }}
            >
              {result.values.map((item, index) => (
                <div className={styles.scoreRow} key={item.method}>
                  <span>{item.method}</span>
                  <div><motion.i
                    className={styles[item.tone]}
                    initial={reduced ? false : { scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.52, delay: index * 0.06, ease: EASE_OUT }}
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
          <div className={styles.scoreReading}>
            <span>What to notice</span>
            <p>{result.reading}</p>
            <small>245k environment steps · Minari v5 normalization · expert score = 100.</small>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.figure
            className={styles.policyCard}
            key={result.rollout}
            initial={reduced ? false : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduced ? undefined : { opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.24, ease: EASE_OUT }}
          >
            <video
              src={result.rollout}
              poster={result.poster}
              aria-label={`${result.task} RLPD policy rollout`}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
            <span>live policy loop · medium-data seed 0</span>
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
  const reduced = useStableMotionPreference();
  const sacEnd = chartPoint(criticSACfD[criticSACfD.length - 1]);
  const rlpdEnd = chartPoint(criticRLPD[criticRLPD.length - 1]);
  const firstLogX = chartPoint(criticSACfD[0]).x;

  return (
    <div className={styles.panelStack}>
      <PanelHeader
        index="04"
        eyebrow="Walker2d / critic redline"
        title="SACfD’s critic diverged."
        accent="Mean Q reached 85,300."
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
            <path
              d={linePath(criticSACfD)}
              className={cx(styles.sacCurve, styles.curveUnderlay)}
            />
            <path
              d={linePath(criticRLPD)}
              className={cx(styles.rlpdCurve, styles.curveUnderlay)}
            />
            <path
              d={linePath(criticSACfD)}
              className={cx(styles.sacCurve, styles.curveComplete, activeSeries === "rlpd" && styles.curveMuted)}
            />
            <path
              d={linePath(criticRLPD)}
              className={cx(styles.rlpdCurve, styles.curveComplete, activeSeries === "sacfd" && styles.curveMuted)}
            />
            {!reduced && (
              <motion.circle
                r="4"
                className={styles.traceSignal}
                animate={{ opacity: [0.2, 1, 0.2], scale: [0.72, 1.35, 0.72] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: EASE_IN_OUT }}
              >
                <animateMotion dur="3.8s" repeatCount="indefinite" path={linePath(criticSACfD)} />
              </motion.circle>
            )}
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
  const launcherRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const reduced = useStableMotionPreference();
  const [animateOpen, setAnimateOpen] = useState(true);

  useEffect(() => {
    if (!open) return;
    const launcher = launcherRef.current;
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
      launcher?.focus();
    };
  }, [open]);

  return (
    <>
      <motion.button
        type="button"
        ref={launcherRef}
        className={styles.figureLauncher}
        data-sound="reveal"
        onClick={() => setOpen(true)}
        onPointerDown={() => setAnimateOpen(true)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") setAnimateOpen(false);
        }}
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
              initial={reduced || !animateOpen ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduced || !animateOpen ? undefined : { opacity: 0 }}
              transition={{ duration: 0.18, ease: EASE_OUT }}
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
                initial={reduced || !animateOpen ? false : { opacity: 0, scale: 0.97, y: 14 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={reduced || !animateOpen ? undefined : { opacity: 0, scale: 0.985, y: 8 }}
                transition={{ duration: 0.24, ease: EASE_OUT }}
              >
                <button
                  type="button"
                  ref={closeRef}
                  data-sound="dismiss"
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
        title="Humanoid changed"
        accent="the comparison."
        copy="Humanoid expands the problem to 348 observations and 17 actuators. Every method ran to one million environment steps; divergent runs stayed in the record."
      />
      <div className={styles.humanoidLayout}>
        <figure className={styles.humanoidMedia}>
          <video
            src="/rlpd/rollout-humanoid.mp4"
            poster="/rlpd/rollout-humanoid.webp"
            aria-label="Best individual IQL Humanoid-v5 rollout, seed 2"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
          <span>live policy loop · regenerated at 960 × 600</span>
          <figcaption>IQL · seed 2 · 87.8 last-five normalized</figcaption>
        </figure>
        <div className={styles.humanoidStats}>
          <article>
            <div className={styles.statHead}><span>IQL · 3 seeds</span><em>best aggregate</em></div>
            <strong>70.1 <small>± 16.2</small></strong>
            <p>Highest mean return, but the wide spread shows that behavior still varied substantially across seeds.</p>
            <footer><span>training context</span><b>1M offline + 1M online</b></footer>
          </article>
          <article>
            <div className={styles.statHead}><span>RLPD · 3 seeds</span><em>bounded critic</em></div>
            <strong>13.0 <small>± 13.8</small></strong>
            <p>Numerical stability held, yet the aggregate return shows that a bounded critic did not guarantee locomotion.</p>
            <footer><span>training context</span><b>no pretrain + 1M online</b></footer>
          </article>
          <article>
            <div className={styles.statHead}><span>SACfD · 3 seeds</span><em>failure retained</em></div>
            <strong>2 / 3 <small>NaN</small></strong>
            <p>Two runs diverged and were not retried; the surviving seed cannot stand in for a robust aggregate.</p>
            <footer><span>reporting rule</span><b>failures remain visible</b></footer>
          </article>
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
          <p>The video is one best-seed behavior sample. The three-seed 70.1 ± 16.2 aggregate—not the cleanest rollout—is the result.</p>
        </div>
      </div>
    </div>
  );
}

function AblationPanel() {
  const reduced = useStableMotionPreference();
  const bars = [
    {
      label: "RLPD · 50/50",
      value: 6.024,
      display: "6.0 ± 2.0",
      note: "128 offline + 128 online samples in every update",
      className: styles.mixBar,
    },
    {
      label: "Online-only",
      value: 27.966,
      display: "28.0 ± 15.2",
      note: "same architecture and 500k horizon; sampling ratio = 1.0",
      className: styles.onlineBar,
    },
  ];

  return (
    <div className={styles.panelStack}>
      <PanelHeader
        index="06"
        eyebrow="matched-horizon ablation / 500k"
        title="Removing offline data"
        accent="improved the policy."
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
                transition={{ duration: 0.56, delay: index * 0.08, ease: EASE_OUT }}
                style={{ width: `${(bar.value / 32) * 100}%` }}
              /></div>
              <p>{bar.note}</p>
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
          <p>One controlled change removed offline samples from the update batch.</p>
        </div>
        <article className={styles.ablationReading}>
          <h3>The architecture stayed fixed; the data mix was the constraint.</h3>
          <p>
            This result does not invalidate offline-to-online RL. It shows that the benefit depends
            on data quality, policy coverage, tuning, and the handoff between offline and online
            learning. Having an offline dataset is not sufficient by itself.
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
    {
      title: "Variance is part of the result.",
      copy: "Three seeds expose instability that a single polished rollout would conceal.",
    },
    {
      title: "Implementation shapes the claim.",
      copy: "LayerNorm, ensemble size, update ratio, and pretraining budget change what is being compared.",
    },
    {
      title: "Ablations can change the question.",
      copy: "Online-only outperforming 50/50 shifts attention from architecture to dataset compatibility.",
    },
    {
      title: "Behavior needs numeric context.",
      copy: "Every policy replay is paired with aggregate return, seed spread, and critic behavior.",
    },
  ];

  return (
    <div className={styles.panelStack}>
      <PanelHeader
        index="07"
        eyebrow="evidence audit / provenance"
        title="Every result includes"
        accent="its sample count."
        copy="Incomplete runs stay visible. Best seeds never masquerade as aggregates, and every figure remains available at full resolution."
      />
      <div className={styles.evidenceLayout}>
        <div className={styles.auditTable} role="table" aria-label="Experiment coverage">
          {auditRows.map(([label, count, note], index) => (
            <div className={styles.auditRow} role="row" key={label}>
              <i aria-hidden>{String(index + 1).padStart(2, "0")}</i>
              <span role="cell">{label}</span><strong role="cell">{count}</strong><em role="cell">{note}</em>
            </div>
          ))}
        </div>
        <aside className={styles.evidenceAside}>
          <div className={styles.lessonGrid}>
            {lessons.map((lesson, index) => (
              <div key={lesson.title}>
                <span>0{index + 1}</span>
                <h3>{lesson.title}</h3>
                <p>{lesson.copy}</p>
              </div>
            ))}
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

type PanelMotion = { direction: number; instant: boolean };

const panelVariants = {
  enter: ({ direction, instant }: PanelMotion) => ({
    opacity: 0,
    transform: instant
      ? "translate3d(0, 0, 0)"
      : `translate3d(${direction > 0 ? 22 : -22}px, 0, 0)`,
    filter: instant ? "blur(0px)" : "blur(4px)",
  }),
  center: { opacity: 1, transform: "translate3d(0, 0, 0)", filter: "blur(0px)" },
  exit: ({ direction, instant }: PanelMotion) => ({
    opacity: 0,
    transform: instant
      ? "translate3d(0, 0, 0)"
      : `translate3d(${direction > 0 ? -16 : 16}px, 0, 0)`,
    filter: instant ? "blur(0px)" : "blur(3px)",
  }),
};

export function RlpdExperience() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [instantNavigation, setInstantNavigation] = useState(false);
  const chapterButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const reduced = useStableMotionPreference();
  const activeChapter = chapters[activeIndex];
  const previousChapter = chapters[activeIndex - 1];
  const nextChapter = chapters[activeIndex + 1];

  const navigate = useCallback((nextIndex: number, updateHistory = true, instant = false) => {
    const bounded = Math.max(0, Math.min(chapters.length - 1, nextIndex));
    if (bounded === activeIndex) return;
    setInstantNavigation(instant);
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
      setInstantNavigation(true);
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
        navigate(activeIndex + 1, true, true);
      }
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault();
        navigate(activeIndex - 1, true, true);
      }
      const numeric = Number(event.key);
      if (numeric >= 1 && numeric <= chapters.length) {
        navigate(numeric - 1, true, true);
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
  const panelMotion = { direction, instant: instantNavigation };

  return (
    <main className={styles.app} data-tone={activeChapter.tone} data-rlpd-sound-root>
      <RlpdSoundLayer />
      <Atmosphere />
      <header className={styles.topbar}>
        <button
          type="button"
          className={styles.wordmark}
          data-sound="chapter"
          data-sound-index="0"
          onClick={() => navigate(0)}
          aria-label="RLPD overview"
        >
          <span>R</span><strong>RLPD / OBSERVATORY</strong>
        </button>
        <div className={styles.topStatus}>
          <span>Select a chapter · arrow keys also work</span>
          <strong>{activeChapter.index} / 07</strong>
        </div>
        <div className={styles.topActions}>
          <RlpdSoundToggle />
          <a href={REPOSITORY} target="_blank" rel="noreferrer">Repository <Arrow /></a>
        </div>
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
              data-sound="chapter"
              data-sound-index={index}
              onClick={() => navigate(index)}
            >
              <span>{chapter.index}</span>
              <span><strong>{chapter.label}</strong><small>{chapter.hint}</small></span>
              <i />
            </button>
          ))}
        </nav>

        <section className={styles.stage}>
          <AnimatePresence mode="wait" custom={panelMotion}>
            <motion.article
              id="rlpd-active-panel"
              role="tabpanel"
              aria-label={activeChapter.label}
              key={activeChapter.id}
              className={cx(styles.panel, activeChapter.id === "ablation" && styles.lightPanel)}
              custom={panelMotion}
              variants={panelVariants}
              initial={reduced || instantNavigation ? false : "enter"}
              animate="center"
              exit={reduced || instantNavigation ? undefined : "exit"}
              transition={{ duration: instantNavigation ? 0 : 0.26, ease: EASE_OUT }}
            >
              {panels[activeIndex]}
            </motion.article>
          </AnimatePresence>

          <footer className={styles.deckControls}>
            <button
              type="button"
              data-sound="chapter"
              data-sound-index={Math.max(0, activeIndex - 1)}
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
              data-sound="chapter"
              data-sound-index={Math.min(chapters.length - 1, activeIndex + 1)}
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
