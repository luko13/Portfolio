import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../motion/gsap'

// Anillo que sigue al cursor y se expande sobre interactivos.
// El cursor nativo NO se oculta (accesibilidad). Solo pointer: fine.
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    if (!window.matchMedia('(pointer: fine)').matches || prefersReducedMotion()) return

    const el = ref.current
    el.style.display = 'block'
    const xTo = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3' })

    const move = (e: MouseEvent) => {
      xTo(e.clientX)
      yTo(e.clientY)
    }
    const over = (e: MouseEvent) => {
      const interactive = (e.target as HTMLElement).closest('a, button')
      el.classList.toggle('big', !!interactive)
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', over)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
    }
  }, [])

  return <div className="cursor" ref={ref} aria-hidden="true" />
}
