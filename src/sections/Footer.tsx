import { useEffect, useRef, useState } from 'react'
import { ScrollTrigger } from '../motion/gsap'
import { scrollBus } from '../motion/scrollBus'
import { useReveal } from '../motion/useReveal'
import { useLang } from '../i18n/LangContext'
import { profile } from '../data/profile'
import { ui } from '../data/ui'
import { Hanko } from '../components/Hanko'

function useLocalTime(timezone: string) {
  const [time, setTime] = useState('')
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: timezone,
    })
    const tick = () => setTime(fmt.format(new Date()))
    tick()
    const id = setInterval(tick, 60_000)
    return () => clearInterval(id)
  }, [timezone])
  return time
}

export function Footer() {
  const { lang, t } = useLang()
  const ref = useReveal<HTMLElement>([lang])
  const [copied, setCopied] = useState(false)
  const time = useLocalTime(profile.timezone)
  const copyTimer = useRef(0)

  // Al llegar al footer, el viento de pétalos amaina
  useEffect(() => {
    if (!ref.current) return
    const st = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top 70%',
      onToggle: (self) => {
        scrollBus.calm = self.isActive ? 1 : 0
      },
    })
    return () => st.kill()
  }, [ref])

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      clearTimeout(copyTimer.current)
      copyTimer.current = window.setTimeout(() => setCopied(false), 1800)
    } catch {
      // el mailto del CTA sigue funcionando como fallback
    }
  }

  return (
    <footer className="footer" id="contact" data-climate="dusk" ref={ref}>
      <div className="container">
        <a className="footer-cta will-reveal" href={`mailto:${profile.email}`} data-magnetic>
          {t(ui.footer.cta)}
        </a>
        <p className="footer-lead will-reveal">{t(ui.footer.lead)}</p>
        <div className="footer-email will-reveal">
          <a className="footer-email-link" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
          <button onClick={copyEmail} className="copy-btn" data-magnetic>
            {copied ? `✓ ${t(ui.footer.copied)}` : t(ui.footer.copyEmail)}
          </button>
        </div>

        <div className="footer-meta will-reveal">
          <div className="footer-socials">
            {profile.socials.map((s) => (
              <a key={s.label} href={s.url} target="_blank" rel="noreferrer">
                {s.label} ↗
              </a>
            ))}
            <a href={t(profile.cv)} download>
              {t(ui.hero.cv)} ↓
            </a>
          </div>
          <p className="footer-place">
            {t(profile.location)} · {time}
          </p>
        </div>

        <div className="footer-sign will-reveal">
          <Hanko size={44} />
          <p>
            © 2026 {profile.realName}. {t(ui.footer.colophon)}
          </p>
        </div>
      </div>
    </footer>
  )
}
