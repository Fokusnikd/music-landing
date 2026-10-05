import type { InstrumentId } from '../data'

// Melodic instruments play recorded samples (see public/samples/CREDITS.txt); drums and the offline fallback are synthesized
let ctx: AudioContext | null = null
let master: GainNode | null = null

function context() {
  if (!ctx || !master) {
    ctx = new AudioContext()
    master = ctx.createGain()
    master.gain.value = 0.7
    const limiter = ctx.createDynamicsCompressor()
    limiter.threshold.value = -10
    master.connect(limiter).connect(ctx.destination)
  }
  return { ctx, out: master }
}

// Browsers only allow sound after a user gesture, so the context is resumed on the first click or key press
function audio() {
  const graph = context()
  if (graph.ctx.state === 'suspended') void graph.ctx.resume()
  return graph
}

type Sampled = Exclude<InstrumentId, 'drums'>

// A few recorded notes per instrument; the rest are the nearest sample played faster or slower
const sampleNotes: Record<Sampled, Record<number, string>> = {
  piano: { 57: 'A3', 60: 'C4', 63: 'Ds4', 66: 'Fs4', 69: 'A4', 72: 'C5', 75: 'Ds5', 78: 'Fs5' },
  guitar: { 45: 'A2', 52: 'E3', 57: 'A3', 60: 'C4', 64: 'E4' },
  ukulele: { 60: 'C4', 64: 'E4', 69: 'A4' },
  violin: { 69: 'A4', 72: 'C5', 76: 'E5' },
  vocal: { 69: 'A4', 72: 'C5', 76: 'E5' },
}
const sampleFolder: Record<Sampled, string> = { piano: 'piano', guitar: 'guitar', ukulele: 'ukulele', violin: 'violin', vocal: 'choir' }

const buffers = new Map<Sampled, Map<number, AudioBuffer>>()
const loading = new Map<Sampled, Promise<void>>()

// Fetches and decodes one instrument once; safe to call many times. Failures leave the synth fallback in place
export function preload(voiceId: InstrumentId): Promise<void> {
  if (voiceId === 'drums') return Promise.resolve()
  const existing = loading.get(voiceId)
  if (existing) return existing
  const { ctx } = context()
  const task = Promise.all(
    Object.entries(sampleNotes[voiceId]).map(async ([midi, name]) => {
      const response = await fetch(`${import.meta.env.BASE_URL}samples/${sampleFolder[voiceId]}/${name}.mp3`)
      if (!response.ok) throw new Error(`Sample ${name} failed: ${response.status}`)
      return [Number(midi), await ctx.decodeAudioData(await response.arrayBuffer())] as const
    }),
  )
    .then((pairs) => {
      buffers.set(voiceId, new Map(pairs))
    })
    .catch(() => {
      // Offline or blocked: keep synthesizing, and allow a retry later
      loading.delete(voiceId)
    })
  loading.set(voiceId, task)
  return task
}

// Plucked and struck instruments ring out on their own; bowed and sung ones stop when the note ends
const sustained: Record<Sampled, boolean> = { piano: false, guitar: false, ukulele: false, violin: true, vocal: true }
const levels: Record<Sampled, number> = { piano: 0.9, guitar: 1, ukulele: 1, violin: 0.8, vocal: 0.9 }

function sample(voiceId: Sampled, set: Map<number, AudioBuffer>, midi: number, start: number, length: number) {
  const { ctx, out } = audio()
  let nearest = 0
  for (const root of set.keys()) if (!nearest || Math.abs(root - midi) < Math.abs(nearest - midi)) nearest = root
  const source = ctx.createBufferSource()
  source.buffer = set.get(nearest) ?? null
  source.playbackRate.value = 2 ** ((midi - nearest) / 12)

  const gain = ctx.createGain()
  const level = levels[voiceId]
  // Sustained notes keep sounding for their length, the rest are cut a bit after it so fast passages do not smear
  const end = sustained[voiceId] ? start + length : start + Math.max(length, 0.5) + 1.2
  const release = sustained[voiceId] ? 0.25 : 0.4
  gain.gain.setValueAtTime(sustained[voiceId] ? 0.0001 : level, start)
  if (sustained[voiceId]) gain.gain.exponentialRampToValueAtTime(level, start + 0.06)
  gain.gain.setValueAtTime(level, end)
  gain.gain.exponentialRampToValueAtTime(0.0001, end + release)
  source.connect(gain).connect(out)
  source.start(start)
  source.stop(end + release + 0.05)
}

export const midiToFreq = (midi: number) => 440 * 2 ** ((midi - 69) / 12)

function envelope(ctx: AudioContext, start: number, peak: number, attack: number, release: number) {
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.0001, start)
  gain.gain.exponentialRampToValueAtTime(peak, start + attack)
  gain.gain.exponentialRampToValueAtTime(0.0001, start + attack + release)
  return gain
}

