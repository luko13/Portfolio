import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import { gsap, prefersReducedMotion } from './gsap'

// Reveal estándar del sitio: fade + slide-up con stagger al entrar en viewport.
// Marca los hijos animables con la clase .will-reveal dentro del contenedor.
export function useReveal<T extends HTMLElement>(deps: unknown[] = []): RefObject<T | null> {
  const ref = useRef<T>(null)

  useEffect(() => {
    if (!ref.current || prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.will-reveal').forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 36 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            scrollTrigger: { trigger: el, start: 'top 85%', once: true },
          },
        )
      })
    }, ref)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return ref
}
