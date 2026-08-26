"use client";

import GlowBorderCard from "@/components/ui/glow-border-card";
import { Reveal, SectionHead } from "@/components/site/reveal";
import { GiantTitle } from "@/components/site/giant-title";
import { motion } from "motion/react";
import { useState } from "react";

const amber = "var(--accent-3)";
const dim = "var(--faint)";

type Entry = {
  no: string;
  hue: string;
  cover: string;
  tags: { label: string; hot?: boolean }[];
  title: string;
  href: string;
  external?: boolean;
  desc: React.ReactNode;
  metrics: { v: string; l: string }[];
  links: { label: string; href: string; external?: boolean }[];
  fig: React.ReactNode;
  caption: string;
};

function RlpdCardMedia({ figure }: { figure: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);
  const [locked, setLocked] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const active = hovered || locked || focusWithin;

  return (
    <div
      className="relative h-full"
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setHovered(true);
      }}
      onPointerLeave={() => setHovered(false)}
      onFocusCapture={() => setFocusWithin(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setFocusWithin(false);
        }
      }}
    >
      {figure}
      {active ? (
        <div className="absolute inset-0 grid grid-cols-3 overflow-hidden rounded-t-[1rem] bg-[#05070d]">
          {[
            ["/rlpd/rollout-hopper.webp", "Hopper-v5"],
            ["/rlpd/rollout-walker.webp", "Walker2d-v5"],
            ["/rlpd/rollout-halfcheetah.webp", "HalfCheetah-v5"],
          ].map(([src, label]) => (
            <div key={label} className="relative overflow-hidden border-r border-white/10 last:border-r-0">
              <img
                src={src}
                alt={`${label} trained RLPD policy rollout`}
                className="h-full w-full object-cover"
              />
              <span className="absolute inset-x-0 bottom-0 bg-black/75 px-2 py-2 text-center font-mono text-[0.48rem] uppercase tracking-[0.1em] text-cyan-200 backdrop-blur-sm">
                {label}
              </span>
            </div>
          ))}
        </div>
      ) : null}
      <button
        type="button"
        aria-pressed={locked}
        onClick={() => setLocked((value) => !value)}
        className="absolute right-3 top-3 z-10 border border-white/20 bg-black/75 px-2.5 py-1.5 font-mono text-[0.5rem] uppercase tracking-[0.1em] text-white backdrop-blur-md transition-colors hover:border-cyan-300 hover:text-cyan-200"
      >
        {locked ? "Show graph" : "Preview policies"}
      </button>
    </div>
  );
}

function RlpdCoverageFig() {
  const coverage = [
    { task: "Hopper", value: 56.2, distance: "1.79×" },
    { task: "Walker2d", value: 69.2, distance: "1.89×" },
    { task: "HalfCheetah", value: 71.6, distance: "1.45×" },
    { task: "Humanoid", value: 6.6, distance: "6.64×", alert: true },
  ];

  return (
    <div
      className="flex h-full min-h-[220px] flex-col justify-center gap-4 bg-[radial-gradient(circle_at_88%_8%,color-mix(in_srgb,var(--lime)_13%,transparent),transparent_38%),linear-gradient(145deg,color-mix(in_srgb,var(--card)_96%,black),var(--bg))] p-5 sm:p-7"
      aria-label="Offline-state coverage: Hopper 56.2 percent, Walker2d 69.2 percent, HalfCheetah 71.6 percent, and Humanoid 6.6 percent"
    >
      <div className="flex items-end justify-between gap-3 border-b border-[var(--line)] pb-3">
        <div>
          <span className="font-mono text-[0.52rem] uppercase tracking-[0.18em] text-[var(--lime)]">
            Latest diagnostic · 3 seeds
          </span>
          <h4 className="mt-1 text-sm font-medium tracking-[-0.02em] text-[var(--fg)] sm:text-base">
            Online states covered by offline data
          </h4>
        </div>
        <span className="font-mono text-[0.48rem] uppercase tracking-[0.12em] text-[var(--faint)]">
          95th-pct NN radius
        </span>
      </div>
      <div className="grid gap-2.5">
        {coverage.map((row, index) => (
          <div key={row.task} className="grid grid-cols-[78px_1fr_82px] items-center gap-2 sm:grid-cols-[92px_1fr_96px]">
            <span className={`font-mono text-[0.58rem] ${row.alert ? "text-[var(--accent-4)]" : "text-[var(--dim)]"}`}>
              {row.task}
            </span>
            <div className="h-4 overflow-hidden bg-[color-mix(in_srgb,var(--faint)_12%,transparent)]">
              <motion.div
                className={`h-full origin-left ${row.alert ? "bg-[var(--accent-4)]" : "bg-[var(--lime)]"}`}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: index * 0.07 }}
                style={{ width: `${row.value}%` }}
              />
            </div>
            <span className="text-right font-mono text-[0.55rem] text-[var(--fg2)]">
              <strong className="font-medium">{row.value}%</strong> · R {row.distance}
            </span>
          </div>
        ))}
      </div>
      <p className="m-0 font-mono text-[0.5rem] uppercase tracking-[0.12em] text-[var(--faint)]">
        Humanoid is the outlier: sparse coverage, 6.64× normalized distance.
      </p>
    </div>
  );
}