function piano(midi: number, start: number, length: number) {
  const { ctx, out } = audio()
  const f = midiToFreq(midi)
  const tail = Math.max(length, 0.6) + 0.8
  const gain = envelope(ctx, start, 0.45, 0.006, tail)
  const tone = ctx.createBiquadFilter()
  tone.type = 'lowpass'
  tone.frequency.setValueAtTime(Math.min(f * 8, 6000), start)
  tone.frequency.exponentialRampToValueAtTime(Math.max(f * 1.5, 400), start + tail)
  gain.connect(tone).connect(out)

  // A slightly detuned pair plus a quiet octave sounds closer to a hammer on strings than a single oscillator
  for (const [type, ratio, level] of [
    ['triangle', 1, 1],
    ['sine', 1.003, 0.6],
    ['sine', 2, 0.25],
  ] as const) {
    const osc = ctx.createOscillator()
    const level_ = ctx.createGain()
    osc.type = type
    osc.frequency.value = f * ratio
    level_.gain.value = level
    osc.connect(level_).connect(gain)
    osc.start(start)
    osc.stop(start + tail + 0.05)
  }
}

// Karplus–Strong plucked string: a burst of noise fed through a short, slowly damped delay line
function pluck(midi: number, start: number, length: number, brightness: number) {
  const { ctx, out } = audio()
  const rate = ctx.sampleRate
  const period = Math.round(rate / midiToFreq(midi))
  const samples = Math.floor(rate * (length + 1.2))
  const buffer = ctx.createBuffer(1, samples, rate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < period; i++) data[i] = Math.random() * 2 - 1
  for (let i = period; i < samples; i++) {
    data[i] = brightness * 0.5 * (data[i - period] + data[i - period + 1])
  }
  const source = ctx.createBufferSource()
  source.buffer = buffer
  const gain = ctx.createGain()
  gain.gain.value = 0.5
  source.connect(gain).connect(out)
  source.start(start)
}

function bowed(midi: number, start: number, length: number) {
  const { ctx, out } = audio()
  const f = midiToFreq(midi)
  const osc = ctx.createOscillator()
  osc.type = 'sawtooth'
  osc.frequency.value = f

  // Vibrato that fades in after the bow settles, as a real violinist does
  const vibrato = ctx.createOscillator()
  const depth = ctx.createGain()
  vibrato.frequency.value = 5.5
  depth.gain.setValueAtTime(0, start)
  depth.gain.linearRampToValueAtTime(f * 0.007, start + 0.25)
  vibrato.connect(depth).connect(osc.frequency)

  const body = ctx.createBiquadFilter()
  body.type = 'lowpass'
  body.frequency.value = 2600
  body.Q.value = 2

  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.0001, start)
  gain.gain.exponentialRampToValueAtTime(0.22, start + 0.09)
  gain.gain.setValueAtTime(0.22, start + length)
  gain.gain.exponentialRampToValueAtTime(0.0001, start + length + 0.25)

  osc.connect(body).connect(gain).connect(out)
  osc.start(start)
  vibrato.start(start)
  osc.stop(start + length + 0.3)
  vibrato.stop(start + length + 0.3)
}

// "Ла": a buzzy source through two vowel formants that glide from L to A
function voice(midi: number, start: number, length: number) {
  const { ctx, out } = audio()
  const f = midiToFreq(midi)
  const osc = ctx.createOscillator()
  osc.type = 'sawtooth'
  osc.frequency.value = f
  const vibrato = ctx.createOscillator()
  const depth = ctx.createGain()
  vibrato.frequency.value = 5
  depth.gain.value = f * 0.01
  vibrato.connect(depth).connect(osc.frequency)

  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.0001, start)
  gain.gain.exponentialRampToValueAtTime(0.5, start + 0.06)
  gain.gain.setValueAtTime(0.5, start + length)
  gain.gain.exponentialRampToValueAtTime(0.0001, start + length + 0.2)
  gain.connect(out)

  for (const [from, to, q] of [
    [350, 800, 6],
    [1300, 1150, 8],
  ]) {
    const formant = ctx.createBiquadFilter()
    formant.type = 'bandpass'
    formant.Q.value = q
    formant.frequency.setValueAtTime(from, start)
    formant.frequency.exponentialRampToValueAtTime(to, start + 0.08)
    osc.connect(formant).connect(gain)
  }
  osc.start(start)
  vibrato.start(start)
  osc.stop(start + length + 0.25)
  vibrato.stop(start + length + 0.25)
}

function noise(ctx: AudioContext, seconds: number) {
  const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * seconds), ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  const source = ctx.createBufferSource()
  source.buffer = buffer
  return source
}

export const KICK = 36
export const SNARE = 38
export const HAT = 42

