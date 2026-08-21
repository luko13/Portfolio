import {
  CanvasTexture,
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  RepeatWrapping,
  Scene,
  ShaderMaterial,
  SRGBColorSpace,
  Texture,
  TextureLoader,
  Vector2,
  Color,
  WebGLRenderer,
} from 'three'
import { gsap } from '../motion/gsap'

// Disolución entre capturas a través de una máscara de pétalos de sakura,
// con barrido direccional, zoom sutil y borde teñido de rosa.
const frag = /* glsl */ `
precision highp float;
uniform sampler2D tFrom;
uniform sampler2D tTo;
uniform sampler2D tMask;
uniform float uProgress;
uniform float uDir;
uniform vec2 uScaleF; uniform vec2 uOffF;
uniform vec2 uScaleT; uniform vec2 uOffT;
uniform vec3 uEdge;
varying vec2 vUv;

void main() {
  // Campo de transición: gradiente direccional mezclado con pétalos
  float g = uDir > 0.0 ? vUv.x : 1.0 - vUv.x;
  float m = texture2D(tMask, vUv * 2.5).r;
  float field = mix(g, m, 0.58);

  float p = uProgress * 1.3 - 0.15;
  float w = 0.14;
  float reveal = smoothstep(p + w, p - w, field); // 1 = captura entrante

  // Zoom sutil de la entrante y leve empuje de la saliente
  vec2 uvT = (vUv - 0.5) * (1.0 + 0.05 * (1.0 - uProgress)) + 0.5;
  vec2 uvF = vUv + vec2(uDir * 0.045 * uProgress, 0.0);

  vec4 from = texture2D(tFrom, uvF * uScaleF + uOffF);
  vec4 to = texture2D(tTo, uvT * uScaleT + uOffT);
  vec4 color = mix(from, to, reveal);

  // Borde de la disolución teñido de sakura
  float band = smoothstep(w, 0.0, abs(field - p));
  color.rgb = mix(color.rgb, uEdge, band * 0.28);

  gl_FragColor = color;
}
`

const vert = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`

// Máscara procedural: pétalos con umbrales aleatorios de gris
function makePetalMask(): CanvasTexture {
  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, size, size)
  ctx.globalCompositeOperation = 'lighten'
  for (let i = 0; i < 160; i++) {
    const s = 14 + Math.random() * 34
    const v = Math.floor(Math.random() * 255)
    ctx.save()
    // Repetible en los bordes: pinta también los wraps cercanos
    const x = Math.random() * size
    const y = Math.random() * size
    for (const dx of [-size, 0, size]) {
      for (const dy of [-size, 0, size]) {
        ctx.save()
        ctx.translate(x + dx, y + dy)
        ctx.rotate(Math.random() * Math.PI * 2)
        ctx.scale(s / 24, s / 24)
        ctx.fillStyle = `rgb(${v},${v},${v})`
        ctx.beginPath()
        ctx.moveTo(12, 27)
        ctx.bezierCurveTo(2, 20, 1, 9, 8, 3)
        ctx.quadraticCurveTo(10, 1.4, 12, 4)
        ctx.quadraticCurveTo(14, 1.4, 16, 3)
        ctx.bezierCurveTo(23, 9, 22, 20, 12, 27)
        ctx.closePath()
        ctx.fill()
        ctx.restore()
      }
    }
    ctx.restore()
  }
  const tex = new CanvasTexture(canvas)
  tex.wrapS = tex.wrapT = RepeatWrapping
  return tex
}

export interface SlideGL {
  show: (next: number, dir: 1 | -1) => void
  destroy: () => void
}

export function createSlideGL(
  canvas: HTMLCanvasElement,
  urls: string[],
  opts: { alignTop?: boolean; onReady?: () => void },
): SlideGL {
  const renderer = new WebGLRenderer({ canvas, antialias: false })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  const scene = new Scene()
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1)

  const uniforms = {
    tFrom: { value: null as Texture | null },
    tTo: { value: null as Texture | null },
    tMask: { value: makePetalMask() },
    uProgress: { value: 1 },
    uDir: { value: 1 },
    uScaleF: { value: new Vector2(1, 1) },
    uOffF: { value: new Vector2(0, 0) },
    uScaleT: { value: new Vector2(1, 1) },
    uOffT: { value: new Vector2(0, 0) },
    uEdge: { value: new Color('#e8a7b7') },
  }

  const mat = new ShaderMaterial({ vertexShader: vert, fragmentShader: frag, uniforms })
  scene.add(new Mesh(new PlaneGeometry(2, 2), mat))

  const textures: (Texture | null)[] = urls.map(() => null)
  const loader = new TextureLoader()
  let current = 0
  let destroyed = false

  const render = () => renderer.render(scene, camera)

  // Encaje tipo object-fit: cover (con alineado top opcional)
  function coverFit(tex: Texture, scale: Vector2, off: Vector2) {
    const img = tex.image as HTMLImageElement
    const ca = canvas.clientWidth / Math.max(canvas.clientHeight, 1)
    const ia = img.width / img.height
    if (ia > ca) {
      scale.set(ca / ia, 1)
      off.set((1 - ca / ia) / 2, 0)
    } else {
      scale.set(1, ia / ca)
      off.set(0, opts.alignTop ? 1 - ia / ca : (1 - ia / ca) / 2)
    }
  }

  function applyFits() {
    if (uniforms.tFrom.value) coverFit(uniforms.tFrom.value, uniforms.uScaleF.value, uniforms.uOffF.value)
    if (uniforms.tTo.value) coverFit(uniforms.tTo.value, uniforms.uScaleT.value, uniforms.uOffT.value)
  }

  function resize() {
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)
    applyFits()
    render()
  }
  const ro = new ResizeObserver(resize)
  ro.observe(canvas)

  urls.forEach((url, i) => {
    loader.load(url, (tex) => {
      if (destroyed) return
      tex.colorSpace = SRGBColorSpace
      textures[i] = tex
      if (i === 0) {
        uniforms.tFrom.value = tex
        uniforms.tTo.value = tex
        resize()
        opts.onReady?.()
      }
    })
  })

  let tween: gsap.core.Tween | null = null

  return {
    show(next, dir) {
      const from = textures[current]
      const to = textures[next]
      if (!to || !from || next === current) return
      current = next
      tween?.kill()
      uniforms.tFrom.value = from
      uniforms.tTo.value = to
      uniforms.uDir.value = dir
      uniforms.uProgress.value = 0
      applyFits()
      tween = gsap.to(uniforms.uProgress, {
        value: 1,
        duration: 1.15,
        ease: 'osaka',
        onUpdate: render,
      })
    },
    destroy() {
      destroyed = true
      tween?.kill()
      ro.disconnect()
      textures.forEach((t) => t?.dispose())
      uniforms.tMask.value.dispose()
      mat.dispose()
      renderer.dispose()
      renderer.forceContextLoss()
    },
  }
}