function SaeFig() {
  const nodes = [
    { x: 12, y: 30, dim: true, label: "token-id" },
    { x: 12, y: 62, dim: true, label: "positional" },
    { x: 50, y: 42, dim: false, label: "prev-token" },
    { x: 86, y: 24, dim: false, label: "induction" },
  ];
  return (
    <div className="relative h-full min-h-[220px] p-6">
      <svg viewBox="0 0 100 90" className="h-full w-full">
        <path
          d="M14 32 C 32 34, 38 40, 48 42"
          fill="none"
          stroke={dim}
          strokeWidth="0.6"
        />
        <path
          d="M14 62 C 32 58, 38 48, 48 44"
          fill="none"
          stroke={dim}
          strokeWidth="0.6"
        />
        <motion.path
          d="M52 41 C 66 36, 74 28, 84 25"
          fill="none"
          stroke={amber}
          strokeWidth="0.9"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, delay: 0.3 }}
        />
        {nodes.map((n, i) => (
          <motion.g
            key={i}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
          >
            <circle
              cx={n.x}
              cy={n.y}
              r={n.dim ? 2.4 : 3.2}
              fill={n.dim ? "var(--faint)" : amber}
            />
            <text
              x={n.x}
              y={n.y - 5}
              textAnchor="middle"
              className="fill-[var(--faint)]"
              style={{ fontSize: "3.2px", fontFamily: "var(--font-geist-mono)" }}
            >
              {n.label}
            </text>
          </motion.g>
        ))}
      </svg>
      <div className="absolute bottom-4 left-0 right-0 text-center font-mono text-[0.6rem] uppercase tracking-[0.16em] text-[var(--faint)]">
        feature circuit · layers 4 → 9
      </div>
    </div>
  );
}

