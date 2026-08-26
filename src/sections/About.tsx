import { useEffect } from 'react'
import { gsap, prefersReducedMotion } from '../motion/gsap'
import { useReveal } from '../motion/useReveal'
import { useLang } from '../i18n/LangContext'
import { profile, experience, education } from '../data/profile'
import { ui } from '../data/ui'
import { Hanko } from '../components/Hanko'
import { SumiStroke } from '../components/SumiStroke'

export function About() {
  const { lang, t } = useLang()
  const ref = useReveal<HTMLElement>([lang])

  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      // El subrayado sakura de las palabras clave se dibuja con el scroll
      gsap.utils.toArray<HTMLElement>('.kw').forEach((el) => {
        gsap.fromTo(
          el,
          { backgroundSize: '0% 2px' },
          {
            backgroundSize: '100% 2px',
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top 80%', end: 'top 55%', scrub: true },
          },
        )
      })
    }, ref)
    return () => ctx.revert()
  }, [lang, ref])

  // Marca palabras clave de la bio con subrayado dibujado
  const highlight = (text: string, words: string[]) => {
    let parts: React.ReactNode[] = [text]
    words.forEach((w, wi) => {
      parts = parts.flatMap((p): React.ReactNode[] => {
        if (typeof p !== 'string' || !p.includes(w)) return [p]
        const [a, b] = p.split(w)
        return [a, <span className="kw" key={`${wi}-${w}`}>{w}</span>, b]
      })
    })
    return parts
  }

  const kw =
    lang === 'es'
      ? ['SaaS multi-tenant', 'clientes reales', 'apps móviles publicadas']
      : ['multi-tenant SaaS', 'real customers', 'mobile apps live in the stores']

  return (
    <section className="section about" id="about" data-climate="bloom" ref={ref}>
      <span className="tategaki side-label" aria-hidden="true">
        {t(ui.sections.about)} · 一
      </span>
      <div className="container about-grid">
        <div className="about-side will-reveal">
          <div className="about-seal">
            <Hanko size={120} />
          </div>
          <p className="about-name">{profile.realName}</p>
          <p className="about-loc">{t(profile.location)}</p>
        </div>
        <div className="about-body">
          <div className="section-head will-reveal">
            <span className="kanji-num" lang="ja">
              一
            </span>
            <h2>{t(ui.sections.about)}</h2>
          </div>
          <SumiStroke variant="underline" className="head-stroke" />
          <p className="about-p will-reveal">{highlight(t(profile.bio1), kw)}</p>
          <p className="about-p will-reveal">{t(profile.bio2)}</p>

          <div className="track will-reveal">
            <h3 className="track-title">{t(ui.about.experience)}</h3>
            <ul className="track-list">
              {experience.map((r) => (
                <li key={r.org}>
                  <div className="track-row">
                    <strong>{r.org}</strong>
                    <span className="track-period">{r.period}</span>
                  </div>
                  <p className="track-role">{t(r.title)}</p>
                  <p className="track-note">{t(r.note)}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="track will-reveal">
            <h3 className="track-title">{t(ui.about.education)}</h3>
            <ul className="track-list">
              {education.map((e) => (
                <li key={e.org}>
                  <div className="track-row">
                    <strong>{e.org}</strong>
                    <span className="track-period">{e.period}</span>
                  </div>
                  <p className="track-role">{t(e.title)}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
