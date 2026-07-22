"use client";
/* eslint-disable react/no-unescaped-entities */

import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "motion/react";
import { Reveal } from "@/components/site/reveal";
import { GlowBorderCard } from "@/components/ui/glow-border-card";

const BLUE = "#5b9dff", AMBER = "#ffb454", RED = "#ff5d73";
const blueGlow = ["#5b9dff", "#7db4ff", "#3f7fe0", "#9ec5ff", "#2f6fd6", "#6ea8fe", "#4a90ff", "#88bcff", "#356fd0", "#5b9dff"];

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 1.5, ease: "easeOut", onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [inView, to]);
  return <span ref={ref}>{n.toLocaleString()}{suffix}</span>;
}

function Bars() {
  const data: [string, [string, number, string][]][] = [
    ["Hopper-v5", [["RLPD", 77.8, BLUE], ["IQL", 74.9, AMBER], ["SACfD", 39.9, RED]]],
    ["Walker2d-v5", [["RLPD", 89.4, BLUE], ["IQL", 82.0, AMBER], ["SACfD", 7.6, RED]]],
    ["HalfCheetah-v5", [["RLPD", 81.6, BLUE], ["IQL", 84.9, AMBER], ["SACfD", 17.1, RED]]],
  ];
  return (
    <>
      {data.map(([env, rows]) => (
        <div className="rl-row" key={env}>
          <div className="rl-env">{env}</div>
          {rows.map(([m, v, c], i) => (
            <div className="rl-barline" key={m}>
              <span className="rl-m">{m}</span>
              <div className="rl-track">
                <motion.div className="rl-bar"
                  style={{ background: `linear-gradient(90deg, ${c}, color-mix(in srgb, ${c} 55%, #0a1424))`, boxShadow: `0 0 14px -2px ${c}` }}
                  initial={{ width: 0 }} whileInView={{ width: `${v}%` }} viewport={{ once: true, margin: "-15%" }}
                  transition={{ duration: 1.1, ease: [0.2, 0.7, 0.2, 1], delay: i * 0.08 }} />
              </div>
              <span className="rl-val">{v.toFixed(1)}</span>
            </div>
          ))}
        </div>
      ))}
    </>
  );
}

function Divergence() {
  return (
    <div className="rl-panel rl-scope">
      <svg viewBox="0 0 720 250" role="img" aria-label="Critic Q: RLPD flat, SACfD diverges">
        <line x1="48" y1="206" x2="700" y2="206" stroke="var(--rl-line2)" />
        <line x1="48" y1="22" x2="48" y2="206" stroke="var(--rl-line2)" />
        <text x="48" y="226" className="rl-lab" fill="var(--rl-faint)">0</text>
        <text x="654" y="226" className="rl-lab" fill="var(--rl-faint)">250k steps</text>
        <motion.polyline points="48,202 160,196 260,180 340,150 410,108 470,66 530,40 610,26 690,22"
          fill="none" stroke={RED} strokeWidth="2.5" strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 2, ease: "easeInOut" }} />
        <motion.polyline points="48,203 180,199 340,197 520,196 690,195"
          fill="none" stroke={BLUE} strokeWidth="2.5" strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 2, ease: "easeInOut" }} />
        <motion.circle cx="690" cy="22" r="5" fill={RED}
          initial={{ scale: 0, opacity: 0 }} whileInView={{ scale: [0, 1.6, 1], opacity: 1 }} viewport={{ once: true, margin: "-20%" }}
          transition={{ delay: 1.9, duration: 1, repeat: Infinity, repeatDelay: 0.6, repeatType: "reverse" }} />
        <text x="636" y="18" className="rl-lab" fill={RED}>SACfD</text>
        <text x="640" y="190" className="rl-lab" fill={BLUE}>RLPD</text>
      </svg>
    </div>
  );
}

const GIFS: [string, string][] = [["hopper", "Hopper"], ["walker2d", "Walker2d"], ["halfcheetah", "HalfCheetah"]];

