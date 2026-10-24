import { ProjectCard } from '../components/ProjectCard'
import { projects } from '../data/projects'
import type { Project } from '../data/types'
import { useLanguage } from '../i18n/LanguageProvider'

export function Projects({ onOpen }: { onOpen: (id: Project['id'], origin: DOMRect) => void }) {
  const { t } = useLanguage()
  return (
    <section className="section" id="projets" aria-labelledby="projects-title">
      <div className="section__head">
        <h2 id="projects-title" className="section__title">
          {t.projects.title}
        </h2>
        <p className="section__aside">{t.projects.hint}</p>
      </div>
      <div className="bento bento--projects">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} onOpen={(origin) => onOpen(project.id, origin)} />
        ))}
      </div>
    </section>
  )
}
