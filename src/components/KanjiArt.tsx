import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../motion/gsap'

// Kanji a escala de viewport como elemento gráfico: capa outline + capa de
// relleno que se pinta de abajo arriba con el scroll (clip-path scrubbed).
export function KanjiArt({
  char,
  className,
}: {
  char: string
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!ref.current || prefersReducedMotion()) return
    const fill = ref.current.querySelector<HTMLElement>('.kanji-fill')
    if (!fill) return
    const tween = gsap.fromTo(
      fill,
      { clipPath: 'inset(100% 0 0 0)' },
      {
        clipPath: 'inset(0% 0 0 0)',
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 90%',
          end: 'center 45%',
          scrub: true,
        },
      },
    )
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [])

  return (
    <span
      ref={ref}
      className={`kanji-art${className ? ` ${className}` : ''}`}
      lang="ja"
      aria-hidden="true"
    >
      <span className="kanji-outline">{char}</span>
      <span className="kanji-fill">{char}</span>
    </span>
  )
}
