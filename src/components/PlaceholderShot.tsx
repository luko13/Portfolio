import type { Project } from '../data/projects'
import { useLang } from '../i18n/LangContext'

// Frame de navegador estilizado mientras no hay captura real del proyecto
export function PlaceholderShot({ project }: { project: Project }) {
  const { t } = useLang()
  return (
    <div className="shot-frame" role="img" aria-label={project.title}>
      <div className="shot-chrome" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="shot-body">
        <p className="shot-kind">{t(project.kind)}</p>
        <p className="shot-title">{project.title}</p>
      </div>
    </div>
  )
}

export function ProjectShot({ project }: { project: Project }) {
  if (!project.image) return <PlaceholderShot project={project} />
  return (
    <div className="shot-frame">
      <div className="shot-chrome" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <img src={project.image} alt={project.title} loading="lazy" width={1600} height={1000} />
    </div>
  )
}
