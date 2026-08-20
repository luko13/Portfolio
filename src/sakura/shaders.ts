export const vertexShader = /* glsl */ `
uniform float uTime;
uniform float uScroll;      // velocidad de scroll suavizada
uniform float uCalm;        // 0..1, amaina el viento en el footer
uniform vec2 uMouse;        // posición del cursor en coords de mundo
uniform float uMouseActive; // 0/1
uniform vec2 uArea;         // volumen de wrap (ancho/alto en mundo)

attribute vec4 aRand;       // 4 aleatorios 0..1 por instancia
attribute float aSize;

varying vec2 vUv;
varying float vShade;
varying float vTint;
varying float vAlpha;
varying float vVariant;

mat3 rotX(float a){ float c=cos(a), s=sin(a); return mat3(1.,0.,0., 0.,c,-s, 0.,s,c); }
mat3 rotY(float a){ float c=cos(a), s=sin(a); return mat3(c,0.,s, 0.,1.,0., -s,0.,c); }
mat3 rotZ(float a){ float c=cos(a), s=sin(a); return mat3(c,-s,0., s,c,0., 0.,0.,1.); }

void main() {
  vUv = uv;
  vVariant = floor(aRand.x * 2.999);
  vTint = aRand.y;

  float wind = uScroll * (1.0 - uCalm);
  float t = uTime;

  // Caída: cada pétalo con su velocidad; el scroll acelera la caída
  float speed = mix(0.25, 0.75, aRand.x);
  float fall = t * speed + wind * 0.02;
  float y = mod(aRand.z * uArea.y - fall, uArea.y) - uArea.y * 0.5;

  // Deriva horizontal + balanceo con dos senos desfasados
  float sway = sin(t * (0.5 + aRand.w * 0.8) + aRand.x * 6.2832) * (0.25 + 0.45 * aRand.w)
             + sin(t * 0.23 + aRand.y * 6.2832) * 0.3;
  float drift = t * (0.06 + 0.12 * aRand.x) + wind * -0.012;
  float x = mod(aRand.w * uArea.x + drift, uArea.x) - uArea.x * 0.5 + sway;

  float z = mix(-5.5, 1.4, aRand.y);
  vec3 iPos = vec3(x, y, z);

  // Repulsión suave del cursor
  if (uMouseActive > 0.5) {
    vec2 d = iPos.xy - uMouse;
    float dist = length(d);
    float radius = 2.2;
    float push = smoothstep(radius, 0.0, dist);
    iPos.xy += (d / max(dist, 0.001)) * push * 1.1;
  }

  // Volteo local del pétalo (tumble 3D)
  float a1 = t * (0.7 + aRand.x * 1.1) + aRand.y * 6.2832 + wind * 0.004;
  float a2 = t * (0.5 + aRand.w * 0.9) + aRand.z * 6.2832;
  vec3 p = position * aSize;
  p.z += 0.18 * aSize * sin(uv.x * 3.1416); // curvatura de cuenca
  p = rotY(a1) * rotX(a2) * rotZ(a1 * 0.35) * p;

  // Sombreado barato según orientación
  vShade = 0.88 + 0.12 * sin(a1 + a2);

  // Los lejanos se desvanecen hacia el papel
  vAlpha = mix(0.35, 0.95, smoothstep(-5.5, 1.4, z));

  gl_Position = projectionMatrix * modelViewMatrix * vec4(iPos + p, 1.0);
}
`

export const fragmentShader = /* glsl */ `
uniform sampler2D uTex;
uniform vec3 uColorA; // sakura claro
uniform vec3 uColorB; // sakura profundo
uniform vec3 uColorC; // casi blanco

varying vec2 vUv;
varying float vShade;
varying float vTint;
varying float vAlpha;
varying float vVariant;

void main() {
  vec2 uvA = vec2((vUv.x + vVariant) / 3.0, vUv.y);
  vec4 tex = texture2D(uTex, uvA);
  if (tex.a < 0.05) discard;

  // Tres familias de tinte: claro, profundo, casi blanco
  vec3 col = vTint < 0.22 ? uColorB : (vTint < 0.7 ? uColorA : uColorC);
  col *= vShade;

  gl_FragColor = vec4(col, tex.a * vAlpha);
}
`
