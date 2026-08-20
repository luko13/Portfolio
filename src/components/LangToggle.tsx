import { useLang } from '../i18n/LangContext'
import { ui } from '../data/ui'

export function LangToggle() {
  const { lang, setLang, t } = useLang()
  return (
    <div className="lang-toggle" role="group" aria-label={t(ui.a11y.langToggle)}>
      <button
        onClick={() => setLang('es')}
        aria-pressed={lang === 'es'}
        className={lang === 'es' ? 'active' : ''}
      >
        ES
      </button>
      <span aria-hidden="true">/</span>
      <button
        onClick={() => setLang('en')}
        aria-pressed={lang === 'en'}
        className={lang === 'en' ? 'active' : ''}
      >
        EN
      </button>
    </div>
  )
}