function MambaStateFig() {
  const variants = [
    { ratio: "1:3", state: 61.33, ppl: "26.301", color: "var(--accent-4)" },
    { ratio: "1:7", state: 34.22, ppl: "26.466", color: "var(--accent-2)" },
    { ratio: "1:15", state: 20.66, ppl: "26.513", color: "var(--lime)" },
  ];

  return (
    <div
      className="flex h-full min-h-[220px] flex-col justify-center gap-4 bg-[radial-gradient(circle_at_88%_8%,color-mix(in_srgb,var(--accent-2)_14%,transparent),transparent_38%),linear-gradient(145deg,color-mix(in_srgb,var(--card)_96%,black),var(--bg))] p-5 sm:p-7"
      aria-label="At 8K context, logical inference state is 61.33 MiB for ratio 1 to 3, 34.22 MiB for 1 to 7, and 20.66 MiB for 1 to 15"
    >
      <div className="flex items-end justify-between gap-3 border-b border-[var(--line)] pb-3">
        <div>
          <span className="font-mono text-[0.52rem] uppercase tracking-[0.18em] text-[var(--accent-2)]">
            Matched 700M-token sweep
          </span>
          <h4 className="mt-1 text-sm font-medium tracking-[-0.02em] text-[var(--fg)] sm:text-base">
            Logical inference state at 8K
          </h4>
        </div>
        <span className="font-mono text-[0.48rem] uppercase tracking-[0.12em] text-[var(--faint)]">
          lower is better
        </span>
      </div>
      <div className="grid gap-3">
        {variants.map((variant, index) => (
          <div key={variant.ratio} className="grid grid-cols-[48px_1fr_112px] items-center gap-2 sm:grid-cols-[56px_1fr_126px]">
            <span className="font-mono text-[0.6rem] text-[var(--fg2)]">{variant.ratio}</span>
            <div className="h-4 overflow-hidden bg-[color-mix(in_srgb,var(--faint)_12%,transparent)]">
              <motion.div
                className="h-full origin-left"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: index * 0.08 }}
                style={{ width: `${(variant.state / 61.33) * 100}%`, backgroundColor: variant.color }}
              />
            </div>
            <span className="text-right font-mono text-[0.52rem] text-[var(--dim)]">
              <strong className="font-medium text-[var(--fg2)]">{variant.state} MiB</strong>
              <br />PPL {variant.ppl}
            </span>
          </div>
        ))}
      </div>
      <p className="m-0 font-mono text-[0.5rem] uppercase tracking-[0.11em] text-[var(--faint)]">
        1:15 saves 66.3% vs 1:3 · +0.212 validation perplexity
      </p>
    </div>
  );
}

