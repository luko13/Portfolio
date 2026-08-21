import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

const META = {
  es: {
    title: 'luko13 · Full-stack developer',
    description:
      'Portfolio de luko13 (Luis Chillón): SaaS con clientes reales, sistemas de trading y agentes de IA. TypeScript, React, Python.',
  },
  en: {
    title: 'luko13 · Full-stack developer',
    description:
      'Portfolio of luko13 (Luis Chillón): SaaS with real customers, trading systems and AI agents. TypeScript, React, Python.',
  },
}

export type Lang = 'es' | 'en'
export type L10n = { es: string; en: string }

interface LangCtx {
  lang: Lang
  setLang: (l: Lang) => void
  t: (x: L10n) => string
}

const Ctx = createContext<LangCtx | null>(null)

function initialLang(): Lang {
  const fromUrl = new URLSearchParams(window.location.search).get('lang')
  if (fromUrl === 'es' || fromUrl === 'en') return fromUrl
  const stored = localStorage.getItem('lang')
  if (stored === 'es' || stored === 'en') return stored
  return navigator.language.startsWith('es') ? 'es' : 'en'
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang)

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = META[lang].title
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', META[lang].description)
  }, [lang])

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    localStorage.setItem('lang', l)
    document.documentElement.lang = l
    const url = new URL(window.location.href)
    url.searchParams.set('lang', l)
    history.replaceState(null, '', url)
  }, [])

  const value = useMemo<LangCtx>(
    () => ({ lang, setLang, t: (x) => x[lang] }),
    [lang, setLang],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useLang(): LangCtx {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useLang fuera de LangProvider')
  return ctx
}
