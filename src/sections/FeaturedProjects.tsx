import { useEffect } from 'react'
import { gsap, prefersReducedMotion } from '../motion/gsap'
import { useReveal } from '../motion/useReveal'
import { useLang } from '../i18n/LangContext'
import { projects } from '../data/projects'
import { ui } from '../data/ui'
import { ProjectShot } from '../components/PlaceholderShot'

const KANJI = ['一', '二', '三', '四', '五', '六', '七', '八', '九']

export function FeaturedProjects() {
  const { lang, t } = useLang()
  const ref = useReveal<HTMLElement>([lang])
  const featured = projects.filter((p) => p.featured)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.fp-media').forEach((el) => {
        gsap.fromTo(
          el,
          { clipPath: 'inset(8% 6% 8% 6%)', scale: 1.06 },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            scale: 1,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top 90%', end: 'top 45%', scrub: 0.4 },
          },
        )
      })
    }, ref)
    return () => ctx.revert()
  }, [lang, ref])

  return (
    <section className="section projects" id="projects" ref={ref}>
      <span className="tategaki side-label" aria-hidden="true">
        {t(ui.sections.projects)} · 三
      </span>
      <div className="container">
        <div className="section-head will-reveal">
          <span className="kanji-num" lang="ja">
            三
          </span>
          <h2>{t(ui.sections.projects)}</h2>
        </div>

        <div className="fp-list">
          {featured.map((p, i) => (
            <article className={`fp-item ${i % 2 === 1 ? 'flip' : ''}`} key={p.id}>
              <div className="fp-media">
                <ProjectShot project={p} />
              </div>
              <div className="fp-text">
                <p className="fp-meta will-reveal">
                  <span className="fp-kanji" lang="ja" aria-hidden="true">
                    {KANJI[i]}
                  </span>
                  {t(p.kind)} · {p.year}
                </p>
                <h3 className="will-reveal">{p.title}</h3>
                <p className="fp-tagline will-reveal">{t(p.tagline)}</p>
                <p className="fp-context will-reveal">{t(p.context)}</p>
                <p className="fp-result will-reveal">{t(p.result)}</p>
                <ul className="fp-stack will-reveal">
                  {p.stack.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
                {p.url && (
                  <a className="fp-link will-reveal" href={p.url} target="_blank" rel="noreferrer">
                    {t(ui.projects.visit)} ↗
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
