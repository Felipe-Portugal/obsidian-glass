import { GraduationCap, Languages, MapPin } from 'lucide-react'
import { profile } from '../data/profile'
import { useLanguage } from '../i18n/LanguageProvider'

export function Hero() {
  const { t } = useLanguage()
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__main">
        <h1 id="hero-title" className="hero__name">
          Felipe Portugal<span className="hero__dot">.</span>
        </h1>
        <p className="hero__role">{t.hero.role}</p>
        <p className="hero__lede">{t.hero.lede}</p>
      </div>
      <ul className="hero__facts" aria-label={t.hero.factsLabel}>
        <li>
          <GraduationCap aria-hidden="true" size={16} strokeWidth={1.75} />
          <span>{t.hero.study}</span>
        </li>
        <li>
          <MapPin aria-hidden="true" size={16} strokeWidth={1.75} />
          <span>{profile.location}</span>
        </li>
        <li>
          <Languages aria-hidden="true" size={16} strokeWidth={1.75} />
          <span>{t.hero.languages}</span>
        </li>
        <li className="hero__status">
          <span className="status-dot" aria-hidden="true" />
          <span>{t.hero.status}</span>
        </li>
      </ul>
    </section>
  )
}
