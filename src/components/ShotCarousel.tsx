import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { Project } from '../data/projects'
import { gsap, prefersReducedMotion } from '../motion/gsap'
import { scrollBus } from '../motion/scrollBus'
import { useLang } from '../i18n/LangContext'
import { ui } from '../data/ui'

const INTERVAL = 5200
const PETALS = 14

// Carrusel de capturas con transición de barrido de pétalos:
// una ráfaga de pétalos cruza el marco revelando la siguiente captura
// (y sopla también sobre los pétalos WebGL de la página vía scrollBus.gust).
export function ShotCarousel({ project }: { project: Project }) {
  const images = project.images ?? []
  const phone = project.frame === 'phone'
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const indexRef = useRef(0)
  const busy = useRef(false)
  const shellRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const touchX = useRef<number | null>(null)
  const { t } = useLang()

  indexRef.current = index

  // Limpia los estilos inline de la transición justo tras el cambio de slide
  useLayoutEffect(() => {
    if (!shellRef.current) return
    gsap.set(shellRef.current.querySelectorAll('img'), {
      clearProps: 'clipPath,zIndex,opacity,scale',
    })
    busy.current = false
  }, [index])

  const goTo = useCallback(
    (next: number, dir: 1 | -1) => {
      const current = indexRef.current
      if (busy.current || next === current || images.length < 2) return
      busy.current = true

      if (prefersReducedMotion()) {
        setIndex(next)
        return
      }

      const shell = shellRef.current
      const overlay = overlayRef.current
      if (!shell || !overlay) {
        setIndex(next)
        return
      }

      // Ráfaga sobre los pétalos globales de la página
      scrollBus.gust = dir * 34

      const inc = shell.querySelectorAll('img')[next] as HTMLElement
      const w = overlay.offsetWidth
      const h = overlay.offsetHeight

      // Wipe diagonal: la captura entrante se revela siguiendo a los pétalos
      const startClip =
        dir === 1
          ? 'polygon(-25% 0%, -25% 0%, -45% 100%, -45% 100%)'
          : 'polygon(145% 0%, 145% 0%, 125% 100%, 125% 100%)'
      const endClip =
        dir === 1
          ? 'polygon(-25% 0%, 145% 0%, 125% 100%, -45% 100%)'
          : 'polygon(-25% 0%, 145% 0%, 125% 100%, -45% 100%)'

      gsap.set(inc, { opacity: 1, zIndex: 2, scale: 1.04, clipPath: startClip })

      const petals = Array.from(overlay.children)
      const tl = gsap.timeline({
        onComplete: () => setIndex(next),
      })
      tl.to(inc, { clipPath: endClip, scale: 1, duration: 0.95, ease: 'osaka' }, 0.06)
      tl.fromTo(
        petals,
        {
          x: dir === 1 ? -60 : w + 60,
          y: () => Math.random() * h,
          rotation: () => Math.random() * 360,
          scale: () => 0.5 + Math.random() * 0.9,
          opacity: 0.95,
        },
        {
          x: dir === 1 ? w + 80 : -80,
          y: () => `+=${Math.random() * 90 - 45}`,
          rotation: () => `+=${120 + Math.random() * 240}`,
          opacity: 0,
          duration: 1.0,
          stagger: 0.028,
          ease: 'power1.inOut',
        },
        0,
      )
    },
    [images.length],
  )

  const step = useCallback(
    (dir: 1 | -1) => {
      const n = (indexRef.current + dir + images.length) % images.length
      goTo(n, dir)
    },
    [goTo, images.length],
  )

  // Autoplay; se reinicia tras cualquier cambio (manual o automático)
  useEffect(() => {
    if (prefersReducedMotion() || paused || images.length < 2) return
    const id = setInterval(() => step(1), INTERVAL)
    return () => clearInterval(id)
  }, [paused, images.length, step, index])

  const slides = images.map((src, i) => (
    <img
      key={src}
      src={src}
      alt={`${project.title}, captura ${i + 1}`}
      className={i === index ? 'active' : ''}
      loading={i === 0 ? 'eager' : 'lazy'}
      width={phone ? 590 : 1600}
      height={phone ? 1280 : 1000}
    />
  ))

  return (
    <div
      className={`carousel ${phone ? 'is-phone' : ''}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="group"
      aria-label={`${project.title}: capturas`}
    >
      <div
        className="carousel-frame"
        onPointerDown={(e) => {
          touchX.current = e.clientX
        }}
        onPointerUp={(e) => {
          if (touchX.current === null) return
          const d = e.clientX - touchX.current
          touchX.current = null
          if (Math.abs(d) > 40) step(d < 0 ? 1 : -1)
        }}
      >
        {phone ? (
          <div className="phone-shell" ref={shellRef}>
            {slides}
          </div>
        ) : (
          <div className="web-shell" ref={shellRef}>
            {slides}
          </div>
        )}
        <div className="petal-overlay" ref={overlayRef} aria-hidden="true">
          {Array.from({ length: PETALS }, (_, i) => (
            <svg key={i} viewBox="0 0 24 28">
              <path
                d="M12 27 C2 20 1 9 8 3 Q10 1.4 12 4 Q14 1.4 16 3 C23 9 22 20 12 27 Z"
                fill={i % 3 === 0 ? 'var(--sakura-deep)' : 'var(--sakura)'}
              />
            </svg>
          ))}
        </div>
        {images.length > 1 && (
          <>
            <button className="carousel-arrow prev" aria-label={t(ui.projects.prev)} onClick={() => step(-1)}>
              ←
            </button>
            <button className="carousel-arrow next" aria-label={t(ui.projects.next)} onClick={() => step(1)}>
              →
            </button>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="carousel-dots">
          {images.map((src, i) => (
            <button
              key={src}
              className={i === index ? 'active' : ''}
              aria-label={`Captura ${i + 1}`}
              aria-current={i === index}
              onClick={() => goTo(i, i > index ? 1 : -1)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
