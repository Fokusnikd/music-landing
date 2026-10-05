import { motion } from 'motion/react'
import { noteColors, reviews } from '../data'
import { motionTokens } from '../lib/motion'
import { Icon } from './Icon'
import { Container, Reveal, SectionHeading } from './ui'

const tilts = [-1.5, 1.2, -0.8, 1.6]

export function Reviews() {
  return (
    <section className="overflow-clip bg-ink py-16 text-paper lg:py-24" aria-labelledby="reviews-title">
      <Container>
        <Reveal>
          <SectionHeading
            light
            id="reviews-title"
            eyebrow="Отзывы"
            title="Что говорят родители. И один минор"
            intro="Отзывы придуманы для демо, но очень похожи на настоящие."
          />
        </Reveal>

        <ul className="mt-12 grid gap-6 md:grid-cols-2">
          {reviews.map((review, i) => (
            <Reveal as="li" key={review.author} delay={(i % 2) * motionTokens.stagger}>
              <motion.figure
                className="relative h-full rounded-[2rem] bg-paper p-7 text-ink"
                style={{ rotate: tilts[i % tilts.length] }}
                whileHover={{ rotate: 0, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              >
                {/* A strip of washi tape, as if the review was pinned to the wall */}
                <span
                  aria-hidden="true"
                  className="absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 -rotate-3 rounded-sm opacity-80"
                  style={{ backgroundColor: noteColors[(i * 2) % noteColors.length] }}
                />
                <div className="flex gap-1 text-sun" aria-label="Оценка 5 из 5">
                  {Array.from({ length: 5 }, (_, s) => (
                    <Icon key={s} name="star" className="size-5" />
                  ))}
                </div>
                <blockquote className="mt-4 text-lg leading-relaxed">«{review.text}»</blockquote>
                <figcaption className="mt-5 font-extrabold text-tomato-deep">{review.author}</figcaption>
              </motion.figure>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  )
}
