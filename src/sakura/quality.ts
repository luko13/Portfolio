export interface QualityTier {
  count: number
  dprCap: number
  mouseInteraction: boolean
}

export function detectTier(): QualityTier {
  const coarse = window.matchMedia('(pointer: coarse)').matches
  const small = window.innerWidth < 768
  if (coarse || small) {
    return { count: 140, dprCap: 1.5, mouseInteraction: false }
  }
  return { count: 380, dprCap: 2, mouseInteraction: true }
}

export function hasWebGL2(): boolean {
  try {
    const c = document.createElement('canvas')
    return !!c.getContext('webgl2')
  } catch {
    return false
  }
}
