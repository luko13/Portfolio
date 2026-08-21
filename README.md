# luko13 · Portfolio

Portfolio personal single-page con estética japonesa de hanami: pétalos de sakura en WebGL sobre papel washi, bilingüe ES/EN y sin backend.

## Stack

- **React 19 + Vite + TypeScript**
- **GSAP** (ScrollTrigger, SplitText, CustomEase): un único sistema de easing en todo el sitio
- **Lenis**: smooth scroll sincronizado con ScrollTrigger
- **Three.js**: pétalos con `InstancedBufferGeometry` y movimiento 100% en GPU (4 uniforms por frame), cargado con `import()` dinámico en chunk aparte
- **i18n propio** (~40 líneas): tipo `L10n = { es, en }` con el contenido de ambos idiomas junto en `src/data/`

## Detalles

- Preloader con sello hanko y contador ligado a la carga real (fuentes + chunk 3D), solo la primera visita por sesión
- Los pétalos reaccionan al scroll (viento por velocidad de Lenis) y al cursor (repulsión en el vertex shader), y amainan al llegar al footer
- Degradación por niveles: menos instancias y sin cursor en móvil, pétalos estáticos con `prefers-reduced-motion`, gradiente sin WebGL2
- Todo el contenido (proyectos, bio, skills, strings de UI) vive en `src/data/`, editable sin tocar componentes

## Desarrollo

```bash
npm install
npm run dev
```

`npm run build` genera el estático en `dist/` (deploy pensado para Vercel).
