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
    index: { es: 'Side projects y más', en: 'Side projects & more' } as L10n,
  },
  hero: {
    intro: { es: 'Portfolio', en: 'Portfolio' } as L10n,
    ctaWork: { es: 'Ver proyectos', en: 'View work' } as L10n,
    ctaContact: { es: 'Contactar', en: 'Get in touch' } as L10n,
    cv: { es: 'Descargar CV', en: 'Download CV' } as L10n,
    since: { es: 'Programando desde', en: 'Coding since' } as L10n,
  },
  process: {
    title: { es: 'Cómo trabajo', en: 'How I work' } as L10n,
    lead: {
      es: 'De idea a producción, sin dejar cabos sueltos.',
      en: 'From idea to production, with no loose ends.',
    } as L10n,
    steps: [
      {
        title: { es: 'Entender el problema', en: 'Understand the problem' } as L10n,
        body: {
          es: 'Hablo con quien va a usarlo. Casi siempre el problema real no es el que se pide.',
          en: 'I talk to whoever will use it. The real problem is rarely the one being asked for.',
        } as L10n,
      },
      {
        title: { es: 'Diseñar lo más simple', en: 'Design the simplest thing' } as L10n,
        body: {
          es: 'La solución que resuelve el problema y nada más. Lo que no se construye no se mantiene.',
          en: 'The solution that solves the problem and nothing else. What you do not build, you do not maintain.',
        } as L10n,
      },
      {
        title: { es: 'Construir', en: 'Build' } as L10n,
        body: {
          es: 'Tipos estrictos, tests donde importan y las garantías empujadas a la capa que no se puede olvidar.',
          en: 'Strict types, tests where they matter, and guarantees pushed down to the layer nobody can forget.',
        } as L10n,
      },
      {
        title: { es: 'Lanzar', en: 'Ship' } as L10n,
        body: {
          es: 'CI en cada push, migraciones aditivas tras feature flags y despliegues que se pueden revertir.',
          en: 'CI on every push, additive migrations behind feature flags, and deploys you can roll back.',
        } as L10n,
      },
      {
        title: { es: 'Medir e iterar', en: 'Measure and iterate' } as L10n,
        body: {
          es: 'Analítica propia y monitorización: decidir sobre datos y no sobre intuiciones.',
          en: 'First-party analytics and monitoring: decide on data, not on hunches.',
        } as L10n,
      },
    ],
  },
  caseStudy: {
    problem: { es: 'El problema', en: 'The problem' } as L10n,
    role: { es: 'Mi rol', en: 'My role' } as L10n,
    decisions: { es: 'Decisiones técnicas', en: 'Technical decisions' } as L10n,
    code: { es: 'Ver código', en: 'View code' } as L10n,
  },
  about: {
    experience: { es: 'Trayectoria', en: 'Experience' } as L10n,
    education: { es: 'Formación', en: 'Education' } as L10n,
  },
  projects: {
    visit: { es: 'Ver proyecto', en: 'View project' } as L10n,
    inProduction: { es: 'En producción', en: 'In production' } as L10n,
    prev: { es: 'Captura anterior', en: 'Previous screenshot' } as L10n,
    next: { es: 'Captura siguiente', en: 'Next screenshot' } as L10n,
  },
  footer: {
    cta: { es: '¿Construimos algo?', en: 'Shall we build something?' } as L10n,
    lead: {
      es: 'Disponible para proyectos y para incorporarme a un equipo. Respondo en menos de 24 h.',
      en: 'Open to projects and to joining a team. I reply within 24 hours.',
    } as L10n,
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
