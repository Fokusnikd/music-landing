import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react'
import { lessonSteps, noteColors } from '../data'
import { motionTokens, springs } from '../lib/motion'
import { Container, Reveal, SectionHeading } from './ui'

// Treble staff, 200 units tall: lines from E4 (bottom) to F5 (top), 12 units per scale step
const LINES = [136, 112, 88, 64, 40]
// A4, B4, C5, D5, E5 — the first five notes of A minor
const pitches = [
  { y: 100, color: noteColors[5] },
  { y: 88, color: noteColors[6] },
  { y: 76, color: noteColors[0] },
  { y: 64, color: noteColors[1] },
  { y: 52, color: noteColors[2] },
]

// Phones get a shorter staff, so the notes and labels stay readable instead of the staff scrolling sideways
function staffGeometry(compact: boolean) {
  const width = compact ? 600 : 1000
  const first = compact ? 130 : 190
  const step = compact ? 100 : 170
  return {
    width,
    startX: compact ? 90 : 110,
    endX: width - 40,
    label: compact ? 28 : 20,
    notes: pitches.map((p, i) => ({ ...p, x: first + i * step })),
  }
}

const narrowQuery = '(max-width: 639px)'
const subscribe = (onChange: () => void) => {
  const media = window.matchMedia(narrowQuery)
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}
const useNarrow = () => useSyncExternalStore(subscribe, () => window.matchMedia(narrowQuery).matches)

// Stems go up for notes below the middle line and down from it, as in printed music
const stem = (x: number, y: number) => (y > 88 ? `M${x + 13} ${y - 3} V${y - 68}` : `M${x - 13} ${y + 3} V${y + 68}`)

export function FirstLesson() {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.4'] })
  const geometry = staffGeometry(useNarrow())
  const { width, notes } = geometry
  // The ref lets the scroll-driven transform see the current geometry after a resize
  const geometryRef = useRef(geometry)
  useLayoutEffect(() => {
    geometryRef.current = geometry
  })
  const playheadX = useTransform(scrollYProgress, (p) => geometryRef.current.startX + p * (geometryRef.current.endX - geometryRef.current.startX))
  const [played, setPlayed] = useState(0)

  // A note counts as played once the playhead has passed it
  useMotionValueEvent(playheadX, 'change', (x) => setPlayed(geometryRef.current.notes.filter((n) => x >= n.x - 6).length))
  const reached = reduce ? notes.length : played

  return (
    <section className="py-16 lg:py-24" aria-labelledby="lesson-title">
      <Container>
        <Reveal>
          <SectionHeading
            id="lesson-title"
            eyebrow="Пробный урок"
            title="Первый урок — как гамма: пять шагов вверх"
            intro="45 минут, бесплатно, вы рядом. Никаких экзаменов и проверки слуха на входе."
          />
        </Reveal>

        <div className="mt-10">
          <div ref={ref} className="rounded-[2rem] bg-white p-4 ring-1 ring-ink/5 sm:p-6">
            <svg viewBox={`0 0 ${width} 200`} className="h-auto w-full" role="img" aria-label="Нотный стан: ноты ля, си, до, ре, ми — пять шагов урока">
              {LINES.map((y) => (
                <path key={y} d={`M20 ${y} H${width - 20}`} stroke="#1e2147" strokeOpacity="0.25" strokeWidth="2" />
              ))}
              <path d="M20 40 V136" stroke="#1e2147" strokeOpacity="0.4" strokeWidth="3" />
              <path d={`M${width - 32} 40 V136`} stroke="#1e2147" strokeOpacity="0.4" strokeWidth="3" />
              <path d={`M${width - 22} 40 V136`} stroke="#1e2147" strokeWidth="6" />
              <g fontFamily="Unbounded, sans-serif" fontWeight="800" fontSize="46" fill="#1e2147" textAnchor="middle">
                <text x="62" y="84">4</text>
                <text x="62" y="132">4</text>
              </g>

              {notes.map((note, i) => {
                const on = i < reached
                return (
                  <g key={note.x}>
                    <motion.path
                      d={stem(note.x, note.y)}
                      strokeWidth="4"
                      strokeLinecap="round"
                      animate={{ stroke: on ? '#1e2147' : 'rgba(30,33,71,0.2)' }}
                    />
                    <motion.ellipse
                      cx={note.x}
                      cy={note.y}
                      rx="15"
                      ry="11"
                      transform={`rotate(-20 ${note.x} ${note.y})`}
                      strokeWidth="3"
                      animate={{
                        fill: on ? note.color : '#ffffff',
                        stroke: on ? '#1e2147' : 'rgba(30,33,71,0.25)',
                        scale: on ? [1.5, 1] : 1,
                      }}
                      transition={springs.bouncy}
                      style={{ originX: '50%', originY: '50%' }}
                    />
                    <text
                      x={note.x}
                      y="186"
                      textAnchor="middle"
                      fontFamily="Unbounded, sans-serif"
                      fontWeight="700"
                      fontSize={geometry.label}
                      fill={on ? '#1e2147' : 'rgba(30,33,71,0.35)'}
                    >
                      {lessonSteps[i].note}
                    </text>
                  </g>
                )
              })}

              {!reduce && (
                <motion.g style={{ x: playheadX }}>
                  <path d="M0 22 V152" stroke="#c93a1b" strokeWidth="3" strokeLinecap="round" />
                  <path d="M-8 14 h16 l-8 10z" fill="#c93a1b" />
                </motion.g>
              )}
            </svg>
          </div>

          <ol className="mt-6 grid gap-4 md:grid-cols-5">
            {lessonSteps.map((step, i) => {
              const on = i < reached
              return (
                <motion.li
                  key={step.title}
                  className="rounded-3xl bg-white p-5 ring-1 ring-ink/5"
                  animate={{ opacity: on ? 1 : 0.45, y: on ? 0 : motionTokens.distance.sm }}
                  transition={{ duration: motionTokens.duration.normal, ease: motionTokens.easing.smooth }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="grid size-10 place-items-center rounded-full font-display text-sm font-bold text-ink transition-colors"
                      style={{ backgroundColor: on ? notes[i].color : '#fcecd2' }}
                    >
                      {step.note}
                    </span>
                    <span className="text-sm font-bold text-ink-soft">{step.time}</span>
                  </div>
                  <h3 className="mt-4 text-lg font-bold">{step.title}</h3>
                  <p className="mt-2 text-ink-soft">{step.text}</p>
                </motion.li>
              )
            })}
          </ol>
        </div>
      </Container>
    </section>
  )
}
