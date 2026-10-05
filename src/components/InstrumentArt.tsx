import { motion } from 'motion/react'
import type { InstrumentId } from '../data'

const INK = '#1e2147'
const PAPER = '#fff8ec'
const WOOD = '#b8692e'
const WOOD_DARK = '#6b3e26'

function Piano() {
  const whites = Array.from({ length: 14 }, (_, i) => 26 + i * 7.7)
  return (
    <g>
      <rect x="20" y="14" width="120" height="12" rx="6" fill="#2c3160" />
      <rect x="25" y="22" width="110" height="80" rx="8" fill={INK} />
      <rect x="60" y="30" width="40" height="24" rx="3" fill={PAPER} />
      <path d="M64 37h32M64 42h32M64 47h32" stroke={INK} strokeOpacity="0.3" strokeWidth="1.2" />
      <circle cx="72" cy="42" r="2.2" fill="#ff6b4a" />
      <circle cx="84" cy="37" r="2.2" fill="#4c6fff" />
      <rect x="25" y="62" width="110" height="20" fill={PAPER} />
      {whites.slice(1).map((x) => (
        <path key={x} d={`M${x} 62v20`} stroke={INK} strokeOpacity="0.25" />
      ))}
      {[0, 1, 3, 4, 5, 7, 8, 10, 11, 12].map((i) => (
        <rect key={i} x={whites[i] + 5.3} y="62" width="4.6" height="12" rx="1" fill={INK} />
      ))}
      <rect x="30" y="100" width="8" height="12" rx="2" fill={INK} />
      <rect x="122" y="100" width="8" height="12" rx="2" fill={INK} />
    </g>
  )
}

// Guitar and ukulele share a body; the ukulele is smaller, with four strings
function Guitar({ small = false }: { small?: boolean }) {
  const strings = small ? [-3, -1, 1, 3] : [-3.75, -2.25, -0.75, 0.75, 2.25, 3.75]
  return (
    <g transform={`translate(80 64) rotate(${small ? -38 : 38}) scale(${small ? 0.82 : 1})`}>
      <rect x="-6" y="-62" width="12" height="15" rx="3" fill={WOOD_DARK} />
      <rect x="-4.5" y="-50" width="9" height="48" fill={WOOD_DARK} />
      <circle cx="0" cy="0" r="17" fill={small ? '#ff9f43' : '#ff6b4a'} />
      <circle cx="0" cy="24" r="23" fill={small ? '#ff9f43' : '#ff6b4a'} />
      <circle cx="0" cy="6" r="7" fill={INK} />
      <rect x="-9" y="30" width="18" height="5" rx="2" fill={WOOD_DARK} />
      {strings.map((x) => (
        <path key={x} d={`M${x} -58 V32`} stroke={PAPER} strokeWidth="0.8" />
      ))}
    </g>
  )
}

function Violin() {
  return (
    <g>
      <g transform="translate(70 62) rotate(-22)">
        <path d="M-2 -58 h4 v40 h-4z" fill={INK} />
        <circle cx="0" cy="-60" r="5" fill={WOOD_DARK} />
        <path
          d="M0 -26 C 14 -26, 18 -18, 16 -10 C 14 -4, 10 -2, 11 3 C 12 8, 22 12, 21 26 C 20 40, 8 44, 0 44 C -8 44, -20 40, -21 26 C -22 12, -12 8, -11 3 C -10 -2, -14 -4, -16 -10 C -18 -18, -14 -26, 0 -26 Z"
          fill={WOOD}
        />
        <path d="M-2.5 -24 h5 v38 h-5z" fill={INK} />
        <path d="M-9 8 q-3 6 0 12 M9 8 q3 6 0 12" fill="none" stroke={INK} strokeWidth="1.6" strokeLinecap="round" />
        <rect x="-6" y="30" width="12" height="9" rx="3" fill={INK} />
        {[-1.5, -0.5, 0.5, 1.5].map((x) => (
          <path key={x} d={`M${x} -54 V32`} stroke={PAPER} strokeWidth="0.5" />
        ))}
      </g>
      <g transform="translate(92 60) rotate(52)">
        <path d="M0 -58 V58" stroke={WOOD_DARK} strokeWidth="3" strokeLinecap="round" />
        <path d="M4 -54 V54" stroke={PAPER} strokeWidth="1.5" />
        <rect x="-3" y="46" width="8" height="10" rx="2" fill={INK} />
      </g>
    </g>
  )
}

function Drums() {
  return (
    <g>
      <path d="M128 40 V104 M120 104 h16" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="128" cy="40" rx="22" ry="5" fill="#ffc53d" />
      <ellipse cx="38" cy="66" rx="20" ry="6" fill={PAPER} stroke={INK} strokeWidth="2" />
      <path d="M18 66 v18 a20 6 0 0 0 40 0 v-18" fill="#8fd3ff" stroke={INK} strokeWidth="2" />
      <circle cx="82" cy="78" r="30" fill="#ff6b4a" />
      <circle cx="82" cy="78" r="23" fill={PAPER} />
      <text x="82" y="85" textAnchor="middle" fontFamily="Unbounded, sans-serif" fontWeight="800" fontSize="18" fill={INK}>
        ля
      </text>
      <path d="M44 18 L72 52 M64 14 L52 52" stroke={WOOD} strokeWidth="4" strokeLinecap="round" />
    </g>
  )
}

function Microphone({ playing }: { playing: boolean }) {
  return (
    <g>
      <path d="M80 62 V104 M64 106 h32" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      <rect x="72" y="48" width="16" height="30" rx="7" fill={INK} />
      <circle cx="80" cy="36" r="17" fill="#5fd3a8" />
      <path d="M66 30 h28 M64 37 h32 M66 44 h28 M73 21 v30 M80 19 v34 M87 21 v30" stroke={INK} strokeOpacity="0.25" strokeWidth="1.4" />
      {[0, 1, 2].map((i) => (
        <motion.g
          key={i}
          fill="none"
          stroke="#5fd3a8"
          strokeWidth="3"
          strokeLinecap="round"
          animate={playing ? { opacity: [0, 1, 0] } : { opacity: 0.35 }}
          transition={playing ? { duration: 0.9, repeat: Infinity, delay: i * 0.2 } : { duration: 0.2 }}
        >
          <path d={`M${54 - i * 9} ${24 - i * 4} q-${6 + i * 3} 12 0 ${24 + i * 8}`} />
          <path d={`M${106 + i * 9} ${24 - i * 4} q${6 + i * 3} 12 0 ${24 + i * 8}`} />
        </motion.g>
      ))}
    </g>
  )
}

// Flat illustrations of the six instruments; they shake to the beat while their sample plays
export function InstrumentArt({ id, playing = false, className = 'h-32 w-auto' }: { id: InstrumentId; playing?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 160 120" className={className} aria-hidden="true">
      <motion.g
        animate={playing ? { rotate: [-3, 3, -3], scale: [1, 1.04, 1] } : { rotate: 0, scale: 1 }}
        transition={playing ? { duration: 0.35, repeat: Infinity } : { duration: 0.2 }}
        style={{ originX: 0.5, originY: 0.6 }}
      >
        {id === 'piano' && <Piano />}
        {id === 'guitar' && <Guitar />}
        {id === 'ukulele' && <Guitar small />}
        {id === 'violin' && <Violin />}
        {id === 'drums' && <Drums />}
        {id === 'vocal' && <Microphone playing={playing} />}
      </motion.g>
    </svg>
  )
}
