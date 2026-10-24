import { TechToolbar } from '../components/TechToolbar'
import { education, skillGroups } from '../data/skills'
import { useLanguage } from '../i18n/LanguageProvider'

/** Tuile de compétences : une barre de logos par famille, le nom de chaque technologie en infobulle. Aucun niveau. */
export function Skills() {
  const { pick, t } = useLanguage()
  return (
    <section className="plate tile tile--skills" id="competences" aria-labelledby="skills-title">
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

/** Tuile de formation : diplôme, établissement, dates et statut ; les langues en pied. */
export function Education() {
  const { pick, t } = useLanguage()
  return (
    <section className="plate tile tile--edu" id="formation" aria-labelledby="education-title">
      <div className="tile__head">
        <h2 id="education-title" className="tile__label">
          {t.education.title}
        </h2>
      </div>
      <ul className="edu">
        {education.map((entry) => (
          <li key={entry.id} className="edu__entry">
            <h3 className="edu__degree">{pick(entry.degree)}</h3>
            <p className="edu__school">{pick(entry.school)}</p>
            <p className="edu__period">{pick(entry.period)}</p>
          </li>
        ))}
      </ul>
      <p className="tile__foot edu__languages">
        <span>{t.education.languages}</span>
        {t.hero.languages}
      </p>
    </section>
  )
}
