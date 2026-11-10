let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let unlocked = false;

function getCtx(): AudioContext {
  if (!ctx) {
    ctx = new AudioContext();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.5;
    masterGain.connect(ctx.destination);
  }
  return ctx;
}

function getMaster(): GainNode {
  getCtx();
  return masterGain!;
}

function makeNoise(c: AudioContext, seconds: number): AudioBuffer {
  const len = c.sampleRate * seconds;
  const buf = c.createBuffer(1, len, c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  return buf;
}

export function unlock(): void {
  if (unlocked) return;
  const c = getCtx();
  if (c.state === "suspended") void c.resume();
  unlocked = true;
}

export function setVolume(v: number): void {
  getMaster().gain.value = Math.max(0, Math.min(1, v));
}

// ── one-shot SFX ─────────────────────────────────────────────

export function playBeep(freq = 880, duration = 0.12): void {
  const c = getCtx();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.15, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
  osc.connect(gain);
  gain.connect(getMaster());
  osc.start(c.currentTime);
  osc.stop(c.currentTime + duration);
}

export function playQuindar(): void {
  const c = getCtx();
  const t = c.currentTime;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = "sine";
  osc.frequency.value = 2525;
  gain.gain.setValueAtTime(0.12, t);
  gain.gain.setValueAtTime(0.12, t + 0.25);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
  osc.connect(gain);
  gain.connect(getMaster());
  osc.start(t);
  osc.stop(t + 0.3);
}

export function playRadioBeep(): void {
  playQuindar();
}

export function playStaging(): void {
  const c = getCtx();
  const t = c.currentTime;

  const clank = c.createBufferSource();
  clank.buffer = makeNoise(c, 0.4);
  const clankBp = c.createBiquadFilter();
  clankBp.type = "bandpass";
  clankBp.frequency.value = 1800;
  clankBp.Q.value = 2;
  const clankEnv = c.createGain();
  clankEnv.gain.setValueAtTime(0.3, t);
  clankEnv.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
  clank.connect(clankBp);
  clankBp.connect(clankEnv);
  clankEnv.connect(getMaster());
  clank.start(t);
  clank.stop(t + 0.4);

  const hiss = c.createBufferSource();
  hiss.buffer = makeNoise(c, 1.2);
  const hissBp = c.createBiquadFilter();
  hissBp.type = "bandpass";
  hissBp.frequency.value = 4000;
  hissBp.Q.value = 0.4;
  const hissEnv = c.createGain();
  hissEnv.gain.setValueAtTime(0.001, t + 0.1);
  hissEnv.gain.exponentialRampToValueAtTime(0.08, t + 0.2);
  hissEnv.gain.exponentialRampToValueAtTime(0.001, t + 1.1);
  hiss.connect(hissBp);
  hissBp.connect(hissEnv);
  hissEnv.connect(getMaster());
  hiss.start(t);
  hiss.stop(t + 1.2);
}

export function playAirlock(): void {
  const c = getCtx();
  const t = c.currentTime;
  const src = c.createBufferSource();
  src.buffer = makeNoise(c, 1.5);
  const bp = c.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 3000;
  bp.Q.value = 0.6;
  const env = c.createGain();
  env.gain.setValueAtTime(0.001, t);
  env.gain.exponentialRampToValueAtTime(0.12, t + 0.05);
  env.gain.exponentialRampToValueAtTime(0.06, t + 0.4);
  env.gain.exponentialRampToValueAtTime(0.001, t + 1.4);
  src.connect(bp);
  bp.connect(env);
  env.connect(getMaster());
  src.start(t);
  src.stop(t + 1.5);
}

export function playThud(): void {
  const c = getCtx();
  const t = c.currentTime;
  const src = c.createBufferSource();
  src.buffer = makeNoise(c, 0.5);
  const lp = c.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.setValueAtTime(200, t);
  lp.frequency.exponentialRampToValueAtTime(60, t + 0.3);
  const env = c.createGain();
  env.gain.setValueAtTime(0.7, t);
  env.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
  src.connect(lp);
  lp.connect(env);
  env.connect(getMaster());
  src.start(t);
  src.stop(t + 0.5);

  const sub = c.createOscillator();
  const subGain = c.createGain();
  sub.type = "sine";
  sub.frequency.setValueAtTime(50, t);
  sub.frequency.exponentialRampToValueAtTime(25, t + 0.3);
  subGain.gain.setValueAtTime(0.4, t);
  subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
  sub.connect(subGain);
  subGain.connect(getMaster());
  sub.start(t);
  sub.stop(t + 0.45);
}

export function playCountdown(): void {
  for (let i = 0; i < 3; i++) {
    setTimeout(() => playBeep(800, 0.15), i * 500);
  }
  setTimeout(() => playBeep(1200, 0.3), 1500);
}

export function playSuccess(): void {
  const notes = [523, 659, 784];
  notes.forEach((freq, i) => {
    setTimeout(() => playBeep(freq, 0.2), i * 150);
  });
}

// ── engine rumble (layered) ──────────────────────────────────

interface EngineNodes {
  oscs: OscillatorNode[];
  noiseSrc: AudioBufferSourceNode;
  gain: GainNode;
}
let engine: EngineNodes | null = null;

export function startEngine(): void {
  if (engine) return;
  const c = getCtx();
  const t = c.currentTime;
  const gain = c.createGain();
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(1, t + 1.2);

  const freqs = [42, 55, 78];
  const oscs: OscillatorNode[] = [];
  for (const f of freqs) {
    const osc = c.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.value = f;
    const g = c.createGain();
    g.gain.value = 0.025;
    osc.connect(g);
    g.connect(gain);
    osc.start(t);
    oscs.push(osc);
  }

  const lfo = c.createOscillator();
  const lfoG = c.createGain();
  lfo.frequency.value = 2;
  lfoG.gain.value = 6;
  lfo.connect(lfoG);
  lfoG.connect(oscs[0].frequency);
  lfo.start(t);
  oscs.push(lfo);

  const noiseSrc = c.createBufferSource();
  noiseSrc.buffer = makeNoise(c, 4);
  noiseSrc.loop = true;
  const noiseLp = c.createBiquadFilter();
  noiseLp.type = "lowpass";
  noiseLp.frequency.value = 180;
  const noiseG = c.createGain();
  noiseG.gain.value = 0.06;
  noiseSrc.connect(noiseLp);
  noiseLp.connect(noiseG);
  noiseG.connect(gain);
  noiseSrc.start(t);

  const masterLp = c.createBiquadFilter();
  masterLp.type = "lowpass";
  masterLp.frequency.value = 250;
  gain.connect(masterLp);
  masterLp.connect(getMaster());

  engine = { oscs, noiseSrc, gain };
}

export function stopEngine(): void {
  if (!engine || !ctx) return;
  const t = ctx.currentTime;
  engine.gain.gain.linearRampToValueAtTime(0, t + 0.6);
  const e = engine;
  engine = null;
  setTimeout(() => {
    for (const o of e.oscs) { try { o.stop(); } catch { /* ok */ } }
    try { e.noiseSrc.stop(); } catch { /* ok */ }
  }, 700);
}

// ── breathing ────────────────────────────────────────────────

let breathingInterval: ReturnType<typeof setInterval> | null = null;

export function startBreathing(): void {
  if (breathingInterval) return;
  const breathe = () => {
    const c = getCtx();
    const dur = 2.8;
    const noise = c.createBufferSource();
    noise.buffer = makeNoise(c, dur);

    const bp = c.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 400;
    bp.Q.value = 0.8;

    const env = c.createGain();
    const t = c.currentTime;
    env.gain.setValueAtTime(0.001, t);
    env.gain.exponentialRampToValueAtTime(0.025, t + 0.6);
    env.gain.exponentialRampToValueAtTime(0.015, t + 1.0);
    env.gain.exponentialRampToValueAtTime(0.001, t + 1.8);
    env.gain.setValueAtTime(0.001, t + 1.9);
    env.gain.exponentialRampToValueAtTime(0.02, t + 2.2);
    env.gain.exponentialRampToValueAtTime(0.001, t + 2.7);

    noise.connect(bp);
    bp.connect(env);
    env.connect(getMaster());
    noise.start(t);
    noise.stop(t + dur);
  };
  breathe();
  breathingInterval = setInterval(breathe, 3200);
}

export function stopBreathing(): void {
  if (breathingInterval) {
    clearInterval(breathingInterval);
    breathingInterval = null;
  }
}

// ── footstep ─────────────────────────────────────────────────

export function playFootstep(): void {
  const c = getCtx();
  const dur = 0.12;
  const src = c.createBufferSource();
  src.buffer = makeNoise(c, dur);
  const lp = c.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 800;
  const g = c.createGain();
  g.gain.value = 0.15;
  src.connect(lp);
  lp.connect(g);
  g.connect(getMaster());
  src.start();
}

// ── ambient: space drone (flight phases) ─────────────────────

interface DroneNodes {
  oscs: OscillatorNode[];
  noiseSrc: AudioBufferSourceNode;
  gain: GainNode;
}
let drone: DroneNodes | null = null;

export function startSpaceDrone(): void {
  if (drone) return;
  const c = getCtx();
  const t = c.currentTime;
  const gain = c.createGain();
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(1, t + 3);

  const pads: Array<[number, OscillatorType]> = [
    [65, "sine"],
    [98, "sine"],
    [131, "triangle"],
    [196, "sine"],
  ];
  const oscs: OscillatorNode[] = [];
  for (const [freq, type] of pads) {
    const osc = c.createOscillator();
    osc.type = type;
    osc.frequency.value = freq;
    const g = c.createGain();
    g.gain.value = 0.012;
    osc.connect(g);
    g.connect(gain);
    osc.start(t);
    oscs.push(osc);
  }

  const lfo = c.createOscillator();
  const lfoG = c.createGain();
  lfo.type = "sine";
  lfo.frequency.value = 0.08;
  lfoG.gain.value = 3;
  lfo.connect(lfoG);
  lfoG.connect(oscs[2].frequency);
  lfo.start(t);
  oscs.push(lfo);

  const noiseSrc = c.createBufferSource();
  noiseSrc.buffer = makeNoise(c, 6);
  noiseSrc.loop = true;
  const noiseBp = c.createBiquadFilter();
  noiseBp.type = "bandpass";
  noiseBp.frequency.value = 200;
  noiseBp.Q.value = 0.3;
  const noiseG = c.createGain();
  noiseG.gain.value = 0.015;
  noiseSrc.connect(noiseBp);
  noiseBp.connect(noiseG);
  noiseG.connect(gain);
  noiseSrc.start(t);

  const lp = c.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 600;
  gain.connect(lp);
  lp.connect(getMaster());

  drone = { oscs, noiseSrc, gain };
}

export function stopSpaceDrone(): void {
  if (!drone || !ctx) return;
  const t = ctx.currentTime;
  drone.gain.gain.linearRampToValueAtTime(0, t + 2);
  const d = drone;
  drone = null;
  setTimeout(() => {
    for (const o of d.oscs) { try { o.stop(); } catch { /* ok */ } }
    try { d.noiseSrc.stop(); } catch { /* ok */ }
  }, 2200);
}

// ── ambient: lunar hum (surface phases) ──────────────────────

interface HumNodes {
  oscs: OscillatorNode[];
  noiseSrc: AudioBufferSourceNode;
  gain: GainNode;
}
let lunarHum: HumNodes | null = null;

export function startLunarHum(): void {
  if (lunarHum) return;
  const c = getCtx();
  const t = c.currentTime;
  const gain = c.createGain();
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(1, t + 4);

  const oscs: OscillatorNode[] = [];

  const sub = c.createOscillator();
  sub.type = "sine";
  sub.frequency.value = 30;
  const subG = c.createGain();
  subG.gain.value = 0.02;
  sub.connect(subG);
  subG.connect(gain);
  sub.start(t);
  oscs.push(sub);

  const mid = c.createOscillator();
  mid.type = "sine";
  mid.frequency.value = 82;
  const midG = c.createGain();
  midG.gain.value = 0.008;
  mid.connect(midG);
  midG.connect(gain);
  mid.start(t);
  oscs.push(mid);

  const lfo = c.createOscillator();
  lfo.type = "sine";
  lfo.frequency.value = 0.05;
  const lfoG = c.createGain();
  lfoG.gain.value = 0.004;
  lfo.connect(lfoG);
  lfoG.connect(midG.gain);
  lfo.start(t);
  oscs.push(lfo);

  const noiseSrc = c.createBufferSource();
  noiseSrc.buffer = makeNoise(c, 8);
  noiseSrc.loop = true;
  const noiseLp = c.createBiquadFilter();
  noiseLp.type = "lowpass";
  noiseLp.frequency.value = 100;
  const noiseG = c.createGain();
  noiseG.gain.value = 0.01;
  noiseSrc.connect(noiseLp);
  noiseLp.connect(noiseG);
  noiseG.connect(gain);
  noiseSrc.start(t);

  gain.connect(getMaster());
  lunarHum = { oscs, noiseSrc, gain };
}

export function stopLunarHum(): void {
  if (!lunarHum || !ctx) return;
  const t = ctx.currentTime;
  lunarHum.gain.gain.linearRampToValueAtTime(0, t + 2);
  const h = lunarHum;
  lunarHum = null;
  setTimeout(() => {
    for (const o of h.oscs) { try { o.stop(); } catch { /* ok */ } }
    try { h.noiseSrc.stop(); } catch { /* ok */ }
  }, 2200);
}

// ── export ───────────────────────────────────────────────────

export const gameAudio = {
  unlock,
  setVolume,
  playBeep,
  playQuindar,
  playRadioBeep,
  playStaging,
  playAirlock,
  playThud,
  startEngine,
  stopEngine,
  playCountdown,
  playSuccess,
  startBreathing,
  stopBreathing,
  playFootstep,
  startSpaceDrone,
  stopSpaceDrone,
  startLunarHum,
  stopLunarHum,
} as const;
