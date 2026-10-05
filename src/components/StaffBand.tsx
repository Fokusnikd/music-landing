import { noteColors } from '../data'

const words = ['фортепиано', 'гитара', 'скрипка', 'ударные', 'вокал', 'укулеле', 'сольфеджио без слёз', 'ансамбль', 'своя группа']
const glyphs = ['♪', '♫', '♩', '♬']
// Heights on the staff, in px from the top, so the notes walk up and down like a melody
const heights = [6, 20, 34, 13, 27]

function Run({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {words.map((word, i) => (
        <li key={word} className="flex items-center">
          <span className="px-6 font-display text-xl font-bold whitespace-nowrap text-paper sm:text-2xl">{word}</span>
          <span
            aria-hidden="true"
            className="relative h-14 w-10 text-4xl leading-none font-bold"
            style={{ color: noteColors[i % noteColors.length], top: heights[i % heights.length] - 18 }}
          >
            {glyphs[i % glyphs.length]}
          </span>
        </li>
      ))}
    </ul>
  )
}

// A tilted strip of music staff with the school's subjects running along it like notes
export function StaffBand() {
  return (
    <div className="relative -my-4 overflow-clip py-8">
      <div className="-mx-4 -rotate-2 bg-ink py-5">
        <div
          className="flex w-max animate-marquee motion-reduce:animate-none"
          style={{
            backgroundImage: 'repeating-linear-gradient(to bottom, transparent 0, transparent 10px, rgb(255 248 236 / 0.16) 10px, rgb(255 248 236 / 0.16) 11.5px)',
            backgroundSize: '100% 58px',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <Run />
          <Run hidden />
        </div>
      </div>
    </div>
  )
}
