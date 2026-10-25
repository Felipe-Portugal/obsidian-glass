import { TechToolbar } from '../components/TechToolbar'
import { skillGroups } from '../data/skills'
import { useLanguage } from '../i18n/LanguageProvider'

/** Tuile de compétences : une barre de logos par famille, le nom de chaque technologie en infobulle. Aucun niveau. */
export function Skills() {
  const { pick, t } = useLanguage()
  return (
    <section className="plate tile tile--skills" data-tone="skills" id="competences" aria-labelledby="skills-title">
      <div className="tile__head">
        <h2 id="skills-title" className="tile__label">
          {t.skills.title}
        </h2>
      </div>
      <div className="skills">
        {skillGroups.map((group) => (
          <div key={group.id} className="skills__row">
            <h3 className="skills__label" id={`skills-${group.id}`}>
              {pick(group.label)}
            </h3>
            <TechToolbar ids={group.items} label={pick(group.label)} size="sm" />
          </div>
        ))}
      </div>
      <p className="tile__foot">{t.skills.note}</p>
    </section>
  )
}
