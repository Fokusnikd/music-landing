import { motion } from 'motion/react'
import { findInstrument, teachers } from '../data'
import { motionTokens } from '../lib/motion'
import { Avatar } from './Avatar'
import { Container, Reveal, SectionHeading } from './ui'

export function Teachers() {
  return (
    <section id="teachers" className="bg-paper-deep py-16 lg:py-24" aria-labelledby="teachers-title">
      <Container>
        <Reveal>
          <SectionHeading
            id="teachers-title"
            eyebrow="Педагоги"
            title="Взрослые, которые не забыли, каково быть минором"
            intro="У всех — консерватория или музыкальный колледж и годы работы с детьми. Но выбирали мы по другому признаку: к ним хочется возвращаться."
          />
        </Reveal>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {teachers.map((teacher, i) => (
            <Reveal as="li" key={teacher.name} delay={i * motionTokens.stagger} className="flex">
              <motion.article
                className="flex w-full flex-col rounded-[2rem] bg-white p-6 ring-1 ring-ink/5"
                initial="rest"
                whileHover="hover"
                variants={{ rest: { y: 0 }, hover: { y: -6 } }}
              >
                <Avatar look={teacher.look} blinkEvery={3.2 + i * 0.7} className="size-28" />
                <h3 className="mt-5 text-lg font-bold">{teacher.name}</h3>
                <p className="mt-1 font-extrabold text-tomato-deep">{teacher.role}</p>
                <p className="mt-1 text-sm font-bold text-ink-soft">{teacher.experience}</p>
                <p className="mt-4 flex-1 text-ink-soft">{teacher.fact}</p>
                <ul className="mt-5 flex flex-wrap gap-2" aria-label="Инструменты">
                  {teacher.instruments.map((id) => {
                    const item = findInstrument(id)
                    return (
                      <li key={id} className="rounded-full px-3 py-1 text-sm font-extrabold" style={{ backgroundColor: `${item.color}40` }}>
                        {item.title}
                      </li>
                    )
                  })}
                </ul>
              </motion.article>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  )
}
