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
      es: 'Funciona entera sin cobertura, incluso creando trucos con vídeo: todo se sincroniza solo al volver la señal. Suscripciones nativas en iOS y Android.',
      en: 'Fully usable offline, even creating tricks with video: everything syncs itself once the signal returns. Native subscriptions on iOS and Android.',
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
      es: 'La Inspección de Trabajo entra con un enlace caducable de solo lectura, sin cuenta: los fichajes son inmutables y cada corrección deja quién, cuándo y qué. En producción con clientes reales.',
      en: 'Labour inspectors walk in through an expiring read-only link, no account needed: entries are immutable and every correction records who, when and what. In production with real customers.',
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
      es: 'DAU/WAU/MAU, retención por cohortes, CTR de búsqueda, cero-resultados y monitorización de errores en un solo panel.',
      en: 'DAU/WAU/MAU, cohort retention, search CTR, zero-results and error monitoring in a single panel.',
    },
    result: {
      es: 'Deployado en analytics.mmento.app; las decisiones de producto de mmento se toman sobre estos datos.',
      en: 'Deployed at analytics.mmento.app; mmento product decisions run on this data.',
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
      es: 'Orquestación LangGraph para research cripto y DeFi, con gating de riesgo determinista antes de cualquier ejecución y modo paper por defecto.',
      en: 'LangGraph orchestration for crypto and DeFi research, with deterministic risk gating before any execution and paper mode by default.',
    },
    result: {
      es: 'Monorepo de 13 packages con PRD, ADRs y threat model escritos antes del código.',
      en: 'A 13-package monorepo with PRD, ADRs and a threat model written before the code.',
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
      es: 'Detecta violaciones de SLA de UPS y DHL, redacta la reclamación y la presenta: 10 microservicios orquestados por eventos.',
      en: 'Detects UPS and DHL SLA breaches, drafts the claim and files it: 10 event-driven microservices.',
    },
    result: {
      es: 'Arquitectura event-driven completa con NATS, trazas OpenTelemetry y dashboards Grafana.',
      en: 'Full event-driven architecture with NATS, OpenTelemetry traces and Grafana dashboards.',
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
      es: 'Inbox compartido entre agentes, pipeline configurable de leads, asignación automática de conversaciones y roles granulares.',
      en: 'Shared agent inbox, configurable lead pipeline, automatic conversation assignment and granular roles.',
    },
    result: {
      es: 'Monorepo con web, API y worker de colas; recordatorios y automatizaciones sobre BullMQ.',
      en: 'Monorepo with web, API and queue worker; reminders and automations on BullMQ.',
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
      es: 'Experimentos de trading algorítmico en mercados de predicción.',
      en: 'Algorithmic trading experiments on prediction markets.',
    },
    context: {
      es: 'Colección de bots y herramientas: BTC a 5 minutos, edge meteorológico contra Open-Meteo, radar de wallets y copy-trading. Kelly fraccionario, backtesting y kill switches.',
      en: 'A collection of bots and tools: 5-minute BTC, weather edge vs Open-Meteo, wallet radar and copy-trading. Fractional Kelly, backtesting and kill switches.',
    },
    result: {
      es: 'Varios bots operando en real con journal de operaciones, calibración con datos propios y credenciales cifradas.',
      en: 'Several bots live with trade journals, calibration on first-party data and encrypted credentials.',
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
      es: 'Auditoría completa en 11 documentos: UX/UI, SEO técnico, optimización para buscadores de IA (GEO/AEO), arquitectura web y cumplimiento legal.',
      en: 'Full audit across 11 documents: UX/UI, technical SEO, AI-search optimization (GEO/AEO), site architecture and legal compliance.',
    },
    result: {
      es: 'Plan de implementación accionable con nueva arquitectura, metadata y schema JSON-LD listos para desplegar.',
      en: 'Actionable implementation plan with new architecture, metadata and JSON-LD schema ready to ship.',
    },
    stack: ['SEO técnico', 'GEO/AEO', 'Lighthouse', 'JSON-LD', 'UX'],
  },
]
