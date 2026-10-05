import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { faq } from '../data'
import { motionTokens, springs } from '../lib/motion'
import { Icon } from './Icon'
import { Container, Reveal, SectionHeading } from './ui'

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="bg-paper-deep py-16 lg:py-24" aria-labelledby="faq-title">
      <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <Reveal>
          <SectionHeading
            id="faq-title"
            eyebrow="Вопросы"
            title="Родители спрашивают"
            intro="Не нашли ответ — позвоните, администратор ответит за пару минут. Или приходите на пробный урок и спросите педагога."
          />
        </Reveal>

        <ul className="grid gap-3">
          {faq.map((item, index) => {
            const isOpen = open === index
            return (
              <Reveal as="li" key={item.q} delay={index * 0.05} className="overflow-hidden rounded-3xl bg-white ring-1 ring-ink/5">
                <h3>
                  <button
                    type="button"
                    id={`faq-q-${index}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${index}`}
                    onClick={() => setOpen(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-sans text-lg font-extrabold focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-tomato-deep"
                  >
                    {item.q}
                    <motion.span
                      className={`grid size-9 shrink-0 place-items-center rounded-full transition-colors ${isOpen ? 'bg-tomato-deep text-white' : 'bg-paper-deep text-ink'}`}
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={springs.snappy}
                    >
                      <Icon name="chevronDown" className="size-5" />
                    </motion.span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-a-${index}`}
                      role="region"
                      aria-labelledby={`faq-q-${index}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: motionTokens.duration.normal, ease: motionTokens.easing.smooth }}
                    >
                      <p className="px-6 pb-6 text-ink-soft">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Reveal>
            )
          })}
        </ul>
      </Container>
    </section>
  )
}
