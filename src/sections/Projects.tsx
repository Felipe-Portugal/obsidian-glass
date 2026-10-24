import { ProjectCard } from '../components/ProjectCard'
import { projects } from '../data/projects'
import type { Project } from '../data/types'
import { useLanguage } from '../i18n/LanguageProvider'

interface Props {
  /** Projet dont l'étude de cas est ouverte : elle est née de sa tuile. */
  open: Project['id'] | null
  onOpen: (id: Project['id'], tile: HTMLElement) => void
}

export function Projects({ open, onOpen }: Props) {
  const { t } = useLanguage()
  return (
    <section className="bento__projects" id="projets" aria-labelledby="projects-title">
      <div className="bento__head">
        <h2 id="projects-title" className="bento__title">
          {t.projects.title}
        </h2>
        <p className="bento__hint">{t.projects.hint}</p>
      </div>
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          lifted={open === project.id}
          onOpen={(tile) => onOpen(project.id, tile)}
        />
      ))}
    </section>
  )
}