export default function RlpdContent() {
  const words = "Mixing memory with practice, and the day the recipe fell apart.".split(" ");
  return (
    <div className="rl">
      <style>{CSS}</style>

      <section className="rl-hero">
        <video className="rl-vid" autoPlay muted loop playsInline preload="auto">
          <source src="/rlpd/hero.mp4" type="video/mp4" />
        </video>
        <div className="rl-scrim" />
        <div className="rl-hero-inner">
          <div className="rl-hero-copy">
            <motion.p className="rl-eyebrow" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              Reproduction study · deep reinforcement learning
            </motion.p>
            <motion.h1 className="rl-h1" initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.05, delayChildren: 0.15 } } }}>
              {words.map((w, i) => (
                <motion.span className="rl-word" key={i}
                  variants={{ hidden: { opacity: 0, y: 26, filter: "blur(7px)" }, show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } } }}>
                  {w}&nbsp;
                </motion.span>
              ))}
            </motion.h1>
            <motion.p className="rl-lead" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.7 }}>
              I rebuilt <strong>RLPD</strong> — a 2023 method for learning control online while reusing a fixed
              batch of old experience — from scratch in PyTorch. Then I pushed it onto a body the paper never
              tried, ran the ablations one guardrail at a time, and hit a result that argued against the premise.
            </motion.p>
            <motion.div className="rl-cue" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1 }}>
              <span className="rl-cue-bar" /> scroll — the numbers, the failure, the twist
            </motion.div>
          </div>
          <motion.img className="rl-figure" src="/rlpd/humanoid.webp" alt="A humanoid rendered as a glowing electric-blue wireframe, mid-stride"
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1.1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }} />
        </div>
      </section>

      <section className="rl-sec">
        <Reveal><p className="rl-brow">The subjects</p></Reveal>
        <Reveal delay={0.05}><h2 className="rl-h2">Three bodies, learning from a mix of memory and practice</h2></Reveal>
        <Reveal delay={0.1}><p className="rl-p">These are my trained policies — 245k steps each, rolling out in MuJoCo, near the expert data they learned from. Rendered on a dark stage to match the room.</p></Reveal>
        <div className="rl-gifs">
          {GIFS.map(([f, label], i) => (
            <Reveal key={f} delay={0.12 + i * 0.08}>
              <GlowBorderCard width="100%" aspectRatio="1" borderRadius="14px" gradientColors={blueGlow} borderWidth="0.9em" blurAmount="0.6em" inset="-0.6em" animationDuration={6}>
                <div className="rl-gif"><img src={`/covers/rlpd-${f}.gif`} alt={`Trained ${label} policy`} /><span>{label}</span></div>
              </GlowBorderCard>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="rl-sec">
        <Reveal><p className="rl-brow">What I was testing</p></Reveal>
        <Reveal delay={0.05}><h2 className="rl-h2">The claim I wanted to break</h2></Reveal>
        <Reveal delay={0.1}><p className="rl-p">RLPD's pitch is almost annoyingly simple. You don't need a specialised offline-RL algorithm to use a dataset. Take ordinary off-policy <span className="rl-mono">SAC</span>, pour the old data into the same pool as the fresh experience, sample <strong>half from each</strong>, and add three guardrails so the value estimates can't blow up once the agent explores.</p></Reveal>
        <Reveal delay={0.12}><p className="rl-p">I wanted to know three things my own way: does it hold up in a clean-room PyTorch reimplementation, on the current <span className="rl-mono">Minari v5</span> datasets, on a single desktop GPU? And does it survive <strong>Humanoid</strong> — 348 observations, 17 actuators, the task the paper quietly left out?</p></Reveal>
        <Reveal delay={0.14}><div className="rl-callout"><b>Honest footnote</b>This started as a three-person course project. I owned the data pipeline and the evaluation side — every number and figure here comes from runs I set up, read, and normalized. The account is first-person because the findings are mine to defend; the algorithm core was a shared build.</div></Reveal>
      </section>

      <div className="rl-divider" />

      <section className="rl-sec">
        <Reveal><p className="rl-brow">The three guardrails</p></Reveal>
        <Reveal delay={0.05}><h2 className="rl-h2">What actually makes it work</h2></Reveal>
        <div className="rl-grid3">
          {[["01 / MIX", "Symmetric sampling", "Every batch is half fresh online experience, half the fixed dataset. A dial, not a switch — and the part that broke.", BLUE],
            ["02 / BOUND", "LayerNorm critic", "One line of normalization that stops the value function chasing its own tail on unseen actions. The most load-bearing trick.", AMBER],
            ["03 / PUSH", "Ensemble + high UTD", "Ten critics, twenty gradient updates per environment step. Squeeze more learning from every transition.", RED]].map(([ix, h, p, c], i) => (
            <Reveal key={ix as string} delay={0.1 + i * 0.07}>
              <div className="rl-card" style={{ ["--gc" as string]: c as string }}>
                <div className="rl-ix">{ix}</div>
                <h3 className="rl-h3"><span className="rl-dot" />{h}</h3>
                <p>{p}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="rl-sec">
        <Reveal><p className="rl-brow">Locomotion · medium data</p></Reveal>
        <Reveal delay={0.05}><h2 className="rl-h2">It reproduced — with a caveat about <em>why</em></h2></Reveal>
        <Reveal delay={0.1}><p className="rl-p">Three tasks, three methods, three seeds, normalized so the Minari v5 expert reads 100 and a random policy 0. RLPD landed high-70s to high-80s. <span className="rl-mono" style={{ color: AMBER }}>IQL</span> matched it on score. <span className="rl-mono" style={{ color: RED }}>SACfD</span>, the naive "dump it in one buffer" baseline, trailed — badly on Walker2d.</p></Reveal>
        <Reveal delay={0.12}>
          <div className="rl-panel">
            <div className="rl-legend"><b style={{ color: BLUE }}><i />RLPD</b><b style={{ color: AMBER }}><i />IQL</b><b style={{ color: RED }}><i />SACfD</b></div>
            <Bars />
            <div className="rl-axis"><span>0</span><span>normalized return · minari v5 expert = 100</span><span>100</span></div>
          </div>
        </Reveal>
        <Reveal delay={0.14}><p className="rl-p">Read the spread, not just the height. RLPD's seed variance was tiny — on Walker2d, <span className="rl-mono">±0.2</span>. IQL matched the scores but swung (<span className="rl-mono">±6–18</span>). So the honest headline isn't "RLPD wins," it's <strong>"RLPD is the boring, repeatable one"</strong> — which for a method you'd deploy is the better property.</p></Reveal>
      </section>

      <section className="rl-sec">
        <Reveal><p className="rl-brow">Where it broke — on purpose</p></Reveal>
        <Reveal delay={0.05}><h2 className="rl-h2">A critic running away</h2></Reveal>
        <Reveal delay={0.1}><p className="rl-p">The most instructive run was the one that failed. Strip the LayerNorm and you get SACfD; on Walker2d its value estimates didn't converge — they climbed. Mean Q walked to about <strong>85,000</strong> while RLPD sat at <span className="rl-mono">545</span>. That gap is the whole paper in one picture: with nothing to bound out-of-distribution values, the critic invents optimism it can't cash.</p></Reveal>
        <Reveal delay={0.12}><Divergence /></Reveal>
        <Reveal delay={0.14}><p className="rl-cap">Mean critic Q on Walker2d (schematic, log-ish). Bounded vs. not.</p></Reveal>
      </section>

      <div className="rl-divider" />

      <section className="rl-sec">
        <Reveal><p className="rl-brow">Beyond the paper</p></Reveal>
        <Reveal delay={0.05}><h2 className="rl-h2">Humanoid, where the honesty lives</h2></Reveal>
        <Reveal delay={0.1}><p className="rl-p">The paper stops at the easy bodies. I ran all three methods on Humanoid at a million steps, and the numbers got interesting for the wrong reasons.</p></Reveal>
        <Reveal delay={0.12}>
          <div className="rl-clip">
            <img src="/covers/rlpd-humanoid.gif" alt="Best trained Humanoid policy walking in MuJoCo" />
            <span>Humanoid-v5 · IQL · best of 3 seeds</span>
          </div>
        </Reveal>
        <div className="rl-kpis">
          {[[70, "IQL final — but see the asterisk", AMBER], [13, "RLPD, learning online from scratch", BLUE]].map(([n, l, c], i) => (
            <Reveal key={i} delay={0.1 + i * 0.08}>
              <div className="rl-kpi" style={{ ["--kc" as string]: c as string }}><div className="rl-n"><CountUp to={n as number} /></div><div className="rl-l">{l}</div></div>
            </Reveal>
          ))}
          <Reveal delay={0.26}>
            <div className="rl-kpi" style={{ ["--kc" as string]: RED }}><div className="rl-n">NaN</div><div className="rl-l">SACfD, on 2 of 3 seeds — critic to infinity</div></div>
          </Reveal>
        </div>
        <Reveal delay={0.1}><p className="rl-p">IQL looks like a runaway winner at <strong>70</strong>. It mostly isn't. IQL spends a million <em>offline</em> gradient steps before it touches the environment, so it <em>starts</em> the online phase already at 48. Those steps cost nothing on an environment-step axis, which is why its curve floats far above RLPD's cold start. The fair reading is "pretraining pays off on a hard body," not "IQL is better." I'd rather report the asterisk than the trophy.</p></Reveal>
        <Reveal delay={0.12}><figure className="rl-fig"><img src="/rlpd/fig-humanoid.png" alt="Humanoid return and critic value estimates" /><figcaption>Humanoid-v5 · 3 seeds. Left: return (IQL's head start). Right: SACfD's critic ≈10¹⁰ before NaN.</figcaption></figure></Reveal>
      </section>

      <section className="rl-sec">
        <Reveal><p className="rl-brow">The result that got me</p></Reveal>
        <Reveal delay={0.05}><h2 className="rl-h2">I turned off the data, and it got <em>better</em></h2></Reveal>
        <Reveal delay={0.1}><p className="rl-p">Then the thing you're supposed to do: take RLPD apart on Humanoid, one component at a time. Drop the LayerNorm — it diverges to NaN, same as SACfD; the guardrail is real. Cut the update ratio, shrink the ensemble — predictably worse. All as expected.</p></Reveal>
        <Reveal delay={0.12}><p className="rl-p">Except one. Set the mix to <strong>online-only</strong> — throw the offline data out entirely — and it didn't get worse. It jumped to <strong>28</strong>, well past the full 50/50 method. That contradicts the premise.</p></Reveal>
        <Reveal delay={0.14}><p className="rl-p">My first thought: the medium data was just weak. So I gave RLPD the best data I had — the <em>expert</em> Humanoid set — and ran it a full million steps. It flatlined at <strong>4</strong>. Not better than medium. If anything, worse.</p></Reveal>
        <Reveal delay={0.16}><figure className="rl-fig"><img src="/rlpd/fig-ablations.png" alt="Humanoid ablations: online-only beats RLPD with medium or expert data" /><figcaption>Humanoid ablations. Online-only (blue) climbs; RLPD with medium and expert data both sit at the bottom.</figcaption></figure></Reveal>
        <Reveal delay={0.1}><p className="rl-pull">On this body, the prior data wasn't a head start. It was a leash.</p></Reveal>
        <Reveal delay={0.12}><p className="rl-p">The likeliest reason: an expert Humanoid moves nothing like a policy learning from scratch, so forcing half of every batch onto those far-off transitions drags the value function away from where the agent actually is. Better data makes that gap <em>wider</em>. It's a single seed on the expert run and I'd want two more before carving it in stone — but the flat trajectory across a million steps makes a lucky seed unlikely.</p></Reveal>
      </section>

      <div className="rl-divider" />

      <section className="rl-sec">
        <Reveal><p className="rl-brow">What I took from it</p></Reveal>
        <Reveal delay={0.05}><h2 className="rl-h2">The honest version</h2></Reveal>
        <Reveal delay={0.1}><p className="rl-p">RLPD's story holds where it should: on locomotion, with data genuinely better than what the agent would stumble into, the 50/50 mix is stable and repeatable, and the LayerNorm earns its keep on every failure I induced. That reproduced cleanly.</p></Reveal>
        <Reveal delay={0.12}><p className="rl-p">But the premise has an edge. On a hard body with imperfect data, a strong online learner didn't need the crutch — it did better without it. The interesting questions live at that boundary, and I only found it because I ran the ablation I assumed would be boring. That's the lesson I'm keeping: <strong>run the boring ablation.</strong></p></Reveal>
      </section>

      <footer className="rl-footer">
        <p className="rl-brow">Colophon</p>
        <h3 className="rl-name">Karan Anchan</h3>
        <p className="rl-p" style={{ marginBottom: 0, color: "var(--rl-dim)" }}>Reproduction, Humanoid extension, and ablation study of RLPD (Ball et al., ICML 2023).</p>
        <div className="rl-links">
          <a className="rl-btn rl-primary" href="https://github.com/Karan-Anchan/rlpd-offline-to-online-rl">Code &amp; full README →</a>
          <a className="rl-btn" href="https://karan-anchan.github.io">← Back to portfolio</a>
          <a className="rl-btn" href="https://arxiv.org/abs/2302.02948">The RLPD paper</a>
        </div>
        <p className="rl-stack">PyTorch 2.11 / cu128 · Gymnasium MuJoCo v5 · Minari offline data · Weights &amp; Biases · one RTX 5070</p>
        <p className="rl-sig">Built and measured by hand. No numbers were rounded in my favour.</p>
      </footer>
    </div>
  );
}

const CSS = `
.rl{--rl-bg:#070b12;--rl-panel:#0c1320;--rl-line:#1a2740;--rl-line2:#26374f;--rl-ink:#e6edf8;--rl-dim:#8496ad;--rl-faint:#4e5f78;
  --rl-disp:var(--font-serif-accent),Georgia,serif;--rl-mono:var(--font-geist-mono),ui-monospace,monospace;--rl-sans:var(--font-geist-sans),system-ui,sans-serif;
  background:var(--rl-bg);color:var(--rl-ink);font-family:var(--rl-sans);line-height:1.62;position:relative;min-height:100vh;overflow-x:hidden}
.rl ::selection{background:color-mix(in srgb,#5b9dff 35%,transparent)}
.rl strong{color:#fff;font-weight:600}
.rl em{font-style:italic;font-family:var(--rl-disp);color:#fff}
.rl .rl-mono{font-family:var(--rl-mono);font-variant-numeric:tabular-nums}
.rl a{color:#5b9dff;text-decoration:none}
.rl-sec,.rl-footer{max-width:840px;margin:0 auto;padding:0 26px}
.rl-sec{padding:70px 26px}
.rl-brow{font-family:var(--rl-mono);font-size:11.5px;letter-spacing:.26em;text-transform:uppercase;color:#5b9dff;margin:0 0 16px;display:flex;align-items:center;gap:11px}
.rl-brow::before{content:"";width:26px;height:1px;background:#5b9dff;box-shadow:0 0 8px #5b9dff}
.rl-h2{font-family:var(--rl-disp);font-weight:400;font-size:clamp(1.9rem,4.4vw,2.9rem);line-height:1.08;letter-spacing:-0.01em;margin:0 0 .5em;text-wrap:balance}
.rl-h3{font-size:1.05rem;font-weight:600;margin:8px 0 .3em}
.rl-p{margin:0 0 1.15em;color:#c2cfe0;font-size:17px}
.rl-cap{font-family:var(--rl-mono);font-size:12px;color:var(--rl-faint);text-align:center;margin-top:-6px}

.rl-hero{position:relative;min-height:100vh;display:flex;align-items:center;overflow:hidden;padding:90px 0 60px}
.rl-vid{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0}
.rl-scrim{position:absolute;inset:0;z-index:1;background:
  radial-gradient(120% 90% at 20% 40%,rgba(7,11,18,.72),rgba(7,11,18,.45)),
  linear-gradient(180deg,rgba(7,11,18,.55),rgba(7,11,18,.35) 40%,var(--rl-bg))}
.rl-hero-inner{position:relative;z-index:2;max-width:1120px;margin:0 auto;padding:0 26px;width:100%;
  display:grid;grid-template-columns:1.15fr .85fr;gap:28px;align-items:center}
.rl-eyebrow{font-family:var(--rl-mono);font-size:11.5px;letter-spacing:.26em;text-transform:uppercase;color:#8fbcff;margin:0 0 18px}
.rl-h1{font-family:var(--rl-disp);font-weight:400;font-size:clamp(2.7rem,6.6vw,4.6rem);line-height:1.02;letter-spacing:-0.015em;margin:.05em 0 .38em;text-wrap:balance}
.rl-word{display:inline-block}
.rl-lead{font-size:1.18rem;color:#dbe6f4;max-width:60ch}
.rl-cue{margin-top:40px;font-family:var(--rl-mono);font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--rl-faint);display:flex;align-items:center;gap:11px}
.rl-cue-bar{width:1px;height:34px;background:linear-gradient(#5b9dff,transparent);display:inline-block}
.rl-figure{width:100%;max-width:440px;justify-self:end;filter:drop-shadow(0 0 40px rgba(91,157,255,.25))}

.rl-gifs{display:grid;grid-template-columns:repeat(3,1fr);gap:26px;margin-top:26px}
.rl-gif{position:relative;width:100%;aspect-ratio:1;border-radius:12px;overflow:hidden;background:#05070d}
.rl-gif img{width:100%;height:100%;object-fit:cover;display:block}
.rl-gif span{position:absolute;left:9px;bottom:8px;font-family:var(--rl-mono);font-size:10.5px;color:#d6e2f2;background:rgba(5,8,14,.72);border:1px solid var(--rl-line2);padding:2px 8px;border-radius:6px}

.rl-callout{border:1px solid var(--rl-line);border-left:2px solid #ffb454;border-radius:0 12px 12px 0;background:var(--rl-panel);padding:16px 20px;margin:22px 0 0;font-size:14.5px;color:var(--rl-dim)}
.rl-callout b{color:#ffb454;font-family:var(--rl-mono);font-size:10.5px;letter-spacing:.15em;text-transform:uppercase;display:block;margin-bottom:6px}

.rl-divider{max-width:1120px;margin:0 auto;height:104px;
  background:center/cover no-repeat url(/rlpd/ambience.webp);opacity:.6;
  -webkit-mask-image:linear-gradient(90deg,transparent,#000 20%,#000 80%,transparent);mask-image:linear-gradient(90deg,transparent,#000 20%,#000 80%,transparent)}

.rl-grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:10px}
.rl-card{border:1px solid var(--rl-line);border-radius:14px;background:var(--rl-panel);padding:20px;height:100%;transition:border-color .3s,transform .3s}
.rl-card:hover{border-color:var(--gc);transform:translateY(-3px)}
.rl-ix{font-family:var(--rl-mono);font-size:11px;color:var(--rl-faint);letter-spacing:.15em}
.rl-card p{font-size:14px;margin:0;color:var(--rl-dim)}
.rl-dot{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:9px;background:var(--gc);box-shadow:0 0 10px var(--gc);vertical-align:middle}

.rl-panel{border:1px solid var(--rl-line);border-radius:16px;background:linear-gradient(180deg,var(--rl-panel),var(--rl-bg));padding:24px 26px 14px;margin:24px 0;box-shadow:0 30px 70px -50px rgba(0,0,0,.9)}
.rl-legend{display:flex;gap:18px;font-family:var(--rl-mono);font-size:11.5px;color:var(--rl-dim);margin-bottom:16px;flex-wrap:wrap}
.rl-legend b{font-weight:400;display:inline-flex;gap:7px;align-items:center}
.rl-legend i{width:10px;height:10px;border-radius:3px;display:inline-block;background:currentColor;box-shadow:0 0 8px currentColor}
.rl-row{margin-bottom:18px}
.rl-env{font-family:var(--rl-mono);font-size:12.5px;color:var(--rl-ink);margin-bottom:9px}
.rl-barline{display:grid;grid-template-columns:56px 1fr 44px;align-items:center;gap:11px;margin-bottom:6px}
.rl-m{font-family:var(--rl-mono);font-size:11px;color:var(--rl-dim)}
.rl-track{height:13px;background:#0a1424;border-radius:7px;overflow:hidden;border:1px solid var(--rl-line)}
.rl-bar{height:100%;border-radius:7px}
.rl-val{font-family:var(--rl-mono);font-size:12px;text-align:right;font-variant-numeric:tabular-nums}
.rl-axis{font-family:var(--rl-mono);font-size:10.5px;color:var(--rl-faint);border-top:1px dashed var(--rl-line);padding-top:8px;display:flex;justify-content:space-between;margin-top:4px}

.rl-scope svg{width:100%;height:auto;display:block}
.rl-lab{font-family:var(--rl-mono);font-size:11px}

.rl-clip{max-width:360px;margin:26px auto 6px;position:relative;border:1px solid var(--rl-line2);border-radius:16px;overflow:hidden;background:#05070d;box-shadow:0 34px 64px -34px rgba(0,0,0,.9),0 0 80px -38px #5b9dff}
.rl-clip img{width:100%;display:block}
.rl-clip span{position:absolute;left:11px;bottom:10px;font-family:var(--rl-mono);font-size:10.5px;color:#d6e2f2;background:rgba(5,8,14,.74);border:1px solid var(--rl-line2);padding:3px 9px;border-radius:7px}

.rl-kpis{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin:24px 0 6px}
.rl-kpi{border:1px solid var(--rl-line);border-radius:14px;background:linear-gradient(180deg,var(--rl-panel),var(--rl-bg));padding:22px;position:relative;overflow:hidden;height:100%}
.rl-kpi::before{content:"";position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--kc),transparent);opacity:.85}
.rl-n{font-family:var(--rl-mono);font-size:2.1rem;font-weight:700;line-height:1;color:var(--kc);font-variant-numeric:tabular-nums}
.rl-l{font-size:12.5px;color:var(--rl-dim);margin-top:9px;line-height:1.4}

.rl-fig img{width:100%;display:block;border:1px solid var(--rl-line);border-radius:14px;background:#0a1120}
.rl-fig figcaption{font-family:var(--rl-mono);font-size:12px;color:var(--rl-faint);margin-top:10px;text-align:center}
.rl-fig{margin:24px 0}

.rl-pull{font-family:var(--rl-disp);font-weight:400;font-style:italic;font-size:clamp(1.5rem,3.2vw,2.1rem);line-height:1.3;color:#fff;margin:34px 0;padding-left:22px;border-left:2px solid #5b9dff}

.rl-footer{padding:56px 26px 78px;border-top:1px solid var(--rl-line);margin-top:20px}
.rl-name{font-family:var(--rl-disp);font-weight:400;font-size:1.6rem;margin:0 0 .2em}
.rl-links{display:flex;gap:13px;flex-wrap:wrap;margin:20px 0 24px}
.rl-btn{font-family:var(--rl-mono);font-size:13px;padding:12px 18px;border-radius:11px;border:1px solid var(--rl-line2);color:var(--rl-ink);background:var(--rl-panel);display:inline-flex;gap:9px;align-items:center;transition:border-color .25s,transform .25s,background .25s}
.rl-btn:hover{border-color:#5b9dff;background:#101d2e;transform:translateY(-2px)}
.rl-primary{background:color-mix(in srgb,#5b9dff 18%,var(--rl-panel));border-color:color-mix(in srgb,#5b9dff 50%,var(--rl-line2))}
.rl-stack{font-family:var(--rl-mono);font-size:12px;color:var(--rl-faint);line-height:2}
.rl-sig{font-family:var(--rl-mono);font-size:12px;color:var(--rl-faint);margin-top:22px}

@media (max-width:760px){
  .rl-hero-inner{grid-template-columns:1fr}
  .rl-figure{display:none}
  .rl-gifs,.rl-grid3,.rl-kpis{grid-template-columns:1fr}
  .rl-gifs{max-width:320px;margin-left:auto;margin-right:auto}
}
@media (prefers-reduced-motion:reduce){.rl-vid{display:none}}
`;
