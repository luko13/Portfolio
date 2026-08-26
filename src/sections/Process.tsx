import { useReveal } from '../motion/useReveal'
import { useLang } from '../i18n/LangContext'
import { ui } from '../data/ui'
import { SumiStroke } from '../components/SumiStroke'

const KANJI = ['一', '二', '三', '四', '五']

export function Process() {
  const { lang, t } = useLang()
  const ref = useReveal<HTMLElement>([lang])

  return (
    <section className="section process" id="process" ref={ref}>
      <div className="container">
        <div className="section-head will-reveal">
          <span className="kanji-num" lang="ja" aria-hidden="true">
            二
          </span>
          <h2>{t(ui.process.title)}</h2>
        </div>
        <SumiStroke variant="underline" className="head-stroke" />
        <p className="process-lead will-reveal">{t(ui.process.lead)}</p>
        <ol className="process-steps">
          {ui.process.steps.map((step, i) => (
            <li className="process-step will-reveal" key={step.title.en}>
              <span className="process-num" lang="ja" aria-hidden="true">
                {KANJI[i]}
              </span>
              <h3>{t(step.title)}</h3>
              <p>{t(step.body)}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
