import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { AGE_MAX, AGE_MIN, bookingDays, findInstrument, instruments, programForAge, school, years } from '../data'
import type { InstrumentId } from '../data'
import { formatPhone, isPhoneComplete } from '../lib/phone'
import { motionTokens, pressable, springs } from '../lib/motion'
import { Icon } from './Icon'
import { Container, Reveal, buttonPrimary } from './ui'

export type InstrumentChoice = InstrumentId | 'any'

const perks = ['45 минут, бесплатно и без обязательств', 'Родители — на уроке вместе с ребёнком', 'Инструменты свои не нужны: всё есть в классе']

const ages = Array.from({ length: AGE_MAX - AGE_MIN + 1 }, (_, i) => AGE_MIN + i)

type Errors = Partial<Record<'child' | 'time' | 'parent' | 'phone' | 'consent', string>>

const fieldClass =
  'mt-2 w-full rounded-2xl border-2 border-ink/10 bg-paper px-4 py-3.5 font-semibold outline-none transition-colors focus:border-tomato-deep aria-[invalid=true]:border-tomato-deep'

const errorClass = 'mt-2 block text-sm font-bold text-tomato-deep'

const instrumentLabel = (choice: InstrumentChoice) => (choice === 'any' ? 'инструмент подберём на уроке' : findInstrument(choice).title)

