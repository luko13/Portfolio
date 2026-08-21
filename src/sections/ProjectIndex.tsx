import { useReveal } from '../motion/useReveal'
import { useLang } from '../i18n/LangContext'
import { projects } from '../data/projects'
import { ui } from '../data/ui'

export function ProjectIndex() {
  const { lang, t } = useLang()
  const ref = useReveal<HTMLElement>([lang])
  const rest = projects.filter((p) => !p.featured)

  return (
    <section className="section pindex" ref={ref}>
      <div className="container">
        <div className="section-head will-reveal">
          <span className="kanji-num" lang="ja">
            四
          </span>
          <h2>{t(ui.sections.index)}</h2>
        </div>
        <ul className="pindex-list will-reveal">
          {rest.map((p) => (
            <li key={p.id}>
              <div className="pindex-row">
                <h3>{p.title}</h3>
                <p className="pindex-tagline">{t(p.tagline)}</p>
                <span className="pindex-meta">
                  {t(p.kind)} · {p.year}
                </span>
              </div>
              <div className="pindex-detail">
                <p>{t(p.context)}</p>
                <p className="pindex-result">{t(p.result)}</p>
                <ul className="fp-stack">
                  {p.stack.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
