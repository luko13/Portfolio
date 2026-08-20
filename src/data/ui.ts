import type { L10n } from '../i18n/LangContext'

// Strings de interfaz. Todo lo visible que no sea contenido de proyectos/perfil.
export const ui = {
  nav: {
    about: { es: 'Sobre mí', en: 'About' } as L10n,
    skills: { es: 'Habilidades', en: 'Skills' } as L10n,
    projects: { es: 'Proyectos', en: 'Work' } as L10n,
    contact: { es: 'Contacto', en: 'Contact' } as L10n,
  },
  sections: {
    about: { es: 'Sobre mí', en: 'About me' } as L10n,
    skills: { es: 'Habilidades', en: 'Skills' } as L10n,
    projects: { es: 'Proyectos destacados', en: 'Selected work' } as L10n,
    index: { es: 'Más proyectos', en: 'More projects' } as L10n,
  },
  hero: {
    intro: { es: 'Portfolio', en: 'Portfolio' } as L10n,
  },
  projects: {
    visit: { es: 'Ver proyecto', en: 'View project' } as L10n,
    inProduction: { es: 'En producción', en: 'In production' } as L10n,
  },
  footer: {
    cta: { es: 'Hablemos', en: "Let's talk" } as L10n,
    copied: { es: 'Copiado', en: 'Copied' } as L10n,
    copyEmail: { es: 'Copiar email', en: 'Copy email' } as L10n,
    colophon: {
      es: 'Diseñado y construido a mano con React, GSAP y Three.js.',
      en: 'Designed and built by hand with React, GSAP and Three.js.',
    } as L10n,
  },
  a11y: {
    langToggle: { es: 'Cambiar idioma', en: 'Switch language' } as L10n,
    petals: { es: 'Animación decorativa de pétalos de sakura', en: 'Decorative sakura petal animation' } as L10n,
  },
}
