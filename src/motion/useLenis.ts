import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger, prefersReducedMotion } from './gsap'
import { scrollBus } from './scrollBus'

export function useLenis() {
  useEffect(() => {
    if (prefersReducedMotion()) return

    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 })

    lenis.on('scroll', (e: Lenis) => {
      scrollBus.velocity = e.velocity
      scrollBus.progress = e.limit > 0 ? e.scroll / e.limit : 0
      ScrollTrigger.update()
    })

    const raf = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    // Anclas de la nav a través de Lenis
    const onClick = (ev: MouseEvent) => {
      const a = (ev.target as HTMLElement).closest('a[href^="#"]')
      if (!a) return
      const id = a.getAttribute('href')!
      const target = document.querySelector(id)
      if (target) {
        ev.preventDefault()
        lenis.scrollTo(target as HTMLElement, { offset: -40 })
      }
    }
    document.addEventListener('click', onClick)

    return () => {
      document.removeEventListener('click', onClick)
      gsap.ticker.remove(raf)
      lenis.destroy()
    }
  }, [])
}
