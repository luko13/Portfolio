import { useEffect, useRef } from 'react'
import { gsap, SplitText, prefersReducedMotion } from '../motion/gsap'
import { introDone } from '../motion/introGate'
import { scrollBus } from '../motion/scrollBus'
import { useLang } from '../i18n/LangContext'
import { profile } from '../data/profile'
import { ui } from '../data/ui'
import { KanjiArt } from '../components/KanjiArt'

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
        gsap.from('.hero-hud, .hero-headline, .hero-role, .hero-actions, .hero-socials, .hero-scrollline', {
          opacity: 0,
          y: 24,
          duration: 0.8,
          delay: 0.85,
          stagger: 0.1,
        })

        // Deshoje: al scrollear, los caracteres vuelan uno a uno como pétalos
        // y la ráfaga alimenta el viento de la escena sakura
        const leaf = gsap.timeline({
          scrollTrigger: {
            trigger: ref.current,
            start: 'top top',
            end: '70% top',
            scrub: true,
          },
        })
        leaf.to(split.chars, {
          yPercent: () => -(90 + Math.random() * 140),
          xPercent: () => 14 + Math.random() * 50,
          rotation: () => 6 + Math.random() * 28,
          opacity: 0,
          duration: 1,
          ease: 'power1.in',
          stagger: { each: 0.09, from: 'random' },
        })
        ScrollTriggerGust(ref.current!)

        // El resto del hero se retira con parallax suave
        gsap.to('.hero-rest', {
          yPercent: -12,
          opacity: 0.2,
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
        <p className="hero-hud hud">
          {profile.realName} <span aria-hidden="true">·</span> 36.54°N 4.62°W{' '}
          <span aria-hidden="true">·</span> <span lang="ja">[01] 夜明け</span>
        </p>
        <h1 className="hero-title" key={lang}>
          Luis
        </h1>
        <div className="hero-rest">
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
      </div>
      <KanjiArt char="桜" className="hero-kanji-art" />
      <span className="hero-scrollline" aria-hidden="true" />
    </section>
  )
}

// La velocidad del deshoje se traduce en ráfaga de viento para los pétalos
function ScrollTriggerGust(el: HTMLElement) {
  gsap.to({}, {
    scrollTrigger: {
      trigger: el,
      start: 'top top',
      end: '60% top',
      onUpdate: (self) => {
        scrollBus.gust += Math.min(Math.abs(self.getVelocity()) / 3000, 3)
      },
    },
  })
}
