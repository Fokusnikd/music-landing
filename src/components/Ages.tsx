import { AnimatePresence, motion } from 'motion/react'
import { AGE_MAX, AGE_MIN, MAJOR_AGE, programForAge, years } from '../data'
import { motionTokens, pressable, springs } from '../lib/motion'
import { Icon } from './Icon'
import { Container, Reveal, SectionHeading, buttonPrimary } from './ui'

const allAges = Array.from({ length: AGE_MAX - AGE_MIN + 1 }, (_, i) => AGE_MIN + i)

function untilMajor(age: number) {
  const left = MAJOR_AGE - age
  if (left === 1) return 'Последний год в миноре'
  return `До мажора — ${years(left)}`
}

export function Ages({ age, onAgeChange, onBook }: { age: number; onAgeChange: (age: number) => void; onBook: () => void }) {
  const program = programForAge(age)
  const fill = ((age - AGE_MIN) / (AGE_MAX - AGE_MIN)) * 100

  return (
    <section id="ages" className="py-16 lg:py-24" aria-labelledby="ages-title">
      <Container>
        <Reveal>
          <SectionHeading
            id="ages-title"
            eyebrow="Программа по возрасту"
            title="Сколько лет вашему минору?"
            intro="Подвиньте ползунок — покажем, чем он будет заниматься. Спойлер: в 18 все наши ученики переходят в мажор."
          />
        </Reveal>

        <Reveal className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] bg-white p-6 ring-1 ring-ink/5 sm:p-8">
            <p className="font-bold text-ink-soft" id="age-label">
              Возраст ребёнка
            </p>
            <div className="mt-2 flex items-baseline gap-3" aria-hidden="true">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={age}
                  className="font-display text-7xl font-extrabold text-tomato-deep sm:text-8xl"
                  initial={{ y: motionTokens.distance.lg, opacity: 0, scale: 0.8 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: -motionTokens.distance.lg, opacity: 0 }}
                  transition={springs.snappy}
                >
                  {age}
                </motion.span>
              </AnimatePresence>
              <span className="font-display text-2xl font-bold">{years(age).split(' ')[1]}</span>
            </div>

            <div className="relative mt-6 h-11">
              <div className="absolute inset-x-0 top-1/2 h-3 -translate-y-1/2 rounded-full bg-paper-deep" />
              <div
                className="absolute top-1/2 left-0 h-3 -translate-y-1/2 rounded-full bg-gradient-to-r from-sun via-mint to-tomato"
                style={{ width: `calc(1.375rem + (100% - 2.75rem) * ${fill / 100})` }}
              />
              <input
                type="range"
                min={AGE_MIN}
                max={AGE_MAX}
                step={1}
                value={age}
                onChange={(event) => onAgeChange(Number(event.target.value))}
                aria-labelledby="age-label"
                aria-valuetext={years(age)}
                className="range-thumb relative h-11 w-full cursor-pointer rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tomato-deep"
              />
            </div>
            <div className="mt-2 flex justify-between text-sm font-bold text-ink-soft" aria-hidden="true">
              <span>{AGE_MIN}</span>
              <span>{AGE_MAX}</span>
            </div>

            {/* One note per year of being a minor; the notes already "played" are filled */}
            <div className="mt-8 rounded-3xl bg-paper p-5">
              <p className="font-display text-lg font-bold">{untilMajor(age)}</p>
              <div className="mt-4 flex items-end gap-1" aria-hidden="true">
                {allAges.map((year) => (
                  <motion.span
                    key={year}
                    className="h-6 flex-1 rounded-full"
                    animate={{
                      backgroundColor: year <= age ? programForAge(year).color : 'rgba(30,33,71,0.1)',
                      scaleY: year === age ? 1.5 : 1,
                    }}
                    transition={springs.snappy}
                  />
                ))}
                <span className="ml-2 rounded-full bg-ink px-2.5 py-1 font-display text-xs font-bold text-paper">18 — мажор</span>
              </div>
            </div>
          </div>

          <div className="relative overflow-clip rounded-[2rem] bg-ink p-6 text-paper sm:p-8" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={program.id}
                initial={{ opacity: 0, x: motionTokens.distance.lg }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -motionTokens.distance.lg }}
                transition={{ duration: motionTokens.duration.normal, ease: motionTokens.easing.smooth }}
                className="flex h-full flex-col"
              >
                <p className="text-sm font-extrabold tracking-[0.16em] uppercase" style={{ color: program.color }}>
                  {program.ages[0]}–{years(program.ages[1])}
                </p>
                <h3 className="mt-2 text-3xl font-extrabold sm:text-4xl">«{program.title}»</h3>
                <p className="mt-2 font-bold text-paper/70">{program.format}</p>
                <p className="mt-5 text-lg text-paper/90">{program.text}</p>
                <ul className="mt-6 grid gap-3">
                  {program.points.map((point) => (
                    <li key={point} className="flex gap-3">
                      <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full text-ink" style={{ backgroundColor: program.color }}>
                        <Icon name="check" className="size-3.5" />
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-8">
                  <motion.button type="button" onClick={onBook} className={`${buttonPrimary} w-full sm:w-auto`} {...pressable}>
                    Записать на пробный урок
                    <Icon name="arrowRight" className="size-5" />
                  </motion.button>
                </div>
              </motion.div>
            </AnimatePresence>
            <span aria-hidden="true" className="pointer-events-none absolute -right-6 -bottom-16 font-display text-[14rem] leading-none font-extrabold text-paper/5">
              {age}
            </span>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
