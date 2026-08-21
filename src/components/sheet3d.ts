import {
  Group,
  Mesh,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Texture,
  WebGLRenderer,
} from 'three'
import { gsap, prefersReducedMotion } from '../motion/gsap'
import { loadSlideTextures } from './slideGl'
import { createPetalBurst } from './petalBurst'

// Capturas web como láminas washi flotantes en 3D:
// tilt hacia el cursor y, al cambiar, la lámina se comba y sale volando
// como papel al viento (con estela de pétalos) mientras la siguiente sube.

const sheetVert = /* glsl */ `
uniform float uCurl;
uniform float uDir;
uniform float uTime;
varying vec2 vUv;

void main() {
  vUv = uv;
  vec3 p = position;
  // Se comba desde el borde de salida y ondea al vuelo
  float c = uDir > 0.0 ? uv.x : 1.0 - uv.x;
  p.z += sin(c * 3.1416) * uCurl * 0.34;
  p.z += sin(uv.y * 6.0 + uTime * 3.0) * uCurl * 0.05;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
`

const sheetFrag = /* glsl */ `
precision highp float;
uniform sampler2D uTex;
uniform float uOpacity;
varying vec2 vUv;

void main() {
  vec4 tex = texture2D(uTex, vUv);
  // Borde de lámina washi
  float b = 0.012;
  float edge = 1.0 - step(b, vUv.x) * step(vUv.x, 1.0 - b) * step(b, vUv.y) * step(vUv.y, 1.0 - b);
  tex.rgb = mix(tex.rgb, vec3(0.968, 0.949, 0.925), edge);
  gl_FragColor = vec4(tex.rgb, uOpacity);
}
`

interface Sheet {
  mesh: Mesh
  mat: ShaderMaterial
}

function makeSheet(): Sheet {
  const mat = new ShaderMaterial({
    vertexShader: sheetVert,
    fragmentShader: sheetFrag,
    uniforms: {
      uTex: { value: null as Texture | null },
      uCurl: { value: 0 },
      uDir: { value: 1 },
      uTime: { value: 0 },
      uOpacity: { value: 1 },
    },
    transparent: true,
  })
  const mesh = new Mesh(new PlaneGeometry(1, 1, 28, 28), mat)
  return { mesh, mat }
}

export interface Sheet3D {
  show: (next: number, dir: 1 | -1) => void
  destroy: () => void
}

