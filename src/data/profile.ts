import type { L10n } from '../i18n/LangContext'

// Todo el contenido personal vive aquí. Edita libremente.
export const profile = {
  handle: 'luko13',
  realName: 'Luis Santiago Chillón Serratosa',
  role: {
    es: 'Full-stack developer. SaaS y apps móviles con clientes reales.',
    en: 'Full-stack developer. SaaS & mobile apps with real customers.',
  } as L10n,
  bio1: {
    es: 'Construyo producto de principio a fin: SaaS multi-tenant con clientes reales, apps móviles publicadas y dashboards que sostienen decisiones de producto.',
    en: 'I build products end to end: multi-tenant SaaS with real customers, mobile apps live in the stores, and dashboards that drive product decisions.',
  } as L10n,
  bio2: {
    es: 'Me obsesiona lo que no se ve: seguridad multi-tenant con RLS verificada por scripts, threat models escritos antes del código y backups que se prueban restaurando. De fondo, side projects de trading algorítmico y agentes de IA donde experimento sin red.',
    en: 'I obsess over what you cannot see: multi-tenant security with script-verified RLS, threat models written before the code, and backups proven by restoring them. On the side, algorithmic trading and AI agent projects where I experiment freely.',
  } as L10n,
  email: 'luislk1996chs@gmail.com',
  location: { es: 'España', en: 'Spain' } as L10n,
  timezone: 'Europe/Madrid',
  socials: [
    { label: 'GitHub', url: 'https://github.com/luko13' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/luis-chill%C3%B3n-serratosa-00735486/' },
  ],
}
