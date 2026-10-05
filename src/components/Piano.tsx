import { AnimatePresence, motion, useInView } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { MouseEvent, PointerEvent } from 'react'
import { noteColors, noteNames } from '../data'
import { playNote, preload } from '../lib/audio'
import { motionTokens, pressable, springs } from '../lib/motion'
import { Icon } from './Icon'

type Key = { midi: number; code: string; label: string }

// C4–E5. Codes are physical keys, so the piano works with the Russian layout too
const whiteKeys: Key[] = [
  { midi: 60, code: 'KeyA', label: 'A' },
  { midi: 62, code: 'KeyS', label: 'S' },
  { midi: 64, code: 'KeyD', label: 'D' },
  { midi: 65, code: 'KeyF', label: 'F' },
  { midi: 67, code: 'KeyG', label: 'G' },
  { midi: 69, code: 'KeyH', label: 'H' },
  { midi: 71, code: 'KeyJ', label: 'J' },
  { midi: 72, code: 'KeyK', label: 'K' },
  { midi: 74, code: 'KeyL', label: 'L' },
  { midi: 76, code: 'Semicolon', label: ';' },
]

// "after" is the index of the white key to the left of each black key
const blackKeys: (Key & { after: number })[] = [
  { midi: 61, code: 'KeyW', label: 'W', after: 0 },
  { midi: 63, code: 'KeyE', label: 'E', after: 1 },
  { midi: 66, code: 'KeyT', label: 'T', after: 3 },
  { midi: 68, code: 'KeyY', label: 'Y', after: 4 },
  { midi: 70, code: 'KeyU', label: 'U', after: 5 },
  { midi: 73, code: 'KeyO', label: 'O', after: 7 },
  { midi: 75, code: 'KeyP', label: 'P', after: 8 },
]

const byCode = new Map([...whiteKeys, ...blackKeys].map((k) => [k.code, k.midi]))

const LA = 69
const scaleSteps = [0, 2, 4, 5, 7, 9, 11]
const sharpNames = ['до-диез', 'ре-диез', 'фа-диез', 'соль-диез', 'ля-диез']

function describe(midi: number) {
  const step = scaleSteps.indexOf(midi % 12)
  if (step >= 0) return { name: noteNames[step], color: noteColors[step] }
  const sharpIndex = [1, 3, 6, 8, 10].indexOf(midi % 12)
  return { name: sharpNames[sharpIndex], color: noteColors[[0, 1, 3, 4, 5][sharpIndex]] }
}

// Horizontal centre of a key in percent of the keyboard width
function keyCenter(midi: number) {
  const white = whiteKeys.findIndex((k) => k.midi === midi)
  if (white >= 0) return ((white + 0.5) / whiteKeys.length) * 100
  const black = blackKeys.find((k) => k.midi === midi)
  return black ? ((black.after + 1) / whiteKeys.length) * 100 : 50
}

// «Во поле берёза стояла», first line. The major version only raises one note — and the whole mood changes
const melody = {
  minor: [76, 76, 76, 76, 74, 72, 71, 71, 69],
  major: [76, 76, 76, 76, 74, 73, 71, 71, 69],
}
const rhythm = [1, 1, 1, 1, 1, 1, 1, 1, 3]
const BEAT = 0.3

type Mode = keyof typeof melody
type Flying = { id: number; midi: number; drift: number }

