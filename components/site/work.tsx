"use client";

import { AreaChart, Area } from "@/components/charts/area-chart";
import { BarChart } from "@/components/charts/bar-chart";
import { Bar } from "@/components/charts/bar";
import GlowBorderCard from "@/components/ui/glow-border-card";
import { Reveal, SectionHead } from "@/components/site/reveal";
import { GiantTitle } from "@/components/site/giant-title";
import { motion } from "motion/react";

/* synthetic figure data — see README: illustrative until real results land */
const rlpdCurve = Array.from({ length: 26 }, (_, i) => {
  const t = i / 25;
  return {
    date: new Date(2026, 0, 1 + i * 7),
    rlpd: Math.round(1000 * (1 - Math.exp(-4.2 * t)) + 12 * Math.sin(i)),
    sac: Math.round(1000 * (1 - Math.exp(-1.4 * t)) * 0.72 + 10 * Math.cos(i)),
  };
});

const yoloLatency = [
  { name: "TensorRT · INT8", ms: 6.4 },
  { name: "ONNX RT · CPU", ms: 21.8 },
  { name: "WebGPU", ms: 34.5 },
];

const lime = "var(--lime)";
const amber = "var(--accent-3)";
const dim = "var(--faint)";

type Entry = {
  no: string;
  hue: string;
  tags: { label: string; hot?: boolean }[];
  title: string;
  href: string;
  desc: React.ReactNode;
  metrics: { v: string; l: string }[];
  links: { label: string; href: string }[];
  fig: React.ReactNode;
  caption: string;
};