export function Booking({
  age,
  instrument,
  onAgeChange,
  onInstrumentChange,
}: {
  age: number
  instrument: InstrumentChoice
  onAgeChange: (age: number) => void
  onInstrumentChange: (choice: InstrumentChoice) => void
}) {
  const days = useMemo(() => bookingDays(), [])
  const [dayKey, setDayKey] = useState(days[0].key)
  const [time, setTime] = useState('')
  const [child, setChild] = useState('')
  const [parent, setParent] = useState('')
  const [phone, setPhone] = useState('')
  const [consent, setConsent] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  // The success panel is shorter than the form, so focusing it brings it into view and announces it
  const focusOnMount = useCallback((node: HTMLDivElement | null) => node?.focus(), [])

  const day = days.find((d) => d.key === dayKey) ?? days[0]
  const program = programForAge(age)

  const pickDay = (key: string) => {
    setDayKey(key)
    const next = days.find((d) => d.key === key)
    if (!next?.slots.some((slot) => slot.time === time && !slot.busy)) setTime('')
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const found: Errors = {}
    if (child.trim().length < 2) found.child = 'Как зовут ребёнка?'
    if (!time) found.time = 'Выберите время урока'
    if (parent.trim().length < 2) found.parent = 'Как обращаться к вам?'
    if (!isPhoneComplete(phone)) found.phone = 'Введите номер полностью'
    if (!consent) found.consent = 'Без согласия родителя мы не можем записать ребёнка'
    setErrors(found)
    const first = Object.keys(found)[0]
    if (first) {
      const selector = first === 'time' ? 'input[name="time"]:not(:disabled)' : `[data-field="${first}"]`
      formRef.current?.querySelector<HTMLElement>(selector)?.focus()
      return
    }
    setSent(true)
  }

  const reset = () => {
    setSent(false)
    setTime('')
    setConsent(false)
  }

  return (
    <section id="booking" className="py-16 lg:py-24" aria-labelledby="booking-title">
      <Container>
        <Reveal className="grid overflow-hidden rounded-[2.5rem] bg-white shadow-[0_30px_80px_-40px_rgba(30,33,71,0.4)] ring-1 ring-ink/5 grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <div className="relative overflow-hidden bg-tomato-deep p-7 text-white sm:p-10">
            <h2 id="booking-title" tabIndex={-1} className="text-[1.85rem] leading-tight font-bold tracking-tight outline-none sm:text-[2.6rem]">
              Пробный урок бесплатно
            </h2>
            <p className="mt-4 text-lg text-white/85">Выберите день и время — администратор перезвонит, чтобы познакомиться и всё подтвердить.</p>

            <motion.div
              key={`${age}-${instrument}`}
              className="mt-8 rounded-2xl bg-white/10 p-5 ring-1 ring-white/20"
              initial={{ scale: motionTokens.scale.subtle, backgroundColor: 'rgba(255,197,61,0.5)' }}
              animate={{ scale: 1, backgroundColor: 'rgba(255,255,255,0.1)' }}
              transition={{ duration: motionTokens.duration.slow, ease: motionTokens.easing.smooth }}
            >
              <p className="text-sm text-white/85">Записываем {years(age)}</p>
              <p className="mt-1 font-display text-xl font-bold">«{program.title}»</p>
              <p className="mt-1 font-bold text-sun first-letter:uppercase">{instrumentLabel(instrument)}</p>
            </motion.div>

            <ul className="mt-8 grid gap-3">
              {perks.map((perk) => (
                <li key={perk} className="flex gap-3">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-sun text-ink">
                    <Icon name="check" className="size-3.5" />
                  </span>
                  {perk}
                </li>
              ))}
            </ul>

            <p className="mt-8 text-white/85">
              Или позвоните:{' '}
              <a href={school.phoneHref} className="font-extrabold text-white underline-offset-4 hover:underline">
                {school.phone}
              </a>
            </p>

            <span aria-hidden="true" className="pointer-events-none absolute -right-4 -bottom-10 font-display text-[11rem] leading-none font-extrabold text-white/10">
              ♫
            </span>
          </div>

          <div className="p-6 sm:p-10">
            <AnimatePresence mode="wait" initial={false}>
              {sent ? (
                <motion.div
                  key="sent"
                  ref={focusOnMount}
                  tabIndex={-1}
                  className="flex min-h-[30rem] flex-col items-center justify-center text-center outline-none"
                  initial={{ opacity: 0, scale: motionTokens.scale.subtle }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: motionTokens.duration.normal, ease: motionTokens.easing.smooth }}
                  role="status"
                >
                  <div className="relative size-28" aria-hidden="true">
                    <motion.span
                      className="absolute inset-0 rounded-full bg-sun"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={springs.bouncy}
                    />
                    {['♪', '♫', '♩'].map((glyph, i) => (
                      <motion.span
                        key={glyph}
                        className="absolute inset-0 grid place-items-center font-bold text-ink"
                        style={{ fontSize: i === 0 ? '3.5rem' : '1.75rem' }}
                        initial={{ opacity: 0, x: 0, y: 0 }}
                        animate={i === 0 ? { opacity: 1 } : { opacity: [0, 1, 0], x: i === 1 ? -50 : 50, y: -60 }}
                        transition={i === 0 ? { delay: 0.2 } : { duration: 1.4, delay: 0.3 + i * 0.2, repeat: Infinity, repeatDelay: 0.6 }}
                      >
                        {glyph}
                      </motion.span>
                    ))}
                  </div>
                  <h3 className="mt-6 text-2xl font-bold sm:text-3xl">{child.trim()}, ждём на урок!</h3>
                  <p className="mt-3 text-lg text-ink-soft">
                    {day.label}, {time} · <span className="first-letter:uppercase">{instrumentLabel(instrument)}</span>
                  </p>
                  <p className="mt-2 max-w-sm text-ink-soft">
                    {parent.trim()}, администратор позвонит в течение 15 минут и расскажет, как нас найти.
                  </p>
                  <p className="mt-6 rounded-full bg-paper-deep px-4 py-2 text-sm font-bold text-ink-soft">Демо-версия: заявка никуда не отправлена</p>
                  <button
                    type="button"
                    onClick={reset}
                    className="mt-6 font-extrabold text-tomato-deep underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-tomato-deep"
                  >
                    Записать ещё одного минора
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  ref={formRef}
                  noValidate
                  onSubmit={submit}
                  className="grid gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: motionTokens.duration.fast }}
                >
                  <div className="grid gap-6 sm:grid-cols-[1fr_9rem]">
                    <label className="block font-extrabold">
                      Имя ребёнка
                      <input
                        data-field="child"
                        type="text"
                        autoComplete="off"
                        value={child}
                        onChange={(event) => setChild(event.target.value)}
                        placeholder="Соня"
                        aria-invalid={Boolean(errors.child)}
                        aria-describedby={errors.child ? 'error-child' : undefined}
                        className={fieldClass}
                      />
                      {errors.child && (
                        <span id="error-child" className={errorClass}>
                          {errors.child}
                        </span>
                      )}
                    </label>
                    <label className="block font-extrabold">
                      Возраст
                      <select value={age} onChange={(event) => onAgeChange(Number(event.target.value))} className={`${fieldClass} cursor-pointer`}>
                        {ages.map((a) => (
                          <option key={a} value={a}>
                            {years(a)}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <fieldset className="min-w-0">
                    <legend className="font-extrabold">Инструмент</legend>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {[...instruments.map((i) => ({ id: i.id as InstrumentChoice, title: i.title })), { id: 'any' as const, title: 'Пока не знаем' }].map((option) => {
                        const checked = option.id === instrument
                        return (
                          <label
                            key={option.id}
                            className={`relative cursor-pointer rounded-full border-2 px-4 py-2 font-bold transition-colors has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-tomato-deep ${
                              checked ? 'border-ink text-paper' : 'border-ink/10 hover:border-ink/40'
                            }`}
                          >
                            <input
                              type="radio"
                              name="instrument"
                              value={option.id}
                              checked={checked}
                              onChange={() => onInstrumentChange(option.id)}
                              className="sr-only"
                            />
                            {checked && <motion.span layoutId="instrument-pill" className="absolute -inset-0.5 rounded-full bg-ink" transition={springs.snappy} />}
                            <span className="relative">{option.title}</span>
                          </label>
                        )
                      })}
                    </div>
                  </fieldset>

                  <fieldset className="min-w-0">
                    <legend className="font-extrabold">Дата</legend>
                    <div className="-mx-1 mt-2 flex gap-2 overflow-x-auto px-1 pt-1 pb-2">
                      {days.map((d) => {
                        const checked = d.key === dayKey
                        return (
                          <label
                            key={d.key}
                            className="relative grid min-w-[4.25rem] shrink-0 cursor-pointer place-items-center rounded-2xl border-2 border-ink/10 px-2 py-2.5 has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-tomato-deep"
                          >
                            <input
                              type="radio"
                              name="day"
                              value={d.key}
                              aria-label={d.label}
                              checked={checked}
                              onChange={() => pickDay(d.key)}
                              className="sr-only"
                            />
                            {checked && <motion.span layoutId="day-pill" className="absolute -inset-0.5 rounded-2xl bg-tomato-deep" transition={springs.snappy} />}
                            <span className={`relative text-sm font-bold ${checked ? 'text-white/85' : 'text-ink-soft'}`}>{d.weekday}</span>
                            <span className={`relative font-display text-xl font-bold ${checked ? 'text-white' : ''}`}>{d.day}</span>
                          </label>
                        )
                      })}
                    </div>
                  </fieldset>

                  <fieldset className="min-w-0" aria-describedby={errors.time ? 'error-time' : undefined}>
                    <legend className="font-extrabold">Время</legend>
                    <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-6">
                      {day.slots.map((slot) => {
                        const checked = slot.time === time
                        return (
                          <label
                            key={slot.time}
                            className={`relative grid place-items-center rounded-xl border-2 py-2.5 font-extrabold transition-colors has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-tomato-deep ${
                              slot.busy
                                ? 'cursor-not-allowed border-transparent bg-paper-deep text-ink-soft line-through'
                                : checked
                                  ? 'cursor-pointer border-tomato-deep bg-tomato/15 text-tomato-deep'
                                  : 'cursor-pointer border-ink/10 hover:border-tomato-deep/50'
                            }`}
                          >
                            <input
                              type="radio"
                              name="time"
                              value={slot.time}
                              checked={checked}
                              disabled={slot.busy}
                              onChange={() => setTime(slot.time)}
                              className="sr-only"
                            />
                            {slot.time}
                            {slot.busy && <span className="sr-only">, занято</span>}
                          </label>
                        )
                      })}
                    </div>
                    {errors.time && (
                      <p id="error-time" className={errorClass}>
                        {errors.time}
                      </p>
                    )}
                  </fieldset>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <label className="block font-extrabold">
                      Ваше имя
                      <input
                        data-field="parent"
                        type="text"
                        autoComplete="name"
                        value={parent}
                        onChange={(event) => setParent(event.target.value)}
                        placeholder="Марина"
                        aria-invalid={Boolean(errors.parent)}
                        aria-describedby={errors.parent ? 'error-parent' : undefined}
                        className={fieldClass}
                      />
                      {errors.parent && (
                        <span id="error-parent" className={errorClass}>
                          {errors.parent}
                        </span>
                      )}
                    </label>
                    <label className="block font-extrabold">
                      Телефон
                      <input
                        data-field="phone"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        value={phone}
                        onChange={(event) => setPhone(formatPhone(event.target.value))}
                        placeholder="+7 (___) ___-__-__"
                        aria-invalid={Boolean(errors.phone)}
                        aria-describedby={errors.phone ? 'error-phone' : undefined}
                        className={fieldClass}
                      />
                      {errors.phone && (
                        <span id="error-phone" className={errorClass}>
                          {errors.phone}
                        </span>
                      )}
                    </label>
                  </div>

                  {/* Children's data needs consent from a parent or guardian (152-FZ, art. 9) */}
                  <div>
                    <label className="flex cursor-pointer items-start gap-3 text-ink-soft">
                      <input
                        data-field="consent"
                        type="checkbox"
                        checked={consent}
                        onChange={(event) => setConsent(event.target.checked)}
                        aria-invalid={Boolean(errors.consent)}
                        aria-describedby={errors.consent ? 'error-consent' : undefined}
                        className="mt-1 size-5 shrink-0 cursor-pointer accent-tomato-deep"
                      />
                      Я родитель или законный представитель ребёнка и согласен на обработку персональных данных — его и моих
                    </label>
                    {errors.consent && (
                      <p id="error-consent" className={errorClass}>
                        {errors.consent}
                      </p>
                    )}
                  </div>

                  <motion.button type="submit" className={`${buttonPrimary} w-full`} {...pressable}>
                    Записаться{time ? ` на ${day.label}, ${time}` : ' на пробный урок'}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
