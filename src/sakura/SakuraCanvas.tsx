import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../motion/gsap'
import { hasWebGL2 } from './quality'
import { useLang } from '../i18n/LangContext'
import { ui } from '../data/ui'
import './sakura.css'

// Carga three dinámicamente tras el primer paint: nunca entra en el bundle inicial
export function SakuraCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [fallback, setFallback] = useState(false)
  const { t } = useLang()

  useEffect(() => {
    if (prefersReducedMotion() || !hasWebGL2()) {
      setFallback(true)
      return
    }
    let destroyed = false
    let sceneHandle: { destroy: () => void } | null = null

    import('./scene').then(({ createSakuraScene }) => {
      if (destroyed || !canvasRef.current) return
      sceneHandle = createSakuraScene(canvasRef.current)
    })

    return () => {
      destroyed = true
      sceneHandle?.destroy()
    }
  }, [])

  if (fallback) return <StaticPetals />

  return (
    <canvas
      ref={canvasRef}
      className="sakura-canvas"
      aria-hidden="true"
      role="presentation"
      title={t(ui.a11y.petals)}
    />
  )
}

// Fallback sin movimiento: unos pétalos SVG estáticos sobre el papel
function StaticPetals() {
  const petals = [
    { top: '12%', left: '8%', size: 26, rot: -20, o: 0.5 },
    { top: '30%', left: '85%', size: 20, rot: 45, o: 0.4 },
    { top: '55%', left: '15%', size: 16, rot: 120, o: 0.35 },
    { top: '70%', left: '75%', size: 24, rot: -60, o: 0.45 },
    { top: '88%', left: '40%', size: 18, rot: 10, o: 0.3 },
  ]
  return (
    <div className="sakura-static" aria-hidden="true">
      {petals.map((p, i) => (
        <svg
          key={i}
          viewBox="0 0 24 28"
          style={{
            top: p.top,
            left: p.left,
            width: p.size,
            transform: `rotate(${p.rot}deg)`,
            opacity: p.o,
          }}
        >
          <path
            d="M12 27 C2 20 1 9 8 3 Q10 1.4 12 4 Q14 1.4 16 3 C23 9 22 20 12 27 Z"
            fill="var(--sakura)"
          />
        </svg>
      ))}
    </div>
  )
}
