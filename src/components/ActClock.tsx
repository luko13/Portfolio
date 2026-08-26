import { useEffect, useState } from 'react'
import { ScrollTrigger } from '../motion/gsap'
import { useLang } from '../i18n/LangContext'
import { ui } from '../data/ui'

// Reloj de actos: tategaki fijo lateral con los cinco actos del día.
// Se ilumina el acto activo según el scroll; cada acto es un ancla.
const ACTS = [
  { href: '#top', kanji: '夜明け', key: 'dawn' },
  { href: '#about', kanji: '満開', key: 'bloom' },
  { href: '#projects', kanji: '仕事', key: 'work' },
  { href: '#skills', kanji: '花吹雪', key: 'storm' },
  { href: '#contact', kanji: '茜', key: 'dusk' },
] as const

export function ActClock() {
  const { t } = useLang()
  const [active, setActive] = useState(0)

  useEffect(() => {
    const els = ACTS.map((a) => document.querySelector<HTMLElement>(a.href))
    const triggers = ACTS.flatMap((_, i) => {
      const el = els[i]
      if (!el) return []
      const next = els[i + 1]
      return [
        ScrollTrigger.create({
          trigger: el,
          start: 'clamp(top 60%)',
          endTrigger: next ?? document.body,
          // +1 para que el último acto siga activo en el final exacto del scroll
          end: next ? 'top 60%' : () => ScrollTrigger.maxScroll(window) + 1,
          onToggle: (self) => {
            if (self.isActive) setActive(i)
          },
        }),
      ]
    })
    return () => triggers.forEach((st) => st.kill())
  }, [])

  return (
    <nav className="act-clock" aria-label="Actos">
      {ACTS.map((a, i) => (
        <a
          key={a.key}
          href={a.href}
          lang="ja"
          className={`tategaki${i === active ? ' active' : ''}`}
          title={t(ui.acts[a.key])}
        >
          {a.kanji}
        </a>
      ))}
    </nav>
  )
}
