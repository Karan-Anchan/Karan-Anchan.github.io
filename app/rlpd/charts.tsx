"use client";

import { motion, useReducedMotion } from "motion/react";

export const C = {
  rlpd: "#5B9DFF",
  iql: "#FFB454",
  sacfd: "#FF5D73",
  online: "#5DE4FF",
};

/* Real trajectories extracted from results/*.eval.csv (see repo).
   Redline: Walker2d medium, mean_q averaged over 3 seeds, log10 scale.
   Twist: Humanoid medium, return_normalized; online-only = 3-seed mean,
   RLPD = seed 0 truncated to 500k; both lightly smoothed (window 3). */
const REDLINE_SACFD =
  "95,170 121,154 147,143 174,132 200,120 226,111 252,103 278,96 304,91 330,85 356,78 383,73 409,68 435,62 461,58 487,54 513,50 539,47 565,45 592,42 618,41 644,40 670,39 696,39";
const REDLINE_RLPD =
  "95,167 121,169 147,167 174,165 200,164 226,164 252,163 278,163 304,162 330,162 356,162 383,161 409,161 435,161 461,161 487,161 513,160 539,161 565,160 592,160 618,160 644,160 670,160 696,160";
const TWIST_ONLINE =
  "62,256 88,240 114,241 139,236 165,234 190,229 216,226 242,219 267,207 293,208 318,213 344,218 370,222 395,205 421,205 446,204 472,186 498,170 523,181 549,185 574,173 600,148 626,158 651,112 677,125 690,123";
const TWIST_RLPD =
  "62,256 88,243 114,243 139,241 165,244 190,242 216,241 242,242 267,240 293,239 318,238 344,235 370,238 395,231 421,232 446,233 472,235 498,234 523,233 549,233 574,232 600,221 626,222 651,229 677,223 696,220";

const draw = (reduced: boolean, dur: number, delay = 0) =>
  reduced
    ? {}
    : {
        initial: { pathLength: 0, opacity: 0 },
        whileInView: { pathLength: 1, opacity: 1 },
        viewport: { once: true, margin: "-20%" },
        transition: { duration: dur, delay, ease: "easeInOut" as const },
      };

const fade = (reduced: boolean, delay = 0) =>
  reduced
    ? {}
    : {
        initial: { opacity: 0 },
        whileInView: { opacity: 1 },
        viewport: { once: true, margin: "-20%" },
        transition: { duration: 0.5, delay },
      };

/* ---------- 1 · mechanism flow: how offline data actually enters RLPD ---------- */

export function FlowDiagram() {
  const r = useReducedMotion() ?? false;
  const box = "rl-flowbox";
  return (
    <div className="rl-panel rl-flow" role="img"
      aria-label="RLPD mechanism: an offline dataset and a growing online replay buffer are sampled fifty-fifty into every batch, which updates a LayerNorm ensemble critic at UTD 20; the policy acts in MuJoCo and feeds the online buffer.">
      <svg viewBox="0 0 760 248">
        {/* nodes */}
        <motion.g {...fade(r, 0)}>
          <rect className={box} x="20" y="34" width="176" height="52" rx="9" />
          <text className="rl-lab" x="108" y="56" textAnchor="middle" fill="var(--rl-ink)">offline dataset</text>
          <text className="rl-lab" x="108" y="72" textAnchor="middle" fill="var(--rl-faint)">Minari · fixed · 1M rows</text>
        </motion.g>
        <motion.g {...fade(r, 0.12)}>
          <rect className={box} x="20" y="150" width="176" height="52" rx="9" />
          <text className="rl-lab" x="108" y="172" textAnchor="middle" fill="var(--rl-ink)">online replay</text>
          <text className="rl-lab" x="108" y="188" textAnchor="middle" fill="var(--rl-faint)">grows as the policy acts</text>
        </motion.g>
        {/* merge arrows */}
        <motion.path d="M196 60 C 232 60 240 102 252 112" className="rl-flowline" {...draw(r, 0.6, 0.25)} />
        <motion.path d="M196 176 C 232 176 240 134 252 124" className="rl-flowline" {...draw(r, 0.6, 0.35)} />
        <motion.g {...fade(r, 0.55)}>
          <rect className={box} x="252" y="92" width="118" height="52" rx="9" style={{ stroke: C.rlpd }} />
          <text className="rl-lab" x="311" y="114" textAnchor="middle" fill={C.rlpd}>50 / 50 batch</text>
          <text className="rl-lab" x="311" y="130" textAnchor="middle" fill="var(--rl-faint)">symmetric sampling</text>
        </motion.g>
        <motion.path d="M370 118 L 420 118" className="rl-flowline" {...draw(r, 0.35, 0.75)} />
        <motion.g {...fade(r, 0.85)}>
          <rect className={box} x="420" y="92" width="196" height="52" rx="9" />
          <text className="rl-lab" x="518" y="114" textAnchor="middle" fill="var(--rl-ink)">critic ×10 · LayerNorm</text>
          <text className="rl-lab" x="518" y="130" textAnchor="middle" fill="var(--rl-faint)">20 updates / env step</text>
        </motion.g>
        <motion.path d="M616 118 L 656 118" className="rl-flowline" {...draw(r, 0.3, 1.0)} />
        <motion.g {...fade(r, 1.1)}>
          <rect className={box} x="656" y="92" width="84" height="52" rx="9" />
          <text className="rl-lab" x="698" y="122" textAnchor="middle" fill="var(--rl-ink)">policy π</text>
        </motion.g>
        {/* loop back */}
        <motion.path d="M698 144 C 698 226 300 238 196 196" className="rl-flowline rl-dash" {...draw(r, 0.9, 1.25)} />
        <motion.text className="rl-lab" x="452" y="240" textAnchor="middle" fill="var(--rl-faint)" {...fade(r, 1.6)}>
          acts in MuJoCo · new transitions join the online buffer
        </motion.text>
      </svg>
    </div>
  );
}

