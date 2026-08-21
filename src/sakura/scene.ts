import {
  CanvasTexture,
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  Mesh,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  SRGBColorSpace,
  Vector2,
  Color,
  WebGLRenderer,
} from 'three'
import { vertexShader, fragmentShader } from './shaders'
import { detectTier } from './quality'
import { scrollBus } from '../motion/scrollBus'

// Atlas procedural: 3 variantes de pétalo dibujadas en canvas (0 KB de assets)
function makePetalAtlas(): CanvasTexture {
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = size * 3
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  for (let i = 0; i < 3; i++) {
    const cx = size * i + size / 2
    const cy = size / 2
    ctx.save()
    ctx.translate(cx, cy)
    ctx.rotate((i - 1) * 0.25)

    const w = size * 0.36
    const h = size * 0.46
    const notch = [0.12, 0.2, 0.05][i] * size // hendidura típica del pétalo de sakura

    const grad = ctx.createRadialGradient(0, h * 0.25, 2, 0, 0, h * 1.1)
    grad.addColorStop(0, 'rgba(255,255,255,1)')
    grad.addColorStop(0.75, 'rgba(255,255,255,0.92)')
    grad.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = grad

    ctx.beginPath()
    ctx.moveTo(0, h) // base (unión con la flor)
    ctx.bezierCurveTo(-w, h * 0.55, -w * 0.95, -h * 0.4, -w * 0.28, -h * 0.82)
    ctx.quadraticCurveTo(-w * 0.1, -h * 0.95, 0, -h + notch) // hendidura
    ctx.quadraticCurveTo(w * 0.1, -h * 0.95, w * 0.28, -h * 0.82)
    ctx.bezierCurveTo(w * 0.95, -h * 0.4, w, h * 0.55, 0, h)
    ctx.closePath()
    ctx.fill()
    ctx.restore()
  }

  const tex = new CanvasTexture(canvas)
  tex.colorSpace = SRGBColorSpace
  return tex
}

export interface SakuraScene {
  destroy: () => void
}

export function createSakuraScene(canvas: HTMLCanvasElement): SakuraScene {
  const tier = detectTier()

  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, tier.dprCap))

  const scene = new Scene()
  const camera = new PerspectiveCamera(50, 1, 0.1, 30)
  camera.position.z = 8

  // Geometría instanciada: un plano, N pétalos, movimiento 100% en GPU
  const base = new PlaneGeometry(0.22, 0.26, 4, 4)
  const geo = new InstancedBufferGeometry()
  geo.index = base.index
  geo.attributes.position = base.attributes.position
  geo.attributes.uv = base.attributes.uv

  const count = tier.count
  const rand = new Float32Array(count * 4)
  const sizes = new Float32Array(count)
  for (let i = 0; i < count; i++) {
    rand[i * 4] = Math.random()
    rand[i * 4 + 1] = Math.random()
    rand[i * 4 + 2] = Math.random()
    rand[i * 4 + 3] = Math.random()
    sizes[i] = 0.6 + Math.random() * 0.9
  }
  geo.setAttribute('aRand', new InstancedBufferAttribute(rand, 4))
  geo.setAttribute('aSize', new InstancedBufferAttribute(sizes, 1))
  geo.instanceCount = count

  const uniforms = {
    uTime: { value: 0 },
    uScroll: { value: 0 },
    uCalm: { value: 0 },
    uMouse: { value: new Vector2(999, 999) },
    uMouseActive: { value: tier.mouseInteraction ? 1 : 0 },
    uArea: { value: new Vector2(20, 12) },
    uTex: { value: makePetalAtlas() },
    uColorA: { value: new Color('#e8a7b7') },
    uColorB: { value: new Color('#d998ab') },
    uColorC: { value: new Color('#f6dde3') },
  }

  const mat = new ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms,
    transparent: true,
    depthWrite: false,
  })

  const mesh = new Mesh(geo, mat)
  mesh.frustumCulled = false
  scene.add(mesh)

  function resize() {
    const w = window.innerWidth
    const h = window.innerHeight
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    // Volumen visible en z=0 con margen para la dispersión en profundidad
    const vh = 2 * Math.tan((camera.fov * Math.PI) / 360) * camera.position.z
    const vw = vh * camera.aspect
    uniforms.uArea.value.set(vw + 6, vh + 4)
  }
  resize()
  window.addEventListener('resize', resize)

  // Cursor en coordenadas de mundo (plano z=0)
  const onMouse = (e: MouseEvent) => {
    const vh = 2 * Math.tan((camera.fov * Math.PI) / 360) * camera.position.z
    const vw = vh * camera.aspect
    uniforms.uMouse.value.set(
      (e.clientX / window.innerWidth - 0.5) * vw,
      -(e.clientY / window.innerHeight - 0.5) * vh,
    )
  }
  if (tier.mouseInteraction) window.addEventListener('mousemove', onMouse)

  // Bucle: solo 4 uniforms por frame + guardarraíl de rendimiento
  let raf = 0
  let last = performance.now()
  let slowFrames = 0
  let degraded = false

  const loop = (now: number) => {
    const dt = now - last
    last = now
    uniforms.uTime.value = now / 1000
    // Lerp del viento de scroll (+ ráfagas del carrusel) y de la calma del footer
    scrollBus.gust *= 0.94
    uniforms.uScroll.value +=
      (scrollBus.velocity + scrollBus.gust - uniforms.uScroll.value) * 0.06
    uniforms.uCalm.value += (scrollBus.calm - uniforms.uCalm.value) * 0.04

    // ponytail: degradación de un solo escalón; LOD progresivo si algún dispositivo lo pide
    if (!degraded && dt > 22) {
      slowFrames++
      if (slowFrames > 120) {
        geo.instanceCount = Math.floor(count / 2)
        degraded = true
      }
    } else if (dt <= 22 && slowFrames > 0) {
      slowFrames--
    }

    renderer.render(scene, camera)
    raf = requestAnimationFrame(loop)
  }
  raf = requestAnimationFrame(loop)

  return {
    destroy() {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouse)
      geo.dispose()
      mat.dispose()
      uniforms.uTex.value.dispose()
      renderer.dispose()
    },
  }
}
