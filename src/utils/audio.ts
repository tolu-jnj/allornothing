// utils/audio.ts - Web Audio API procedural sounds

let audioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

export const playDiceClatter = () => {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  // Cascade of clicks
  for (let i = 0; i < 5; i++) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.frequency.setValueAtTime(200 + i * 100, now + i * 0.1);
    osc.frequency.exponentialRampToValueAtTime(50, now + i * 0.1 + 0.1);

    gain.gain.setValueAtTime(0.3, now + i * 0.1);
    gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.1);

    osc.start(now + i * 0.1);
    osc.stop(now + i * 0.1 + 0.1);
  }
};

export const playChipClink = () => {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.frequency.setValueAtTime(800, now);
  osc.frequency.exponentialRampToValueAtTime(200, now + 0.2);

  gain.gain.setValueAtTime(0.2, now);
  gain.gain.exponentialRampToValueAtTime(0, now + 0.2);

  osc.start(now);
  osc.stop(now + 0.2);
};

export const playWinFanfare = () => {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  const notes = [262, 330, 392, 523]; // C, E, G, C

  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.frequency.setValueAtTime(freq, now + i * 0.15);
    osc.type = 'sine';

    gain.gain.setValueAtTime(0.3, now + i * 0.15);
    gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.15 + 0.3);

    osc.start(now + i * 0.15);
    osc.stop(now + i * 0.15 + 0.3);
  });
};

export const playLossTink = () => {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.frequency.setValueAtTime(300, now);
  osc.frequency.exponentialRampToValueAtTime(100, now + 0.3);

  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0, now + 0.3);

  osc.start(now);
  osc.stop(now + 0.3);
};

export const enableHaptic = async () => {
  try {
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  } catch {
    // Haptics not available
  }
};

export const hapticSuccess = async () => {
  try {
    if ('vibrate' in navigator) {
      navigator.vibrate([20, 30, 20]);
    }
  } catch {
    // Haptics not available
  }
};

export const hapticError = async () => {
  try {
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 50, 50]);
    }
  } catch {
    // Haptics not available
  }
};
