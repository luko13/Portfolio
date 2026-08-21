import {
  AmbientLight,
  CanvasTexture,
  Color,
  DirectionalLight,
  Group,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Texture,
  Vector2,
  WebGLRenderer,
} from 'three'
import { NoColorSpace, SRGBColorSpace } from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { gsap, prefersReducedMotion } from '../motion/gsap'
import { slideFrag, makePetalMask, loadSlideTextures } from './slideGl'
import { createPetalBurst } from './petalBurst'

// iPhone 3D: tilt siguiendo al cursor y transición "explosión de pétalos":
// ráfaga 3D de pétalos + giro completo del teléfono + pantalla que se
// reconstruye con la disolución de máscara de pétalos.

const PHONE_W = 0.62
const PHONE_H = 1.28
const PHONE_D = 0.072

// Sello hanko para la trasera (se ve durante el giro)
function makeHankoTexture(): CanvasTexture {
  const s = 128
  const c = document.createElement('canvas')
  c.width = c.height = s
  const ctx = c.getContext('2d')!
  ctx.fillStyle = '#c43a3e'
  ctx.beginPath()
  ctx.roundRect(4, 4, s - 8, s - 8, 18)
  ctx.fill()
  ctx.strokeStyle = '#f7f2ec'
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.roundRect(14, 14, s - 28, s - 28, 10)
  ctx.stroke()
  ctx.fillStyle = '#f7f2ec'
  ctx.font = 'bold 38px Georgia, serif'
  ctx.textAlign = 'center'
  ctx.fillText('LU', s / 2, 58)
  ctx.fillText('KO', s / 2, 102)
  return new CanvasTexture(c)
}

export interface Phone3D {
  show: (next: number, dir: 1 | -1) => void
  destroy: () => void
}

