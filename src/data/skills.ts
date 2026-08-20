import type { L10n } from '../i18n/LangContext'

export interface SkillGroup {
  label: L10n
  items: string[]
}

export const skillGroups: SkillGroup[] = [
  {
    label: { es: 'Frontend', en: 'Frontend' },
    items: ['TypeScript', 'React / Next.js', 'React Native / Expo', 'Tailwind CSS', 'GSAP'],
  },
  {
    label: { es: 'Backend y datos', en: 'Backend & data' },
    items: ['NestJS / Fastify', 'Python / FastAPI', 'PostgreSQL + RLS', 'Supabase', 'Redis / BullMQ', 'Docker'],
  },
  {
    label: { es: 'Trading y quant', en: 'Trading & quant' },
    items: ['CCXT', 'Polymarket CLOB', 'Backtesting', 'Kelly fraccionario', 'On-chain (Polygon / Solana)'],
  },
  {
    label: { es: 'IA e infra', en: 'AI & infra' },
    items: ['LangGraph', 'OpenAI SDK', 'Búsqueda vectorial', 'Sentry / OpenTelemetry', 'Stripe', 'CI/CD'],
  },
]

// Cinta de marquee (dos filas)
export const marqueeItems = [
  'TypeScript', 'Next.js', 'React Native', 'Python', 'FastAPI', 'NestJS',
  'PostgreSQL', 'Supabase', 'Docker', 'Stripe', 'LangGraph', 'CCXT',
  'Redis', 'NATS', 'OpenTelemetry', 'Turborepo', 'Three.js', 'GSAP',
]
