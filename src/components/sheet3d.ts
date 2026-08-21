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
import { makePetalSprite } from './petalBurst'

// Capturas web como láminas washi flotantes en 3D con tilt hacia el cursor.
// Transición: la lámina se despega y SE METAMORFOSEA en un pétalo de sakura
// que revolotea hacia el fondo y se funde con los pétalos de la página,
// mientras la siguiente captura sube a su sitio.

const sheetVert = /* glsl */ `
uniform float uCurl;
uniform float uDir;
uniform float uTime;
uniform float uMorph;
varying vec2 vUv;

void main() {
  vUv = uv;
  vec3 p = position;
  // Se comba desde el borde de salida y ondea al vuelo
  float c = uDir > 0.0 ? uv.x : 1.0 - uv.x;
  p.z += sin(c * 3.1416) * uCurl * 0.34;
  p.z += sin(uv.y * 6.0 + uTime * 3.0) * uCurl * 0.05;
  // Al volverse pétalo, se ahueca como una cuenca
  p.z += sin(uv.x * 3.1416) * sin(uv.y * 3.1416) * uMorph * 0.2;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
`

const sheetFrag = /* glsl */ `
precision highp float;
uniform sampler2D uTex;
uniform sampler2D uPetal;
uniform float uOpacity;
uniform float uMorph;
varying vec2 vUv;

void main() {
  vec4 tex = texture2D(uTex, vUv);
  // Borde de lámina washi
  float b = 0.012;
  float edge = 1.0 - step(b, vUv.x) * step(vUv.x, 1.0 - b) * step(b, vUv.y) * step(vUv.y, 1.0 - b);
  tex.rgb = mix(tex.rgb, vec3(0.968, 0.949, 0.925), edge);

  // Metamorfosis: la captura se recorta a silueta de pétalo y se tiñe de sakura
  vec4 petal = texture2D(uPetal, vUv);
  float shape = smoothstep(0.12, 0.6, uMorph);
  float tint = smoothstep(0.25, 0.9, uMorph);
  float alpha = mix(1.0, petal.a, shape);
  vec3 col = mix(tex.rgb, petal.rgb, tint);

  if (alpha < 0.02) discard;
  gl_FragColor = vec4(col, alpha * uOpacity);
}
`

interface Sheet {
  mesh: Mesh
  mat: ShaderMaterial
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

  const petalTex = makePetalSprite()

  function makeSheet(): Sheet {
    const mat = new ShaderMaterial({
      vertexShader: sheetVert,
      fragmentShader: sheetFrag,
      uniforms: {
        uTex: { value: null as Texture | null },
        uPetal: { value: petalTex },
        uCurl: { value: 0 },
        uDir: { value: 1 },
        uTime: { value: 0 },
        uOpacity: { value: 1 },
        uMorph: { value: 0 },
      },
      transparent: true,
    })
    const mesh = new Mesh(new PlaneGeometry(1, 1, 28, 28), mat)
    return { mesh, mat }
  }

  let front = makeSheet()
  let back = makeSheet()
  back.mesh.visible = false
  tiltGroup.add(front.mesh, back.mesh)

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
      inc.mesh.position.set(0, -0.12, -0.3)
      inc.mesh.rotation.set(0, 0, 0)
      inc.mat.uniforms.uOpacity.value = 0
      inc.mat.uniforms.uCurl.value = 0
      inc.mat.uniforms.uMorph.value = 0

      out.mat.uniforms.uDir.value = dir
      out.mesh.renderOrder = 2
      inc.mesh.renderOrder = 1

      tl = gsap
        .timeline({
          onComplete: () => {
            out.mesh.visible = false
            out.mesh.position.set(0, 0, 0)
            out.mesh.rotation.set(0, 0, 0)
            out.mat.uniforms.uCurl.value = 0
            out.mat.uniforms.uMorph.value = 0
            out.mat.uniforms.uOpacity.value = 1
          },
        })
        // La lámina se despega y se comba...
        .to(out.mat.uniforms.uCurl, { value: 0.55, duration: 0.4, ease: 'power2.in' }, 0)
        // ...se convierte en pétalo mientras vuela...
        .to(out.mat.uniforms.uMorph, { value: 1, duration: 0.65, ease: 'power1.inOut' }, 0.3)
        .to(out.mesh.scale, { x: 0.17, y: 0.19, duration: 0.95, ease: 'osaka' }, 0.28)
        // ...y revolotea hacia el fondo, entre los pétalos de la página
        .to(
          out.mesh.position,
          { x: dir * 1.7, y: 0.6, z: -1.6, duration: 1.4, ease: 'power1.in' },
          0.15,
        )
        .to(
          out.mesh.rotation,
          { y: dir * 2.1, z: dir * 2.6, x: 0.7, duration: 1.4, ease: 'power1.in' },
          0.15,
        )
        .to(out.mat.uniforms.uCurl, { value: 0.15, duration: 0.5, ease: 'none' }, 0.7)
        .to(out.mat.uniforms.uOpacity, { value: 0, duration: 0.4, ease: 'none' }, 1.1)
        // La siguiente captura sube a su sitio
        .to(inc.mesh.position, { x: 0, y: 0, z: 0, duration: 0.95, ease: 'osaka' }, 0.35)
        .to(inc.mat.uniforms.uOpacity, { value: 1, duration: 0.45, ease: 'none' }, 0.35)

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
      petalTex.dispose()
      front.mat.dispose()
      back.mat.dispose()
      front.mesh.geometry.dispose()
      back.mesh.geometry.dispose()
      renderer.dispose()
      renderer.forceContextLoss()
    },
  }
}
