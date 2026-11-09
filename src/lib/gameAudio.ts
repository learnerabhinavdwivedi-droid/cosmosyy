let ctx: AudioContext | null = null;
let engineOsc: OscillatorNode | null = null;
let engineGain: GainNode | null = null;
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

export function unlock(): void {
  if (unlocked) return;
  const c = getCtx();
  if (c.state === "suspended") void c.resume();
  unlocked = true;
}

export function setVolume(v: number): void {
  getMaster().gain.value = Math.max(0, Math.min(1, v));
}

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

export function playRadioBeep(): void {
  playBeep(1200, 0.08);
  setTimeout(() => playBeep(1500, 0.06), 120);
}

export function playThud(): void {
  const c = getCtx();
  const bufferSize = c.sampleRate * 0.3;
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    const t = i / c.sampleRate;
    data[i] = (Math.random() * 2 - 1) * Math.exp(-t * 15) * 0.8;
  }
  const source = c.createBufferSource();
  source.buffer = buffer;
  const filter = c.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 120;
  const gain = c.createGain();
  gain.gain.value = 0.6;
  source.connect(filter);
  filter.connect(gain);
  gain.connect(getMaster());
  source.start();
}

export function startEngine(): void {
  if (engineOsc) return;
  const c = getCtx();
  engineOsc = c.createOscillator();
  engineGain = c.createGain();
  engineOsc.type = "sawtooth";
  engineOsc.frequency.value = 55;
  engineGain.gain.value = 0;
  engineGain.gain.linearRampToValueAtTime(0.08, c.currentTime + 1);
  engineOsc.connect(engineGain);

  const lfo = c.createOscillator();
  const lfoGain = c.createGain();
  lfo.frequency.value = 2.5;
  lfoGain.gain.value = 8;
  lfo.connect(lfoGain);
  lfoGain.connect(engineOsc.frequency);
  lfo.start();

  const filter = c.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 200;
  engineGain.connect(filter);
  filter.connect(getMaster());
  engineOsc.start();
}

export function stopEngine(): void {
  if (!engineOsc || !engineGain || !ctx) return;
  engineGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
  const osc = engineOsc;
  setTimeout(() => {
    try { osc.stop(); } catch { /* already stopped */ }
  }, 600);
  engineOsc = null;
  engineGain = null;
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

let breathingInterval: ReturnType<typeof setInterval> | null = null;

export function startBreathing(): void {
  if (breathingInterval) return;
  const breathe = () => {
    const c = getCtx();
    const dur = 2.8;
    const noise = c.createBufferSource();
    const bufSize = c.sampleRate * dur;
    const buf = c.createBuffer(1, bufSize, c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      data[i] = (Math.random() * 2 - 1);
    }
    noise.buffer = buf;
    noise.loop = false;

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

export function playFootstep(): void {
  const c = getCtx();
  const dur = 0.12;
  const bufSize = c.sampleRate * dur;
  const buf = c.createBuffer(1, bufSize, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) {
    const t = i / c.sampleRate;
    data[i] = (Math.random() * 2 - 1) * Math.exp(-t * 25) * 0.4;
  }
  const source = c.createBufferSource();
  source.buffer = buf;
  const filter = c.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 800;
  const gain = c.createGain();
  gain.gain.value = 0.15;
  source.connect(filter);
  filter.connect(gain);
  gain.connect(getMaster());
  source.start();
}

export const gameAudio = {
  unlock,
  setVolume,
  playBeep,
  playRadioBeep,
  playThud,
  startEngine,
  stopEngine,
  playCountdown,
  playSuccess,
  startBreathing,
  stopBreathing,
  playFootstep,
} as const;