function MambaFig() {
  return (
    <div className="flex h-full flex-col justify-center gap-6 p-6">
      <div className="flex items-end justify-center gap-2">
        {["ssm", "ssm", "ssm", "attn", "ssm", "ssm", "ssm", "attn"].map(
          (b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              className="flex flex-col items-center gap-1.5"
            >
              <span
                className={`font-mono text-[0.55rem] uppercase tracking-wider ${
                  b === "attn" ? "text-[var(--accent-2)]" : "text-[var(--faint)]"
                }`}
              >
                {b}
              </span>
              <div
                className={`h-14 w-8 rounded-sm border sm:w-10 ${
                  b === "attn"
                    ? "border-[var(--accent-2)] bg-[var(--accent-2)]/80"
                    : "border-[var(--faint)] bg-[var(--card)]"
                }`}
              />
            </motion.div>
          ),
        )}
      </div>
      <div className="text-center font-mono text-[0.6rem] uppercase tracking-[0.16em] text-[var(--faint)]">
        1 attention layer per 7 Mamba-2 blocks — the Jamba interleave
      </div>
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

const entries: Entry[] = [
  {
    no: "01",
    hue: "var(--lime)",
    tags: [
      { label: "Active · 2026", hot: true },
      { label: "Reinforcement Learning" },
      { label: "Lab project · team of 3" },
    ],
    title: "RLPD — offline-to-online RL, extended to humanoids",
    href: "https://github.com/Karan-Anchan/rlpd-offline-to-online-rl",
    desc: (
      <>
        Reproduction and extension of <strong>RLPD</strong> (Ball et al., ICML
        2023) in PyTorch with Minari offline data: symmetric 50/50 sampling,
        LayerNorm critics, large ensembles at high UTD — reproduced on three
        MuJoCo suites, then pushed to <strong>Humanoid-v5</strong>.
      </>
    ),
    metrics: [
      { v: "3×3", l: "envs × seeds" },
      { v: "10", l: "critic ensemble" },
      { v: "UTD 20", l: "update-to-data" },
    ],
    links: [
      {
        label: "Repository",
        href: "https://github.com/Karan-Anchan/rlpd-offline-to-online-rl",
      },
      { label: "Paper", href: "https://arxiv.org/abs/2302.02948" },
    ],
    fig: (
      <div className="p-5">
        <AreaChart data={rlpdCurve} aspectRatio="16 / 9">
          <Area dataKey="rlpd" fill={lime} fillOpacity={0.35} />
          <Area dataKey="sac" fill={dim} fillOpacity={0.15} />
        </AreaChart>
      </div>
    ),
    caption: "fig. 1 — return vs env steps · rlpd (lime) vs sac+data",
  },
  {
    no: "02",
    hue: "var(--accent-4)",
    tags: [
      { label: "Active · 2026", hot: true },
      { label: "Computer Vision" },
      { label: "Edge deployment" },
    ],
    title: "One detector, three runtimes — YOLO26 at the edge",
    href: "https://github.com/Karan-Anchan/edge-yolo26-deployment",
    desc: (
      <>
        Fine-tune an <strong>NMS-free YOLO26</strong>, ship the{" "}
        <em className="font-serif-accent italic">same network</em> to TensorRT
        (INT8, RTX 5070), ONNX Runtime (Ryzen 7700) and{" "}
        <strong>WebGPU in the browser</strong> — an MLPerf-style
        latency-per-watt study under a ≤2% mAP budget.
      </>
    ),
    metrics: [
      { v: "3", l: "runtimes, one model" },
      { v: "≤2%", l: "mAP budget" },
      { v: "INT8", l: "PTQ calibrated" },
    ],
    links: [
      {
        label: "Repository",
        href: "https://github.com/Karan-Anchan/edge-yolo26-deployment",
      },
    ],
    fig: (
      <div className="p-5">
        <BarChart data={yoloLatency} xDataKey="name" aspectRatio="16 / 9">
          <Bar dataKey="ms" fill="var(--accent-4)" />
        </BarChart>
      </div>
    ),
    caption: "fig. 2 — p95 latency per frame (ms), lower is better",
  },
  {
    no: "03",
    hue: "var(--accent-2)",
    tags: [
      { label: "In progress" },
      { label: "Hybrid architectures" },
      { label: "Language modelling" },
    ],
    title: "Mamba-2 × attention — a hybrid LM ratio study",
    href: "https://github.com/Karan-Anchan",
    desc: (
      <>
        A <strong>160M-param hybrid LM</strong> interleaving Mamba-2 SSM blocks
        with sparse attention (the Jamba pattern), trained on FineWeb-Edu at
        matched FLOPs. The 1:7 mix holds full-attention perplexity within{" "}
        <strong>~3%</strong> at a fraction of the KV-cache.
      </>
    ),
    metrics: [
      { v: "160M", l: "parameters" },
      { v: "1:7", l: "attn : ssm sweet spot" },
      { v: "32K", l: "eval context" },
    ],
    links: [
      { label: "Repo — soon", href: "https://github.com/Karan-Anchan" },
      { label: "Mamba-2 paper", href: "https://arxiv.org/abs/2405.21060" },
    ],
    fig: <MambaFig />,
    caption: "fig. 3 — interleave pattern & kv-cache saving",
  },
  {
    no: "04",
    hue: "var(--accent-3)",
    tags: [
      { label: "In progress" },
      { label: "Interpretability" },
      { label: "Safety" },
    ],
    title: "Sparse autoencoders — tracing circuits in a small LM",
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
      { label: "Repo — soon", href: "https://github.com/Karan-Anchan" },
      { label: "Circuits thread", href: "https://transformer-circuits.pub/" },
    ],
    fig: <SaeFig />,
    caption: "fig. 4 — feature circuit, induction",
  },
];

export function Work() {
  return (
    <section id="work" className="mx-auto max-w-6xl px-5 py-24">
      <GiantTitle word="WORK" className="-mt-10 mb-2 opacity-70" />
      <SectionHead hue="var(--accent-4)"
        index="§02"
        title="Selected"
        accent="work"
        side="ckpt 02 — two shipping, two brewing"
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
                    <span
                      key={t.label}
                      className={`rounded-full border px-3 py-1 font-mono text-[0.58rem] uppercase tracking-[0.14em] ${
                        t.hot
                          ? "border-[var(--e)]/50 text-[var(--e)]"
                          : "border-[var(--line)] text-[var(--dim)]"
                      }`}
                    >
                      {t.label}
                    </span>
                  ))}
                </div>
                <h3 className="text-2xl font-light tracking-tight text-[var(--fg)] sm:text-3xl">
                  <a
                    href={e.href}
                    target="_blank"
                    rel="noopener"
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
                <div className="mt-6 flex gap-5">
                  {e.links.map((l) => (
                    <a
                      key={l.label}
                      href={l.href}
                      target="_blank"
                      rel="noopener"
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
                className="bg-[var(--bg)]"
              >
                <div className="flex h-full flex-col">
                  <div className="min-h-0 flex-1">{e.fig}</div>
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
