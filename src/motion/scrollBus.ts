// Estado de scroll compartido entre Lenis (escritor) y la escena sakura (lector).
// Evita acoplar el canvas a React: la escena lo lee cada frame.
export const scrollBus = {
  velocity: 0, // px/frame suavizado por Lenis
  progress: 0, // 0..1 del documento
  calm: 0, // 0..1, sube al llegar al footer para amainar el viento
  gust: 0, // ráfaga puntual (transiciones del carrusel); decae en la escena
}
