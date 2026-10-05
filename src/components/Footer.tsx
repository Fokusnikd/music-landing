import { motion } from 'motion/react'
import { navItems, school } from '../data'
import { motionTokens } from '../lib/motion'
import { Icon } from './Icon'
import type { IconName } from './Icon'
import { Container, Logo, Reveal } from './ui'

const contacts: { icon: IconName; label: string; value: string; href?: string }[] = [
  { icon: 'phone', label: 'Телефон', value: school.phone, href: school.phoneHref },
  { icon: 'mapPin', label: 'Адрес', value: `${school.address}, ${school.metro}` },
  { icon: 'clock', label: 'Часы работы', value: school.hours },
]

// Abstract city block where the school building is a grand piano seen from above; a real project would embed Yandex Maps here
function MapArt() {
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Схема проезда: школа в семи минутах от метро">
      <rect width="400" height="300" fill="#fcecd2" />
      <g stroke="#ffffff" strokeWidth="18" strokeLinecap="round">
        <path d="M-10 90 H410" />
        <path d="M-10 215 C 120 205, 260 235, 410 220" />
        <path d="M120 -10 V310" />
        <path d="M290 -10 C 280 100, 300 200, 285 310" />
      </g>
      <g fill="#ffe0a3">
        <rect x="20" y="20" width="80" height="50" rx="10" />
        <rect x="140" y="20" width="130" height="50" rx="10" />
        <rect x="20" y="110" width="80" height="80" rx="10" />
        <rect x="310" y="110" width="80" height="85" rx="10" />
        <rect x="140" y="240" width="125" height="50" rx="10" />
      </g>
      <path d="M150 112 h70 c34 0 42 18 42 36 s-10 40 -40 40 h-72 z" fill="#1e2147" />
      <g fill="#fff8ec">
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <rect key={i} x="153" y={118 + i * 9.5} width="12" height="7.5" rx="1.5" />
        ))}
      </g>
      <g fill="none" stroke="#c93a1b" strokeWidth="3" strokeDasharray="2 9" strokeLinecap="round">
        <path d="M60 258 C 90 245, 110 225, 120 200 S 140 175, 160 160" />
      </g>
      <g transform="translate(60 264)">
        <circle r="13" fill="#c93a1b" />
        <text y="5" textAnchor="middle" fontFamily="Nunito, sans-serif" fontWeight="800" fontSize="14" fill="#ffffff">
          М
        </text>
      </g>
      <g transform="translate(222 140)">
        <motion.circle
          r="14"
          fill="#ffc53d"
          animate={{ scale: [1, 2.6], opacity: [0.5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
        />
        <motion.text
          textAnchor="middle"
          y="9"
          fontSize="26"
          fontWeight="800"
          fill="#ffc53d"
          animate={{ y: [9, 3, 9] }}
          transition={{ duration: motionTokens.loop.float / 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          ♪
        </motion.text>
      </g>
    </svg>
  )
}

export function Footer() {
  return (
    <>
      <section id="contacts" className="py-16 lg:py-24" aria-labelledby="contacts-title">
        <Container>
          <Reveal className="grid overflow-hidden rounded-[2.5rem] bg-white ring-1 ring-ink/5 lg:grid-cols-2">
            <div className="p-7 sm:p-10">
              <h2 id="contacts-title" className="text-[1.85rem] leading-tight font-bold tracking-tight sm:text-[2.6rem]">
                Приходите. Шуметь у нас можно
              </h2>
              <ul className="mt-8 grid gap-6">
                {contacts.map((item) => (
                  <li key={item.label} className="flex items-start gap-4">
                    <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-sun/40 text-ink">
                      <Icon name={item.icon} className="size-6" />
                    </span>
                    <span>
                      <span className="block text-sm font-bold text-ink-soft">{item.label}</span>
                      {item.href ? (
                        <a href={item.href} className="text-xl font-extrabold underline-offset-4 hover:underline">
                          {item.value}
                        </a>
                      ) : (
                        <span className="text-lg font-bold">{item.value}</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-8 flex items-center gap-2 text-ink-soft">
                <Icon name="send" className="size-5 text-tomato-deep" />
                Расписание, переносы и видео с концертов — в Telegram-чате родителей
              </p>
            </div>
            <div className="min-h-[18rem]">
              <MapArt />
            </div>
          </Reveal>
        </Container>
      </section>

      <footer className="bg-ink pt-12 pb-10 text-paper">
        <Container className="grid gap-8">
          <div className="grid gap-6 md:grid-cols-[auto_1fr] md:items-center">
            <Logo light />
            <nav aria-label="Навигация в подвале" className="md:justify-self-end">
              <ul className="flex flex-wrap gap-x-6 gap-y-3 font-bold text-paper/75">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <a href={item.href} className="hover:text-paper">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <p className="border-y border-paper/15 py-6 text-center font-display text-lg leading-snug font-bold text-paper/85 sm:text-2xl">
            В 18 лет все наши ученики переходят в мажор. Таков закон гармонии.
          </p>

          <div className="grid gap-2 text-sm text-paper/60">
            <p>© 2026 Музыкальная школа «{school.name}». Лицензия на образовательную деятельность: номер не указан — это демо.</p>
            <p>
              Демо-проект для портфолио: школа вымышленная, педагоги, цены и отзывы придуманы, заявки никуда не отправляются. Информация на сайте не
              является публичной офертой.
            </p>
            <p>
              Звуки инструментов: Salamander Grand Piano (Alexander Holm), University of Iowa EMS и VSCO 2 через tonejs-instruments, FreePats
              Ukulele, хор из Fluid R3 GM —{' '}
              <a href={`${import.meta.env.BASE_URL}samples/CREDITS.txt`} className="underline underline-offset-4 hover:text-paper">
                авторы и лицензии
              </a>
              .
            </p>
          </div>
        </Container>
      </footer>
    </>
  )
}