export function Piano() {
  const [pressed, setPressed] = useState<Set<number>>(new Set())
  const [flying, setFlying] = useState<Flying[]>([])
  const [playing, setPlaying] = useState<Mode | null>(null)
  const [laHits, setLaHits] = useState(0)
  const timers = useRef<number[]>([])
  const nextId = useRef(0)
  const root = useRef<HTMLDivElement>(null)
  const visible = useInView(root, { amount: 0.3 })

  const press = useCallback((midi: number, length = 0.4) => {
    playNote('piano', midi, 0, length)
    setPressed((prev) => new Set(prev).add(midi))
    const id = nextId.current++
    setFlying((prev) => [...prev.slice(-14), { id, midi, drift: (Math.random() - 0.5) * 40 }])
    if (midi === LA) setLaHits((n) => n + 1)
  }, [])

  const release = useCallback((midi: number) => {
    setPressed((prev) => {
      const next = new Set(prev)
      next.delete(midi)
      return next
    })
  }, [])

  const stop = useCallback(() => {
    timers.current.forEach(window.clearTimeout)
    timers.current = []
    setPlaying(null)
    setPressed(new Set())
  }, [])

  const play = (mode: Mode) => {
    stop()
    setPlaying(mode)
    let at = 0
    melody[mode].forEach((midi, i) => {
      const length = rhythm[i] * BEAT
      const startMs = at * 1000
      timers.current.push(
        window.setTimeout(() => press(midi, length), startMs),
        window.setTimeout(() => release(midi), startMs + length * 1000 - 40),
      )
      at += length
    })
    timers.current.push(window.setTimeout(() => setPlaying(null), at * 1000 + 300))
  }

  useEffect(() => stop, [stop])

  useEffect(() => {
    if (visible) void preload('piano')
  }, [visible])

  // Computer keyboard plays the piano while it is on screen, but never while someone types into a form
  useEffect(() => {
    if (!visible) return
    const typing = (target: EventTarget | null) =>
      target instanceof HTMLElement && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
    const down = (event: KeyboardEvent) => {
      const midi = byCode.get(event.code)
      if (midi === undefined || event.repeat || event.ctrlKey || event.metaKey || event.altKey || typing(event.target)) return
      event.preventDefault()
      press(midi)
    }
    const up = (event: KeyboardEvent) => {
      const midi = byCode.get(event.code)
      if (midi !== undefined) release(midi)
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [visible, press, release])

  // Mouse and touch sound on pointer down for zero latency; keyboard activation of a focused key comes through click with detail 0
  const keyHandlers = (midi: number) => ({
    onPointerDown: (event: PointerEvent) => {
      event.currentTarget.releasePointerCapture(event.pointerId)
      press(midi)
    },
    onPointerUp: () => release(midi),
    onPointerLeave: () => release(midi),
    onClick: (event: MouseEvent) => {
      if (event.detail !== 0) return
      press(midi)
      window.setTimeout(() => release(midi), 180)
    },
  })

  return (
    <div ref={root} className="relative rounded-[2rem] bg-ink p-4 pt-5 text-paper shadow-[0_40px_80px_-40px_rgba(30,33,71,0.7)] sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-display text-base font-bold whitespace-nowrap sm:text-lg">Сыграйте что-нибудь</p>
          <p className="mt-1 hidden items-center gap-1.5 text-sm text-paper/70 sm:flex">
            <Icon name="keyboard" className="size-4" />
            Мышкой или клавишами A–; и W–P
          </p>
          <p className="mt-1 text-sm text-paper/70 sm:hidden">Нажимайте на клавиши — со звуком</p>
        </div>
        <span className="hidden rounded-full bg-paper/10 px-3 py-1 text-xs font-bold whitespace-nowrap text-paper/80 sm:inline">со звуком</span>
      </div>

      {/* "That's us" pointer above the A key, which turns into a reaction when A is played */}
      <div className="relative mt-5 h-12">
        <div className="absolute bottom-1 -translate-x-1/2" style={{ left: `${keyCenter(LA)}%` }}>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={laHits}
              className={`block rounded-full px-3 py-1.5 text-center text-xs font-extrabold whitespace-nowrap ${laHits ? 'bg-sun text-ink' : 'bg-tomato text-ink'}`}
              initial={{ scale: 0.6, opacity: 0, y: motionTokens.distance.sm }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={springs.bouncy}
            >
              {laHits ? 'Ля! 440 Гц — это мы' : 'это мы ↓'}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      <div className="relative select-none touch-none">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-full h-40">
          <AnimatePresence>
            {flying.map((note) => {
              const { color } = describe(note.midi)
              return (
                <motion.span
                  key={note.id}
                  className="absolute bottom-0 text-3xl font-bold"
                  style={{ left: `${keyCenter(note.midi)}%`, color }}
                  initial={{ opacity: 1, y: 0, x: '-50%', rotate: 0, scale: 0.6 }}
                  animate={{ opacity: 0, y: -150, x: `calc(-50% + ${note.drift}px)`, rotate: note.drift / 2, scale: 1.2 }}
                  transition={{ duration: 1.3, ease: motionTokens.easing.smooth }}
                  onAnimationComplete={() => setFlying((prev) => prev.filter((n) => n.id !== note.id))}
                >
                  {note.midi % 2 ? '♫' : '♪'}
                </motion.span>
              )
            })}
          </AnimatePresence>
        </div>

        <div role="group" aria-label="Пианино: две октавы от до до ми" className="relative flex h-44 gap-1 sm:h-52">
          {whiteKeys.map((key) => {
            const { name, color } = describe(key.midi)
            const down = pressed.has(key.midi)
            return (
              <button
                key={key.midi}
                type="button"
                aria-label={`Нота ${name}`}
                {...keyHandlers(key.midi)}
                className="relative flex flex-1 cursor-pointer flex-col items-center justify-end rounded-b-xl pb-2.5 transition-[transform,background-color] duration-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sun"
                style={{
                  backgroundColor: down ? color : '#fff8ec',
                  transform: down ? 'translateY(3px)' : undefined,
                  boxShadow: down ? 'inset 0 -2px 0 rgba(0,0,0,0.15)' : 'inset 0 -6px 0 rgba(30,33,71,0.12)',
                }}
              >
                <span className="mb-1 hidden text-[0.65rem] font-bold text-ink/45 sm:block">{key.label}</span>
                <span className="size-2.5 rounded-full sm:size-3" style={{ backgroundColor: down ? '#fff' : color }} />
                <span className={`mt-1 text-[0.6rem] font-extrabold sm:text-xs ${key.midi === LA ? 'text-tomato-deep' : 'text-ink/70'}`}>{name}</span>
              </button>
            )
          })}

          {blackKeys.map((key) => {
            const { name, color } = describe(key.midi)
            const down = pressed.has(key.midi)
            return (
              <button
                key={key.midi}
                type="button"
                aria-label={`Нота ${name}`}
                {...keyHandlers(key.midi)}
                className="absolute top-0 z-10 flex h-[58%] w-[6.4%] -translate-x-1/2 cursor-pointer items-end justify-center rounded-b-lg pb-2 transition-colors duration-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sun"
                style={{
                  left: `${((key.after + 1) / whiteKeys.length) * 100}%`,
                  backgroundColor: down ? color : '#0f1130',
                  boxShadow: down ? 'none' : 'inset 0 -5px 0 rgba(255,255,255,0.12)',
                }}
              >
                <span className="hidden text-[0.6rem] font-bold text-paper/50 sm:block">{key.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        {(['minor', 'major'] as const).map((mode) => (
          <motion.button
            key={mode}
            type="button"
            onClick={() => (playing === mode ? stop() : play(mode))}
            className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 font-extrabold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sun ${
              mode === 'minor' ? 'bg-sun text-ink hover:bg-white' : 'bg-paper/10 text-paper hover:bg-paper/20'
            }`}
            {...pressable}
          >
            <Icon name={playing === mode ? 'stop' : 'play'} className="size-4" />
            {mode === 'minor' ? 'В миноре' : 'В мажоре'}
          </motion.button>
        ))}
      </div>
      <p className="mt-3 text-sm leading-snug text-paper/70">
        «Во поле берёза стояла». Минор — задумчиво, как ребёнок. Мажор — уверенно, по-взрослому. Разница в одной ноте.
      </p>
    </div>
  )
}
