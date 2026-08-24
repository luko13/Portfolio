import { useEffect, useRef } from 'react'
import { gsap, SplitText, prefersReducedMotion } from '../motion/gsap'
import { introDone } from '../motion/introGate'
import { useLang } from '../i18n/LangContext'
import { profile } from '../data/profile'
import { ui } from '../data/ui'

export function Hero() {
  const { lang, t } = useLang()
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!ref.current || prefersReducedMotion()) return
    let cancelled = false
    let ctx: ReturnType<typeof gsap.context> | undefined
    // El reveal del hero espera a que el preloader termine
    introDone.then(() => {
      if (cancelled || !ref.current) return
      ctx = gsap.context(() => {
      const split = SplitText.create('.hero-title', { type: 'chars', mask: 'chars' })
      gsap.from(split.chars, {
        yPercent: 110,
        duration: 1.2,
        stagger: 0.055,
        delay: 0.15,
      })
      gsap.from('.hero-headline, .hero-role, .hero-actions, .hero-socials, .hero-scrollline', {
        opacity: 0,
        y: 24,
        duration: 0.8,
        delay: 0.85,
        stagger: 0.1,
      })
      gsap.from('.hero-kanji', { opacity: 0, duration: 1.2, delay: 1.1 })

      // Parallax de salida al scrollear
      gsap.to('.hero-inner', {
        yPercent: -12,
        opacity: 0.25,
        ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to('.hero-kanji', {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true },
      })
      return () => split.revert()
      }, ref)
    })
    return () => {
      cancelled = true
      ctx?.revert()
    }
  }, [lang])

  return (
    <section className="hero" id="top" ref={ref}>
      <div className="hero-inner container">
        <p className="hero-eyebrow">{profile.realName}</p>
        <h1 className="hero-title" key={lang}>
          luko13
        </h1>
        <p className="hero-headline">{t(profile.headline)}</p>
        <p className="hero-role">{t(profile.role)}</p>
        <div className="hero-actions">
          <a className="btn btn-primary" href="#projects" data-magnetic>
            {t(ui.hero.ctaWork)}
          </a>
          <a className="btn btn-ghost" href="#contact">
            {t(ui.hero.ctaContact)}
          </a>
          <a className="btn btn-quiet" href={t(profile.cv)} download>
            {t(ui.hero.cv)} ↓
          </a>
        </div>
        <div className="hero-socials">
          {profile.socials.map((s) => (
            <a key={s.label} href={s.url} target="_blank" rel="noreferrer">
              {s.label} ↗
            </a>
          ))}
        </div>
      </div>
      <span className="hero-kanji" lang="ja" aria-hidden="true">
        桜
      </span>
      <span className="hero-scrollline" aria-hidden="true" />
    </section>
  )
}
