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
// Modo contain: la captura se ve ENTERA y el hueco lo llena la propia
// captura desenfocada (mipmap bias) con velo washi.
export const slideFrag = /* glsl */ `
precision highp float;
uniform sampler2D tFrom;
uniform sampler2D tTo;
uniform sampler2D tMask;
uniform float uProgress;
uniform float uDir;
uniform vec2 uFitF; uniform vec2 uFitT; // fracción visible por eje (contain) o recorte (cover)
uniform float uContain;
uniform float uCorner; // radio de esquina en UV (pantalla del iPhone); 0 = sin redondeo
uniform float uAspect; // alto/ancho del lienzo, para esquinas circulares
uniform vec3 uEdge;
varying vec2 vUv;

vec2 fitUv(vec2 uv, vec2 fit, float contain) {
  // contain: mapea el área central [off, off+fit] del lienzo al [0,1] de la textura
  // cover: muestrea el sub-rect [off, off+fit] de la textura
  vec2 off = (1.0 - fit) * 0.5;
  vec2 containUv = (uv - off) / fit;
  vec2 coverUv = uv * fit + off;
  return mix(coverUv, containUv, contain);
}

float insideBox(vec2 uv) {
  vec2 s = step(vec2(0.0), uv) * step(uv, vec2(1.0));
  return s.x * s.y;
}

void main() {
  // Esquinas redondeadas (pantalla del iPhone)
  if (uCorner > 0.0) {
    vec2 p = abs(vUv - 0.5) * vec2(1.0, uAspect);
    vec2 half_ = vec2(0.5, 0.5 * uAspect) - uCorner;
    vec2 d = max(p - half_, 0.0);
    if (length(d) > uCorner) discard;
  }

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

  vec2 fUv = fitUv(uvF, uFitF, uContain);
  vec2 tUv = fitUv(uvT, uFitT, uContain);

  vec4 from = texture2D(tFrom, clamp(fUv, 0.0, 1.0));
  vec4 to = texture2D(tTo, clamp(tUv, 0.0, 1.0));

  if (uContain > 0.5) {
    // Fondo ambiental: la captura desenfocada (mipmap) con velo washi
    vec4 bgF = texture2D(tFrom, uvF, 6.0);
    vec4 bgT = texture2D(tTo, uvT, 6.0);
    from = mix(mix(bgF, vec4(0.96, 0.93, 0.90, 1.0), 0.4), from, insideBox(fUv));
    to = mix(mix(bgT, vec4(0.96, 0.93, 0.90, 1.0), 0.4), to, insideBox(tUv));
  }

  vec4 color = mix(from, to, reveal);

  // Borde de la disolución teñido de sakura
  float band = smoothstep(w, 0.0, abs(field - p));
  color.rgb = mix(color.rgb, uEdge, band * 0.28);

  gl_FragColor = color;
}
`

export const slideVert = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

// Máscara procedural: pétalos con umbrales aleatorios de gris
export function makePetalMask(): CanvasTexture {
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
    const x = Math.random() * size
    const y = Math.random() * size
    const rot = Math.random() * Math.PI * 2
    for (const dx of [-size, 0, size]) {
      for (const dy of [-size, 0, size]) {
        ctx.save()
        ctx.translate(x + dx, y + dy)
        ctx.rotate(rot)
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
  }
  const tex = new CanvasTexture(canvas)
  tex.wrapS = tex.wrapT = RepeatWrapping
  return tex
}

// Fracción visible por eje para contain (imagen entera) o cover (recorte)
export function fitFraction(imgAspect: number, boxAspect: number, contain: boolean): Vector2 {
  if (contain ? imgAspect > boxAspect : imgAspect < boxAspect) {
    return new Vector2(contain ? 1 : boxAspect / imgAspect, contain ? boxAspect / imgAspect : 1)
  }
  return new Vector2(contain ? imgAspect / boxAspect : 1, contain ? 1 : imgAspect / boxAspect)
}

export function loadSlideTextures(
  urls: string[],
  onFirst: (tex: Texture) => void,
): { textures: (Texture | null)[]; dispose: () => void } {
  const loader = new TextureLoader()
  const textures: (Texture | null)[] = urls.map(() => null)
  let disposed = false
  urls.forEach((url, i) => {
    loader.load(url, (tex) => {
      if (disposed) {
        tex.dispose()
        return
      }
      tex.colorSpace = SRGBColorSpace
      textures[i] = tex
      if (i === 0) onFirst(tex)
    })
  })
  return {
    textures,
    dispose() {
      disposed = true
      textures.forEach((t) => t?.dispose())
    },
  }
}

export interface SlideGL {
  show: (next: number, dir: 1 | -1) => void
  destroy: () => void
}

// Carrusel plano (capturas de escritorio) sobre un quad ortográfico
export function createSlideGL(
  canvas: HTMLCanvasElement,
  urls: string[],
  opts: { onReady?: () => void },
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
    uFitF: { value: new Vector2(1, 1) },
    uFitT: { value: new Vector2(1, 1) },
    uContain: { value: 1 },
    uCorner: { value: 0 },
    uAspect: { value: 1 },
    uEdge: { value: new Color('#e8a7b7') },
  }

  const mat = new ShaderMaterial({
    vertexShader: /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position, 1.0); }`,
    fragmentShader: slideFrag,
    uniforms,
  })
  scene.add(new Mesh(new PlaneGeometry(2, 2), mat))

  let current = 0
  const render = () => renderer.render(scene, camera)

  const boxAspect = () => canvas.clientWidth / Math.max(canvas.clientHeight, 1)

  function fitFor(tex: Texture): Vector2 {
    const img = tex.image as HTMLImageElement
    return fitFraction(img.width / img.height, boxAspect(), true)
  }

  function applyFits() {
    if (uniforms.tFrom.value) uniforms.uFitF.value.copy(fitFor(uniforms.tFrom.value))
    if (uniforms.tTo.value) uniforms.uFitT.value.copy(fitFor(uniforms.tTo.value))
  }

  function resize() {
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)
    applyFits()
    render()
  }
  const ro = new ResizeObserver(resize)
  ro.observe(canvas)

  const { textures, dispose: disposeTex } = loadSlideTextures(urls, (tex) => {
    uniforms.tFrom.value = tex
    uniforms.tTo.value = tex
    resize()
    opts.onReady?.()
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
      tween?.kill()
      ro.disconnect()
      disposeTex()
      uniforms.tMask.value.dispose()
      mat.dispose()
      renderer.dispose()
      renderer.forceContextLoss()
    },
  }
}
