import { motion } from 'motion/react'
import { formatPrice, plans } from '../data'
import { motionTokens, pressable } from '../lib/motion'
import { Icon } from './Icon'
import { Container, Reveal, SectionHeading, buttonGhost, buttonSun } from './ui'

// Each plan is drawn as its note: a tuning fork for the trial, then quarter, eighth and whole notes
function PlanNote({ id, color }: { id: string; color: string }) {
  return (
    <svg viewBox="0 0 48 56" className="h-14 w-12" aria-hidden="true" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round">
      {id === 'trial' && <path d="M16 6 V26 a8 8 0 0 0 16 0 V6 M24 34 V52" />}
      {id === 'quarter' && (
        <>
          <ellipse cx="18" cy="43" rx="10" ry="7.5" fill={color} transform="rotate(-20 18 43)" />
          <path d="M27 40 V6" />
        </>
      )}
      {id === 'eighth' && (
        <>
          <ellipse cx="18" cy="43" rx="10" ry="7.5" fill={color} transform="rotate(-20 18 43)" />
          <path d="M27 40 V6 c2 8 14 10 12 24" />
        </>
      )}
      {id === 'whole' && <ellipse cx="24" cy="30" rx="15" ry="10" transform="rotate(-20 24 30)" strokeWidth="5" />}
    </svg>
  )
}

export function Prices({ onBook }: { onBook: () => void }) {
  return (
    <section id="prices" className="py-16 lg:py-24" aria-labelledby="prices-title">
      <Container>
        <Reveal>
          <SectionHeading
            id="prices-title"
            eyebrow="Цены"
            title="Абонементы называются как ноты: чем длиннее, тем больше музыки"
            intro="Платите помесячно, без годовых договоров. Пропустили по болезни — урок переносится."
          />
        </Reveal>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {plans.map((plan, i) => (
            <Reveal as="li" key={plan.id} delay={i * motionTokens.stagger} className="flex">
              <motion.article
                className={`relative flex w-full flex-col rounded-[2rem] p-6 ${plan.featured ? 'bg-ink text-paper' : 'bg-white ring-1 ring-ink/5'}`}
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              >
                {plan.featured && (
                  <span className="absolute -top-3 right-6 rotate-3 rounded-full bg-sun px-3 py-1 text-sm font-extrabold text-ink">Чаще выбирают</span>
                )}
                <PlanNote id={plan.id} color={plan.featured ? '#ffc53d' : '#1e2147'} />
                <h3 className="mt-4 text-2xl font-bold">{plan.title}</h3>
                <p className={`font-bold ${plan.featured ? 'text-paper/70' : 'text-ink-soft'}`}>{plan.note}</p>
                <p className="mt-5 font-display text-3xl font-extrabold">{formatPrice(plan.price)}</p>
                <p className={`text-sm font-bold ${plan.featured ? 'text-paper/70' : 'text-ink-soft'}`}>{plan.period}</p>
                <ul className="mt-5 grid flex-1 content-start gap-2.5">
                  {plan.points.map((point) => (
                    <li key={point} className="flex gap-2.5">
                      <Icon name="check" className={`mt-0.5 size-5 shrink-0 ${plan.featured ? 'text-sun' : 'text-mint-deep'}`} />
                      {point}
                    </li>
                  ))}
                </ul>
                <motion.button
                  type="button"
                  onClick={onBook}
                  className={`${plan.featured ? buttonSun : buttonGhost} mt-6 w-full !py-3`}
                  {...pressable}
                >
                  {plan.price === 0 ? 'Записаться' : 'Начать с пробного'}
                </motion.button>
              </motion.article>
            </Reveal>
          ))}
        </ul>

        <Reveal className="mt-8 flex flex-col items-start gap-4 rounded-[2rem] bg-sun/40 p-6 sm:flex-row sm:items-center sm:p-8">
          <span className="font-display text-4xl font-extrabold text-tomato-deep" aria-hidden="true">
            −10%
          </span>
          <p className="text-lg">
            <strong className="font-extrabold">Второй минор в семье — скидка 10%.</strong> Братья и сёстры могут заниматься разными инструментами, а дома
            соберёте свой ансамбль.
          </p>
        </Reveal>
      </Container>
    </section>
  )
}
