import { useEffect, useId, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../motion/gsap'

// Trazos de pincel sumi-e dibujados en SVG: paths superpuestos de distinto
// grosor + turbulencia sutil para el borde irregular de tinta. Se dibujan
// con stroke-dashoffset al entrar en viewport. Color via currentColor.

type Variant = 'underline' | 'divider' | 'enso'

interface Stroke {
  d: string
  w: number
  opacity?: number
}

const ART: Record<Variant, { viewBox: string; stretch: boolean; paths: Stroke[] }> = {
  underline: {
    viewBox: '0 0 200 12',
    stretch: true,
    paths: [
      { d: 'M 3 8 C 40 4, 90 10, 130 6 S 185 4, 197 6', w: 3.4 },
      { d: 'M 5 9 C 50 6, 110 11, 196 7', w: 1.2, opacity: 0.5 },
    ],
  },
  divider: {
    viewBox: '0 0 400 14',
    stretch: true,
    paths: [
      { d: 'M 4 8 C 80 4, 180 11, 260 7 S 380 5, 396 8', w: 3 },
      { d: 'M 8 10 C 120 7, 240 12, 392 8', w: 1, opacity: 0.45 },
    ],
  },
  enso: {
    viewBox: '0 0 100 100',
    stretch: false,
    paths: [
      { d: 'M 71 14 A 42 42 0 1 0 78 71', w: 5 },
      { d: 'M 69 17 A 39 39 0 1 0 75 68', w: 1.6, opacity: 0.4 },
    ],
  },
}

export function SumiStroke({
  variant,
  className,
  scrub = false,
}: {
  variant: Variant
  className?: string
  scrub?: boolean
}) {
  const id = useId()
  const ref = useRef<SVGSVGElement>(null)
  const art = ART[variant]

  useEffect(() => {
    if (!ref.current || prefersReducedMotion()) return
    const paths = ref.current.querySelectorAll('path')
    const tween = gsap.fromTo(
      paths,
      { strokeDashoffset: 1 },
      {
        strokeDashoffset: 0,
        duration: 1.1,
        ease: scrub ? 'none' : 'osaka',
        stagger: 0.12,
        scrollTrigger: scrub
          ? { trigger: ref.current, start: 'top 88%', end: 'top 45%', scrub: true }
          : { trigger: ref.current, start: 'top 85%' },
      },
    )
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [scrub])

  return (
    <svg
      ref={ref}
      className={`sumi ${className ?? ''}`}
      viewBox={art.viewBox}
      preserveAspectRatio={art.stretch ? 'none' : 'xMidYMid meet'}
      aria-hidden="true"
      focusable="false"
    >
      <filter id={id} x="-10%" y="-40%" width="120%" height="180%">
        <feTurbulence type="fractalNoise" baseFrequency="0.12 0.9" numOctaves="2" seed="7" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="2.6" />
      </filter>
      <g filter={`url(#${id})`}>
        {art.paths.map((p, i) => (
          <path
            key={i}
            d={p.d}
            pathLength={1}
            fill="none"
            stroke="currentColor"
            strokeWidth={p.w}
            strokeLinecap="round"
            strokeDasharray="1"
            strokeDashoffset="var(--sumi-start, 1)"
            opacity={p.opacity ?? 1}
          />
        ))}
      </g>
    </svg>
  )
}
