"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from "motion/react";
import { useRef } from "react";
import Link from "next/link";
import styles from "./rlpd.module.css";

const REPOSITORY =
  "https://github.com/Karan-Anchan/rlpd-offline-to-online-rl";

const results = [
  {
    task: "Hopper-v5",
    values: [
      { method: "RLPD", value: 88.0, spread: 6.8 },
      { method: "IQL", value: 65.6, spread: 29.2 },
      { method: "SACfD", value: 41.9, spread: 11.3 },
    ],
  },
  {
    task: "Walker2d-v5",
    values: [
      { method: "RLPD", value: 89.6, spread: 0.7 },
      { method: "IQL", value: 84.3, spread: 6.6 },
      { method: "SACfD", value: 8.1, spread: 2.1 },
    ],
  },
  {
    task: "HalfCheetah-v5",
    values: [
      { method: "RLPD", value: 88.6, spread: 1.6 },
      { method: "IQL", value: 86.0, spread: 7.8 },
      { method: "SACfD", value: 18.5, spread: 3.4 },
    ],
  },
];

const criticRLPD: Array<[number, number]> = [
  [25, 382.3],
  [50, 452.1],
  [75, 477.2],
  [100, 498.4],
  [125, 516.7],
  [150, 521.2],
  [175, 537.9],
  [200, 543.4],
  [225, 539.0],
  [245, 545.4],
];

const criticSACfD: Array<[number, number]> = [
  [25, 688.2],
  [50, 2241.6],
  [75, 5995.6],
  [100, 11129.7],
  [125, 20473.9],
  [150, 35123.8],
  [175, 53155.0],
  [200, 71850.4],
  [225, 81460.8],
  [245, 85300.2],
];

function cx(...values: Array<string | false | undefined>) {
  return values.filter(Boolean).join(" ");
}

function Arrow({ down = false }: { down?: boolean }) {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className={styles.arrowIcon}>
      <path d={down ? "M8 2v11M4 9l4 4 4-4" : "M3 13 13 3M6 3h7v7"} />
    </svg>
  );
}

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 28 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function SectionLabel({ index, children }: { index: string; children: string }) {
  return (
    <div className={styles.sectionLabel}>
      <span>{index}</span>
      <span>{children}</span>
    </div>
  );
}

function Header() {
  return (
    <header className={styles.header}>
      <a href="#top" className={styles.wordmark} aria-label="RLPD, back to top">
        <span className={styles.wordmarkMark}>R</span>
        <span>RLPD / OBSERVATORY</span>
      </a>
      <nav className={styles.nav} aria-label="Research story">
        <a href="#method">Method</a>
        <a href="#results">Results</a>
        <a href="#ablation">Ablation</a>
      </nav>
      <a className={styles.headerLink} href={REPOSITORY} target="_blank" rel="noreferrer">
        Repository <Arrow />
      </a>
    </header>
  );
}

