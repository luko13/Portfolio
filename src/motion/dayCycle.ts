// El ciclo del día: el scroll recorre un día de hanami (amanecer → floración
// → mundos de proyecto → hanafubuki → atardecer akane). Cada sección con
// [data-climate] es una frontera: al cruzarla se interpola la parada previa
// hacia la suya, escribiendo CSS custom properties vivas (--sky, --paper,
// --accent-day, --sun-*) y el tinte de los pétalos en scrollBus.
import { gsap, ScrollTrigger, prefersReducedMotion } from './gsap'
import { scrollBus } from './scrollBus'

export interface DayStop {
  sky: string
  paper: string
  accent: string
  sunX: number // % viewport
  sunY: number
  sunColor: string
  petals: [string, string, string] // uColorA/B/C
  storm: number // 0..1 viento sostenido
}

// Todas las paradas son claras (atardecer = temperatura, nunca oscuridad)
const STOPS: Record<string, DayStop> = {
  dawn: {
    sky: '#f3edf4',
    paper: '#eee6ef',
    accent: '#d3a8c4',
    sunX: 76,
    sunY: 74,
    sunColor: '#f2d7e2',
    petals: ['#e0b0c8', '#c9a1c0', '#f4e8f2'],
    storm: 0,
  },
  bloom: {
    sky: '#f7f2ec',
    paper: '#efe7de',
    accent: '#e8a7b7',
    sunX: 58,
    sunY: 20,
    sunColor: '#f6d9c4',
    petals: ['#e8a7b7', '#d998ab', '#f6dde3'],
    storm: 0,
  },
  storm: {
    sky: '#f5eee9',
    paper: '#eee5dd',
    accent: '#dd9cae',
    sunX: 34,
    sunY: 34,
    sunColor: '#eed9c8',
    petals: ['#eab3c0', '#d998ab', '#f8e6ea'],
    storm: 1,
  },
  dusk: {
    sky: '#f9ece2',
    paper: '#f4e2d2',
    accent: '#e8b48f',
    sunX: 20,
    sunY: 70,
    sunColor: '#f0bfa0',
    petals: ['#ecb9a4', '#dfa08e', '#f8e3d2'],
    storm: 0,
  },
}

// Los mundos de proyecto registran su clima antes de montarse
export function defineStop(name: string, stop: DayStop) {
  STOPS[name] = stop
}

function makeLerp(a: DayStop, b: DayStop) {
  const i = gsap.utils.interpolate
  const sky = i(a.sky, b.sky)
  const paper = i(a.paper, b.paper)
  const accent = i(a.accent, b.accent)
  const sunX = i(a.sunX, b.sunX)
  const sunY = i(a.sunY, b.sunY)
  const sunColor = i(a.sunColor, b.sunColor)
  const pA = i(a.petals[0], b.petals[0])
  const pB = i(a.petals[1], b.petals[1])
  const pC = i(a.petals[2], b.petals[2])
  const root = document.documentElement.style

  return (t: number) => {
    root.setProperty('--sky', sky(t))
    root.setProperty('--paper', paper(t))
    root.setProperty('--accent-day', accent(t))
    root.setProperty('--sun-x', `${sunX(t)}%`)
    root.setProperty('--sun-y', `${sunY(t)}%`)
    root.setProperty('--sun-color', sunColor(t))
    scrollBus.palette.a = pA(t)
    scrollBus.palette.b = pB(t)
    scrollBus.palette.c = pC(t)
    scrollBus.storm = a.storm + (b.storm - a.storm) * t
  }
}

export function initDayCycle(): () => void {
  const zones = Array.from(
    document.querySelectorAll<HTMLElement>('[data-climate]'),
  )
  const reduced = prefersReducedMotion()
  const triggers: ScrollTrigger[] = []

  let prev = STOPS.dawn
  makeLerp(prev, prev)(1) // estado base: amanecer

  for (const el of zones) {
    const stop = STOPS[el.dataset.climate!]
    if (!stop) continue
    const lerp = makeLerp(prev, stop)
    triggers.push(
      reduced
        ? ScrollTrigger.create({
            trigger: el,
            start: 'top 60%',
            onEnter: () => lerp(1),
            onLeaveBack: () => lerp(0),
          })
        : ScrollTrigger.create({
            trigger: el,
            start: 'top bottom',
            end: 'top 35%',
            scrub: true,
            onUpdate: (self) => lerp(self.progress),
          }),
    )
    prev = stop
  }

  return () => triggers.forEach((t) => t.kill())
}