const entries: Entry[] = [
  {
    no: "01",
    cover: "/covers/rlpd-humanoid.webp",
    hue: "var(--lime)",
    tags: [
      { label: "Completed · 2026", hot: true },
      { label: "Reinforcement Learning" },
      { label: "Lab project · team of 3" },
    ],
    title: "RLPD: offline-to-online RL on locomotion and Humanoid",
    href: "/rlpd/",
    external: false,
    desc: (
      <>
        A three-person PyTorch reproduction and critical evaluation of{" "}
        <strong>RLPD</strong> (Ball et al., ICML 2023). Across the complete
        locomotion matrix, RLPD finishes at 88–90 normalized on all three tasks.
        On Humanoid-v5, only <strong>6.6% of online states are covered by the
        offline dataset</strong>—and online-only beats the 50/50 mix by +21.9
        points at the matched 500k horizon.
      </>
    ),
    metrics: [
      { v: "88–90", l: "minari-normalized · 3 tasks" },
      { v: "+21.9", l: "online-only · matched 500k" },
      { v: "6.6%", l: "humanoid offline-state coverage" },
    ],
    links: [
      { label: "Read the deep dive", href: "/rlpd/", external: false },
      {
        label: "Repository",
        href: "https://github.com/Karan-Anchan/rlpd-offline-to-online-rl",
      },
      { label: "Paper", href: "https://arxiv.org/abs/2302.02948" },
    ],
    fig: <RlpdCoverageFig />,
    caption: "fig. 1 — offline-state coverage · 3 seeds · humanoid is the 6.6% outlier",
  },
  {
    no: "02",
    cover: "/covers/yolo-demo.webp",
    hue: "var(--accent-4)",
    tags: [
      { label: "Shipped · 2026", hot: true },
      { label: "Computer Vision" },
      { label: "Edge deployment" },
    ],
    title: "YOLO26 at the edge: one detector, three runtimes",
    href: "https://github.com/Karan-Anchan/edge-yolo26-deployment",
    desc: (
      <>
        I fine-tuned an <strong>NMS-free YOLO26</strong> and deployed the{" "}
        <em className="font-serif-accent italic">same network</em> through
        TensorRT on an RTX 5070, ONNX Runtime on a Ryzen 7700, and{" "}
        <strong>WebGPU in the browser</strong>. Each path has latency and
        accuracy measurements; the GPU paths also include NVML power data.
        FP8 reaches <strong>560 FPS</strong>, while FP16 has the best
        latency-per-watt result on this Blackwell GPU.
      </>
    ),
    metrics: [
      { v: "3", l: "runtimes, one model" },
      { v: "560", l: "FPS · GPU (FP8)" },
      { v: "44", l: "FPS · in-browser" },
    ],
    links: [
      {
        label: "Live demo",
        href: "https://karan-anchan.github.io/edge-yolo26-deployment/",
      },
      {
        label: "Repository",
        href: "https://github.com/Karan-Anchan/edge-yolo26-deployment",
      },
    ],
    fig: (
      <div className="aspect-[16/10] w-full">
        <img
          src="/covers/yolo-benchmark.webp"
          alt="Accuracy cost of quantization. FP16 and FP8 stay within the 2% budget; INT8 does not."
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>
    ),
    caption: "fig. 2 · accuracy cost of quantization · measured on RTX 5070",
  },
  {
    no: "03",
    cover: "/covers/nmt-decode.webp",
    hue: "var(--accent-5)",
    tags: [
      { label: "Shipped · 2026" },
      { label: "NLP · from scratch" },
      { label: "Re-evaluated" },
    ],
    title: "A PyTorch Transformer for English → Hindi",
    href: "https://github.com/Karan-Anchan/en-hi-nmt-transformer",
    desc: (
      <>
        A 6-layer Transformer written directly in <strong>PyTorch</strong>,
        without <code>nn.Transformer</code> or <code>transformers</code>. It
        trains on Samanantar with byte-level BPE and a Noam schedule. A new
        evaluation on a <strong>frozen 5k test set</strong> shows that beam
        search adds 0.2 chrF++ at 9.3× the latency, improving 162 sentences
        and worsening 140.
      </>
    ),
    metrics: [
      { v: "16.9", l: "sacrebleu · beam k=4" },
      { v: "41.6", l: "chrf++ · frozen test set" },
      { v: "~43M", l: "params, from scratch" },
    ],
    links: [
      {
        label: "Repository",
        href: "https://github.com/Karan-Anchan/en-hi-nmt-transformer",
      },
      { label: "Paper", href: "https://arxiv.org/abs/1706.03762" },
    ],
    fig: (
      <div className="aspect-[16/10] w-full">
        <img
          src="/covers/nmt-beam.webp"
          alt="Per-sentence chrF++ scatter for greedy and beam decoding. Beam improves 162 sentences and worsens 140 at 9.3 times the latency."
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>
    ),
    caption: "fig. 3 · beam search on a frozen 500-pair test",
  },
  {
    no: "04",
    cover: "/covers/mamba-stream.webp",
    hue: "var(--accent-2)",
    tags: [
      { label: "Study complete · 2026", hot: true },
      { label: "Hybrid architectures" },
      { label: "Language-model systems" },
    ],
    title: "Mamba-2 × attention: a hybrid LM ratio study",
    href: "https://karan-anchan.github.io/mamba-hybrid-lm-showcase/",
    desc: (
      <>
        Three <strong>52–54M-parameter hybrid LMs</strong> interleaving Mamba-2
        SSM blocks with causal attention, each trained on 700M matched
        OpenWebText token positions. <strong>1:3 leads on perplexity and sampled
        generation</strong>; 1:15 cuts logical state by 66.3% at 8K for a
        0.212 perplexity increase.
      </>
    ),
    metrics: [
      { v: "26.30", l: "val ppl · ratio 1:3" },
      { v: "66.3%", l: "less state · 1:15 at 8K" },
      { v: "52.3", l: "tok/s · sampled generation" },
    ],
    links: [
      { label: "Showcase", href: "https://karan-anchan.github.io/mamba-hybrid-lm-showcase/" },
      { label: "Repository", href: "https://github.com/Karan-Anchan/mamba-hybrid-lm" },
    ],
    fig: <MambaStateFig />,
    caption: "fig. 4 — 8K logical state · matched 700M-token variants",
  },
  {
    no: "05",
    cover: "/covers/sae.webp",
    hue: "var(--accent-3)",
    tags: [
      { label: "In progress" },
      { label: "Interpretability" },
      { label: "Safety" },
    ],
    title: "Sparse autoencoders for tracing circuits in a small LM",
    href: "https://github.com/Karan-Anchan",
    desc: (
      <>
        Training <strong>sparse autoencoders</strong> over the residual stream
        of a small open LM to decompose activations into monosemantic features,
        then <strong>circuit-tracing</strong> induction behaviour. Early
        dictionaries hit <strong>~78% auto-interp</strong> on probed layers.
      </>
    ),
    metrics: [
      { v: "16×", l: "dictionary expansion" },
      { v: "~78%", l: "auto-interp score" },
      { v: "L4–L9", l: "layers probed" },
    ],
    links: [
      { label: "Repo coming soon", href: "https://github.com/Karan-Anchan" },
      { label: "Circuits thread", href: "https://transformer-circuits.pub/" },
    ],
    fig: <SaeFig />,
    caption: "fig. 5 · feature circuit, induction",
  },
];