/* ---------- 2 · locomotion bars, last-5 evals, 3 seeds, ± std ---------- */

const LOCO: [string, [keyof typeof C & string, string, number, number][]][] = [
  ["Hopper-v5", [["rlpd", "RLPD", 77.8, 2.4], ["iql", "IQL", 74.9, 17.7], ["sacfd", "SACfD", 39.9, 9.2]]],
  ["Walker2d-v5", [["rlpd", "RLPD", 89.4, 0.2], ["iql", "IQL", 82.0, 5.9], ["sacfd", "SACfD", 7.6, 0.8]]],
  ["HalfCheetah-v5", [["rlpd", "RLPD", 81.6, 6.3], ["iql", "IQL", 84.9, 2.6], ["sacfd", "SACfD", 17.1, 0.8]]],
];

export function LocoBars() {
  const r = useReducedMotion() ?? false;
  return (
    <div className="rl-panel">
      <div className="rl-legend">
        <b style={{ color: C.rlpd }}><i />RLPD</b>
        <b style={{ color: C.iql }}><i />IQL</b>
        <b style={{ color: C.sacfd }}><i />SACfD</b>
        <span className="rl-legend-note">last-5 evals · mean ± std over 3 seeds</span>
      </div>
      {LOCO.map(([env, rows]) => (
        <div className="rl-row" key={env}>
          <div className="rl-env">{env}</div>
          {rows.map(([key, label, v, sd], i) => (
            <div className="rl-barline" key={label}>
              <span className="rl-m">{label}</span>
              <div className="rl-track">
                <motion.div
                  className="rl-bar"
                  style={{
                    background: `linear-gradient(90deg, ${C[key as keyof typeof C]}, color-mix(in srgb, ${C[key as keyof typeof C]} 50%, #0A1524))`,
                  }}
                  initial={r ? { width: `${v}%` } : { width: 0 }}
                  whileInView={{ width: `${v}%` }}
                  viewport={{ once: true, margin: "-12%" }}
                  transition={{ duration: 1.0, ease: [0.2, 0.7, 0.2, 1], delay: i * 0.08 }}
                />
                <motion.span
                  className="rl-whisker"
                  style={{
                    left: `${Math.max(v - sd, 0)}%`,
                    width: `${Math.min(v + sd, 100) - Math.max(v - sd, 0)}%`,
                  }}
                  {...fade(r, 0.9 + i * 0.08)}
                />
              </div>
              <span className="rl-val">
                {v.toFixed(1)} <em>±{sd.toFixed(1)}</em>
              </span>
            </div>
          ))}
        </div>
      ))}
      <div className="rl-axis"><span>0</span><span>normalized return · Minari v5 expert = 100 · random = 0</span><span>100</span></div>
    </div>
  );
}

/* ---------- 3 · the critic redline (real Walker2d mean-Q curves, log scale) ---------- */

