// Compuerta de intro: el hero espera a que el preloader termine.
let resolveIntro: () => void = () => {}
let done = false

export const introDone = new Promise<void>((r) => {
  resolveIntro = r
})

export function finishIntro() {
  done = true
  resolveIntro()
}

export const introFinished = () => done
