import { animate, motion, useInView } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { stats } from '../data'
import { motionTokens, pressable } from '../lib/motion'
import { Icon } from './Icon'
import { Piano } from './Piano'
import { Container, Squiggle, buttonGhost, buttonPrimary } from './ui'

// Background notes drifting up and down; purely decorative
const floaters = [
  { glyph: '♪', className: 'left-[2%] bottom-[30%] text-5xl text-sun', delay: 0 },
  { glyph: '♫', className: 'left-[44%] top-[10%] text-4xl text-sky', delay: 1.2 },
  { glyph: '♩', className: 'right-[3%] top-[8%] text-5xl text-mint', delay: 0.6 },
  { glyph: '♬', className: 'left-[38%] bottom-[12%] text-4xl text-plum', delay: 1.8 },
  { glyph: '♪', className: 'right-[2%] bottom-[24%] text-3xl text-tomato', delay: 2.4 },
]

function Counter({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const [shown, setShown] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, value, { duration: 1.4, ease: motionTokens.easing.smooth, onUpdate: (v) => setShown(Math.round(v)) })
    return () => controls.stop()
  }, [inView, value])

  return <span ref={ref}>{shown}</span>
}

export function Hero({ onBook }: { onBook: () => void }) {
  return (
    <section id="top" className="relative overflow-clip pt-28 pb-14 lg:pt-36 lg:pb-20" aria-labelledby="hero-title">
      {floaters.map((f) => (
        <motion.span
          key={f.className}
          aria-hidden="true"
          className={`pointer-events-none absolute font-bold opacity-70 ${f.className}`}
          animate={{ y: [0, -16, 0], rotate: [-8, 8, -8] }}
          transition={{ duration: motionTokens.loop.float, repeat: Infinity, ease: 'easeInOut', delay: f.delay }}
        >
          {f.glyph}
        </motion.span>
      ))}

      <Container className="relative grid items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-12">
        <div>
          <motion.p
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-extrabold ring-1 ring-ink/10"
            initial={{ opacity: 0, y: motionTokens.distance.sm }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: motionTokens.duration.normal }}
          >
            <span className="size-2.5 rounded-full bg-mint" />
            Детская музыкальная школа · от 4 до 17 лет
          </motion.p>

          <motion.h1
            id="hero-title"
            className="mt-6 text-[2.15rem] leading-[1.1] font-extrabold tracking-tight text-balance sm:text-[3.2rem] lg:text-[2.9rem] xl:text-[3.4rem]"
            initial={{ opacity: 0, y: motionTokens.distance.lg }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: motionTokens.duration.slow, ease: motionTokens.easing.smooth, delay: 0.1 }}
          >
            Минор<sup className="text-tomato-deep">*</sup> — это не грустно. Это просто <Squiggle>возраст</Squiggle>.
          </motion.h1>

          <motion.p
            className="mt-6 max-w-xl text-lg text-ink-soft sm:text-xl"
            initial={{ opacity: 0, y: motionTokens.distance.md }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: motionTokens.duration.slow, ease: motionTokens.easing.smooth, delay: 0.2 }}
          >
            Учим детей фортепиано, гитаре, скрипке, ударным, вокалу и укулеле. Так, чтобы на занятия бежали, а не плелись. Первый урок
            бесплатно — инструмент подберём прямо на нём.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-col gap-3 sm:flex-row"
            initial={{ opacity: 0, y: motionTokens.distance.md }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: motionTokens.duration.slow, ease: motionTokens.easing.smooth, delay: 0.3 }}
          >
            <motion.button type="button" onClick={onBook} className={buttonPrimary} {...pressable}>
              Записаться на пробный
              <Icon name="arrowRight" className="size-5" />
            </motion.button>
            <motion.a href="#ages" className={buttonGhost} {...pressable}>
              Программа по возрасту
            </motion.a>
          </motion.div>

          <p className="mt-6 text-sm text-ink-soft">
            <span className="font-extrabold text-tomato-deep">*</span> minor (англ.) — несовершеннолетний. Все наши ученики — миноры. Пока.
          </p>
        </div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, y: motionTokens.distance.xl, rotate: 2 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 90, damping: 16, delay: 0.25 }}
        >
          <Piano />
          <motion.span
            aria-hidden="true"
            className="absolute -top-5 -right-2 rotate-6 rounded-2xl bg-mint px-4 py-2 font-display text-sm font-bold text-ink shadow-lg sm:-right-5"
            animate={{ rotate: [6, 2, 6], y: [0, -4, 0] }}
            transition={{ duration: motionTokens.loop.wobble, repeat: Infinity, ease: 'easeInOut' }}
          >
            Пробный урок — 0 ₽
          </motion.span>
        </motion.div>
      </Container>

      <Container className="relative mt-14">
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="flex flex-col-reverse rounded-3xl bg-white p-5 ring-1 ring-ink/5"
              initial={{ opacity: 0, y: motionTokens.distance.md }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: motionTokens.duration.normal, delay: i * motionTokens.stagger }}
            >
              <dt className="mt-1 font-bold text-ink-soft">{stat.label}</dt>
              <dd className="font-display text-3xl font-extrabold sm:text-4xl" style={{ color: ['#c93a1b', '#17775a', '#1e2147', '#565a7a'][i] }}>
                <Counter value={stat.value} />
              </dd>
            </motion.div>
          ))}
        </dl>
      </Container>
    </section>
  )
}
