import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { motionTokens, springs } from '../lib/motion'

const buttonBase =
  'inline-flex items-center justify-center gap-2 rounded-full font-extrabold whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-4'

export const buttonPrimary = `${buttonBase} bg-tomato-deep px-7 py-4 text-white hover:bg-ink focus-visible:outline-tomato-deep`

export const buttonGhost = `${buttonBase} border-2 border-ink/15 px-7 py-4 text-ink hover:border-ink/45 focus-visible:outline-ink`

export const buttonSun = `${buttonBase} bg-sun px-7 py-4 text-ink hover:bg-white focus-visible:outline-sun`

export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 ${className}`}>{children}</div>
}

// A word with a hand-drawn squiggle underneath that draws itself when it scrolls into view
export function Squiggle({ children, color = '#ff6b4a', className = '' }: { children: ReactNode; color?: string; className?: string }) {
  return (
    <span className={`relative inline-block whitespace-nowrap ${className}`}>
      {children}
      <svg aria-hidden="true" viewBox="0 0 200 16" preserveAspectRatio="none" className="absolute -bottom-2 left-0 h-3 w-full">
        <motion.path
          d="M3 10 C 25 3, 40 15, 62 8 S 100 3, 120 9 S 165 14, 197 6"
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: motionTokens.duration.crawl, ease: motionTokens.easing.smooth, delay: 0.3 }}
        />
      </svg>
    </span>
  )
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  intro,
  light = false,
}: {
  id: string
  eyebrow: string
  title: ReactNode
  intro?: ReactNode
  light?: boolean
}) {
  return (
    <div className="max-w-2xl">
      <p className={`flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.18em] ${light ? 'text-sun' : 'text-tomato-deep'}`}>
        <span aria-hidden="true">♪</span>
        {eyebrow}
      </p>
      <h2 id={id} className="mt-3 text-[1.85rem] font-bold leading-[1.15] tracking-tight text-balance sm:text-[2.75rem]">
        {title}
      </h2>
      {intro && <p className={`mt-4 text-lg ${light ? 'text-paper/80' : 'text-ink-soft'}`}>{intro}</p>}
    </div>
  )
}

// A quarter note whose head is a little face: the school's "minor". Winks on hover of a parent with whileHover="hover"
export function LogoMark({ className = 'size-11' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="#1e2147" />
      <path d="M19 6v15" stroke="#fff8ec" strokeWidth="2.5" strokeLinecap="round" />
      <motion.path
        d="M19 6c3 1 5 3 5 6"
        fill="none"
        stroke="#fff8ec"
        strokeWidth="2.5"
        strokeLinecap="round"
        variants={{ rest: { rotate: 0 }, hover: { rotate: [0, -18, 10, 0] } }}
        transition={{ duration: motionTokens.duration.slow }}
        style={{ originX: 0, originY: 0 }}
      />
      <ellipse cx="14.5" cy="21.5" rx="6" ry="5" fill="#ffc53d" />
      <circle cx="12.6" cy="20.8" r="1" fill="#1e2147" />
      <motion.ellipse
        cx="16.4"
        cy="20.8"
        rx="1"
        ry="1"
        fill="#1e2147"
        variants={{ rest: { ry: 1 }, hover: { ry: [1, 0.15, 0.15, 1] } }}
        transition={{ duration: motionTokens.duration.slow }}
      />
      <path d="M12.8 23.3q1.7 1.3 3.4 0" fill="none" stroke="#1e2147" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  )
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark />
      <span className="leading-none">
        <span className="block font-display text-[1.15rem] font-bold tracking-tight">
          Ля <span className={light ? 'text-sun' : 'text-tomato-deep'}>минор</span>
        </span>
        <span className={`mt-1 block text-xs font-bold whitespace-nowrap ${light ? 'text-paper/70' : 'text-ink-soft'}`}>музыкальная школа для детей</span>
      </span>
    </span>
  )
}

// Fades content up once it scrolls into view; as="li" keeps list markup valid
export function Reveal({
  children,
  delay = 0,
  className = '',
  as = 'div',
}: {
  children: ReactNode
  delay?: number
  className?: string
  as?: 'div' | 'li'
}) {
  const Tag = as === 'li' ? motion.li : motion.div
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: motionTokens.distance.lg }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        y: { ...springs.gentle, delay },
        opacity: { duration: motionTokens.duration.normal, delay },
      }}
    >
      {children}
    </Tag>
  )
}
