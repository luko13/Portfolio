import { useEffect } from 'react'
import type { CSSProperties } from 'react'
import { ScrollTrigger, prefersReducedMotion } from '../motion/gsap'
import { defineStop } from '../motion/dayCycle'
import { scrollBus } from '../motion/scrollBus'
import { useReveal } from '../motion/useReveal'
import { useLang } from '../i18n/LangContext'
import { projects } from '../data/projects'
import { ui } from '../data/ui'
import { ShotCarousel } from '../components/ShotCarousel'
import { KanjiArt } from '../components/KanjiArt'
import { SumiStroke } from '../components/SumiStroke'

const featured = projects.filter((p) => p.featured)

// Cada mundo registra su clima en el ciclo del día antes de que App monte
// los triggers (import-time, previo a cualquier efecto).
for (const p of featured) {
  if (!p.world) continue
  defineStop(`world-${p.id}`, {
    sky: p.world.sky,
    paper: p.world.paper,
    accent: p.world.accent,
    sunX: 50,
    sunY: 22,
    sunColor: p.world.paper,
    petals: [p.world.accent, p.world.deep, p.world.paper],
    storm: 0,
  })
}

// Mundos por proyecto: cada caso de estudio tiñe la página con su propio
// clima (dayCycle) y cruza la frontera con una ráfaga hanafubuki.
export function Worlds() {
  const { lang, t } = useLang()
  const ref = useReveal<HTMLElement>([lang])

  useEffect(() => {
    if (!ref.current || prefersReducedMotion()) return
    const triggers = Array.from(
      ref.current.querySelectorAll<HTMLElement>('.world'),
    ).map((el) =>
      ScrollTrigger.create({
        trigger: el,
        start: 'top 65%',
        onEnter: () => {
          scrollBus.gust += 42
        },
        onLeaveBack: () => {
          scrollBus.gust -= 42
        },
      }),
    )
    return () => triggers.forEach((st) => st.kill())
  }, [ref])

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
        <SumiStroke variant="underline" className="head-stroke" />
      </div>

      <div className="worlds">
        {featured.map((p, i) => (
          <article
            className={`world ${i % 2 === 1 ? 'flip' : ''}`}
            data-climate={`world-${p.id}`}
            key={p.id}
            style={
              {
                '--w-accent': p.world?.accent,
                '--w-deep': p.world?.deep,
              } as CSSProperties
            }
          >
            {p.world && <KanjiArt char={p.world.kanji} className="world-kanji" />}
            <header className="world-head container">
              <p className="hud will-reveal">
                [{String(i + 1).padStart(2, '0')}] {t(p.kind)}{' '}
                <span aria-hidden="true">·</span> {p.year}
                {p.url && (
                  <>
                    {' '}
                    <span aria-hidden="true">·</span>{' '}
                    {t(ui.projects.inProduction)}
                  </>
                )}
              </p>
              <h3 className="world-title will-reveal">{p.title}</h3>
              <p className="world-tagline will-reveal">{t(p.tagline)}</p>
            </header>

            <div className="world-body container">
              <div className="world-media">
                {p.images?.length ? <ShotCarousel project={p} /> : null}
              </div>
              <div className="world-text">
                <p className="fp-context will-reveal">{t(p.context)}</p>
                {p.problem && (
                  <div className="case-block will-reveal">
                    <h4>{t(ui.caseStudy.problem)}</h4>
                    <p>{t(p.problem)}</p>
                  </div>
                )}
                {p.ownership && (
                  <div className="case-block will-reveal">
                    <h4>{t(ui.caseStudy.role)}</h4>
                    <p>{t(p.ownership)}</p>
                  </div>
                )}
                {p.decisions && (
                  <div className="case-block will-reveal">
                    <h4>{t(ui.caseStudy.decisions)}</h4>
                    <ul className="case-decisions">
                      {p.decisions.map((d) => (
                        <li key={d.en}>{t(d)}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {p.metric && <p className="fp-metric will-reveal">{t(p.metric)}</p>}
                <p className="fp-result will-reveal">{t(p.result)}</p>
                <ul className="fp-stack will-reveal">
                  {p.stack.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
                {p.url && (
                  <a
                    className="fp-link will-reveal"
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t(ui.projects.visit)} ↗
                  </a>
                )}
              </div>
            </div>

            <p className="world-strip hud container" aria-hidden="true">
              {p.title} <span>·</span> {p.year} <span>·</span>{' '}
              {p.stack.slice(0, 4).join(' / ')}
              {p.decisions ? (
                <>
                  {' '}
                  <span>·</span> {p.decisions.length}{' '}
                  {lang === 'es' ? 'decisiones' : 'decisions'}
                </>
              ) : null}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}
