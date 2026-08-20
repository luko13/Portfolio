import type { L10n } from '../i18n/LangContext'

// Todo el contenido personal vive aquí. Edita libremente.
export const profile = {
  handle: 'luko13',
  realName: 'Luis Bravo',
  role: {
    es: 'Full-stack developer. SaaS, sistemas de trading y agentes de IA.',
    en: 'Full-stack developer. SaaS, trading systems & AI agents.',
  } as L10n,
  bio1: {
    es: 'Construyo software que cobra, opera y escala: SaaS multi-tenant con clientes reales, bots que tradean con dinero real y agentes de IA que trabajan mientras duermo.',
    en: 'I build software that bills, trades and scales: multi-tenant SaaS with real customers, bots trading real money, and AI agents that work while I sleep.',
  } as L10n,
  bio2: {
    es: 'Me obsesiona lo que no se ve: seguridad multi-tenant con RLS verificada por scripts, threat models escritos antes del código, backups que se prueban restaurando y modo paper por defecto en todo lo que toca dinero.',
    en: 'I obsess over what you cannot see: multi-tenant security with script-verified RLS, threat models written before the code, backups proven by restoring them, and paper mode by default in anything that touches money.',
  } as L10n,
  email: 'luislk1996chs@gmail.com',
  location: { es: 'España', en: 'Spain' } as L10n,
  timezone: 'Europe/Madrid',
  socials: [
    { label: 'GitHub', url: 'https://github.com/luko13' },
    // Añade LinkedIn, X, etc. aquí
  ],
}
