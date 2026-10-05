import { MotionConfig, useReducedMotion } from 'motion/react'
import { useState } from 'react'
import { Ages } from './components/Ages'
import { Booking } from './components/Booking'
import type { InstrumentChoice } from './components/Booking'
import { Faq } from './components/Faq'
import { FirstLesson } from './components/FirstLesson'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Instruments } from './components/Instruments'
import { Prices } from './components/Prices'
import { Reviews } from './components/Reviews'
import { StaffBand } from './components/StaffBand'
import { Teachers } from './components/Teachers'

export default function App() {
  const reduce = useReducedMotion()
  // The age slider and the instrument cards both feed the booking form
  const [age, setAge] = useState(7)
  const [instrument, setInstrument] = useState<InstrumentChoice>('any')

  const book = () => {
    document.getElementById('booking')?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
    document.getElementById('booking-title')?.focus({ preventScroll: true })
  }

  const bookInstrument = (choice: InstrumentChoice) => {
    setInstrument(choice)
    book()
  }

  return (
    // "user" turns off transform and layout animations for people who prefer reduced motion
    <MotionConfig reducedMotion="user">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[80] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:font-bold focus:text-paper"
      >
        Перейти к содержанию
      </a>
      <Header />
      <main id="main">
        <Hero onBook={book} />
        <StaffBand />
        <Ages age={age} onAgeChange={setAge} onBook={book} />
        <Instruments onBook={bookInstrument} />
        <FirstLesson />
        <Teachers />
        <Prices onBook={book} />
        <Reviews />
        <Booking age={age} instrument={instrument} onAgeChange={setAge} onInstrumentChange={setInstrument} />
        <Faq />
      </main>
      <Footer />
    </MotionConfig>
  )
}
