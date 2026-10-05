import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { navItems, school } from '../data'
import { motionTokens, pressable } from '../lib/motion'
import { Icon } from './Icon'
import { Container, Logo, buttonPrimary } from './ui'

export function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  const close = () => setOpen(false)

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors ${
        scrolled || open ? 'bg-paper/90 shadow-[0_1px_0_rgba(30,33,71,0.08)] backdrop-blur-md' : ''
      }`}
    >
      <Container className="flex h-18 items-center justify-between gap-4">
        <motion.a href="#top" aria-label={`${school.name} — на главную`} onClick={close} initial="rest" whileHover="hover">
          <Logo />
        </motion.a>

        <nav aria-label="Основная навигация" className="hidden lg:block">
          <ul className="flex items-center gap-5 font-bold xl:gap-6">
            {navItems.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="text-ink-soft transition hover:text-ink">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <a href={school.phoneHref} className="hidden items-center gap-2 font-extrabold whitespace-nowrap xl:flex">
            <Icon name="phone" className="size-5 text-tomato-deep" />
            {school.phone}
          </a>
          <motion.a href="#booking" className={`${buttonPrimary} !px-5 !py-2.5 whitespace-nowrap max-sm:hidden`} {...pressable}>
            Пробный урок
          </motion.a>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full border-2 border-ink/15 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
            onClick={() => setOpen((v) => !v)}
          >
            <Icon name={open ? 'close' : 'menu'} className="size-5" />
          </button>
        </div>
      </Container>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label="Мобильная навигация"
            className="border-t border-ink/10 lg:hidden"
            initial={{ opacity: 0, y: -motionTokens.distance.sm }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -motionTokens.distance.sm }}
            transition={{ duration: motionTokens.duration.fast, ease: motionTokens.easing.smooth }}
          >
            <Container className="py-4">
              <ul className="grid gap-1">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <a href={item.href} onClick={close} className="block rounded-2xl px-3 py-3 text-lg font-extrabold transition hover:bg-paper-deep">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-4 grid gap-3 border-t border-ink/10 pt-4">
                <a href="#booking" onClick={close} className={buttonPrimary}>
                  Записаться на пробный урок
                </a>
                <a href={school.phoneHref} className="py-2 text-center font-extrabold">
                  {school.phone}
                </a>
              </div>
            </Container>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
