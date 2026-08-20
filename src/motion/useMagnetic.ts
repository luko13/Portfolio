import { useEffect } from 'react'
import { gsap, prefersReducedMotion } from './gsap'

// Botones magnéticos: los elementos con [data-magnetic] se imantan al cursor.
export function useMagnetic() {
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches || prefersReducedMotion()) return

    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-magnetic]'))
    const cleanups = els.map((el) => {
      const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3' })
      const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3' })
      const move = (e: MouseEvent) => {
        const r = el.getBoundingClientRect()
        xTo((e.clientX - (r.left + r.width / 2)) * 0.3)
        yTo((e.clientY - (r.top + r.height / 2)) * 0.3)
      }
      const leave = () => {
        xTo(0)
        yTo(0)
      }
      el.addEventListener('mousemove', move)
      el.addEventListener('mouseleave', leave)
      return () => {
        el.removeEventListener('mousemove', move)
        el.removeEventListener('mouseleave', leave)
      }
    })
    return () => cleanups.forEach((c) => c())
  }, [])
}