function Hero() {
  const reduced = useReducedMotion();

  return (
    <section className={styles.hero} id="top">
      <div className={styles.heroField} aria-hidden />
      <div className={styles.heroGrid}>
        <div className={styles.heroCopy}>
          <motion.div
            className={styles.heroKicker}
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span>Research reproduction / 2026</span>
            <span className={styles.liveDot}>evaluation complete</span>
          </motion.div>

          <h1 className={styles.heroTitle}>
            <motion.span
              initial={reduced ? false : { y: "105%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            >
              We rebuilt RLPD.
            </motion.span>
            <motion.em
              initial={reduced ? false : { y: "105%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 0.26, ease: [0.22, 1, 0.36, 1] }}
            >
              The ablation changed the story.
            </motion.em>
          </h1>

          <motion.p
            className={styles.heroIntro}
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.55 }}
          >
            A three-person PyTorch reproduction of offline-to-online reinforcement
            learning—extended to Humanoid-v5, stress-tested across three seeds,
            and forced to explain a result the paper did not predict.
          </motion.p>

          <motion.div
            className={styles.heroActions}
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.68 }}
          >
            <a className={styles.primaryAction} href="#results">
              Read the evidence <Arrow down />
            </a>
            <a className={styles.secondaryAction} href={REPOSITORY} target="_blank" rel="noreferrer">
              View the code <Arrow />
            </a>
          </motion.div>

          <motion.div
            className={styles.teamLine}
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <span>Research team</span>
            <strong>Karan Anchan</strong>
            <strong>Pranav Menon</strong>
            <strong>Sridhar Kandi</strong>
          </motion.div>
        </div>

        <motion.div
          className={styles.heroStage}
          initial={reduced ? false : { opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
            src="/rlpd/hero-robot-v2.jpg"
            alt="Humanoid training agent walking through a dark embodied-learning observation field"
            className={styles.heroPoster}
            width={1024}
            height={1536}
            fetchPriority="high"
          />
          <div className={styles.stageGrid} aria-hidden />
          <div className={styles.stageReadout}>
            <span>policy / humanoid-v5</span>
            <span>step 995,000</span>
          </div>
          <div className={styles.heroFinding}>
            <span>unexpected result</span>
            <strong>+21.9</strong>
            <small>online-only vs 50/50 mix · matched 500k</small>
          </div>
        </motion.div>
      </div>

      <div className={styles.telemetryStrip} aria-label="Project telemetry">
        <div><span>Primary study</span><strong>3 tasks × 3 methods × 3 seeds</strong></div>
        <div><span>Locomotion budget</span><strong>245k environment steps</strong></div>
        <div><span>Extension</span><strong>Humanoid-v5 · 1M steps</strong></div>
        <div><span>Compute</span><strong>one RTX 5070 · 12 GB</strong></div>
      </div>
    </section>
  );
}

function FlowDiagram() {
  const nodes = [
    ["01", "offline data", "fixed demonstrations"],
    ["02", "critic update", "50 / 50 sampling"],
    ["03", "online action", "new experience"],
    ["04", "policy shift", "behavior evolves"],
  ];
  return (
    <div className={styles.flow}>
      <div className={styles.flowLine} />
      {nodes.map(([index, title, detail], nodeIndex) => (
        <Reveal className={styles.flowNode} delay={nodeIndex * 0.08} key={index}>
          <span>{index}</span>
          <strong>{title}</strong>
          <small>{detail}</small>
        </Reveal>
      ))}
    </div>
  );
}

function ResultBoard() {
  return (
    <div className={styles.resultBoard}>
      <div className={styles.boardHead}>
        <div className={styles.legend}>
          <span className={styles.rlpdSwatch}>RLPD</span>
          <span className={styles.iqlSwatch}>IQL</span>
          <span className={styles.sacSwatch}>SACfD</span>
        </div>
        <span>final normalized return · mean ± seed std</span>
      </div>
      <div className={styles.resultScale}><span>0</span><span>50</span><span>100 · expert</span></div>
      {results.map((result) => (
        <div className={styles.taskBlock} key={result.task}>
          <div className={styles.taskName}>{result.task}</div>
          <div className={styles.taskBars}>
            {result.values.map((value) => (
              <div className={styles.barRow} key={value.method}>
                <span className={styles.methodName}>{value.method}</span>
                <div className={styles.barTrack}>
                  <div
                    className={cx(
                      styles.barFill,
                      value.method === "RLPD" && styles.barRLPD,
                      value.method === "IQL" && styles.barIQL,
                      value.method === "SACfD" && styles.barSAC,
                    )}
                    style={{ width: `${value.value}%` }}
                  />
                </div>
                <strong>{value.value.toFixed(1)} <small>± {value.spread.toFixed(1)}</small></strong>
              </div>
            ))}
          </div>
        </div>
      ))}
      <p className={styles.boardFootnote}>
        Minari v5 normalization: random policy = 0, measured expert dataset = 100.
        Every row uses three complete runs at 245k environment steps.
      </p>
    </div>
  );
}

function RolloutCard({
  src,
  name,
  score,
}: {
  src: string;
  name: string;
  score: string;
}) {
  return (
    <figure className={styles.rolloutCard}>
      <div className={styles.rolloutViewport}>
        <img
          src={src}
          alt={`${name} RLPD policy rollout in MuJoCo`}
          width={360}
          height={360}
          loading="lazy"
        />
        <span className={styles.recBadge}>policy replay</span>
      </div>
      <figcaption>
        <div><strong>{name}</strong><span>RLPD · seed 0</span></div>
        <div><strong>{score}</strong><span>normalized</span></div>
      </figcaption>
    </figure>
  );
}

function linePath(values: Array<[number, number]>) {
  return values
    .map(([step, q], index) => {
      const x = 58 + (step / 245) * 594;
      const normalized = (Math.log10(q) - 2) / 3;
      const y = 272 - normalized * 214;
      return `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

function CriticChart() {
  const reduced = useReducedMotion();
  const yTicks = [2, 3, 4, 5];
  return (
    <div className={styles.criticChart}>
      <div className={styles.chartMeta}>
        <span>Walker2d-v5 · medium · three-seed mean</span>
        <span>mean Q · log scale</span>
      </div>
      <svg viewBox="0 0 700 320" role="img" aria-labelledby="critic-title critic-desc">
        <title id="critic-title">Walker2d critic values</title>
        <desc id="critic-desc">
          SACfD mean Q rises from 688 at 25 thousand steps to 85,300 at 245 thousand,
          while RLPD remains bounded near 545.
        </desc>
        {yTicks.map((tick) => {
          const y = 272 - ((tick - 2) / 3) * 214;
          return (
            <g key={tick}>
              <line x1="58" x2="652" y1={y} y2={y} className={styles.chartGridLine} />
              <text x="16" y={y + 4} className={styles.chartTick}>10^{tick}</text>
            </g>
          );
        })}
        {[0, 50, 100, 150, 200, 245].map((tick) => {
          const x = 58 + (tick / 245) * 594;
          return <text key={tick} x={x} y="301" textAnchor="middle" className={styles.chartTick}>{tick}k</text>;
        })}
        <line x1="58" x2="652" y1="272" y2="272" className={styles.chartAxis} />
        <motion.path
          d={linePath(criticSACfD)}
          className={styles.sacCurve}
          initial={reduced ? false : { pathLength: 0 }}
          whileInView={reduced ? undefined : { pathLength: 1 }}
          viewport={{ once: true, amount: 0.55 }}
          transition={{ duration: 1.35, ease: "easeInOut" }}
        />
        <motion.path
          d={linePath(criticRLPD)}
          className={styles.rlpdCurve}
          initial={reduced ? false : { pathLength: 0 }}
          whileInView={reduced ? undefined : { pathLength: 1 }}
          viewport={{ once: true, amount: 0.55 }}
          transition={{ duration: 1.1, delay: reduced ? 0 : 0.15, ease: "easeInOut" }}
        />
        <circle cx="652" cy="63" r="5" className={styles.sacPoint} />
        <circle cx="652" cy="219" r="5" className={styles.rlpdPoint} />
        <text x="638" y="45" textAnchor="end" className={styles.sacAnnotation}>SACfD · 85,300</text>
        <text x="638" y="207" textAnchor="end" className={styles.rlpdAnnotation}>RLPD · 545</text>
      </svg>
    </div>
  );
}

function ResearchFigure({
  src,
  alt,
  caption,
  width,
  height,
}: {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  return (
    <>
      <figure className={styles.researchFigure}>
        <button
          type="button"
          onClick={() => dialogRef.current?.showModal()}
          aria-label={`Enlarge figure: ${caption}`}
        >
          <img src={src} alt={alt} width={width} height={height} loading="lazy" />
          <span>open full figure ↗</span>
        </button>
        <figcaption>{caption}</figcaption>
      </figure>
      <dialog
        ref={dialogRef}
        className={styles.figureDialog}
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
      >
        <button type="button" onClick={() => dialogRef.current?.close()} aria-label="Close figure">
          Close ×
        </button>
        <img src={src} alt={alt} width={width} height={height} />
        <p>{caption}</p>
      </dialog>
    </>
  );
}

function HumanoidPanel() {
  return (
    <div className={styles.humanoidPanel}>
      <figure className={styles.humanoidMedia}>
        <img
          src="/rlpd/rollout-humanoid.webp"
          alt="Best individual IQL Humanoid-v5 rollout, seed 2"
          width={480}
          height={300}
          loading="lazy"
        />
        <figcaption>
          <span>best individual visualization</span>
          <strong>IQL · seed 2 · 87.8 last-5 normalized</strong>
        </figcaption>
      </figure>
      <div className={styles.humanoidStats}>
        <div className={styles.humanoidStatLead}>
          <span>IQL · 3 seeds</span>
          <strong>70.1 <small>± 16.2</small></strong>
          <p>last-five normalized at 1M environment steps</p>
        </div>
        <div>
          <span>RLPD · 3 seeds</span>
          <strong>13.0 <small>± 13.8</small></strong>
          <p>bounded critic, but little locomotion emerged</p>
        </div>
        <div className={styles.dangerStat}>
          <span>SACfD</span>
          <strong>2 / 3 <small>NaN</small></strong>
          <p>critic divergence was recorded, not retried</p>
        </div>
      </div>
    </div>
  );
}

function AblationComparison() {
  const items = [
    { label: "RLPD · 50/50", value: 6.024, display: "6.0 ± 2.0", tone: "mix" },
    { label: "Online-only", value: 27.966, display: "28.0 ± 15.2", tone: "online" },
  ];
  return (
    <div className={styles.ablationComparison}>
      <div className={styles.ablationBars}>
        {items.map((item) => (
          <div className={styles.ablationBarItem} key={item.label}>
            <div className={styles.ablationBarMeta}>
              <span>{item.label}</span>
              <strong>{item.display}</strong>
            </div>
            <div className={styles.ablationTrack}>
              <div
                className={cx(styles.ablationFill, item.tone === "online" ? styles.onlineFill : styles.mixFill)}
                style={{ width: `${(item.value / 32) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className={styles.deltaBadge}>
        <span>Δ matched horizon</span>
        <strong>+21.9</strong>
        <small>normalized points</small>
      </div>
    </div>
  );
}

export function RlpdExperience() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 160, damping: 28, mass: 0.3 });

  return (
    <main className={styles.main}>
      <motion.div className={styles.readingProgress} style={{ scaleX: progress }} />
      <Header />
      <Hero />

      <section className={styles.section} id="method">
        <Reveal className={styles.sectionIntro}>
          <div>
            <SectionLabel index="01">The question</SectionLabel>
            <h2>Can old experience accelerate a policy <em>without destabilizing what it learns?</em></h2>
          </div>
          <div className={styles.introCopy}>
            <p>
              RLPD makes a deceptively simple promise: mix a fixed offline dataset
              into ordinary online SAC, then add enough structure to keep the critic
              honest when the policy leaves the data distribution.
            </p>
            <p>
              We treated reproduction as an interrogation—not a screenshot of one
              benchmark. The framework changed from JAX to PyTorch, the data from
              D4RL to Minari v5, and the evaluation expanded to a body the paper never tested.
            </p>
          </div>
        </Reveal>
        <FlowDiagram />
      </section>

      <div className={styles.ambientRule} aria-hidden />

      <section className={cx(styles.section, styles.guardrailSection)} id="guardrails">
        <Reveal className={styles.sectionIntro}>
          <div>
            <SectionLabel index="02">Three guardrails</SectionLabel>
            <h2>The method is small. <em>The implementation details carry the weight.</em></h2>
          </div>
          <p className={styles.sectionAside}>
            One shared motion language connects all three: sample, bound, update.
            Each value below comes directly from the checked configuration.
          </p>
        </Reveal>

        <div className={styles.guardrailGrid}>
          <Reveal className={styles.guardrail}>
            <div className={styles.guardrailTop}><span>01 / MIX</span><strong>50 / 50</strong></div>
            <div className={styles.mixGlyph} aria-hidden><i /><i /></div>
            <h3>Symmetric sampling</h3>
            <p>Every update draws 128 online and 128 offline transitions. The dataset enters through the sampler—there is no RLPD pretraining phase.</p>
            <code>ratio = 0.5 · batch = 256</code>
          </Reveal>
          <Reveal className={styles.guardrail} delay={0.08}>
            <div className={styles.guardrailTop}><span>02 / BOUND</span><strong>LN</strong></div>
            <div className={styles.boundGlyph} aria-hidden><i /><i /><i /></div>
            <h3>LayerNorm critic</h3>
            <p>Normalization limits value extrapolation on actions the offline data never covered. Removing it on Humanoid sent mean Q to 8.9×10¹⁰.</p>
            <code>layernorm = true</code>
          </Reveal>
          <Reveal className={styles.guardrail} delay={0.16}>
            <div className={styles.guardrailTop}><span>03 / PUSH</span><strong>10 × 20</strong></div>
            <div className={styles.ensembleGlyph} aria-hidden>{Array.from({ length: 10 }).map((_, index) => <i key={index} />)}</div>
            <h3>Ensemble + high UTD</h3>
            <p>Ten critics and twenty gradient updates per environment step trade compute for sample efficiency while reducing single-critic overestimation.</p>
            <code>ensemble = 10 · utd = 20</code>
          </Reveal>
        </div>
      </section>

      <section className={cx(styles.section, styles.resultsSection)} id="results">
        <Reveal className={styles.sectionIntro}>
          <div>
            <SectionLabel index="03">Locomotion / medium data</SectionLabel>
            <h2>The reproduction held. <em>Consistency was the stronger result.</em></h2>
          </div>
          <div className={styles.introCopy}>
            <p>
              Across Hopper, Walker2d, and HalfCheetah, RLPD was the only method to
              finish between 88 and 90 on every task. IQL reached similar peaks but
              carried much wider seed variance; SACfD fell behind sharply.
            </p>
            <p>
              These are final evaluations from the honest three-seed medium-data
              matrix. The chart leads; the policy footage follows.
            </p>
          </div>
        </Reveal>
        <Reveal><ResultBoard /></Reveal>

        <div className={styles.rolloutHeader}>
          <span>numbers → policies → observed behavior</span>
          <small>visualizations below are expert-data seed 0, not the aggregate above</small>
        </div>
        <div className={styles.rolloutGrid}>
          <RolloutCard src="/rlpd/rollout-hopper.webp" name="Hopper-v5" score="97.1" />
          <RolloutCard src="/rlpd/rollout-walker.webp" name="Walker2d-v5" score="96.8" />
          <RolloutCard src="/rlpd/rollout-halfcheetah.webp" name="HalfCheetah-v5" score="103.1" />
        </div>
      </section>

      <section className={cx(styles.section, styles.failureSection)} id="failure">
        <div className={styles.failureNumber} aria-hidden>85,300</div>
        <Reveal className={styles.failureHeader}>
          <div>
            <SectionLabel index="04">SACfD / critic redline</SectionLabel>
            <h2>The failure was not subtle.</h2>
          </div>
          <p>
            On Walker2d, SACfD&apos;s mean Q climbed two orders of magnitude to
            85,300 while RLPD settled near 545 on the same data and three-seed budget.
          </p>
        </Reveal>
        <Reveal><CriticChart /></Reveal>
        <Reveal className={styles.failureReading}>
          <span>What the trace supports</span>
          <p>
            The unbounded critic coincides with a final return of 8.1 ± 2.1. The
            later no-LayerNorm ablation reproduces the same explosion inside the
            RLPD architecture, strengthening the mechanism without pretending one
            curve proves every causal step.
          </p>
        </Reveal>
      </section>

      <section className={styles.section} id="humanoid">
        <Reveal className={styles.sectionIntro}>
          <div>
            <SectionLabel index="05">Beyond the paper</SectionLabel>
            <h2>A harder body exposed <em>a different kind of advantage.</em></h2>
          </div>
          <div className={styles.introCopy}>
            <p>
              Humanoid-v5 expands the problem to 348 observations and 17 actuators.
              We ran every method to one million environment steps and kept divergent
              runs in the record.
            </p>
            <p>
              IQL looks dominant on the environment-step axis, but it arrives with
              one million offline gradient steps already completed. Its 47.9-point
              start is a pretraining head start, not free learning.
            </p>
          </div>
        </Reveal>
        <Reveal><HumanoidPanel /></Reveal>
        <p className={styles.humanoidCaveat}>
          The moving policy is a best-seed visualization. The 70.1 ± 16.2 aggregate is the result.
        </p>
        <ResearchFigure
          src="/rlpd/humanoid-results.webp"
          alt="Humanoid normalized return and critic mean Q for RLPD, IQL, and SACfD over one million steps"
          caption="Humanoid-v5 · three seeds · return and mean Q · IQL includes 1M offline updates before environment step 0"
          width={1800}
          height={648}
        />
      </section>

      <section className={styles.ablationSection} id="ablation">
        <div className={styles.ablationInner}>
          <Reveal className={styles.ablationHeadline}>
            <SectionLabel index="06">The twist</SectionLabel>
            <h2>We turned off the offline data. <em>The policy got better.</em></h2>
            <p>
              Keeping LayerNorm, the critic ensemble, and high UTD—but setting the
              sampling ratio to online-only—outperformed the full 50/50 method at the
              matched 500k horizon.
            </p>
          </Reveal>
          <Reveal><AblationComparison /></Reveal>
          <div className={styles.calculationStrip}>
            <span>last-five mean / seed</span>
            <span>online-only: 23.1 · 45.0 · 15.8 → 28.0</span>
            <span>RLPD: 7.8 · 3.8 · 6.4 → 6.0</span>
            <strong>27.966 − 6.024 = +21.942</strong>
          </div>
          <Reveal className={styles.ablationInterpretation}>
            <h3>The architecture survived. The prior data became the constraint.</h3>
            <p>
              This does not invalidate offline-to-online RL. It says the premise is
              conditional: data quality, policy coverage, tuning, and the handoff
              between learning regimes can matter more than the presence of a dataset
              alone. On this body, forcing half of every batch toward the offline
              distribution pulled learning away from where the live policy was going.
            </p>
          </Reveal>
        </div>
      </section>

      <section className={styles.section} id="evidence">
        <Reveal className={styles.sectionIntro}>
          <div>
            <SectionLabel index="07">Evidence audit</SectionLabel>
            <h2>Every conclusion carries <em>its sample count.</em></h2>
          </div>
          <p className={styles.sectionAside}>
            Incomplete runs stay visible. Best seeds never masquerade as aggregates.
          </p>
        </Reveal>
        <div className={styles.auditGrid}>
          <div className={styles.auditTable} role="table" aria-label="Experiment coverage">
            <div className={styles.auditRow} role="row"><span role="cell">Locomotion · medium</span><strong role="cell">27 complete runs</strong><em role="cell">primary comparison</em></div>
            <div className={styles.auditRow} role="row"><span role="cell">Locomotion · expert</span><strong role="cell">seed 0 complete</strong><em role="cell">seeds 1–2 stop at 57.5k</em></div>
            <div className={styles.auditRow} role="row"><span role="cell">Humanoid · IQL / RLPD</span><strong role="cell">3 seeds · 1M</strong><em role="cell">different pretraining budgets</em></div>
            <div className={styles.auditRow} role="row"><span role="cell">Humanoid · SACfD</span><strong role="cell">2 of 3 NaN</strong><em role="cell">divergence retained</em></div>
            <div className={styles.auditRow} role="row"><span role="cell">Online-only</span><strong role="cell">3 seeds · 500k</strong><em role="cell">matched-horizon ablation</em></div>
            <div className={styles.auditRow} role="row"><span role="cell">RLPD · expert Humanoid</span><strong role="cell">n = 1 · 1M</strong><em role="cell">4.0 last-five, held loosely</em></div>
          </div>
          <div className={styles.auditNote}>
            <span>Expert-data follow-up</span>
            <strong>Better demonstrations did not rescue Humanoid RLPD.</strong>
            <p>
              The single complete expert-data run stayed near 4.0 after one million
              steps. That is evidence against a simple “the medium data was bad”
              explanation, but n=1 is not a population claim.
            </p>
          </div>
        </div>
        <div className={styles.figurePair}>
          <ResearchFigure
            src="/rlpd/ablation-results.webp"
            alt="Humanoid ablation curves showing online-only above RLPD and no-LayerNorm critic divergence"
            caption="Humanoid ablations · 500k horizon · online-only is the only three-seed ablation"
            width={1800}
            height={650}
          />
          <ResearchFigure
            src="/rlpd/data-quality.webp"
            alt="RLPD returns across simple, medium, and expert datasets for Hopper, Walker2d, and HalfCheetah"
            caption="Locomotion data quality · expert curves become single-seed after 57.5k"
            width={1800}
            height={519}
          />
        </div>
      </section>

      <section className={cx(styles.section, styles.learningSection)} id="learning">
        <Reveal className={styles.sectionIntro}>
          <div>
            <SectionLabel index="08">What we learned</SectionLabel>
            <h2>Reproduction is not imitation. <em>It is a pressure test.</em></h2>
          </div>
        </Reveal>
        <div className={styles.learningGrid}>
          <Reveal><span>01</span><h3>Variance is part of the result.</h3><p>A peak policy can look convincing while the three-seed distribution tells a weaker story.</p></Reveal>
          <Reveal delay={0.06}><span>02</span><h3>Implementation choices become research claims.</h3><p>LayerNorm, ensemble size, and update ratio determined whether the critic stayed meaningful.</p></Reveal>
          <Reveal delay={0.12}><span>03</span><h3>Ablations changed the question.</h3><p>Once online-only won, the study shifted from “does RLPD reproduce?” to “when does prior data help?”</p></Reveal>
          <Reveal delay={0.18}><span>04</span><h3>Visual behavior needs numeric context.</h3><p>Rollouts explain what a score feels like; they do not replace aggregate evaluation.</p></Reveal>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerLead}>
          <span>RLPD / reproduction study</span>
          <h2>Built, evaluated, and questioned together.</h2>
        </div>
        <div className={styles.credits}>
          <span>Research team</span>
          <strong>Karan Anchan</strong>
          <strong>Pranav Menon</strong>
          <strong>Sridhar Kandi</strong>
        </div>
        <div className={styles.footerLinks}>
          <a href={REPOSITORY} target="_blank" rel="noreferrer">Repository <Arrow /></a>
          <a href="https://arxiv.org/abs/2302.02948" target="_blank" rel="noreferrer">Original paper <Arrow /></a>
          <Link href="/">Karan&apos;s portfolio <Arrow /></Link>
        </div>
        <div className={styles.footerBase}>
          <span>PyTorch · Minari · MuJoCo · three-seed evaluation</span>
          <a href="#top">Back to top ↑</a>
        </div>
      </footer>
    </main>
  );
}