export function CriticRedline() {
  const r = useReducedMotion() ?? false;
  const ticks: [number, string][] = [[200.8, "10²"], [145.6, "10³"], [90.4, "10⁴"], [35.2, "10⁵"]];
  return (
    <div className="rl-panel rl-scope" role="img"
      aria-label="Critic value estimates on Walker2d, log scale. SACfD's mean Q climbs continuously to about 85,300 by 245 thousand steps while RLPD stays flat near 545.">
      <svg viewBox="0 0 760 300">
        <line x1="56" y1="264" x2="696" y2="264" stroke="var(--rl-line2)" />
        <line x1="56" y1="24" x2="56" y2="264" stroke="var(--rl-line2)" />
        {ticks.map(([y, t]) => (
          <g key={t}>
            <line x1="56" y1={y} x2="696" y2={y} stroke="var(--rl-line)" strokeDasharray="3 6" />
            <text className="rl-lab" x="48" y={y + 4} textAnchor="end" fill="var(--rl-faint)">{t}</text>
          </g>
        ))}
        {/* grid destabilizes as the curve escapes */}
        {[560, 628].map((x, i) => (
          <motion.line key={x} x1={x} y1="24" x2={x} y2="264" stroke="var(--rl-line)"
            {...(r ? {} : {
              initial: { opacity: 0.9, x1: x, x2: x },
              whileInView: { opacity: [0.9, 0.25, 0.8, 0.35, 0.7], x1: [x, x + 1.5, x - 1, x + 0.5, x], x2: [x, x - 1.5, x + 1, x - 0.5, x] },
              viewport: { once: true, margin: "-25%" },
              transition: { duration: 1.6, delay: 1.4 + i * 0.2 },
            })}
          />
        ))}
        <text className="rl-lab" x="56" y="284" fill="var(--rl-faint)">0</text>
        <text className="rl-lab" x="696" y="284" textAnchor="end" fill="var(--rl-faint)">245k env steps</text>
        <motion.polyline points={REDLINE_RLPD} fill="none" stroke={C.rlpd} strokeWidth="2.4" strokeLinecap="round" {...draw(r, 1.6, 0.1)} />
        <motion.polyline points={REDLINE_SACFD} fill="none" stroke={C.sacfd} strokeWidth="2.4" strokeLinecap="round" {...draw(r, 2.2, 0.3)} />
        <motion.circle cx="696" cy="39" r="4.5" fill={C.sacfd}
          {...(r ? {} : {
            initial: { scale: 0, opacity: 0 },
            whileInView: { scale: [0, 1.7, 1], opacity: [0, 1, 1] },
            viewport: { once: true, margin: "-25%" },
            transition: { delay: 2.4, duration: 0.9 },
          })}
        />
        <motion.text className="rl-lab" x="688" y="24" textAnchor="end" fill={C.sacfd} {...fade(r, 2.6)}>
          SACfD · mean Q ≈ 85,300
        </motion.text>
        <motion.text className="rl-lab" x="688" y="150" textAnchor="end" fill={C.rlpd} {...fade(r, 2.0)}>
          RLPD · mean Q ≈ 545
        </motion.text>
      </svg>
    </div>
  );
}

/* ---------- 4 · the twist (real Humanoid curves: online-only vs the 50/50 mix) ---------- */

export function TwistChart() {
  const r = useReducedMotion() ?? false;
  const seeds: [number, number, string][] = [[149, 23.1, "s0"], [47, 45.0, "s1"], [183, 15.8, "s2"]];
  return (
    <div className="rl-panel rl-scope" role="img"
      aria-label="Humanoid, normalized return over 500 thousand steps. The online-only ablation climbs to a 3-seed mean of 28.0 while the full 50/50 RLPD mix reaches 7.8 — a gap of plus 20.1.">
      <svg viewBox="0 0 760 320">
        <line x1="56" y1="256" x2="696" y2="256" stroke="var(--rl-line2)" />
        <line x1="56" y1="24" x2="56" y2="256" stroke="var(--rl-line2)" />
        {[[256, "0"], [163.2, "20"], [70.4, "40"]].map(([y, t]) => (
          <g key={t as string}>
            <line x1="56" y1={y as number} x2="696" y2={y as number} stroke="var(--rl-line)" strokeDasharray="3 6" />
            <text className="rl-lab" x="48" y={(y as number) + 4} textAnchor="end" fill="var(--rl-faint)">{t}</text>
          </g>
        ))}
        <text className="rl-lab" x="56" y="276" fill="var(--rl-faint)">0</text>
        <text className="rl-lab" x="696" y="276" textAnchor="end" fill="var(--rl-faint)">500k env steps · same seed grid</text>
        <motion.polyline points={TWIST_RLPD} fill="none" stroke={C.rlpd} strokeWidth="2.2" strokeLinecap="round" opacity="0.85" {...draw(r, 1.8, 0.1)} />
        <motion.polyline points={TWIST_ONLINE} fill="none" stroke={C.online} strokeWidth="2.6" strokeLinecap="round" {...draw(r, 1.8, 0.35)} />
        {seeds.map(([y, v, s], i) => (
          <motion.g key={s} {...fade(r, 2.1 + i * 0.12)}>
            <circle cx="700" cy={y} r="3.4" fill={C.online} opacity="0.9" />
            <text className="rl-lab" x="710" y={y + 4} fill="var(--rl-faint)">{s} · {v.toFixed(1)}</text>
          </motion.g>
        ))}
        <motion.path d="M700 220 L 706 220 L 706 126 L 700 126" fill="none" stroke="var(--rl-dim)" strokeWidth="1" {...draw(r, 0.5, 2.5)} />
        <motion.text className="rl-lab" x="712" y="170" fill="#fff" fontWeight="700" {...fade(r, 2.8)}>
          Δ +20.1
        </motion.text>
        <motion.text className="rl-lab" x="66" y="40" fill={C.online} {...fade(r, 1.6)}>
          online-only · 3-seed mean → 28.0 ± 15.2
        </motion.text>
        <motion.text className="rl-lab" x="66" y="58" fill={C.rlpd} {...fade(r, 1.7)}>
          RLPD 50/50 · matched seed → 7.8
        </motion.text>
      </svg>
    </div>
  );
}
