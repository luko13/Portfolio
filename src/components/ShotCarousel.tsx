import { useEffect, useRef, useState } from 'react'
import type { Project } from '../data/projects'
import { prefersReducedMotion } from '../motion/gsap'

const INTERVAL = 4200

// Carrusel de capturas: crossfade + deriva suave, autoplay pausado al hover.
export function ShotCarousel({ project }: { project: Project }) {
  const images = project.images ?? []
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduced = useRef(false)

  useEffect(() => {
    reduced.current = prefersReducedMotion()
    if (reduced.current || paused || images.length < 2) return
    const id = setInterval(() => setIndex((i) => (i + 1) % images.length), INTERVAL)
    return () => clearInterval(id)
  }, [paused, images.length])

  return (
    <div
      className="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="group"
      aria-label={`${project.title}: capturas`}
    >
      <div className="carousel-frame">
        {images.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={`${project.title}, captura ${i + 1}`}
            className={i === index ? 'active' : ''}
            loading={i === 0 ? 'eager' : 'lazy'}
            width={1600}
            height={1000}
          />
        ))}
      </div>
      {images.length > 1 && (
        <div className="carousel-dots">
          {images.map((src, i) => (
            <button
              key={src}
              className={i === index ? 'active' : ''}
              aria-label={`Captura ${i + 1}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
