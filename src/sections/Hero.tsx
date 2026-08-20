import { useEffect, useRef } from 'react'
import { gsap, SplitText, prefersReducedMotion } from '../motion/gsap'
import { useLang } from '../i18n/LangContext'
import { profile } from '../data/profile'

export function Hero() {
  const { lang, t } = useLang()
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!ref.current || prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      const split = SplitText.create('.hero-title', { type: 'chars', mask: 'chars' })
      gsap.from(split.chars, {
        yPercent: 110,
        duration: 1.2,
        stagger: 0.055,
        delay: 0.15,
      })
      gsap.from('.hero-role, .hero-scrollline', {
        opacity: 0,
        y: 24,
        duration: 0.8,
        delay: 0.9,
        stagger: 0.12,
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
    return () => ctx.revert()
  }, [lang])

  return (
    <section className="hero" id="top" ref={ref}>
      <div className="hero-inner container">
        <h1 className="hero-title" key={lang}>
          luko13
        </h1>
        <p className="hero-role">{t(profile.role)}</p>
      </div>
      <span className="hero-kanji" lang="ja" aria-hidden="true">
        桜
      </span>
      <span className="hero-scrollline" aria-hidden="true" />
    </section>
  )
}
