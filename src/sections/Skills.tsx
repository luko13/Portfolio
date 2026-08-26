import { useReveal } from '../motion/useReveal'
import { useLang } from '../i18n/LangContext'
import { skillGroups, marqueeItems } from '../data/skills'
import { ui } from '../data/ui'
import { Marquee } from '../components/Marquee'

export function Skills() {
  const { lang, t } = useLang()
  const ref = useReveal<HTMLElement>([lang])

  return (
    <section className="section skills" id="skills" data-climate="storm" ref={ref}>
      <span className="tategaki side-label" aria-hidden="true">
        {t(ui.sections.skills)} · 四
      </span>
      <div className="container">
        <div className="section-head will-reveal">
          <span className="kanji-num" lang="ja">
            四
          </span>
          <h2>{t(ui.sections.skills)}</h2>
        </div>
        <div className="skills-grid">
          {skillGroups.map((g) => (
            <div className="skill-group will-reveal" key={g.label.en}>
              <h3>{t(g.label)}</h3>
              <hr className="hairline" />
              <ul>
                {g.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="skills-marquee will-reveal">
        <Marquee items={marqueeItems} />
      </div>
    </section>
  )
}
