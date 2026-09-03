import type { L10n } from '../i18n/LangContext'

// Todo el contenido personal vive aquí. Edita libremente.
export const profile = {
  handle: 'luko13',
  realName: 'Luis Santiago Chillón Serratosa',

  // Propuesta de valor: qué construyo, no qué etiqueta llevo
  headline: {
    es: 'Construyo productos web completos, de la interfaz a la infraestructura.',
    en: 'I build complete web products, from the interface to the infrastructure.',
  } as L10n,
  role: {
    es: 'Software Engineer especializado en React Native, TypeScript, React, Next.js y PostgreSQL. Fundador de Jornal y cofundador de MMENTO.',
    en: 'Software Engineer specializing in React Native, TypeScript, React, Next.js and PostgreSQL. Founder of Jornal and co-founder of MMENTO.',
  } as L10n,

  bio1: {
    es: 'Soy Software Engineer y construyo productos de principio a fin: entender el problema, diseñar la solución más simple que lo resuelva y llevarla hasta producción. Fundé Jornal, un SaaS de gestión laboral que estoy preparando para su lanzamiento comercial, y cofundé MMENTO, una app iOS/Android en fase final de desarrollo.',
    en: 'I am a Software Engineer and I build products end to end: understand the problem, design the simplest solution that solves it, and take it to production. I founded Jornal, a workforce SaaS currently being prepared for commercial launch, and co-founded MMENTO, an iOS/Android app in the final stage of development.',
  } as L10n,
  bio2: {
    es: 'Me importa especialmente lo que no se ve: aislamiento multi-tenant verificado intentando romperlo, migraciones probadas contra un motor de base de datos real y backups validados mediante restauraciones. Intento que las garantías importantes vivan en el sistema y no dependan únicamente de que el código de aplicación se comporte bien.',
    en: 'I care especially about what you cannot see: multi-tenant isolation verified by trying to break it, migrations tested against a real database engine, and backups validated through actual restores. I try to make important guarantees live in the system rather than depending solely on application code behaving correctly.',
  } as L10n,

  codingSince: 2022,
  email: 'luislk1996chs@gmail.com',
  location: { es: 'Fuengirola, Málaga', en: 'Fuengirola, Spain' } as L10n,
  timezone: 'Europe/Madrid',
  cv: { es: '/CV_Luis_Chillon_ES.pdf', en: '/CV_Luis_Chillon_EN.pdf' } as L10n,
  socials: [
    { label: 'GitHub', url: 'https://github.com/luko13' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/luis-chill%C3%B3n-serratosa-00735486/' },
  ],
}

// Trayectoria (todo verificable en el CV). Añade aquí nuevas entradas.
export interface Role {
  org: string
  title: L10n
  period: string
  note: L10n
}

export const experience: Role[] = [
  {
    org: 'Jornal',
    title: { es: 'Fundador y CTO · Software Engineer', en: 'Founder & CTO · Hands-on Software Engineer' },
    period: '2024 — ',
    note: {
      es: 'SaaS de gestión laboral nacido de necesidades operativas reales, en preparación para su lanzamiento comercial: web, app móvil y toda la operación.',
      en: 'Workforce SaaS born from real operational needs, being prepared for commercial launch: web, mobile app and the whole operation.',
    },
  },
  {
    org: 'MMENTO',
    title: { es: 'Cofundador y CTO · Lead React Native Engineer', en: 'Co-Founder & CTO · Lead React Native Engineer' },
    period: '2023 — ',
    note: {
      es: 'App iOS/Android en fase final de desarrollo, con el pipeline de publicación preparado, más su panel interno de analítica.',
      en: 'iOS/Android app in the final stage of development, with the release pipeline ready, plus its internal analytics panel.',
    },
  },
  {
    org: 'Fuenlegal SL',
    title: { es: 'Auxiliar administrativo · Digitalización', en: 'Administrative Assistant · Digitalization Support' },
    period: '2022 — ',
    note: {
      es: 'Rol administrativo con responsabilidad adicional en digitalización y mejora de procesos; de ahí nació Jornal.',
      en: 'Administrative role with additional responsibility for digitalization and process improvement; this is where Jornal originated.',
    },
  },
  {
    org: 'Japify',
    title: { es: 'React Native Engineer · Contrato', en: 'React Native Engineer · Contract' },
    period: '2024',
    note: {
      es: 'App móvil de cero en 3 meses en solitario: auth, chat en tiempo real y emparejamiento.',
      en: 'Mobile app from scratch in 3 months, solo: auth, realtime chat and matching.',
    },
  },
  {
    org: 'Not a Serious Game Studio',
    title: { es: 'Líder de equipo', en: 'Team lead' },
    period: '2019 — 2021',
    note: {
      es: 'Lideré un equipo de 5 para lanzar Agent-00 en Steam (Unreal Engine 4).',
      en: 'Led a team of 5 to ship Agent-00 on Steam (Unreal Engine 4).',
    },
  },
]

export const education = [
  {
    org: 'MEDAC',
    title: { es: 'FP Superior en Desarrollo de Aplicaciones Web', en: 'Advanced VET in Web Application Development' } as L10n,
    period: '2022 — 2024',
  },
  {
    org: 'U-TAD',
    title: { es: 'Grado en Diseño de Productos Interactivos', en: 'BA in Interactive Product Design' } as L10n,
    period: '2014 — 2018',
  },
]
