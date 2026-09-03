/**
 * Procedural Web Audio Engine for Gamified Pack Opening
 * Pure browser-native synthesis — 0 external audio files needed.
 */

let sharedCtx: AudioContext | null = null

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  try {
    if (!sharedCtx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) {
        sharedCtx = new AudioCtx()
      }
    }
    if (sharedCtx && sharedCtx.state === 'suspended') {
      sharedCtx.resume()
    }
    return sharedCtx
  } catch {
    return null
  }
}

/**
 * 1. Tension Riser: Sub-bass rumble + rising pitch oscillator (120Hz -> 850Hz)
 */
export function playPackRiser(duration = 2.4): { stop: () => void } {
  const ctx = getAudioContext()
  if (!ctx) return { stop: () => {} }

  const now = ctx.currentTime

  // Oscillator 1: Sawtooth frequency riser
  const osc1 = ctx.createOscillator()
  osc1.type = 'sawtooth'
  osc1.frequency.setValueAtTime(110, now)
  osc1.frequency.exponentialRampToValueAtTime(820, now + duration)

  // Oscillator 2: Sub-bass rumbler
  const osc2 = ctx.createOscillator()
  osc2.type = 'triangle'
  osc2.frequency.setValueAtTime(55, now)
  osc2.frequency.linearRampToValueAtTime(120, now + duration)

  // Resonant Lowpass Filter sweep
  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.setValueAtTime(250, now)
  filter.frequency.exponentialRampToValueAtTime(2800, now + duration)
  filter.Q.setValueAtTime(4.0, now)

  // Master Gain with swell
  const masterGain = ctx.createGain()
  masterGain.gain.setValueAtTime(0.01, now)
  masterGain.gain.linearRampToValueAtTime(0.35, now + duration * 0.8)
  masterGain.gain.linearRampToValueAtTime(0.55, now + duration)

  osc1.connect(filter)
  osc2.connect(filter)
  filter.connect(masterGain)
  masterGain.connect(ctx.destination)

  osc1.start(now)
  osc2.start(now)
  osc1.stop(now + duration)
  osc2.stop(now + duration)

  return {
    stop: () => {
      try {
        masterGain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.05)
        setTimeout(() => {
          try {
            osc1.stop()
            osc2.stop()
          } catch {
            // ignore
          }
        }, 60)
      } catch {
        // ignore
      }
    },
  }
}

/**
 * 2. Burst Impact: Deep 808 Sub-kick + crisp foil tear explosion
 */
export function playBurstImpact() {
  const ctx = getAudioContext()
  if (!ctx) return

  const now = ctx.currentTime

  // A. Deep 808 Sub Kick Drop (150Hz -> 28Hz)
  const kickOsc = ctx.createOscillator()
  kickOsc.type = 'sine'
  kickOsc.frequency.setValueAtTime(160, now)
  kickOsc.frequency.exponentialRampToValueAtTime(28, now + 0.5)

  const kickGain = ctx.createGain()
  kickGain.gain.setValueAtTime(0.85, now)
  kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7)

  kickOsc.connect(kickGain)
  kickGain.connect(ctx.destination)
  kickOsc.start(now)
  kickOsc.stop(now + 0.7)

  // B. White Noise Foil Tear Crunch
  const tearDuration = 0.35
  const sampleRate = ctx.sampleRate
  const frameCount = Math.floor(sampleRate * tearDuration)
  const buffer = ctx.createBuffer(1, frameCount, sampleRate)
  const data = buffer.getChannelData(0)

  for (let i = 0; i < frameCount; i++) {
    const p = i / frameCount
    const env = Math.sin(p * Math.PI) * Math.pow(1 - p, 0.3)
    const snap = Math.random() > 0.8 ? (Math.random() * 2 - 1) * 2.2 : (Math.random() * 2 - 1) * 0.7
    data[i] = snap * env
  }

  const noise = ctx.createBufferSource()
  noise.buffer = buffer

  const bandpass = ctx.createBiquadFilter()
  bandpass.type = 'bandpass'
  bandpass.frequency.setValueAtTime(4200, now)
  bandpass.frequency.exponentialRampToValueAtTime(1200, now + tearDuration)
  bandpass.Q.setValueAtTime(2.2, now)

  const noiseGain = ctx.createGain()
  noiseGain.gain.setValueAtTime(0.65, now)
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + tearDuration)

  noise.connect(bandpass)
  bandpass.connect(noiseGain)
  noiseGain.connect(ctx.destination)
  noise.start(now)
}

/**
 * 3. Legendary Chime Fanfare: Crystal Bells Major Triad (FUT / Clash Royale Style)
 */
export function playLegendaryChime() {
  const ctx = getAudioContext()
  if (!ctx) return

  const now = ctx.currentTime
  // Frequencies: C5, E5, G5, B5, C6 (Major 7th arpeggio)
  const notes = [523.25, 659.25, 783.99, 987.77, 1046.5]

  notes.forEach((freq, idx) => {
    const noteStart = now + idx * 0.12
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, noteStart)

    // Sparkle harmonic overtone
    const osc2 = ctx.createOscillator()
    osc2.type = 'triangle'
    osc2.frequency.setValueAtTime(freq * 2.01, noteStart)

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.001, noteStart)
    gain.gain.linearRampToValueAtTime(0.28, noteStart + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0005, noteStart + 1.2)

    osc.connect(gain)
    osc2.connect(gain)
    gain.connect(ctx.destination)

    osc.start(noteStart)
    osc2.start(noteStart)
    osc.stop(noteStart + 1.25)
    osc2.stop(noteStart + 1.25)
  })
}
