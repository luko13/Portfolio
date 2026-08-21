import {
  AmbientLight,
  CanvasTexture,
  Color,
  DirectionalLight,
  Group,
  InstancedBufferAttribute,
  InstancedBufferGeometry,
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
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { gsap, prefersReducedMotion } from '../motion/gsap'
import { slideFrag, makePetalMask, loadSlideTextures } from './slideGl'

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

// Sprite de pétalo para la explosión
function makePetalSprite(): CanvasTexture {
  const s = 64
  const c = document.createElement('canvas')
  c.width = c.height = s
  const ctx = c.getContext('2d')!
  ctx.translate(s / 2, s / 2)
  ctx.scale(s / 30, s / 30)
  ctx.translate(-12, -14)
  const grad = ctx.createRadialGradient(12, 8, 1, 12, 14, 16)
  grad.addColorStop(0, '#f6dde3')
  grad.addColorStop(1, '#e8a7b7')
  ctx.fillStyle = grad
  ctx.beginPath()
  ctx.moveTo(12, 27)
  ctx.bezierCurveTo(2, 20, 1, 9, 8, 3)
  ctx.quadraticCurveTo(10, 1.4, 12, 4)
  ctx.quadraticCurveTo(14, 1.4, 16, 3)
  ctx.bezierCurveTo(23, 9, 22, 20, 12, 27)
  ctx.closePath()
  ctx.fill()
  return new CanvasTexture(c)
}

const burstVert = /* glsl */ `
uniform float uBurst;
attribute vec3 aDir;
attribute float aSpd;
attribute vec3 aRot;
attribute float aSize;
varying vec2 vUv;
varying float vFade;

mat3 rotX(float a){ float c=cos(a), s=sin(a); return mat3(1.,0.,0., 0.,c,-s, 0.,s,c); }
mat3 rotY(float a){ float c=cos(a), s=sin(a); return mat3(c,0.,s, 0.,1.,0., -s,0.,c); }
mat3 rotZ(float a){ float c=cos(a), s=sin(a); return mat3(c,-s,0., s,c,0., 0.,0.,1.); }

void main() {
  vUv = uv;
  float t = uBurst;
  float travel = pow(t, 0.55) * aSpd;
  vec3 center = aDir * travel;
  center.y -= t * t * 0.35; // ligera gravedad

  float grow = sin(min(t * 1.2, 1.0) * 3.1416);
  vFade = 1.0 - smoothstep(0.55, 1.0, t);

  float a1 = aRot.x * 6.2832 + t * (4.0 + aRot.y * 6.0);
  float a2 = aRot.z * 6.2832 + t * 5.0;
  vec3 p = rotY(a1) * rotX(a2) * rotZ(a1 * 0.5) * (position * aSize * grow);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(center + p, 1.0);
}
`

const burstFrag = /* glsl */ `
precision highp float;
uniform sampler2D uTex;
varying vec2 vUv;
varying float vFade;
void main() {
  vec4 tex = texture2D(uTex, vUv);
  if (tex.a < 0.05) discard;
  gl_FragColor = vec4(tex.rgb, tex.a * vFade);
}
`

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
    uEdge: { value: new Color('#e8a7b7') },
  }
  const screenMat = new ShaderMaterial({
    vertexShader: /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: slideFrag,
    uniforms: screenUniforms,
  })
  const screen = new Mesh(new PlaneGeometry(PHONE_W - 0.045, PHONE_H - 0.045), screenMat)
  screen.position.z = PHONE_D / 2 + 0.002
  phone.add(screen)

  const BASE_SCALE = 1.1
  phone.scale.setScalar(BASE_SCALE)

  // ---- Explosión de pétalos ----
  const COUNT = 90
  const base = new PlaneGeometry(0.085, 0.1)
  const burstGeo = new InstancedBufferGeometry()
  burstGeo.index = base.index
  burstGeo.attributes.position = base.attributes.position
  burstGeo.attributes.uv = base.attributes.uv
  const dirs = new Float32Array(COUNT * 3)
  const spds = new Float32Array(COUNT)
  const rots = new Float32Array(COUNT * 3)
  const sizes = new Float32Array(COUNT)
  for (let i = 0; i < COUNT; i++) {
    // dirección aleatoria en esfera, sesgada hacia el plano frontal
    const th = Math.random() * Math.PI * 2
    const ph = Math.acos(2 * Math.random() - 1)
    dirs[i * 3] = Math.sin(ph) * Math.cos(th) * 1.2
    dirs[i * 3 + 1] = Math.cos(ph) * 1.4
    dirs[i * 3 + 2] = Math.sin(ph) * Math.sin(th) * 0.9 + 0.35
    spds[i] = 0.55 + Math.random() * 0.9
    rots[i * 3] = Math.random()
    rots[i * 3 + 1] = Math.random()
    rots[i * 3 + 2] = Math.random()
    sizes[i] = 0.55 + Math.random() * 1.0
  }
  burstGeo.setAttribute('aDir', new InstancedBufferAttribute(dirs, 3))
  burstGeo.setAttribute('aSpd', new InstancedBufferAttribute(spds, 1))
  burstGeo.setAttribute('aRot', new InstancedBufferAttribute(rots, 3))
  burstGeo.setAttribute('aSize', new InstancedBufferAttribute(sizes, 1))
  burstGeo.instanceCount = COUNT

  const petalTex = makePetalSprite()
  const burstMat = new ShaderMaterial({
    vertexShader: burstVert,
    fragmentShader: burstFrag,
    uniforms: { uBurst: { value: 1 }, uTex: { value: petalTex } },
    transparent: true,
    depthWrite: false,
  })
  const burst = new Mesh(burstGeo, burstMat)
  burst.frustumCulled = false
  burst.visible = false
  scene.add(burst)

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

      burst.visible = true
      burstMat.uniforms.uBurst.value = 0

      tl = gsap
        .timeline({
          onComplete: () => {
            burst.visible = false
          },
        })
        // Explosión de pétalos
        .to(burstMat.uniforms.uBurst, { value: 1, duration: 1.15, ease: 'power2.out' }, 0)
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
      petalTex.dispose()
      hankoTex.dispose()
      burstGeo.dispose()
      burstMat.dispose()
      screenMat.dispose()
      bodyMat.dispose()
      body.geometry.dispose()
      renderer.dispose()
      renderer.forceContextLoss()
    },
  }
}
