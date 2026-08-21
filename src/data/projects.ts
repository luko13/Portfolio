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
  image?: string // ruta en /screenshots; sin ella se usa PlaceholderShot
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
      es: 'La app donde los magos organizan su repertorio.',
      en: 'The app where magicians organize their repertoire.',
    },
    context: {
      es: 'Plataforma iOS y Android offline-first para magos: biblioteca de técnicas por categorías, búsqueda semántica y suscripciones.',
      en: 'Offline-first iOS and Android platform for magicians: categorized technique library, semantic search and subscriptions.',
    },
    result: {
      es: 'Publicada en producción en mmentoapp.com. Más de 570 commits, Sentry y analítica de producto integradas.',
      en: 'Live in production at mmentoapp.com. 570+ commits, with Sentry and product analytics wired in.',
    },
    stack: ['React Native', 'Expo', 'TypeScript', 'Supabase', 'Cloudflare', 'Sentry'],
    url: 'https://mmentoapp.com',
    image: '/screenshots/mmento.webp',
  },
  {
    id: 'jornal',
    featured: true,
    title: 'Jornal',
    year: '2025',
    kind: { es: 'SaaS B2B', en: 'B2B SaaS' },
    tagline: {
      es: 'Control horario y gestión de jornada para pymes españolas.',
      en: 'Time tracking and workday management for Spanish SMBs.',
    },
    context: {
      es: 'Registro de jornada conforme al BOE: fichajes, vacaciones, correcciones con auditoría y backups con valor legal.',
      en: 'Legally compliant workday registry: clock-ins, leave, audited corrections and legally sound backups.',
    },
    result: {
      es: 'En producción en jornal.work con clientes reales. Más de 500 commits, web y app móvil, auditorías de seguridad y RLS verificada por scripts.',
      en: 'In production at jornal.work with real customers. 500+ commits, web and mobile app, security audits and script-verified RLS.',
    },
    stack: ['Next.js 15', 'TypeScript', 'Supabase', 'PostgreSQL + RLS', 'Expo', 'Vitest'],
    url: 'https://jornal.work',
    image: '/screenshots/jornal.webp',
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
