"use client";
/* eslint-disable react/no-unescaped-entities */

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Reveal } from "@/components/site/reveal";
import { Sect, CountUp, Fig, HeroVideo } from "./ui";
import { C, FlowDiagram, LocoBars, CriticRedline, TwistChart } from "./charts";

const EASE = [0.22, 1, 0.36, 1] as const;

const GIFS: [string, string, string][] = [
  ["hopper", "Hopper", "Trained Hopper policy hopping forward in MuJoCo, dark render"],
  ["walker2d", "Walker2d", "Trained Walker2d policy walking in MuJoCo, dark render"],
  ["halfcheetah", "HalfCheetah", "Trained HalfCheetah policy galloping in MuJoCo, dark render"],
];

export default function RlpdContent() {
  const reduced = useReducedMotion() ?? false;
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const vidScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const vidY = useTransform(scrollYProgress, [0, 1], [0, 56]);

  const enter = (delay: number, y = 16) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y, filter: "blur(6px)" },
          animate: { opacity: 1, y: 0, filter: "blur(0px)" },
          transition: { duration: 0.75, delay, ease: EASE },
        };

  return (
    <div className="rl">
      <style>{CSS}</style>

      {/* ---------- 1 · hero ---------- */}
      <section className="rl-hero" ref={heroRef}>
        <motion.div className="rl-vidwrap" style={reduced ? undefined : { scale: vidScale, y: vidY }}>
          <HeroVideo poster="/rlpd/hero-poster.webp" />
        </motion.div>
        <div className="rl-scrim" aria-hidden="true" />
        <div className="rl-hero-inner">
          <div>
            <motion.p className="rl-eyebrow" {...enter(0.1)}>
              RLPD · offline-to-online reinforcement learning · reproduction study
            </motion.p>
            <h1 className="rl-h1">
              <motion.span className="rl-h1line" {...enter(0.25, 26)}>I reproduced RLPD.</motion.span>
              <motion.span className="rl-h1line" {...enter(0.45, 26)}>Then the data challenged its premise.</motion.span>
            </h1>
            <motion.p className="rl-lead" {...enter(0.72)}>
              A clean-room PyTorch rebuild of <strong>RLPD</strong> — online reinforcement learning that
              reuses a fixed batch of old experience — taken to a body the paper never tried, then taken
              apart one guardrail at a time. Every number below comes from runs I set up, read, and
              normalized myself.
            </motion.p>
            <motion.ul className="rl-chips" {...enter(0.9)} aria-label="Project facts">
              {["PyTorch", "MuJoCo v5 · Minari data", "3-seed evaluation", "one RTX 5070"].map((c) => (
                <li key={c}>{c}</li>
              ))}
            </motion.ul>
            <motion.div className="rl-herolinks" {...enter(1.0)}>
              <a className="rl-btn rl-primary" href="https://github.com/Karan-Anchan/rlpd-offline-to-online-rl" target="_blank" rel="noopener">Repository ↗</a>
              <a className="rl-btn" href="#guardrails">Method ↓</a>
              <a className="rl-btn" href="#results">Results ↓</a>
            </motion.div>
            <motion.div className="rl-cue" {...enter(1.2)}>
              <span className="rl-cue-bar" aria-hidden="true" /> the numbers, the failure, the twist
            </motion.div>
          </div>
          <motion.img
            className="rl-motif"
            src="/rlpd/humanoid.webp"
            alt=""
            aria-hidden="true"
            initial={reduced ? false : { opacity: 0, clipPath: "inset(0 0 100% 0)", filter: "blur(8px)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)", filter: "blur(0px)" }}
            transition={{ duration: 1.2, delay: 0.5, ease: EASE }}
          />
        </div>
      </section>

      {/* ---------- 2 · the question ---------- */}
      <Sect id="question" brow="The question" title={<>What was actually being tested</>}>
        <Reveal delay={0.1}>
          <p className="rl-p">
            RLPD's claim is almost annoyingly simple: you don't need a specialised offline-RL algorithm to
            profit from a dataset. Run ordinary off-policy <span className="rl-mono">SAC</span>, make every
            training batch <strong>half fresh experience, half old data</strong>, and add three guardrails
            so the value function survives the mix. The paper reports state-of-the-art sample efficiency
            with nothing more exotic than that.
          </p>
        </Reveal>
        <Reveal delay={0.14}>
          <p className="rl-p">
            Reproducing a paper isn't matching one number — it's checking whether the <em>mechanism</em>{" "}
            survives outside its home turf: a different framework (PyTorch, not JAX), today's datasets
            (Minari v5, not D4RL), one desktop GPU, and a harder body the paper never touched. This is how
            the data is supposed to flow:
          </p>
        </Reveal>
        <Reveal delay={0.18}><FlowDiagram /></Reveal>
        <Reveal delay={0.1}>
          <div className="rl-callout">
            <b>Honest footnote</b>
            This began as a three-person course project — I owned the data pipeline and the evaluation
            side; the algorithm core was a shared build. The findings and the writing here are mine to
            defend.
          </div>
        </Reveal>
      </Sect>

      {/* ---------- 3 · guardrails ---------- */}
      <Sect id="guardrails" brow="The three guardrails" title={<>What keeps the mix from exploding</>}>
        <Reveal delay={0.08}>
          <svg className="rl-connector" viewBox="0 0 760 24" aria-hidden="true">
            <motion.line x1="60" y1="12" x2="700" y2="12" stroke="var(--rl-line2)"
              initial={reduced ? undefined : { pathLength: 0 }}
              whileInView={{ pathLength: 1 }} viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 1.2, ease: "easeInOut" }} />
            {[126, 380, 634].map((x, i) => (
              <motion.circle key={x} cx={x} cy="12" r="4" fill={[C.rlpd, C.iql, C.sacfd][i]}
                initial={reduced ? undefined : { scale: 0 }}
                whileInView={{ scale: 1 }} viewport={{ once: true, margin: "-15%" }}
                transition={{ delay: 0.3 + i * 0.25, duration: 0.4 }} />
            ))}
          </svg>
        </Reveal>
        <div className="rl-grid3">
          {[
            {
              c: C.rlpd, ix: "01 · MIX", h: "Symmetric sampling",
              cfg: "symmetric_sampling_ratio: 0.5",
              p: "Every batch is 128 online + 128 offline rows. No pretraining phase — the dataset enters through the sampler, nowhere else.",
              echo: "It's a dial, not a switch. I turn it to 0.0 and 1.0 at the end.",
            },
            {
              c: C.iql, ix: "02 · BOUND", h: "LayerNorm critic",
              cfg: "algo.layernorm: true",
              p: "One normalization layer inside every critic bounds value estimates on actions the data never covered.",
              echo: "Removed on Humanoid: mean Q hit 8.9×10¹⁰ and the run NaN'd by 15k steps.",
            },
            {
              c: C.sacfd, ix: "03 · PUSH", h: "Ensemble + high UTD",
              cfg: "ensemble_size: 10 · utd: 20",
              p: "Ten critics and twenty gradient updates per environment step squeeze the most out of every transition.",
              echo: "Ablated at matched step: ensemble 2 → −3.2 · UTD 1 → −4.6.",
            },
          ].map((g, i) => (
            <Reveal key={g.ix} delay={0.12 + i * 0.08}>
              <div className="rl-card" style={{ ["--gc" as string]: g.c }}>
                <div className="rl-ix">{g.ix}</div>
                <h3 className="rl-h3"><span className="rl-dot" aria-hidden="true" />{g.h}</h3>
                <p className="rl-cfg">{g.cfg}</p>
                <p>{g.p}</p>
                <p className="rl-echo">{g.echo}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Sect>

      <div className="rl-divider" role="presentation" />

      {/* ---------- 4 · locomotion results ---------- */}
      <Sect id="results" brow="Locomotion · medium data" title={<>It reproduced — with a caveat about <em>why</em></>}>
        <Reveal delay={0.1}>
          <p className="rl-p">
            Three tasks, three methods, three seeds each, on the medium-quality datasets. Scores are
            normalized so the Minari v5 expert data reads 100 and a random policy 0.{" "}
            <strong style={{ color: C.rlpd }}>RLPD</strong> lands high-70s to high-80s everywhere.{" "}
            <strong style={{ color: C.iql }}>IQL</strong> matches it on score.{" "}
            <strong style={{ color: C.sacfd }}>SACfD</strong> — the naive "one shared buffer" baseline the
            paper argues against — trails badly.
          </p>
        </Reveal>
        <Reveal delay={0.14}><LocoBars /></Reveal>
        <Reveal delay={0.1}>
          <p className="rl-p">
            Read the ±, not just the height. RLPD's seed spread on Walker2d is{" "}
            <span className="rl-mono">±0.2</span>; IQL's spread runs <span className="rl-mono">±2.6</span>{" "}
            to <span className="rl-mono">±17.7</span>. The honest headline isn't "RLPD wins" — on
            HalfCheetah IQL is actually ahead — it's that <strong>RLPD is the boring, repeatable one</strong>.
            For a method you'd deploy, that's the stronger property.
          </p>
        </Reveal>
        <Reveal delay={0.1}><p className="rl-transition">numbers → policies → behavior</p></Reveal>
        <div className="rl-gifrow">
          {GIFS.map(([f, label, alt], i) => (
            <Reveal key={f} delay={0.1 + i * 0.08}>
              <div className="rl-gifcard">
                <img src={`/covers/rlpd-${f}.gif`} alt={alt} loading="lazy" decoding="async" />
                <span className="rl-gifcap"><span className="rl-mono">{label}</span> · RLPD · 245k steps · deterministic rollout</span>
              </div>
            </Reveal>
          ))}
        </div>
      </Sect>

      {/* ---------- 5 · the critic redlines ---------- */}
      <Sect id="redline" brow="Where it broke — on purpose" title={<>The critic redlines</>}>
        <Reveal delay={0.1}>
          <p className="rl-p">
            The most instructive run is the one that fails. SACfD is what's left when the guardrails are
            gone, and on Walker2d its value estimates never converge — they climb. The failure is not
            subtle: <strong>mean Q walks to ≈ 85,300</strong> while RLPD sits at{" "}
            <span className="rl-mono">545</span> on the same task, same data, same seeds.
          </p>
        </Reveal>
        <Reveal delay={0.14}><CriticRedline /></Reveal>
        <Reveal delay={0.1}>
          <p className="rl-cap">Real curves: mean critic Q, Walker2d medium, averaged over 3 seeds, log scale.</p>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="rl-p">
            Mechanically: with no bound on out-of-distribution actions, the critic extrapolates optimism
            its policy can't cash, the policy chases it, and return collapses to{" "}
            <span className="rl-mono">7.6 ± 0.8</span>. I can't claim a full causal chain from one curve —
            but the LayerNorm ablation later reproduces the same explosion <em>inside RLPD's own
            architecture</em>, which is about as close to the mechanism as a reproduction gets.
          </p>
        </Reveal>
      </Sect>

      <div className="rl-divider" role="presentation" />

      {/* ---------- 6 · humanoid ---------- */}
      <Sect id="humanoid" brow="Beyond the paper" title={<>Humanoid, where the honesty lives</>}>
        <Reveal delay={0.1}>
          <p className="rl-p">
            The paper stops at the easy bodies. Humanoid-v5 is 348 observations and 17 actuators, and I
            ran all three methods on it for a million steps each. The numbers got interesting for the
            wrong reasons.
          </p>
        </Reveal>
        <Reveal delay={0.14}>
          <div className="rl-clip">
            <img src="/covers/rlpd-humanoid.gif" alt="Trained Humanoid policy walking upright in MuJoCo, dark render" loading="lazy" decoding="async" />
            <span className="rl-cliptag">best single seed — IQL · seed 2 · 87.8 normalized</span>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="rl-cap">One seed walking is a demonstration, not a result. The aggregate is below.</p>
        </Reveal>
        <div className="rl-kpis">
          <Reveal delay={0.1}>
            <div className="rl-kpi" style={{ ["--kc" as string]: C.iql }}>
              <div className="rl-n"><CountUp to={70.1} decimals={1} /></div>
              <div className="rl-l">IQL, 3-seed mean ± 16.2 — but it <em>starts</em> at 47.9</div>
            </div>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="rl-kpi" style={{ ["--kc" as string]: C.rlpd }}>
              <div className="rl-n"><CountUp to={13.0} decimals={1} /></div>
              <div className="rl-l">RLPD, 3-seed mean ± 13.8, learning online from scratch</div>
            </div>
          </Reveal>
          <Reveal delay={0.26}>
            <div className="rl-kpi" style={{ ["--kc" as string]: C.sacfd }}>
              <div className="rl-n">NaN</div>
              <div className="rl-l">SACfD critic, on 2 of 3 seeds (at 550k and 430k steps)</div>
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <p className="rl-p">
            The asterisk matters: IQL runs <strong>one million offline gradient steps before touching the
            environment</strong>, so its curve starts at 48 on an env-step axis where RLPD starts from
            random. That's a different budget, not a fair race. The honest reading is "offline pretraining
            pays off on a hard body" — not "IQL is better."
          </p>
        </Reveal>
        <Reveal delay={0.12}>
          <Fig src="/rlpd/fig-humanoid.png"
            alt="Two panels: Humanoid normalized return over one million steps for RLPD, IQL and SACfD, and mean critic Q on a log scale showing SACfD diverging past ten to the tenth"
            caption="Humanoid-v5 · 3 seeds · left: return (note IQL's head start at step 0) · right: mean Q, log scale — SACfD reaches ~10¹⁰ before NaN. Click to enlarge." />
        </Reveal>
      </Sect>

      {/* ---------- 7 · the twist ---------- */}
      <Sect id="twist" brow="The result that got me" title={<>I turned off the offline data. It got better.</>}>
        <Reveal delay={0.1}>
          <p className="rl-p">
            Then the ablations — one component at a time, seed-matched against RLPD at the same 500k step.
            Remove LayerNorm: NaN by 15k, same signature as SACfD. Offline-only sampling:{" "}
            <span className="rl-mono">−8.5</span>, barely above random. UTD 1:{" "}
            <span className="rl-mono">−4.6</span>. Ensemble of 2: <span className="rl-mono">−3.2</span>.
            All four confirm the paper's design.
          </p>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="rl-p">
            The fifth didn't. Setting the mix to <strong style={{ color: C.online }}>online-only</strong> —
            throwing the offline data out entirely, keeping the architecture — beat the full method. Not
            within noise. By a factor of three:
          </p>
        </Reveal>
        <Reveal delay={0.14}><TwistChart /></Reveal>
        <Reveal delay={0.1}>
          <p className="rl-cap">
            Real curves. Δ = 28.0 − 7.8 = <strong>+20.1</strong>, computed as the mean of each run's last
            five evaluations at the matched 500k step; online-only is the 3-seed mean (23.1 / 45.0 / 15.8),
            the reference is the seed-matched RLPD run.
          </p>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="rl-pull">On this body, the prior data wasn't a head start. It was a leash.</p>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="rl-p">
            This doesn't invalidate offline-to-online RL. It says the premise is conditional: when the
            dataset's state distribution is far from what a from-scratch policy visits, forcing half of
            every batch onto it drags the critic away from where the agent actually is — and the
            architecture (LayerNorm, ensemble, high UTD) turns out to be the part carrying the weight.
            The ablation changed the question I was asking.
          </p>
        </Reveal>
      </Sect>

      {/* ---------- 8 · expert-data follow-up ---------- */}
      <Sect id="expert" brow="The obvious objection" title={<>"Your data was just mediocre"</>}>
        <Reveal delay={0.1}>
          <p className="rl-p">
            Fair. So I gave RLPD the best data that exists for this body — the <em>expert</em> Humanoid
            dataset — and ran it a full million steps. It flatlined at <strong>4.0</strong>. Not better
            than medium (7.8). If anything worse, and worse than online-only by a factor of seven. One
            seed, so I hold it loosely — but a million flat steps is hard to read as bad luck.
          </p>
        </Reveal>
        <div className="rl-kpis">
          {[
            [7.8, "RLPD · medium data · matched seed @ 500k", C.rlpd],
            [4.0, "RLPD · expert data · n=1, flat to 1M", C.iql],
            [28.0, "online-only · no data at all · 3 seeds", C.online],
          ].map(([v, l, c], i) => (
            <Reveal key={l as string} delay={0.1 + i * 0.08}>
              <div className="rl-kpi" style={{ ["--kc" as string]: c as string }}>
                <div className="rl-n"><CountUp to={v as number} decimals={1} /></div>
                <div className="rl-l">{l}</div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.12}>
          <Fig src="/rlpd/fig-ablations.png"
            alt="Humanoid ablation curves: online-only rises well above RLPD with medium data and RLPD with expert data, which both stay low; the no-LayerNorm run's critic explodes"
            caption="All Humanoid ablations at 500k, plus both RLPD references (medium and expert). Click to enlarge." />
        </Reveal>
        <Reveal delay={0.12}>
          <p className="rl-p">
            For completeness, the locomotion expert story — where offline data <em>does</em> help — comes
            with its own asterisk: only seed 0 ran the full horizon (last-5 of{" "}
            <span className="rl-mono">81.9 / 93.1 / 82.3</span> on Hopper / Walker2d / HalfCheetah); seeds
            1–2 stopped at 57.5k during an earlier phase. I report that as what it is — a single-seed
            observation, not a clean 3-seed comparison.
          </p>
        </Reveal>
        <Reveal delay={0.12}>
          <Fig src="/rlpd/fig-quality.png"
            alt="RLPD normalized return across simple, medium and expert offline data on the three locomotion tasks; the expert curves are ragged because two seeds stopped early"
            caption="Locomotion, RLPD across data qualities. The expert curves go single-seed past 57.5k — read them accordingly. Click to enlarge." />
        </Reveal>
      </Sect>

      <div className="rl-divider" role="presentation" />

      {/* ---------- 9 · what I learned ---------- */}
      <Sect id="learned" brow="What I took from it" title={<>Reproduction as interrogation</>}>
        <ul className="rl-learned">
          {[
            ["The mechanism, not the number.", "The scores matched the paper's story on locomotion — but the reason they matched (bounded critics, not the data mix) only showed up under ablation."],
            ["Aggregates hide behavior.", "IQL's 70 on Humanoid looks dominant until you notice where its curve starts. One seed walking beautifully is a demo; three seeds are a result."],
            ["Implementation is the experiment.", "A log-std floor, a LayerNorm, a sampling ratio — each one changed conclusions more than any headline hyperparameter."],
            ["Run the boring ablation.", "The one I almost skipped — online-only — was the one that changed the question."],
          ].map(([h, p], i) => (
            <Reveal key={h} delay={0.08 + i * 0.07}>
              <li><strong>{h}</strong> {p}</li>
            </Reveal>
          ))}
        </ul>
      </Sect>

      {/* ---------- footer ---------- */}
      <footer className="rl-footer">
        <p className="rl-brow">Colophon</p>
        <p className="rl-name">Karan Anchan</p>
        <p className="rl-p" style={{ marginBottom: 0, color: "var(--rl-dim)" }}>
          Reproduction, Humanoid extension, and ablation study of RLPD (Ball, Smith, Kostrikov &amp; Levine, ICML 2023).
        </p>
        <div className="rl-links">
          <a className="rl-btn rl-primary" href="https://github.com/Karan-Anchan/rlpd-offline-to-online-rl" target="_blank" rel="noopener">Code &amp; full results ↗</a>
          <a className="rl-btn" href="https://karan-anchan.github.io">← Portfolio</a>
          <a className="rl-btn" href="https://arxiv.org/abs/2302.02948" target="_blank" rel="noopener">The RLPD paper ↗</a>
          <a className="rl-btn" href="https://github.com/Karan-Anchan" target="_blank" rel="noopener">GitHub ↗</a>
        </div>
        <p className="rl-stack">PyTorch 2.11 / cu128 · Gymnasium MuJoCo v5 · Minari offline data · Weights &amp; Biases · one RTX 5070</p>
        <p className="rl-sig">Built and measured by hand. No numbers were rounded in my favour.</p>
      </footer>
    </div>
  );
}

/* ============================== styles ============================== */

const CSS = `
.rl{
  --rl-bg:#05070D; --rl-panel:#0B111C; --rl-panel2:#0F1826;
  --rl-line:rgba(130,170,230,.14); --rl-line2:rgba(130,170,230,.26);
  --rl-ink:#F4F7FB; --rl-dim:#A6B1C2; --rl-faint:#5C6B82;
  --rl-disp:var(--font-serif-accent),Georgia,serif;
  --rl-mono:var(--font-geist-mono),ui-monospace,monospace;
  --rl-sans:var(--font-geist-sans),system-ui,sans-serif;
  background:var(--rl-bg);color:var(--rl-ink);font-family:var(--rl-sans);
  line-height:1.62;position:relative;min-height:100vh;overflow-x:hidden}
.rl ::selection{background:rgba(91,157,255,.35)}
.rl :focus-visible{outline:2px solid #5DE4FF;outline-offset:3px;border-radius:6px}
.rl strong{color:#fff;font-weight:600}
.rl em{font-style:italic;font-family:var(--rl-disp);color:#fff;letter-spacing:.01em}
.rl .rl-mono{font-family:var(--rl-mono);font-variant-numeric:tabular-nums;font-size:.92em}
.rl a{color:#5B9DFF;text-decoration:none}
.rl-tnum{font-variant-numeric:tabular-nums}

.rl-sec{max-width:860px;margin:0 auto;padding:76px 26px}
.rl-brow{font-family:var(--rl-mono);font-size:11.5px;letter-spacing:.26em;text-transform:uppercase;color:#5B9DFF;margin:0 0 16px;display:flex;align-items:center;gap:11px}
.rl-brow::before{content:"";width:26px;height:1px;background:#5B9DFF;box-shadow:0 0 8px #5B9DFF;flex:none}
.rl-h2{font-family:var(--rl-disp);font-weight:400;font-size:clamp(1.9rem,4.4vw,2.9rem);line-height:1.08;letter-spacing:-0.01em;margin:0 0 .55em;text-wrap:balance}
.rl-h3{font-size:1.04rem;font-weight:600;margin:8px 0 .35em}
.rl-p{margin:0 0 1.15em;color:#C4CFDF;font-size:17px;max-width:66ch}
.rl-cap{font-family:var(--rl-mono);font-size:12px;color:var(--rl-faint);margin:-6px 0 18px;max-width:70ch}

/* hero */
.rl-hero{position:relative;min-height:100svh;display:flex;align-items:center;overflow:hidden;padding:96px 0 64px}
.rl-vidwrap{position:absolute;inset:-4%;z-index:0;will-change:transform}
.rl-vid{width:100%;height:100%;object-fit:cover;display:block}
.rl-scrim{position:absolute;inset:0;z-index:1;background:
  radial-gradient(120% 90% at 24% 42%,rgba(5,7,13,.78),rgba(5,7,13,.42)),
  linear-gradient(180deg,rgba(5,7,13,.55),rgba(5,7,13,.30) 45%,var(--rl-bg) 96%)}
.rl-hero-inner{position:relative;z-index:2;max-width:1140px;margin:0 auto;padding:0 26px;width:100%;
  display:grid;grid-template-columns:1.18fr .82fr;gap:30px;align-items:center}
.rl-eyebrow{font-family:var(--rl-mono);font-size:11.5px;letter-spacing:.24em;text-transform:uppercase;color:#9CC2FF;margin:0 0 20px}
.rl-h1{font-family:var(--rl-disp);font-weight:400;font-size:clamp(2.4rem,6vw,4.4rem);line-height:1.04;letter-spacing:-0.015em;margin:0 0 .4em;text-wrap:balance}
.rl-h1line{display:block}
.rl-lead{font-size:1.16rem;color:#DEE8F5;max-width:58ch;margin:0 0 1.2em}
.rl-chips{display:flex;flex-wrap:wrap;gap:8px;list-style:none;padding:0;margin:0 0 22px}
.rl-chips li{font-family:var(--rl-mono);font-size:11px;letter-spacing:.06em;color:var(--rl-dim);
  border:1px solid var(--rl-line);background:rgba(11,17,28,.5);border-radius:999px;padding:5px 12px}
.rl-herolinks{display:flex;gap:12px;flex-wrap:wrap}
.rl-cue{margin-top:42px;font-family:var(--rl-mono);font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--rl-faint);display:flex;align-items:center;gap:11px}
.rl-cue-bar{width:1px;height:34px;background:linear-gradient(#5DE4FF,transparent);display:inline-block}
.rl-motif{width:100%;max-width:430px;justify-self:end;filter:drop-shadow(0 0 44px rgba(91,157,255,.22))}

/* buttons */
.rl-btn{font-family:var(--rl-mono);font-size:13px;padding:12px 18px;border-radius:11px;border:1px solid var(--rl-line2);
  color:var(--rl-ink);background:rgba(11,17,28,.66);display:inline-flex;gap:8px;align-items:center;
  transition:border-color .2s,transform .2s,background .2s}
.rl-btn:hover{border-color:#5B9DFF;background:var(--rl-panel2);transform:translateY(-2px)}
.rl-primary{background:rgba(91,157,255,.16);border-color:rgba(91,157,255,.45)}

/* question / flow */
.rl-callout{border:1px solid var(--rl-line);border-left:2px solid #FFB454;border-radius:0 12px 12px 0;background:var(--rl-panel);
  padding:16px 20px;margin:6px 0 0;font-size:14.5px;color:var(--rl-dim);max-width:66ch}
.rl-callout b{color:#FFB454;font-family:var(--rl-mono);font-size:10.5px;letter-spacing:.15em;text-transform:uppercase;display:block;margin-bottom:6px}
.rl-flow svg{width:100%;height:auto;display:block}
.rl-flowbox{fill:rgba(15,24,38,.7);stroke:var(--rl-line2);stroke-width:1}
.rl-flowline{fill:none;stroke:var(--rl-line2);stroke-width:1.5}
.rl-dash{stroke-dasharray:5 6;stroke:rgba(93,228,255,.5)}
.rl-lab{font-family:var(--rl-mono);font-size:11px}

/* guardrails */
.rl-connector{width:100%;height:24px;display:block;margin-bottom:2px}
.rl-grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.rl-card{border:1px solid var(--rl-line);border-radius:14px;background:var(--rl-panel);padding:20px;height:100%;
  transition:border-color .25s,transform .25s}
.rl-card:hover{border-color:var(--gc);transform:translateY(-3px)}
.rl-ix{font-family:var(--rl-mono);font-size:11px;color:var(--rl-faint);letter-spacing:.15em}
.rl-card p{font-size:14px;margin:0 0 10px;color:var(--rl-dim)}
.rl-cfg{font-family:var(--rl-mono);font-size:12px;color:var(--rl-ink);background:rgba(5,7,13,.6);
  border:1px solid var(--rl-line);border-radius:7px;padding:6px 9px;display:inline-block;margin:2px 0 10px!important}
.rl-echo{font-size:12.5px!important;color:var(--rl-faint)!important;border-top:1px dashed var(--rl-line);padding-top:9px;margin-bottom:0!important}
.rl-dot{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:9px;background:var(--gc);box-shadow:0 0 10px var(--gc);vertical-align:middle}

/* panels & charts */
.rl-panel{border:1px solid var(--rl-line);border-radius:16px;background:linear-gradient(180deg,var(--rl-panel),var(--rl-bg));
  padding:24px 26px 16px;margin:6px 0 22px;box-shadow:0 30px 70px -50px rgba(0,0,0,.9)}
.rl-legend{display:flex;gap:18px;font-family:var(--rl-mono);font-size:11.5px;color:var(--rl-dim);margin-bottom:16px;flex-wrap:wrap;align-items:center}
.rl-legend b{font-weight:400;display:inline-flex;gap:7px;align-items:center}
.rl-legend i{width:10px;height:10px;border-radius:3px;display:inline-block;background:currentColor;box-shadow:0 0 8px currentColor}
.rl-legend-note{margin-left:auto;font-size:10.5px;color:var(--rl-faint)}
.rl-row{margin-bottom:18px}
.rl-env{font-family:var(--rl-mono);font-size:12.5px;color:var(--rl-ink);margin-bottom:9px}
.rl-barline{display:grid;grid-template-columns:52px 1fr 92px;align-items:center;gap:11px;margin-bottom:6px}
.rl-m{font-family:var(--rl-mono);font-size:11px;color:var(--rl-dim)}
.rl-track{position:relative;height:13px;background:#0A1524;border-radius:7px;overflow:hidden;border:1px solid var(--rl-line)}
.rl-bar{height:100%;border-radius:7px}
.rl-whisker{position:absolute;top:50%;height:1.5px;background:rgba(244,247,251,.55);transform:translateY(-50%);pointer-events:none}
.rl-val{font-family:var(--rl-mono);font-size:12px;text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}
.rl-val em{font-style:normal;color:var(--rl-faint);font-size:10.5px}
.rl-axis{font-family:var(--rl-mono);font-size:10.5px;color:var(--rl-faint);border-top:1px dashed var(--rl-line);padding-top:8px;display:flex;justify-content:space-between;margin-top:4px;gap:8px}
.rl-scope svg{width:100%;height:auto;display:block}

/* transitions & media */
.rl-transition{font-family:var(--rl-mono);font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:var(--rl-faint);text-align:center;margin:26px 0 18px}
.rl-gifrow{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
.rl-gifcard{border:1px solid var(--rl-line);border-radius:14px;overflow:hidden;background:#05070D;
  transition:border-color .25s,transform .25s}
.rl-gifcard:hover{border-color:rgba(91,157,255,.55);transform:translateY(-3px)}
.rl-gifcard img{width:100%;aspect-ratio:1;object-fit:cover;display:block}
.rl-gifcap{display:block;font-family:var(--rl-mono);font-size:10.5px;color:var(--rl-faint);padding:9px 12px;border-top:1px solid var(--rl-line);letter-spacing:.03em}
.rl-clip{max-width:380px;margin:8px auto 6px;position:relative;border:1px solid var(--rl-line2);border-radius:16px;overflow:hidden;background:#05070D;
  box-shadow:0 34px 64px -34px rgba(0,0,0,.9),0 0 90px -40px #5B9DFF}
.rl-clip img{width:100%;display:block;aspect-ratio:1;object-fit:cover}
.rl-cliptag{position:absolute;left:11px;bottom:10px;font-family:var(--rl-mono);font-size:10.5px;color:#D6E2F2;
  background:rgba(5,7,13,.78);border:1px solid var(--rl-line2);padding:3px 9px;border-radius:7px}

/* kpis */
.rl-kpis{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin:20px 0 22px}
.rl-kpi{border:1px solid var(--rl-line);border-radius:14px;background:linear-gradient(180deg,var(--rl-panel),var(--rl-bg));padding:22px;position:relative;overflow:hidden;height:100%}
.rl-kpi::before{content:"";position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--kc),transparent);opacity:.85}
.rl-n{font-family:var(--rl-mono);font-size:2.05rem;font-weight:700;line-height:1;color:var(--kc)}
.rl-l{font-size:12.5px;color:var(--rl-dim);margin-top:9px;line-height:1.45}
.rl-l em{font-family:inherit;font-style:normal;color:var(--rl-ink)}

/* figures + lightbox */
.rl-fig{margin:8px 0 20px}
.rl-figbtn{display:block;width:100%;padding:0;border:1px solid var(--rl-line);border-radius:14px;overflow:hidden;
  background:#0A1120;cursor:zoom-in;position:relative}
.rl-figbtn img{width:100%;display:block}
.rl-figzoom{position:absolute;right:10px;top:10px;font-size:13px;color:var(--rl-dim);background:rgba(5,7,13,.7);
  border:1px solid var(--rl-line);border-radius:7px;padding:2px 8px}
.rl-fig figcaption{font-family:var(--rl-mono);font-size:12px;color:var(--rl-faint);margin-top:10px;text-align:center}
.rl-lightbox{position:fixed;inset:0;z-index:60;background:rgba(3,5,9,.92);display:flex;flex-direction:column;
  align-items:center;justify-content:center;gap:14px;padding:4vh 4vw;cursor:zoom-out}
.rl-lightbox img{max-width:min(1400px,92vw);max-height:78vh;border:1px solid var(--rl-line2);border-radius:12px;cursor:default}
.rl-lightbox p{font-family:var(--rl-mono);font-size:12.5px;color:var(--rl-dim);max-width:80ch;text-align:center;margin:0}
.rl-lbclose{font-family:var(--rl-mono);font-size:12.5px;color:var(--rl-ink);background:var(--rl-panel);
  border:1px solid var(--rl-line2);border-radius:9px;padding:8px 16px;cursor:pointer}

/* pull, divider, learned, footer */
.rl-pull{font-family:var(--rl-disp);font-weight:400;font-style:italic;font-size:clamp(1.5rem,3.2vw,2.1rem);line-height:1.3;color:#fff;margin:30px 0;padding-left:22px;border-left:2px solid #5DE4FF;max-width:30ch}
.rl-divider{max-width:1140px;margin:0 auto;height:96px;background:center/cover no-repeat url(/rlpd/ambience.webp);opacity:.55;
  -webkit-mask-image:linear-gradient(90deg,transparent,#000 18%,#000 82%,transparent);mask-image:linear-gradient(90deg,transparent,#000 18%,#000 82%,transparent)}
.rl-learned{list-style:none;padding:0;margin:6px 0 0;display:grid;gap:14px}
.rl-learned li{border:1px solid var(--rl-line);border-radius:12px;background:var(--rl-panel);padding:16px 20px;font-size:15px;color:var(--rl-dim);max-width:72ch}
.rl-learned li strong{display:block;margin-bottom:3px;font-family:var(--rl-disp);font-weight:400;font-size:1.12rem;letter-spacing:.01em}
.rl-footer{max-width:860px;margin:0 auto;padding:56px 26px 84px;border-top:1px solid var(--rl-line)}
.rl-name{font-family:var(--rl-disp);font-size:1.55rem;margin:0 0 .2em;color:#fff}
.rl-links{display:flex;gap:12px;flex-wrap:wrap;margin:20px 0 24px}
.rl-stack{font-family:var(--rl-mono);font-size:12px;color:var(--rl-faint);line-height:2;margin:0}
.rl-sig{font-family:var(--rl-mono);font-size:12px;color:var(--rl-faint);margin-top:20px}

/* responsive */
@media (max-width:860px){
  .rl-hero-inner{grid-template-columns:1fr}
  .rl-motif{display:none}
  .rl-grid3,.rl-kpis{grid-template-columns:1fr}
  .rl-connector{display:none}
  .rl-sec{padding:56px 20px}
  .rl-h1{font-size:clamp(2.1rem,9vw,2.9rem)}
  .rl-gifrow{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;gap:12px;padding-bottom:8px;margin:0 -20px;padding-left:20px;padding-right:20px}
  .rl-gifrow>div{flex:0 0 74%;scroll-snap-align:center}
  .rl-legend-note{margin-left:0;width:100%}
  .rl-barline{grid-template-columns:46px 1fr 84px}
  .rl-divider{height:64px}
}
@media (prefers-reduced-motion:reduce){
  .rl{scroll-behavior:auto}
  .rl-btn,.rl-card,.rl-gifcard{transition:none}
}
`;