function drum(kind: number, start: number) {
  const { ctx, out } = audio()
  if (kind === KICK) {
    const osc = ctx.createOscillator()
    osc.frequency.setValueAtTime(140, start)
    osc.frequency.exponentialRampToValueAtTime(45, start + 0.15)
    const gain = envelope(ctx, start, 0.9, 0.004, 0.3)
    osc.connect(gain).connect(out)
    osc.start(start)
    osc.stop(start + 0.35)
    return
  }
  const isSnare = kind === SNARE
  const hiss = noise(ctx, isSnare ? 0.25 : 0.06)
  const filter = ctx.createBiquadFilter()
  filter.type = isSnare ? 'bandpass' : 'highpass'
  filter.frequency.value = isSnare ? 1800 : 7000
  const gain = envelope(ctx, start, isSnare ? 0.5 : 0.18, 0.002, isSnare ? 0.18 : 0.05)
  hiss.connect(filter).connect(gain).connect(out)
  hiss.start(start)
  if (isSnare) {
    const tone = ctx.createOscillator()
    tone.frequency.value = 190
    const body = envelope(ctx, start, 0.3, 0.002, 0.1)
    tone.connect(body).connect(out)
    tone.start(start)
    tone.stop(start + 0.12)
  }
}

export type Voice = InstrumentId

export function playNote(voiceId: Voice, midi: number, delay = 0, length = 0.4) {
  const { ctx } = audio()
  const start = ctx.currentTime + 0.01 + delay
  if (voiceId !== 'drums') {
    const set = buffers.get(voiceId)
    if (set) return sample(voiceId, set, midi, start, length)
    void preload(voiceId)
  }
  switch (voiceId) {
    case 'piano':
      return piano(midi, start, length)
    case 'guitar':
      return pluck(midi, start, length, 0.996)
    case 'ukulele':
      return pluck(midi, start, length * 0.6, 0.99)
    case 'violin':
      return bowed(midi, start, length)
    case 'vocal':
      return voice(midi, start, length)
    case 'drums':
      return drum(midi, start)
  }
}

// [midi, start beat, length in beats]
type Phrase = { beat: number; notes: [number, number, number][] }

// Short A minor phrases, one per instrument, for the "Послушать" buttons
export const phrases: Record<Voice, Phrase> = {
  piano: {
    beat: 0.22,
    notes: [
      [57, 0, 1],
      [60, 1, 1],
      [64, 2, 1],
      [69, 3, 1],
      [72, 4, 1],
      [76, 5, 3],
      [57, 5, 3],
      [64, 5, 3],
    ],
  },
  guitar: {
    beat: 0.2,
    notes: [
      [45, 0, 1],
      [52, 1, 1],
      [57, 2, 1],
      [60, 3, 1],
      [64, 4, 1],
      [60, 5, 1],
      [57, 6, 1],
      [52, 7, 2],
    ],
  },
  ukulele: {
    beat: 0.16,
    notes: [
      [69, 0, 2],
      [60, 0.15, 2],
      [64, 0.3, 2],
      [69, 0.45, 2],
      [69, 2, 2],
      [60, 2.1, 2],
      [64, 2.2, 2],
      [69, 2.3, 2],
      [69, 4, 4],
      [60, 4.15, 4],
      [64, 4.3, 4],
      [69, 4.45, 4],
    ],
  },
  violin: {
    beat: 0.3,
    notes: [
      [76, 0, 2],
      [74, 2, 1],
      [72, 3, 1],
      [71, 4, 1],
      [69, 5, 3],
    ],
  },
  vocal: {
    beat: 0.28,
    notes: [
      [69, 0, 1],
      [72, 1, 1],
      [76, 2, 1],
      [72, 3, 1],
      [69, 4, 2],
    ],
  },
  drums: {
    beat: 0.16,
    notes: [
      [KICK, 0, 1],
      [HAT, 1, 1],
      [SNARE, 2, 1],
      [HAT, 3, 1],
      [KICK, 4, 1],
      [KICK, 5, 1],
      [SNARE, 6, 1],
      [HAT, 7, 1],
      [KICK, 8, 1],
      [HAT, 9, 1],
      [SNARE, 10, 1],
      [SNARE, 11, 1],
    ],
  },
}

// Waits for the samples (but not forever), plays a phrase and resolves with its length in milliseconds, so the UI knows when it ends
export async function playPhrase(voiceId: Voice) {
  audio()
  await Promise.race([preload(voiceId), new Promise((resolve) => setTimeout(resolve, 2500))])
  const phrase = phrases[voiceId]
  let end = 0
  for (const [midi, at, length] of phrase.notes) {
    playNote(voiceId, midi, at * phrase.beat, length * phrase.beat)
    end = Math.max(end, (at + length) * phrase.beat)
  }
  return Math.round(end * 1000)
}
