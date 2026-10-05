import { motion, useInView } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { instruments, years } from '../data'
import type { InstrumentId } from '../data'
import { playPhrase, preload } from '../lib/audio'
import { motionTokens, pressable } from '../lib/motion'
import { Icon } from './Icon'
import { InstrumentArt } from './InstrumentArt'
import { Container, Reveal, SectionHeading, Squiggle } from './ui'

function Equalizer() {
  return (
    <span className="flex h-4 items-end gap-0.5" aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <motion.span
          key={i}
          className="w-1 rounded-full bg-current"
          animate={{ height: ['30%', '100%', '45%', '80%', '30%'] }}
          transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.12 }}
        />
      ))}
    </span>
  )
}

export function Instruments({ onBook }: { onBook: (id: InstrumentId) => void }) {
  const [playing, setPlaying] = useState<InstrumentId | null>(null)
  const timer = useRef(0)
  const lastClick = useRef(0)
  const section = useRef<HTMLElement>(null)
  // Start downloading the samples while the visitor is still reading the cards
  const near = useInView(section, { once: true, margin: '0px 0px 400px 0px' })

  useEffect(() => () => window.clearTimeout(timer.current), [])

  useEffect(() => {
    if (near) instruments.forEach((item) => void preload(item.id))
  }, [near])

  const listen = async (id: InstrumentId) => {
    window.clearTimeout(timer.current)
    const click = ++lastClick.current
    setPlaying(id)
    const ms = await playPhrase(id)
    // A newer click owns the button state
    if (click !== lastClick.current) return
    timer.current = window.setTimeout(() => setPlaying(null), ms + 400)
  }

  return (
    <section ref={section} id="instruments" className="staff-lines py-16 lg:py-24" aria-labelledby="instruments-title">
      <Container>
        <Reveal>
          <SectionHeading
            id="instruments-title"
            eyebrow="Инструменты"
            title={
              <>
                Шесть инструментов. <Squiggle color="#5fd3a8">Послушайте</Squiggle> каждый
              </>
            }
            intro="Нажмите «Послушать» — это записи настоящих инструментов. Вживую, в классе, они звучат ещё лучше: приходите сравнить."
          />
        </Reveal>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {instruments.map((item, i) => {
            const isPlaying = playing === item.id
            return (
              <Reveal as="li" key={item.id} delay={(i % 3) * motionTokens.stagger} className="flex">
                <motion.article
                  className="flex w-full flex-col overflow-hidden rounded-[2rem] bg-white ring-1 ring-ink/5"
                  whileHover={{ y: -6 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                >
                  <div className="relative grid h-44 place-items-center" style={{ backgroundColor: `${item.color}33` }}>
                    <InstrumentArt id={item.id} playing={isPlaying} className="h-36 w-auto" />
                    <span className="absolute top-4 left-4 rounded-full bg-white px-3 py-1 text-sm font-extrabold">с {years(item.from)}</span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-xl font-bold">{item.title}</h3>
                    <p className="mt-2 flex-1 text-ink-soft">{item.text}</p>
                    <div className="mt-5 flex flex-wrap items-center gap-3">
                      <motion.button
                        type="button"
                        onClick={() => listen(item.id)}
                        aria-pressed={isPlaying}
                        className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-extrabold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
                          isPlaying ? 'bg-ink text-paper' : 'bg-paper-deep text-ink hover:bg-sun'
                        }`}
                        {...pressable}
                      >
                        {isPlaying ? <Equalizer /> : <Icon name="play" className="size-4" />}
                        Послушать
                      </motion.button>
                      <button
                        type="button"
                        onClick={() => onBook(item.id)}
                        className="font-extrabold text-tomato-deep underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tomato-deep"
                      >
                        Хочу попробовать
                      </button>
                    </div>
                  </div>
                </motion.article>
              </Reveal>
            )
          })}
        </ul>
      </Container>
    </section>
  )
}