export function createSheet3D(
  canvas: HTMLCanvasElement,
  urls: string[],
  opts: { onReady?: () => void },
): Sheet3D {
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  const scene = new Scene()
  const camera = new PerspectiveCamera(30, 1, 0.1, 20)
  camera.position.z = 3

  const tiltGroup = new Group()
  scene.add(tiltGroup)

  let front = makeSheet()
  let back = makeSheet()
  back.mesh.visible = false
  tiltGroup.add(front.mesh, back.mesh)

  const burst = createPetalBurst(70)
  scene.add(burst.mesh)

  let current = 0
  const { textures, dispose: disposeTex } = loadSlideTextures(urls, (tex) => {
    setSheetTexture(front, tex)
    opts.onReady?.()
  })

  // La lámina ES la captura: plano con el aspecto exacto de la imagen (sin recortes)
  function fitScale(tex: Texture): { w: number; h: number } {
    const img = tex.image as HTMLImageElement
    const ia = img.width / img.height
    const vh = 2 * Math.tan((camera.fov * Math.PI) / 360) * camera.position.z
    const vw = vh * camera.aspect
    const maxH = vh * 0.62
    const maxW = vw * 0.74
    const h = Math.min(maxH, maxW / ia)
    return { w: h * ia, h }
  }

  function setSheetTexture(sheet: Sheet, tex: Texture) {
    sheet.mat.uniforms.uTex.value = tex
    const { w, h } = fitScale(tex)
    sheet.mesh.scale.set(w, h, 1)
  }

  // Tilt con el cursor + vaivén
  const target = { x: 0, y: 0 }
  const fine = window.matchMedia('(pointer: fine)').matches
  const onMove = (e: MouseEvent) => {
    const r = canvas.getBoundingClientRect()
    target.y = ((e.clientX - r.left) / r.width - 0.5) * 0.36
    target.x = ((e.clientY - r.top) / r.height - 0.5) * 0.22
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
    const texF = front.mat.uniforms.uTex.value as Texture | null
    if (texF) setSheetTexture(front, texF)
    const texB = back.mat.uniforms.uTex.value as Texture | null
    if (texB) setSheetTexture(back, texB)
  }
  const ro = new ResizeObserver(resize)
  ro.observe(canvas)
  resize()

  let running = true
  const io = new IntersectionObserver(([e]) => {
    running = e.isIntersecting
  })
  io.observe(canvas)

  let raf = 0
  const loop = (now: number) => {
    raf = requestAnimationFrame(loop)
    if (!running) return
    const t = now / 1000
    tiltGroup.rotation.y += (target.y + Math.sin(t * 0.45) * 0.05 - tiltGroup.rotation.y) * 0.07
    tiltGroup.rotation.x += (target.x + Math.sin(t * 0.3) * 0.03 - tiltGroup.rotation.x) * 0.07
    tiltGroup.position.y = Math.sin(t * 0.7) * 0.012
    front.mat.uniforms.uTime.value = t
    back.mat.uniforms.uTime.value = t
    renderer.render(scene, camera)
  }
  raf = requestAnimationFrame(loop)

  let tl: gsap.core.Timeline | null = null

  return {
    show(next, dir) {
      const to = textures[next]
      if (!to || next === current) return
      current = next
      tl?.kill()

      const out = front
      const inc = back
      setSheetTexture(inc, to)
      inc.mesh.visible = true
      inc.mesh.position.set(0, -0.1, -0.3)
      inc.mat.uniforms.uOpacity.value = 0
      inc.mat.uniforms.uCurl.value = 0

      out.mat.uniforms.uDir.value = dir
      out.mesh.renderOrder = 2
      inc.mesh.renderOrder = 1

      burst.mesh.visible = true
      burst.uBurst.value = 0
      burst.setBias(dir * 0.9, 0.2, 0.25)

      tl = gsap
        .timeline({
          onComplete: () => {
            burst.mesh.visible = false
            out.mesh.visible = false
            out.mesh.position.set(0, 0, 0)
            out.mesh.rotation.set(0, 0, 0)
            out.mat.uniforms.uCurl.value = 0
            out.mat.uniforms.uOpacity.value = 1
          },
        })
        // La lámina saliente se comba y vuela con el viento
        .to(out.mat.uniforms.uCurl, { value: 1, duration: 0.55, ease: 'power2.in' }, 0)
        .to(out.mesh.position, { x: dir * 3.4, y: 0.5, z: 0.55, duration: 1.05, ease: 'power2.in' }, 0.05)
        .to(out.mesh.rotation, { y: dir * 1.1, z: dir * 0.28, duration: 1.05, ease: 'power2.in' }, 0.05)
        .to(out.mat.uniforms.uOpacity, { value: 0, duration: 0.3, ease: 'none' }, 0.75)
        // Estela de pétalos
        .to(burst.uBurst, { value: 1, duration: 1.1, ease: 'power2.out' }, 0.1)
        // La entrante sube a su sitio
        .to(inc.mesh.position, { x: 0, y: 0, z: 0, duration: 1.0, ease: 'osaka' }, 0.2)
        .to(inc.mat.uniforms.uOpacity, { value: 1, duration: 0.5, ease: 'none' }, 0.2)

      front = inc
      back = out
    },
    destroy() {
      tl?.kill()
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      canvas.removeEventListener('mousemove', onMove)
      canvas.removeEventListener('mouseleave', onLeave)
      disposeTex()
      burst.dispose()
      front.mat.dispose()
      back.mat.dispose()
      front.mesh.geometry.dispose()
      back.mesh.geometry.dispose()
      renderer.dispose()
      renderer.forceContextLoss()
    },
  }
}