export function Work() {
  return (
    <section id="work" className="mx-auto max-w-6xl px-5 py-24">
      <GiantTitle word="WORK" className="-mt-10 mb-2 opacity-70" />
      <SectionHead sprite="/mc/sprite-diamond.png" hue="var(--accent-4)"
        index="§02"
        title="Selected"
        accent="work"
        side="ckpt 02 · four shipped, one in progress"
      />
      <div className="space-y-20">
        {entries.map((e, i) => (
          <Reveal key={e.no}>
            <article
              style={{ ["--e" as string]: e.hue }}
              className={`grid items-center gap-10 lg:grid-cols-2 ${
                i % 2 ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              <div>
                <div className="mb-4 flex flex-wrap gap-2">
                  {e.tags.map((t) => (
                    <motion.span
                      key={t.label}
                      whileHover={{ scale: 1.07, rotate: -1.5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 12 }}
                      className={`rounded-full border px-3 py-1 font-mono text-[0.58rem] uppercase tracking-[0.14em] ${
                        t.hot
                          ? "border-[var(--e)]/50 text-[var(--e)]"
                          : "border-[var(--line)] text-[var(--dim)]"
                      }`}
                    >
                      {t.label}
                    </motion.span>
                  ))}
                </div>
                <h3 className="text-2xl font-light tracking-tight text-[var(--fg)] sm:text-3xl">
                  <a
                    href={e.href}
                    target={e.external === false ? undefined : "_blank"}
                    rel={e.external === false ? undefined : "noopener"}
                    className="transition-colors hover:text-[var(--e)]"
                  >
                    {e.title}
                  </a>
                </h3>
                <p className="mt-4 max-w-xl text-sm font-light leading-relaxed text-[var(--dim)]">
                  {e.desc}
                </p>
                <div className="mt-6 flex flex-wrap gap-8">
                  {e.metrics.map((m) => (
                    <div key={m.l}>
                      <div className="text-xl font-light text-[var(--e)]">
                        {m.v}
                      </div>
                      <div className="font-mono text-[0.55rem] uppercase tracking-[0.14em] text-[var(--faint)]">
                        {m.l}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3">
                  {e.links.map((l) => (
                    <a
                      key={l.label}
                      href={l.href}
                      target={l.external === false ? undefined : "_blank"}
                      rel={l.external === false ? undefined : "noopener"}
                      className="border-b border-[var(--line)] pb-0.5 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-[var(--fg2)] transition-colors hover:border-[var(--e)] hover:text-[var(--e)]"
                    >
                      {l.label} ↗
                    </a>
                  ))}
                </div>
              </div>

              <GlowBorderCard
                width="100%"
                aspectRatio="16/11"
                borderRadius="1rem"
                gradientColors={[
                  "#c7f284",
                  "#67e8f9",
                  "#c4b5fd",
                  "#fbbf24",
                  "#c7f284",
                ]}
                className="group/card bg-[var(--bg)]"
              >
                <div className="flex h-full flex-col">
                  <div className="relative min-h-0 flex-1">
                    {e.no === "01" ? (
                      <RlpdCardMedia figure={e.fig} />
                    ) : (
                      <>
                        {e.fig}
                        <img
                          src={e.cover}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          className="absolute inset-0 h-full w-full rounded-t-[1rem] object-cover opacity-0 transition-opacity duration-500 group-hover/card:opacity-100 group-focus-within/card:opacity-100"
                        />
                      </>
                    )}
                  </div>
                  <div className="border-t border-[var(--line)] px-4 py-2.5 font-mono text-[0.58rem] uppercase tracking-[0.14em] text-[var(--faint)]">
                    {e.caption}
                  </div>
                </div>
              </GlowBorderCard>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
