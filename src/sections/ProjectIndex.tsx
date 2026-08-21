import { useEffect, useRef, useState } from 'react'
import { gsap, prefersReducedMotion } from '../motion/gsap'
import { useReveal } from '../motion/useReveal'
import { useLang } from '../i18n/LangContext'
import { projects } from '../data/projects'
import type { Project } from '../data/projects'
import { ui } from '../data/ui'
import { ProjectPreview } from '../components/PlaceholderShot'

export function ProjectIndex() {
  const { lang, t } = useLang()
  const ref = useReveal<HTMLElement>([lang])
  const rest = projects.filter((p) => !p.featured)
  const [active, setActive] = useState<Project | null>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const fine = useRef(false)

  useEffect(() => {
    fine.current =
      window.matchMedia('(pointer: fine)').matches && !prefersReducedMotion()
    if (!fine.current || !previewRef.current) return

    const xTo = gsap.quickTo(previewRef.current, 'x', { duration: 0.5, ease: 'power3' })
    const yTo = gsap.quickTo(previewRef.current, 'y', { duration: 0.5, ease: 'power3' })
    const move = (e: MouseEvent) => {
      xTo(e.clientX + 24)
      yTo(e.clientY - 100)
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  return (
    <section className="section pindex" ref={ref}>
      <div className="container">
        <div className="section-head will-reveal">
          <span className="kanji-num" lang="ja">
            四
          </span>
          <h2>{t(ui.sections.index)}</h2>
        </div>
        <ul className="pindex-list will-reveal" onMouseLeave={() => setActive(null)}>
          {rest.map((p) => (
            <li key={p.id}>
              <div
                className="pindex-row"
                onMouseEnter={() => fine.current && setActive(p)}
              >
                <h3>{p.title}</h3>
                <p className="pindex-tagline">{t(p.tagline)}</p>
                <span className="pindex-meta">
                  {t(p.kind)} · {p.year}
                </span>
              </div>
              <div className="pindex-detail">
                <p>{t(p.context)}</p>
                <p className="pindex-result">{t(p.result)}</p>
                <ul className="fp-stack">
                  {p.stack.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div
        className={`pindex-preview ${active ? 'visible' : ''}`}
        ref={previewRef}
        aria-hidden="true"
      >
        {active && <ProjectPreview project={active} />}
      </div>
    </section>
  )
}
