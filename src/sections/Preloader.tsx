import { useEffect, useRef, useState } from 'react'
import { gsap, prefersReducedMotion } from '../motion/gsap'
import { finishIntro } from '../motion/introGate'
import { Hanko } from '../components/Hanko'

const SEEN_KEY = 'intro-seen'

export function Preloader() {
  const [gone, setGone] = useState(
    () => sessionStorage.getItem(SEEN_KEY) === '1' || prefersReducedMotion(),
  )
  const ref = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (gone) {
      finishIntro()
      return
    }
    if (!ref.current) return

    let cancelled = false
    const counter = { value: 0 }

    // Progreso real: fuentes + chunk de three precalentado
    const jobs = [
      document.fonts.ready,
      import('../sakura/scene').catch(() => {}),
    ]
    let loaded = 0
    let target = 30 // arranque optimista
    jobs.forEach((j) =>
      Promise.resolve(j).then(() => {
        loaded++
        target = 30 + (loaded / jobs.length) * 70
      }),
    )

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.pre-seal',
        { scale: 1.5, opacity: 0, rotate: 3 },
        { scale: 1, opacity: 1, rotate: -4, duration: 0.7, ease: 'expo.inOut' },
      )

      // El contador persigue al progreso real, con suelo de duración
      const tick = gsap.to(counter, {
        value: 100,
        duration: 1.6,
        ease: 'none',
        modifiers: {
          value: (v: number) => Math.min(Number(v), target),
        },
        onUpdate() {
          if (counterRef.current)
            counterRef.current.textContent = String(Math.round(counter.value)).padStart(3, '0')
        },
      })

      const finish = () => {
        if (cancelled) return
        if (Math.round(counter.value) < 100 || target < 100) {
          requestAnimationFrame(finish)
          return
        }
        tick.kill()
        if (counterRef.current) counterRef.current.textContent = '100'
        gsap
          .timeline({
            onComplete() {
              sessionStorage.setItem(SEEN_KEY, '1')
              finishIntro()
              setGone(true)
            },
          })
          .fromTo(
            '.pre-petal',
            { opacity: 1, y: 0 },
            {
              y: () => 120 + Math.random() * 160,
              x: () => -40 + Math.random() * 80,
              rotate: () => -90 + Math.random() * 180,
              opacity: 0,
              duration: 0.9,
              stagger: 0.05,
              ease: 'power1.in',
            },
          )
          .to(ref.current, { yPercent: -100, duration: 0.9, ease: 'expo.inOut' }, '-=0.55')
      }
      requestAnimationFrame(finish)
    }, ref)

    return () => {
      cancelled = true
      ctx.revert()
    }
  }, [gone])

  if (gone) return null

  return (
    <div className="preloader" ref={ref} aria-hidden="true">
      <div className="pre-center">
        <div className="pre-seal">
          <Hanko size={96} />
          <div className="pre-petals">
            {[0, 1, 2, 3, 4].map((i) => (
              <svg key={i} className="pre-petal" viewBox="0 0 24 28" style={{ left: `${10 + i * 18}%` }}>
                <path
                  d="M12 27 C2 20 1 9 8 3 Q10 1.4 12 4 Q14 1.4 16 3 C23 9 22 20 12 27 Z"
                  fill="var(--sakura)"
                />
              </svg>
            ))}
          </div>
        </div>
      </div>
      <span className="pre-counter">
        <span ref={counterRef}>000</span>
      </span>
    </div>
  )
}
