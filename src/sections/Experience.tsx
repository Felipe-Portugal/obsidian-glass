import { experience } from '../data/experience'
import { useLanguage } from '../i18n/LanguageProvider'

export function Experience() {
  const { pick, t } = useLanguage()
  return (
    <section className="section" id="experience" aria-labelledby="experience-title">
      <div className="section__head">
        <h2 id="experience-title" className="section__title">
          {t.experience.title}
        </h2>
        <p className="section__aside">{t.experience.org}</p>
      </div>
      <div className="panel">
        <ol className="timeline">
          {experience.map((entry) => (
            <li key={entry.id} className="timeline__entry">
              <div className="timeline__roles">
                {entry.roles.map((role) => (
                  <div key={pick(role.title)} className="timeline__role">
                    <h3 className="timeline__title">{pick(role.title)}</h3>
                    <p className="timeline__period">{pick(role.period)}</p>
                  </div>
                ))}
                {entry.note && <p className="timeline__note">{pick(entry.note)}</p>}
              </div>
              <ul className="timeline__points">
                {pick(entry.points).map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
