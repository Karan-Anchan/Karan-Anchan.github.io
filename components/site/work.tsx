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
    cover: "/covers/rlpd-humanoid.webp",
    hue: "var(--lime)",
    tags: [
      { label: "Completed · 2026", hot: true },
      { label: "Reinforcement Learning" },
      { label: "Lab project · team of 3" },
    ],
    title: "RLPD — offline-to-online RL, extended to humanoids",
    href: "/rlpd/",
    external: false,
    desc: (
      <>
        A three-person PyTorch reproduction and critical evaluation of{" "}
        <strong>RLPD</strong> (Ball et al., ICML 2023). Across the complete
        locomotion matrix, RLPD finishes at 88–90 normalized on all three tasks.
        On Humanoid-v5, the registered follow-up becomes the real story:{" "}
        <strong>online-only beats the 50/50 offline mix by +21.9 points</strong>
        at the matched 500k horizon.
      </>
    ),
    metrics: [
      { v: "88–90", l: "minari-normalized · 3 tasks" },
      { v: "+21.9", l: "online-only · matched 500k" },
      { v: "3×3", l: "seeds × methods · 245k steps" },
    ],
    links: [
      { label: "Read the deep dive", href: "/rlpd/", external: false },
      {
        label: "Repository",
        href: "https://github.com/Karan-Anchan/rlpd-offline-to-online-rl",
      },
      { label: "Paper", href: "https://arxiv.org/abs/2302.02948" },
    ],
    fig: (
      <div className="aspect-[16/10] w-full">
        <img
          src="/covers/rlpd-benchmark.webp"
          alt="RLPD vs IQL and SACfD on medium offline data — normalized return over 245k steps, mean ± std across 3 seeds; RLPD reaches 88–90 on the Minari v5 expert scale on Hopper, Walker2d and HalfCheetah"
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>
    ),
    caption: "fig. 1 — rlpd vs iql vs sacfd · medium data · 3 seeds ± std",
  },
  {
    no: "02",
    cover: "/covers/yolo-demo.webp",
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
        (RTX 5070), ONNX Runtime (Ryzen 7700) and{" "}
        <strong>WebGPU in the browser</strong>, then measure every path with
        MLPerf-style rigor + NVML power. On Blackwell, <strong>FP8 hits 560
        FPS</strong> and FP16 wins latency-per-watt — while INT8, the reflex
        default, is dominated on accuracy, speed <em>and</em> power.
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
          alt="Accuracy cost of quantization — FP16/FP8 pass the 2% budget, INT8 fails"
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>
    ),
    caption: "fig. 2 — accuracy cost of quantization · measured on RTX 5070",
  },
  {
    no: "03",
    cover: "/covers/nmt-decode.webp",
    hue: "var(--accent-5)",
    tags: [
      { label: "Shipped · 2026" },
      { label: "NLP · from scratch" },
      { label: "Rebuilt honestly" },
    ],
    title: "Attention Is All You Need — from scratch, EN → HI",
    href: "https://github.com/Karan-Anchan/en-hi-nmt-transformer",
    desc: (
      <>
        A 6-layer Transformer in <strong>raw PyTorch</strong> — no{" "}
        <code>nn.Transformer</code>, no <code>transformers</code> — trained
        EN→HI on Samanantar with byte-level BPE, a Noam schedule and beam
        search. The 2024 original reported a mirage BLEU; the rebuild scores a{" "}
        <strong>frozen 5k test set</strong> and finds beam&apos;s +0.2 chrF++
        is really a <strong>two-way rewrite</strong> — 162 sentences better,
        140 worse — at 9.3× the latency. Hover: the decoder translating live,
        attention and all.
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
          alt="Per-sentence chrF++ scatter, greedy vs beam decode — beam's +0.2 corpus gain hides 162 improved and 140 worsened sentences at 9.3 times the latency"
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>
    ),
    caption: "fig. 3 — what beam search actually buys · frozen 500-pair test",
  },
  {
    no: "04",
    cover: "/covers/mamba.webp",
    hue: "var(--accent-2)",
    tags: [
      { label: "In progress" },
      { label: "Hybrid architectures" },
      { label: "Language modelling" },
    ],
    title: "Mamba-2 × attention — a hybrid LM ratio study",
    href: "https://github.com/Karan-Anchan/mamba-hybrid-lm",
    desc: (
      <>
        A <strong>~50M-param hybrid LM</strong> interleaving Mamba-2 SSM blocks
        with causal attention (the Jamba pattern), trained on OpenWebText at
        matched tokens-seen. Sweeping the attention:SSM ratio —{" "}
        <strong>1:7 leads the reduced-scale preview</strong>; KV-cache and
        inference columns land next.
      </>
    ),
    metrics: [
      { v: "~50M", l: "parameters" },
      { v: "1:7", l: "attn : ssm front-runner" },
      { v: "102.4", l: "val ppl · preview" },
    ],
    links: [
      { label: "Repo", href: "https://github.com/Karan-Anchan/mamba-hybrid-lm" },
      { label: "Mamba-2 paper", href: "https://arxiv.org/abs/2405.21060" },
    ],
    fig: <MambaFig />,
    caption: "fig. 4 — interleave pattern & kv-cache saving",
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
    caption: "fig. 5 — feature circuit, induction",
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
        side="ckpt 02 — three shipped, two brewing"
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
                <div className="mt-6 flex gap-5">
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
