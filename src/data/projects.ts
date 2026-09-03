import type { L10n } from '../i18n/LangContext'

// Identidad de clima de cada mundo destacado: el ciclo del día (dayCycle)
// tiñe toda la página con estos tonos al entrar en su sección.
export interface ProjectWorld {
  sky: string // fondo de página (siempre claro)
  paper: string // superficies
  accent: string // subrayados, HUD, viñetas
  deep: string // solo display grande
  kanji: string // monograma a escala viewport
}

export interface Project {
  id: string
  featured: boolean
  world?: ProjectWorld
  title: string
  year: string
  kind: L10n
  tagline: L10n
  context: L10n
  result: L10n
  problem?: L10n // qué problema resuelve
  ownership?: L10n // cuál fue mi responsabilidad
  decisions?: L10n[] // decisiones técnicas destacadas
  metric?: L10n // dato de tracción; se muestra solo si existe
  stack: string[]
  images?: string[] // slides del carrusel (/screenshots); sin ellas, layout editorial sin imagen
  frame?: 'phone' // capturas verticales de móvil: se muestran dentro de un teléfono
  url?: string
  repo?: string
}

// featured: true = casos de estudio principales del portfolio.
// El resto aparece en el índice de side projects.
export const projects: Project[] = [
  {
    id: 'mmento',
    featured: true,
    world: {
      sky: '#f1edf7',
      paper: '#eae3f2',
      accent: '#8d7bb8',
      deep: '#584d78',
      kanji: '魔', // magia
    },
    title: 'mmento',
    year: '2023 — ',
    kind: { es: 'App móvil', en: 'Mobile app' },
    tagline: {
      es: 'La app donde los magos guardan sus secretos.',
      en: 'The app where magicians keep their secrets.',
    },
    context: {
      es: 'Cada truco separa el efecto del método, cada uno con su propio vídeo. Buscador semántico sobre más de 20.000 productos de magia y una IA que responde preguntas sobre tu propio repertorio.',
      en: 'Every trick splits the effect from the method, each with its own video. Semantic search across 20,000+ magic products and an AI that answers questions about your own repertoire.',
    },
    result: {
      es: 'Detrás: arquitectura offline-first con cola de sincronización idempotente, búsqueda vectorial con pgvector, vídeo con subidas resumibles a Cloudflare Stream y compras in-app. Actualmente en fase final de desarrollo, con el pipeline de publicación para iOS y Android preparado para su lanzamiento público.',
      en: 'Under the hood: offline-first architecture with an idempotent sync queue, pgvector semantic search, resumable video uploads to Cloudflare Stream and in-app purchases. Currently in the final stage of development, with the iOS/Android release pipeline prepared ahead of public launch.',
    },
    problem: {
      es: 'Un mago guarda su repertorio en libretas, vídeos sueltos y capturas: nada de eso se busca ni se recupera cuando lo necesita sobre el escenario.',
      en: 'Magicians keep their repertoire in notebooks, loose videos and screenshots: none of it is searchable when they need it on stage.',
    },
    ownership: {
      es: 'Cofundador. Todo el código: app React Native, backend, base de datos, publicación en tiendas y el panel de analítica. La UI/UX es en su mayor parte de mi socio.',
      en: 'Co-founder. All the code: React Native app, backend, database, store releases and the analytics panel. UI/UX is mostly my co-founder’s work.',
    },
    decisions: [
      {
        es: 'Offline-first con cola de sincronización idempotente: escribir sin cobertura no puede perder ni duplicar datos.',
        en: 'Offline-first with an idempotent sync queue: writing without signal must never lose or duplicate data.',
      },
      {
        es: 'Búsqueda híbrida con pgvector sobre 20.000 productos: semántica para describir un efecto, léxica para buscarlo por nombre.',
        en: 'Hybrid pgvector search over 20,000 products: semantic to describe an effect, lexical to find it by name.',
      },
      {
        es: 'El cupo de vídeo se firma en el servidor y lo hace cumplir Cloudflare, porque el minuto de vídeo cuesta dinero real.',
        en: 'The video quota is signed server-side and enforced by Cloudflare, because a minute of video costs real money.',
      },
    ],
    stack: ['React Native', 'Expo', 'TypeScript', 'Supabase', 'Cloudflare', 'Sentry'],
    url: 'https://mmentoapp.com',
    images: [
      '/screenshots/mmentomovil1.jpg',
      '/screenshots/mmentomovil2.jpg',
      '/screenshots/mmentomovil3.jpg',
      '/screenshots/mmentomovil4.jpg',
      '/screenshots/mmentomovil5.jpg',
      '/screenshots/mmentomovil6.jpg',
    ],
    frame: 'phone',
  },
  {
    id: 'jornal',
    featured: true,
    world: {
      sky: '#ecf2ee',
      paper: '#e2ece6',
      accent: '#6f9e8f',
      deep: '#3f6e63',
      kanji: '時', // tiempo
    },
    title: 'Jornal',
    year: '2024 — ',
    kind: { es: 'SaaS B2B', en: 'B2B SaaS' },
    tagline: {
      es: 'El control horario que cumple la ley por ti.',
      en: 'Time tracking that handles Spanish labour law for you.',
    },
    context: {
      es: 'Fichajes sellados por el servidor (manual, QR, geovalla o automático), cuadrantes de turnos con plan contra realidad, y vacaciones calculadas sobre el horario real de cada persona.',
      en: 'Server-stamped clock-ins (manual, QR, geofence or automatic), shift planning with plan-vs-reality, and leave computed on each person’s actual schedule.',
    },
    result: {
      es: 'Detrás: multi-tenant con aislamiento RLS probado por scripts que intentan romperlo, inmutabilidad y auditoría append-only a nivel de base de datos, backups verificados restaurándolos y 112 migraciones aditivas tras feature flags. Actualmente se está preparando para su lanzamiento comercial tras evolucionar desde una solución nacida de necesidades operativas reales.',
      en: 'Under the hood: multi-tenant RLS isolation proven by scripts that try to break it, database-level immutability with append-only auditing, backups verified by restoring them, and 112 additive migrations behind feature flags. Currently being prepared for commercial launch after evolving from a solution built around real operational needs.',
    },
    problem: {
      es: 'El registro horario es obligatorio en España y la mayoría de pymes lo resuelve con hojas de cálculo que no aguantan una inspección.',
      en: 'Spain mandates time-tracking, and most SMBs solve it with spreadsheets that would not survive a labour inspection.',
    },
    ownership: {
      es: 'Fundador y CTO. Producto, arquitectura y todo el código: web, app móvil, base de datos y la operación completa (CI, backups, correo, cumplimiento legal).',
      en: 'Founder and CTO. Product, architecture and all the code: web, mobile app, database and the entire operation (CI, backups, email, legal compliance).',
    },
    decisions: [
      {
        es: 'Las garantías viven en la base de datos, no en el código: triggers que impiden borrar un fichaje y auditoría append-only que nadie puede reescribir.',
        en: 'Guarantees live in the database, not the code: triggers that forbid deleting an entry and append-only auditing nobody can rewrite.',
      },
      {
        es: '40+ scripts levantan un PostgreSQL real en proceso (PGlite/WASM) y ejecutan las migraciones de verdad en ~45 s, sin Docker ni mocks.',
        en: '40+ scripts spin up a real in-process PostgreSQL (PGlite/WASM) and run the actual migrations in ~45s, with no Docker and no mocks.',
      },
      {
        es: 'Un script se autentica como empleado de una empresa e intenta leer y escribir en otra: si el aislamiento se rompe, falla el CI.',
        en: 'A script authenticates as one company’s employee and tries to read and write into another: if isolation breaks, CI fails.',
      },
    ],
    stack: ['Next.js 15', 'TypeScript', 'Supabase', 'PostgreSQL + RLS', 'Expo', 'Vitest'],
    url: 'https://jornal.work',
    images: [
      '/screenshots/jornal.webp',
      '/screenshots/Jornal1.png',
      '/screenshots/Jornal2.png',
      '/screenshots/Jornal3.png',
      '/screenshots/Jornal4.png',
      '/screenshots/Jornal5.png',
    ],
  },
  {
    id: 'mmento-analytics',
    featured: true,
    world: {
      sky: '#f7f0e2',
      paper: '#f1e7d3',
      accent: '#b99a66',
      deep: '#7d6538',
      kanji: '数', // números
    },
    title: 'mmento Analytics',
    year: '2025',
    kind: { es: 'Dashboard', en: 'Dashboard' },
    tagline: {
      es: 'Dashboard de producto: retención, cohortes y salud de la búsqueda.',
      en: 'Product dashboard: retention, cohorts and search health.',
    },
    context: {
      es: 'Panel interno de analítica de mmento: DAU/WAU/MAU, retención por cohortes, embudo de búsqueda y monetización sobre la base de datos de producción.',
      en: "mmento's internal product analytics: DAU/WAU/MAU, cohort retention, search funnel and monetization over the production database.",
    },
    result: {
      es: 'Detrás: la analítica vive en 34 funciones de Postgres (6.400 líneas de SQL), con cohortes calculadas en vivo para poder excluir cuentas de test de numerador y denominador, rate limiting con Redis y auditoría de cada mutación.',
      en: 'Under the hood: the analytics live in 34 Postgres functions (6,400 lines of SQL), with cohorts computed live so test accounts can be excluded from numerator and denominator alike, Redis rate limiting and an audit log on every mutation.',
    },
    problem: {
      es: 'Sin datos propios, las decisiones de producto de mmento se tomaban por intuición: no sabíamos qué se buscaba, qué no se encontraba ni quién volvía.',
      en: 'Without first-party data, mmento product decisions were guesswork: we did not know what users searched, what they failed to find, or who came back.',
    },
    ownership: {
      es: 'Todo el código y el modelo de datos analítico. La UI/UX es en su mayor parte de mi socio.',
      en: 'All the code and the analytics data model. UI/UX is mostly my co-founder’s work.',
    },
    decisions: [
      {
        es: 'La analítica se calcula en Postgres, no en el cliente: 34 funciones y ~6.400 líneas de SQL que el panel solo consume.',
        en: 'Analytics is computed in Postgres, not on the client: 34 functions and ~6,400 lines of SQL the panel merely consumes.',
      },
      {
        es: 'Desmaterialicé las vistas de cohortes: un agregado precalculado no permite excluir cuentas de test y mezclaba cifras filtradas con sin filtrar.',
        en: 'I de-materialized the cohort views: a precomputed aggregate cannot exclude test accounts and was mixing filtered with unfiltered numbers.',
      },
    ],
    stack: ['Next.js 16', 'TanStack Query', 'Recharts', 'Supabase', 'Upstash Redis'],
    images: ['/screenshots/mmentoadmin1.png'],
  },
  {
    id: 'agent-alpha',
    featured: false,
    title: 'Agent Alpha',
    year: '2026',
    kind: { es: 'Agentes IA', en: 'AI agents' },
    tagline: {
      es: 'Plataforma de agentes autónomos con el riesgo fuera del LLM.',
      en: 'Autonomous agent platform with risk kept outside the LLM.',
    },
    context: {
      es: 'Pipeline LangGraph de 13 nodos que analiza mercados cripto y propone operaciones. El agente sugiere; ejecutar es otra historia.',
      en: 'A 13-node LangGraph pipeline that analyzes crypto markets and proposes trades. The agent suggests; executing is another story.',
    },
    result: {
      es: 'Detrás: un motor de riesgo determinista con 14 vetos entre la propuesta del LLM y la orden, doble confirmación para el modo live y anti-replay garantizado con un UNIQUE en Postgres, no con un check en memoria.',
      en: 'Under the hood: a deterministic risk engine with 14 vetoes between the LLM proposal and the order, double confirmation for live mode, and replay protection enforced by a Postgres UNIQUE constraint, not an in-memory check.',
    },
    stack: ['TypeScript', 'LangGraph', 'Fastify', 'Prisma', 'Turborepo', 'Docker'],
  },
  {
    id: 'sla-refunds',
    featured: false,
    title: 'SLA Refunds',
    year: '2025',
    kind: { es: 'Microservicios', en: 'Microservices' },
    tagline: {
      es: 'Reclamación automática de reembolsos por SLA incumplido.',
      en: 'Automatic refund claims for breached carrier SLAs.',
    },
    context: {
      es: 'Detecta incumplimientos de SLA de UPS, DHL, FedEx, GLS y SEUR proyectando la entrega en días hábiles con festivos por país, y reclama el reembolso al transportista.',
      en: 'Detects SLA breaches across UPS, DHL, FedEx, GLS and SEUR by projecting delivery in business days with per-country holidays, then claims the refund.',
    },
    result: {
      es: 'Detrás: 13 microservicios NestJS sobre NATS con 6 streams tipados, dead-letter queue que persiste cada evento fallido con su payload, credenciales de transportista cifradas con AES-256-GCM y multi-tenancy por RLS.',
      en: 'Under the hood: 13 NestJS microservices on NATS with 6 typed streams, a dead-letter queue persisting every failed event with its payload, carrier credentials encrypted with AES-256-GCM and RLS multi-tenancy.',
    },
    stack: ['NestJS', 'NATS', 'Next.js', 'Supabase', 'OpenTelemetry', 'Docker'],
  },
  {
    id: 'wa-crm',
    featured: false,
    title: 'WhatsApp CRM',
    year: '2026',
    kind: { es: 'SaaS B2B', en: 'B2B SaaS' },
    tagline: {
      es: 'CRM multi-tenant sobre WhatsApp Business.',
      en: 'Multi-tenant CRM built on WhatsApp Business.',
    },
    context: {
      es: 'Inbox compartido entre agentes sobre la API de WhatsApp Business: pipeline de leads, asignación de conversaciones y recordatorios con colas.',
      en: 'Shared agent inbox on the WhatsApp Business API: lead pipeline, conversation assignment and queue-driven reminders.',
    },
    result: {
      es: 'Detrás: el aislamiento entre negocios no depende de ningún WHERE: 40 políticas RLS en Postgres, jerarquía de roles resuelta en SQL y un webhook que responde a Meta al instante y procesa en background con BullMQ.',
      en: 'Under the hood: business isolation never rides on a WHERE clause: 40 Postgres RLS policies, a role hierarchy resolved in SQL, and a webhook that acks Meta instantly and processes in the background with BullMQ.',
    },
    stack: ['Next.js', 'NestJS', 'BullMQ', 'Redis', 'Supabase', 'Turborepo'],
  },
  {
    id: 'quant-lab',
    featured: false,
    title: 'Quant Lab',
    year: '2025-2026',
    kind: { es: 'Side project · Trading', en: 'Side project · Trading' },
    tagline: {
      es: 'Cinco sistemas de trading con la misma obsesión: el riesgo primero.',
      en: 'Five trading systems sharing one obsession: risk first.',
    },
    context: {
      es: 'Bots sobre Polymarket, Binance y Solana: modelos de probabilidad propios (incluido un ensemble de 4 modelos meteorológicos donde el desacuerdo es la incertidumbre), sizing por Kelly fraccionario capado y kill switches por drawdown.',
      en: 'Bots on Polymarket, Binance and Solana: home-grown probability models (including a 4-model weather ensemble where disagreement is the uncertainty), capped fractional-Kelly sizing and drawdown kill switches.',
    },
    result: {
      es: 'Detrás: cada decisión de NO operar queda registrada con su motivo (drawdown, límite horario, favorito cambiado) en un diario de 6.545 eventos que anota hasta el desfase Chainlink-Binance por apuesta. Sistemas auditables, no cajas negras.',
      en: 'Under the hood: every decision NOT to trade is logged with its reason (drawdown, hourly cap, flipped favorite) in a 6,545-event journal that even records the per-bet Chainlink-Binance gap. Auditable systems, not black boxes.',
    },
    stack: ['Python', 'FastAPI', 'CCXT', 'WebSockets', 'Polygon', 'Solana'],
  },
]
