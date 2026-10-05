import { motion } from 'motion/react'
import { useId } from 'react'
import type { TeacherLook } from '../data'

const INK = '#1e2147'

const hairFront: Record<TeacherLook['style'], string> = {
  bob: 'M40 58 C37 37, 52 32, 62 33 C75 34, 83 43, 80 58 C74 48, 62 43, 50 44 C46 48, 42 53, 40 58 Z',
  short: 'M41 54 C40 38, 52 32, 61 33 C72 33, 81 40, 79 54 C76 46, 70 42, 60 42 C50 42, 44 46, 41 54 Z',
  bun: 'M41 56 C41 40, 52 34, 60 34 C68 34, 79 40, 79 56 C74 46, 66 42, 60 42 C54 42, 46 46, 41 56 Z',
  curly: '',
}

const curls = [
  [43, 47],
  [48, 40],
  [56, 36],
  [64, 36],
  [72, 40],
  [77, 47],
]

// Flat illustrated teacher; blinks on a loop and bobs the head to an imaginary beat when the parent card is hovered (whileHover="hover")
export function Avatar({ look, blinkEvery = 4, className = 'size-32' }: { look: TeacherLook; blinkEvery?: number; className?: string }) {
  const clipId = useId()

  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <defs>
        <clipPath id={clipId}>
          <circle cx="60" cy="60" r="60" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <circle cx="60" cy="60" r="60" fill={look.bg} />

        {/* Sweater with a collar and a tiny note brooch */}
        <path d="M12 124 C14 98, 36 88, 60 88 C84 88, 106 98, 108 124 Z" fill={look.sweater} />
        <path d="M48 89 Q60 100 72 89" fill="none" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
        <path d="M82 100 v-9 l5 -1.5" fill="none" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="80" cy="100.5" r="2.6" fill="#ffffff" />

        <motion.g
          variants={{ hover: { rotate: [0, -7, 5, -7, 0] } }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
          style={{ originX: 0.5, originY: 0.85 }}
        >
          {look.style === 'bob' && <path d="M36 58 C36 32, 84 32, 84 58 L86 86 C76 90, 44 90, 34 86 Z" fill={look.hair} />}
          {look.style === 'bun' && <circle cx="60" cy="27" r="10" fill={look.hair} />}

          <path d="M52 72 h16 v16 c0 5 -16 5 -16 0 z" fill={look.skin} />
          <path d="M52 76 h16 v4 c-5 3 -11 3 -16 0 z" fill={INK} opacity="0.1" />
          <circle cx="41" cy="60" r="4" fill={look.skin} />
          <circle cx="79" cy="60" r="4" fill={look.skin} />
          <ellipse cx="60" cy="58" rx="19" ry="22" fill={look.skin} />

          {look.style === 'curly' ? (
            curls.map(([cx, cy]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="8" fill={look.hair} />)
          ) : (
            <path d={hairFront[look.style]} fill={look.hair} />
          )}

          {look.beard && (
            <path d="M42 63 C44 80, 52 84, 60 84 C68 84, 76 80, 78 63 C74 72, 68 74, 60 74 C52 74, 46 72, 42 63 Z" fill={look.hair} />
          )}

          <path d="M49 52.5 q4 -2.5 8 0 M63 52.5 q4 -2.5 8 0" fill="none" stroke={look.hair} strokeWidth="2" strokeLinecap="round" />
          <motion.g
            animate={{ scaleY: [1, 1, 0.1, 1] }}
            transition={{ duration: blinkEvery, times: [0, 0.94, 0.97, 1], repeat: Infinity }}
            style={{ originY: 0.5 }}
          >
            <ellipse cx="53" cy="59" rx="2.2" ry="2.6" fill={INK} />
            <ellipse cx="67" cy="59" rx="2.2" ry="2.6" fill={INK} />
          </motion.g>
          <circle cx="48" cy="66" r="3" fill="#ff6b4a" opacity="0.35" />
          <circle cx="72" cy="66" r="3" fill="#ff6b4a" opacity="0.35" />
          <path
            d={look.beard ? 'M55 72 Q60 75 65 72' : 'M54 68.5 Q60 73.5 66 68.5'}
            fill="none"
            stroke={look.beard ? look.skin : INK}
            strokeWidth="2"
            strokeLinecap="round"
          />
          {look.glasses && (
            <g fill="none" stroke={INK} strokeWidth="1.8">
              <circle cx="53" cy="59" r="6" />
              <circle cx="67" cy="59" r="6" />
              <path d="M59 59 h2" />
            </g>
          )}
        </motion.g>
      </g>
    </svg>
  )
}
