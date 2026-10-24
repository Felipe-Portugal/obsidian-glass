import { TechToolbar } from '../components/TechToolbar'
import { education, skillGroups } from '../data/skills'
import { useLanguage } from '../i18n/LanguageProvider'

export function SkillsAndEducation() {
  const { pick, t } = useLanguage()
  return (
    <div className="bento bento--closing">
      <section className="section section--flush skills" id="competences" aria-labelledby="skills-title">
        <div className="section__head">
          <h2 id="skills-title" className="section__title">
            {t.skills.title}
          </h2>
        </div>
        <div className="panel">
          <div className="skills__rows">
            {skillGroups.map((group) => (
              <div key={group.id} className="skills__row">
                <h3 className="skills__label" id={`skills-${group.id}`}>
                  {pick(group.label)}
                </h3>
                <TechToolbar ids={group.items} label={pick(group.label)} />
              </div>
            ))}
          </div>
          <p className="skills__note">{t.skills.note}</p>
        </div>
      </section>

      <section className="section section--flush education" id="formation" aria-labelledby="education-title">
        <div className="section__head">
          <h2 id="education-title" className="section__title">
            {t.education.title}
          </h2>
        </div>
        <div className="panel">
          <ul className="edu">
            {education.map((entry) => (
              <li key={entry.id} className="edu__entry">
                <h3 className="edu__degree">{pick(entry.degree)}</h3>
                <p className="edu__school">{pick(entry.school)}</p>
                <p className="edu__period">{pick(entry.period)}</p>
              </li>
            ))}
            <li className="edu__entry edu__entry--languages">
              <h3 className="edu__degree">{t.education.languages}</h3>
              <p className="edu__school">{t.hero.languages}</p>
            </li>
          </ul>
        </div>
      </section>
    </div>
  )
}
