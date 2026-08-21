import type { L10n } from '../i18n/LangContext'

export interface Project {
  id: string
  featured: boolean
  title: string
  year: string
  kind: L10n
  tagline: L10n
  context: L10n
  result: L10n
  stack: string[]
  images?: string[] // slides del carrusel (/screenshots); sin ellas, layout editorial sin imagen
  frame?: 'phone' // capturas verticales de móvil: se muestran dentro de un teléfono
  url?: string
  repo?: string
}

// featured: true = productos terminados y en producción (casos de estudio grandes).
// El resto aparece en el índice de side projects.
export const projects: Project[] = [
  {
    id: 'mmento',
    featured: true,
    title: 'mmento',
    year: '2025',
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
      es: 'Detrás: arquitectura offline-first con cola de sincronización idempotente, búsqueda vectorial con pgvector, vídeo con subidas resumibles a Cloudflare Stream y compras in-app. Publicada en App Store y Google Play.',
      en: 'Under the hood: offline-first architecture with an idempotent sync queue, pgvector semantic search, resumable video uploads to Cloudflare Stream and in-app purchases. Live on the App Store and Google Play.',
    },
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
    title: 'Jornal',
    year: '2025',
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
      es: 'Detrás: multi-tenant con aislamiento RLS probado por scripts que intentan romperlo, inmutabilidad y auditoría append-only a nivel de base de datos, backups verificados restaurándolos y 112 migraciones aditivas tras feature flags. En producción con clientes reales.',
      en: 'Under the hood: multi-tenant RLS isolation proven by scripts that try to break it, database-level immutability with append-only auditing, backups verified by restoring them, and 112 additive migrations behind feature flags. In production with real customers.',
    },
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
  {
    id: 'jlch-web',
    featured: false,
    title: 'JLCH Abogados',
    year: '2026',
    kind: { es: 'Consultoría', en: 'Consulting' },
    tagline: {
      es: 'Auditoría de rediseño y SEO/GEO para un despacho de abogados.',
      en: 'Redesign and SEO/GEO audit for a law firm.',
    },
    context: {
      es: 'Consultoría en 11 documentos, medida navegando el sitio real: UX, SEO técnico, optimización para buscadores de IA (GEO/AEO), arquitectura y cumplimiento legal.',
      en: 'An 11-document consulting engagement, measured on the live site: UX, technical SEO, AI-search optimization (GEO/AEO), architecture and legal compliance.',
    },
    result: {
      es: 'Detrás: el hallazgo clave fue un sitio con 100/100 en SEO de Lighthouse que aun así era invisible para las IAs (51/100 en agentic browsing); el plan cierra esa brecha con bloques de respuesta directa y 14 tipos de schema.org listos para pegar.',
      en: 'Under the hood: the key finding was a site scoring 100/100 on Lighthouse SEO while remaining invisible to AI search (51/100 agentic browsing); the plan closes that gap with direct-answer blocks and 14 ready-to-paste schema.org types.',
    },
    stack: ['SEO técnico', 'GEO/AEO', 'Lighthouse', 'JSON-LD', 'UX'],
  },
]
