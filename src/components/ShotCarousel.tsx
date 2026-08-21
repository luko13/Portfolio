import { useCallback, useEffect, useRef, useState } from 'react'
import type { Project } from '../data/projects'
import { prefersReducedMotion } from '../motion/gsap'
import { scrollBus } from '../motion/scrollBus'
import { hasWebGL2 } from '../sakura/quality'
import { useLang } from '../i18n/LangContext'
import { ui } from '../data/ui'
import type { Sheet3D } from './sheet3d'

const INTERVAL = 5200

// Carrusel de capturas. La transición es una disolución WebGL a través de
// una máscara de pétalos (con fallback a crossfade sin WebGL/reduced-motion).
export function ShotCarousel({ project }: { project: Project }) {
  const images = project.images ?? []
  const phone = project.frame === 'phone'
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [glReady, setGlReady] = useState(false)
  const indexRef = useRef(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const glRef = useRef<Sheet3D | null>(null)
  const touchX = useRef<number | null>(null)
  const { t } = useLang()

  indexRef.current = index

  const useGl = images.length > 0 && !prefersReducedMotion() && hasWebGL2()

  useEffect(() => {
    if (!useGl || !canvasRef.current) return
    let destroyed = false
    const load = phone
      ? import('./phone3d').then((m) => m.createPhone3D)
      : import('./sheet3d').then((m) => m.createSheet3D)
    load.then((create) => {
      if (destroyed || !canvasRef.current) return
      glRef.current = create(canvasRef.current, images, {
        onReady: () => setGlReady(true),
      })
    })
    return () => {
      destroyed = true
      glRef.current?.destroy()
      glRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useGl])

  const goTo = useCallback((next: number, dir: 1 | -1) => {
    if (next === indexRef.current) return
    scrollBus.gust = dir * 30
    glRef.current?.show(next, dir)
    setIndex(next)
  }, [])

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

  const slides = (
    <>
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={`${project.title}, captura ${i + 1}`}
          className={i === index ? 'active' : ''}
          draggable={false}
          loading={i === 0 ? 'eager' : 'lazy'}
          width={phone ? 590 : 1600}
          height={phone ? 1280 : 1000}
        />
      ))}
    </>
  )

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
        {useGl ? (
          <canvas
            ref={canvasRef}
            className={`gl-stage ${glReady ? 'ready' : ''}`}
            aria-label={`${project.title}: capturas`}
          />
        ) : phone ? (
          <div className="phone-shell">
            <div className="phone-screen">{slides}</div>
          </div>
        ) : (
          <div className="web-shell">{slides}</div>
        )}
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
