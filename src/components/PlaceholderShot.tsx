import type { Project } from '../data/projects'
import { useLang } from '../i18n/LangContext'

// Tarjeta washi para proyectos sin captura: diseño propio, sin fingir un navegador.
export function WashiCard({ project }: { project: Project }) {
  const { t } = useLang()
  return (
    <div className="washi-card" role="img" aria-label={project.title}>
      <p className="washi-kind">{t(project.kind)}</p>
      <p className="washi-title">{project.title}</p>
      <ul className="washi-stack" aria-hidden="true">
        {project.stack.slice(0, 3).map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>
    </div>
  )
}

// Preview del índice: primera captura si existe, tarjeta washi si no.
export function ProjectPreview({ project }: { project: Project }) {
  const first = project.images?.[0]
  if (!first) return <WashiCard project={project} />
  return (
    <div className="preview-shot">
      <img src={first} alt={project.title} loading="lazy" width={1600} height={1000} />
    </div>
  )
}
