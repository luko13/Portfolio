import { useEffect, useRef } from 'react'
import { Hanko } from './Hanko'
import { LangToggle } from './LangToggle'
import { useLang } from '../i18n/LangContext'
import { ui } from '../data/ui'
import { ScrollTrigger } from '../motion/gsap'

export function Nav() {
  const { t } = useLang()
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const st = ScrollTrigger.create({
      start: 60,
      onToggle: (self) => ref.current?.classList.toggle('scrolled', self.isActive),
    })
    return () => st.kill()
  }, [])

  return (
    <header className="nav" ref={ref}>
      <a href="#top" className="nav-brand" aria-label="luko13, inicio">
        <Hanko size={34} />
      </a>
      <nav className="nav-links">
        <a href="#about">{t(ui.nav.about)}</a>
        <a href="#process">{t(ui.process.title)}</a>
        <a href="#projects">{t(ui.nav.projects)}</a>
        <a href="#contact">{t(ui.nav.contact)}</a>
      </nav>
      <LangToggle />
    </header>
  )
}
