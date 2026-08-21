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
    es: 'Full-stack developer. Fundador de Jornal y cofundador de MMENTO: SaaS y apps móviles en producción con clientes reales.',
    en: 'Full-stack developer. Founder of Jornal and co-founder of MMENTO: SaaS and mobile apps in production with real customers.',
  } as L10n,

  bio1: {
    es: 'Soy desarrollador full-stack y construyo aplicaciones de principio a fin: entender el problema, diseñar la solución más simple que lo resuelva y llevarla hasta producción. Fundé Jornal, un SaaS de gestión laboral con clientes de pago, y cofundé MMENTO, una app iOS/Android publicada en ambas tiendas.',
    en: 'I am a full-stack developer and I build applications end to end: understand the problem, design the simplest solution that solves it, and take it to production. I founded Jornal, a workforce SaaS with paying customers, and co-founded MMENTO, an iOS/Android app live on both stores.',
  } as L10n,
  bio2: {
    es: 'Me obsesiona lo que no se ve: aislamiento multi-tenant verificado por scripts que intentan romperlo, migraciones probadas contra un motor de base de datos real y backups que se prueban restaurándolos. De fondo, side projects de trading algorítmico y agentes de IA donde experimento sin red.',
    en: 'I obsess over what you cannot see: multi-tenant isolation verified by scripts that try to break it, migrations tested against a real database engine, and backups proven by restoring them. On the side, algorithmic trading and AI agent projects where I experiment freely.',
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
    title: { es: 'Fundador y CTO', en: 'Founder & CTO' },
    period: '2024 — ',
    note: {
      es: 'SaaS de gestión laboral en producción con clientes de pago: web, app móvil y toda la operación.',
      en: 'Workforce SaaS in production with paying customers: web, mobile app and the whole operation.',
    },
  },
  {
    org: 'MMENTO',
    title: { es: 'Cofundador y full-stack', en: 'Co-founder & full-stack' },
    period: '2025 — ',
    note: {
      es: 'App iOS/Android publicada en ambas tiendas, más su panel interno de analítica.',
      en: 'iOS/Android app live on both stores, plus its internal analytics panel.',
    },
  },
  {
    org: 'Fuenlegal SL',
    title: { es: 'Desarrollador full-stack', en: 'Full-stack developer' },
    period: '2022 — ',
    note: {
      es: 'App interna de control horario y tareas, en uso diario por la plantilla.',
      en: 'Internal time-tracking and task app, used daily by the staff.',
    },
  },
  {
    org: 'Japify',
    title: { es: 'Desarrollador móvil', en: 'Mobile developer' },
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