export function createPhone3D(
  canvas: HTMLCanvasElement,
  urls: string[],
  opts: { onReady?: () => void },
): Phone3D {
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  const scene = new Scene()
  const camera = new PerspectiveCamera(30, 1, 0.1, 20)
  camera.position.z = 2.9

  scene.add(new AmbientLight('#fff6f0', 1.6))
  const key = new DirectionalLight('#ffffff', 2.2)
  key.position.set(2, 3, 4)
  scene.add(key)
  const rim = new DirectionalLight('#e8a7b7', 1.4)
  rim.position.set(-3, -1, -2)
  scene.add(rim)

  // ---- Teléfono ----
  const phone = new Group()
  scene.add(phone)

  const bodyMat = new MeshStandardMaterial({ color: '#1b1721', metalness: 0.55, roughness: 0.32 })
  const body = new Mesh(new RoundedBoxGeometry(PHONE_W, PHONE_H, PHONE_D, 4, 0.07), bodyMat)
  phone.add(body)

  const hankoTex = makeHankoTexture()
  hankoTex.colorSpace = SRGBColorSpace // material con luces: sí necesita decodificación
  const hankoMat = new MeshStandardMaterial({ map: hankoTex, roughness: 0.6, metalness: 0.1 })
  const hanko = new Mesh(new PlaneGeometry(0.16, 0.16), hankoMat)
  hanko.position.set(0, 0.32, -PHONE_D / 2 - 0.002)
  hanko.rotation.y = Math.PI
  phone.add(hanko)

  // Pantalla: disolución de pétalos con esquinas redondeadas
  const screenUniforms = {
    tFrom: { value: null as Texture | null },
    tTo: { value: null as Texture | null },
    tMask: { value: makePetalMask() },
    uProgress: { value: 1 },
    uDir: { value: 1 },
    uFitF: { value: new Vector2(1, 1) },
    uFitT: { value: new Vector2(1, 1) },
    uContain: { value: 0 },
    uCorner: { value: 0.075 },
    uAspect: { value: (PHONE_H - 0.045) / (PHONE_W - 0.045) },
    uEdge: { value: new Color().setRGB(232 / 255, 167 / 255, 183 / 255, NoColorSpace) },
  }
  const screenMat = new ShaderMaterial({
    vertexShader: /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: slideFrag,
    uniforms: screenUniforms,
  })
  const screen = new Mesh(new PlaneGeometry(PHONE_W - 0.045, PHONE_H - 0.045), screenMat)
  screen.position.z = PHONE_D / 2 + 0.002
  phone.add(screen)

  const BASE_SCALE = 0.94 // el canvas sobresale del marco; compensa el tamaño
  phone.scale.setScalar(BASE_SCALE)

  // ---- Explosión de pétalos (compartida) ----
  const burst = createPetalBurst(90)
  scene.add(burst.mesh)

  // ---- Texturas de capturas ----
  let current = 0
  const { textures, dispose: disposeTex } = loadSlideTextures(urls, (tex) => {
    screenUniforms.tFrom.value = tex
    screenUniforms.tTo.value = tex
    opts.onReady?.()
  })

  // ---- Tilt con el cursor + vaivén ----
  const target = { x: 0, y: 0 }
  const fine = window.matchMedia('(pointer: fine)').matches
  const onMove = (e: MouseEvent) => {
    const r = canvas.getBoundingClientRect()
    target.y = ((e.clientX - r.left) / r.width - 0.5) * 0.9
    target.x = ((e.clientY - r.top) / r.height - 0.5) * 0.5
  }
  const onLeave = () => {
    target.x = 0
    target.y = 0
  }
  if (fine && !prefersReducedMotion()) {
    canvas.addEventListener('mousemove', onMove)
    canvas.addEventListener('mouseleave', onLeave)
  }

  function resize() {
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)
    camera.aspect = canvas.clientWidth / Math.max(canvas.clientHeight, 1)
    camera.updateProjectionMatrix()
  }
  const ro = new ResizeObserver(resize)
  ro.observe(canvas)
  resize()

  // ---- Bucle (pausado fuera de viewport) ----
  let running = true
  const io = new IntersectionObserver(([e]) => {
    running = e.isIntersecting
  })
  io.observe(canvas)

  const spin = { value: 0, dip: 0 }
  let raf = 0
  const loop = (now: number) => {
    raf = requestAnimationFrame(loop)
    if (!running) return
    const t = now / 1000
    const idleY = Math.sin(t * 0.5) * 0.1
    const idleX = Math.sin(t * 0.34) * 0.04
    phone.rotation.y += (target.y + idleY + spin.value - phone.rotation.y) * 0.07
    phone.rotation.x += (target.x + idleX - phone.rotation.x) * 0.07
    phone.position.y = Math.sin(t * 0.8) * 0.015
    const s = BASE_SCALE - spin.dip
    phone.scale.setScalar(s)
    renderer.render(scene, camera)
  }
  raf = requestAnimationFrame(loop)

  let tl: gsap.core.Timeline | null = null

  return {
    show(next, dir) {
      const from = textures[current]
      const to = textures[next]
      if (!to || !from || next === current) return
      current = next
      tl?.kill()

      screenUniforms.tFrom.value = from
      screenUniforms.tTo.value = to
      screenUniforms.uDir.value = dir
      screenUniforms.uProgress.value = 0

      burst.mesh.visible = true
      burst.uBurst.value = 0

      tl = gsap
        .timeline({
          onComplete: () => {
            burst.mesh.visible = false
          },
        })
        // Explosión de pétalos
        .to(burst.uBurst, { value: 1, duration: 1.15, ease: 'power2.out' }, 0)
        // Giro completo del teléfono con caída y recuperación de escala
        .to(spin, { value: `+=${dir * Math.PI * 2}`, duration: 1.25, ease: 'osaka' }, 0)
        .to(spin, { dip: 0.07, duration: 0.3, ease: 'power2.in' }, 0)
        .to(spin, { dip: 0, duration: 0.6, ease: 'osaka' }, 0.45)
        // La pantalla se reconstruye con la disolución de pétalos
        .to(screenUniforms.uProgress, { value: 1, duration: 0.9, ease: 'osaka' }, 0.25)
    },
    destroy() {
      tl?.kill()
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      canvas.removeEventListener('mousemove', onMove)
      canvas.removeEventListener('mouseleave', onLeave)
      disposeTex()
      screenUniforms.tMask.value.dispose()
      hankoTex.dispose()
      burst.dispose()
      screenMat.dispose()
      bodyMat.dispose()
      body.geometry.dispose()
      renderer.dispose()
      renderer.forceContextLoss()
    },
  }
}
