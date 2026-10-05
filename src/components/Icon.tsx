import type { ReactNode } from 'react'

// Line icon set: 24×24 grid, 2px stroke, round caps
const paths = {
  arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  chevronDown: <path d="M6 9l6 6 6-6" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  play: <path fill="currentColor" d="M8 5.5v13l10.5-6.5z" />,
  stop: <rect fill="currentColor" x="6.5" y="6.5" width="11" height="11" rx="2" />,
  phone: (
    <path d="M5.5 4h3l1.5 4.25-2 1.25a11 11 0 0 0 6.5 6.5l1.25-2L20 15.5v3a1.5 1.5 0 0 1-1.6 1.5C10.6 19.5 4.5 13.4 4 5.6A1.5 1.5 0 0 1 5.5 4z" />
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  mapPin: (
    <>
      <path d="M12 21s-6.5-5.8-6.5-11a6.5 6.5 0 0 1 13 0c0 5.2-6.5 11-6.5 11z" />
      <circle cx="12" cy="10" r="2.25" />
    </>
  ),
  note: (
    <>
      <path d="M9 18V5.5l10-2V16" />
      <circle cx="6.5" cy="18" r="2.5" />
      <circle cx="16.5" cy="16" r="2.5" />
    </>
  ),
  keyboard: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M7 10h.01M11 10h.01M15 10h.01M8 14h8" />
    </>
  ),
  send: <path d="M20.5 3.5L3.5 10.5l6.5 2.5 2.5 6.5zM10 13l4.5-4.5" />,
  star: (
    <path
      fill="currentColor"
      stroke="none"
      d="M12 3.5l2.6 5.3 5.9.85-4.25 4.15 1 5.85L12 16.9l-5.25 2.75 1-5.85L3.5 9.65l5.9-.85L12 3.5z"
    />
  ),
} satisfies Record<string, ReactNode>

export type IconName = keyof typeof paths

export function Icon({ name, className = 'size-6' }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}
