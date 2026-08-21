import {
  CanvasTexture,
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  Mesh,
  PlaneGeometry,
  ShaderMaterial,
  Vector3,
} from 'three'

// Ráfaga 3D de pétalos instanciados, compartida por el iPhone y las láminas web.

export function makePetalSprite(): CanvasTexture {
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

const vert = /* glsl */ `
uniform float uBurst;
uniform vec3 uBias;
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
  vec3 center = (aDir + uBias) * travel;
  center.y -= t * t * 0.35; // ligera gravedad

  float grow = sin(min(t * 1.2, 1.0) * 3.1416);
  vFade = 1.0 - smoothstep(0.55, 1.0, t);

  float a1 = aRot.x * 6.2832 + t * (4.0 + aRot.y * 6.0);
  float a2 = aRot.z * 6.2832 + t * 5.0;
  vec3 p = rotY(a1) * rotX(a2) * rotZ(a1 * 0.5) * (position * aSize * grow);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(center + p, 1.0);
}
`

const frag = /* glsl */ `
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

export interface PetalBurst {
  mesh: Mesh
  uBurst: { value: number }
  setBias: (x: number, y: number, z: number) => void
  dispose: () => void
}

export function createPetalBurst(count = 90): PetalBurst {
  const base = new PlaneGeometry(0.085, 0.1)
  const geo = new InstancedBufferGeometry()
  geo.index = base.index
  geo.attributes.position = base.attributes.position
  geo.attributes.uv = base.attributes.uv

  const dirs = new Float32Array(count * 3)
  const spds = new Float32Array(count)
  const rots = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  for (let i = 0; i < count; i++) {
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
  geo.setAttribute('aDir', new InstancedBufferAttribute(dirs, 3))
  geo.setAttribute('aSpd', new InstancedBufferAttribute(spds, 1))
  geo.setAttribute('aRot', new InstancedBufferAttribute(rots, 3))
  geo.setAttribute('aSize', new InstancedBufferAttribute(sizes, 1))
  geo.instanceCount = count

  const tex = makePetalSprite()
  const mat = new ShaderMaterial({
    vertexShader: vert,
    fragmentShader: frag,
    uniforms: { uBurst: { value: 1 }, uTex: { value: tex }, uBias: { value: new Vector3() } },
    transparent: true,
    depthWrite: false,
  })
  const mesh = new Mesh(geo, mat)
  mesh.frustumCulled = false
  mesh.visible = false

  return {
    mesh,
    uBurst: mat.uniforms.uBurst,
    setBias(x, y, z) {
      ;(mat.uniforms.uBias.value as Vector3).set(x, y, z)
    },
    dispose() {
      geo.dispose()
      mat.dispose()
      tex.dispose()
    },
  }
}
