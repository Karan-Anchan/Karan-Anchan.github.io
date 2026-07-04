/* Ethereal UI sound engine — pure Web Audio, no files.
   Everything is quiet by design: tactile, not noisy. */

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let enabled = true;

function ensure(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.6;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function note(
  freq: number,
  {
    type = "sine" as OscillatorType,
    dur = 0.5,
    gain = 0.03,
    delay = 0,
    detune = 0,
    lowpass = 3200,
  } = {},
) {
  const c = ensure();
  if (!c || !master) return;
  const t0 = c.currentTime + delay;
  const o = c.createOscillator();
  o.type = type;
  o.frequency.value = freq;
  o.detune.value = detune;
  const g = c.createGain();
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(gain, t0 + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  const f = c.createBiquadFilter();
  f.type = "lowpass";
  f.frequency.value = lowpass;
  o.connect(g);
  g.connect(f);
  f.connect(master);
  o.start(t0);
  o.stop(t0 + dur + 0.1);
}

export const sound = {
  isEnabled(): boolean {
    try {
      return localStorage.getItem("snd") !== "off";
    } catch {
      return true;
    }
  },
  setEnabled(on: boolean) {
    enabled = on;
    try {
      localStorage.setItem("snd", on ? "on" : "off");
    } catch {}
  },
  sync() {
    enabled = this.isEnabled();
  },
  unlock() {
    ensure();
  },

  /* faint tactile blip for hovers */
  tick() {
    if (!enabled) return;
    note(1850, { dur: 0.05, gain: 0.011, lowpass: 4200 });
  },

  /* soft bell that climbs a pentatonic scale per checkpoint */
  ckpt(n: number) {
    if (!enabled) return;
    const scale = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5];
    const f = scale[Math.max(0, Math.min(scale.length - 1, n - 1))];
    note(f, { dur: 0.9, gain: 0.028 });
    note(f * 2.76, { dur: 0.45, gain: 0.007, delay: 0.012, lowpass: 5200 });
  },

  /* minecraft xp-orb ding: two quick random-pitched plings */
  xp() {
    if (!enabled) return;
    const base = 1400 + Math.random() * 500;
    note(base, { dur: 0.16, gain: 0.035, lowpass: 6000 });
    note(base * 1.5, { dur: 0.22, gain: 0.028, delay: 0.09, lowpass: 6000 });
  },

  /* ethereal theme chime — airy detuned triad, brighter for paper mode */
  chime(bright: boolean) {
    if (!enabled) return;
    const notes = bright
      ? [659.25, 987.77, 1318.51] // E5 · B5 · E6 — morning
      : [220.0, 329.63, 440.0]; //   A3 · E4 · A4 — night lab
    notes.forEach((f, i) => {
      note(f, {
        type: "triangle",
        dur: bright ? 1.1 : 1.5,
        gain: 0.02,
        delay: i * 0.09,
        detune: i % 2 ? 5 : -4,
        lowpass: bright ? 4200 : 2200,
      });
      note(f, {
        dur: bright ? 1.3 : 1.7,
        gain: 0.012,
        delay: i * 0.09 + 0.03,
        detune: i % 2 ? -6 : 5,
        lowpass: 1800,
      });
    });
  },
};
