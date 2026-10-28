import { experience } from './data/experience'
import { profile } from './data/profile'
import { projects } from './data/projects'
import { education, skillGroups } from './data/skills'
import { technologies } from './data/technologies'
import { timeline } from './data/timeline'
import type { Lang, Localized } from './data/types'
import { ui } from './i18n/ui'

const escape = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const list = (items: readonly string[]) => `<ul>${items.map((item) => `<li>${escape(item)}</li>`).join('')}</ul>`

/**
 * Version statique du contenu principal, écrite dans le HTML au build : les robots qui
 * n'exécutent pas JavaScript et les visiteurs sans JavaScript lisent ainsi projets, parcours,
 * compétences et contact. Avec JavaScript, elle est masquée (classe « js » posée dans <head>)
 * et l'application la remplace au montage. Tout vient des mêmes données que le site.
 */
export function renderStaticPage(lang: Lang = 'fr'): string {
  const t = ui[lang]
  const pick = <T,>(value: Localized<T>) => value[lang]
  const techName = (id: keyof typeof technologies) => {
    const { name } = technologies[id]
    return typeof name === 'string' ? name : pick(name)
  }

  const projectsHtml = projects
    .map(
      (project) => `<article>
<h3>${escape(pick(project.title))}</h3>
<p>${escape(pick(project.summary))}</p>
<p><strong>${escape(t.projects.contribution)}</strong> : ${escape(pick(project.contribution))}</p>
<p><strong>${escape(t.projects.result)}</strong> : ${escape(pick(project.result))}</p>
<p>${escape(pick(project.maturity.label))} · ${escape(pick(project.context))}</p>
<p>${escape(project.cardTech.map(techName).join(', '))}</p>
</article>`,
    )
    .join('\n')

  const stepsHtml = timeline
    .map((step) => {
      if (step.kind === 'experience') {
        const entry = experience.find((item) => item.id === step.id)
        if (!entry) return ''
        const roles = entry.roles.map((role) => `${pick(role.title)} (${pick(role.period)})`)
        return `<li><h3>${escape(roles.join(' · '))}</h3><p>${escape(t.experience.org)}</p>${list(pick(entry.points))}</li>`
      }
      const entry = education.find((item) => item.id === step.id)
      if (!entry) return ''
      return `<li><h3>${escape(pick(entry.degree))}</h3><p>${escape(`${pick(entry.school)} · ${pick(entry.period)}`)}</p>${entry.groups.map((group) => (group.label ? `<h4>${escape(pick(group.label))}</h4>` : '') + list(pick(group.items))).join('')}</li>`
    })
    .join('\n')

  const skillsHtml = skillGroups
    .map((group) => `<p><strong>${escape(pick(group.label))}</strong> : ${escape(group.items.map(techName).join(', '))}</p>`)
    .join('\n')

  return `<div class="prerender" lang="${lang}">
<header>
<h1>${escape(profile.name)}</h1>
<p>${escape(t.hero.role)}</p>
<p>${escape(t.hero.lede)}</p>
<ul><li>${escape(t.hero.status)}</li><li>${escape(t.hero.study)}</li><li>${escape(profile.location)}</li><li>${escape(t.hero.languages)}</li></ul>
</header>
<main>
<section><h2>${escape(t.projects.title)}</h2>
${projectsHtml}
</section>
<section><h2>${escape(t.timeline.title)}</h2>
<ol>
${stepsHtml}
</ol>
</section>
<section><h2>${escape(t.skills.title)}</h2>
${skillsHtml}
</section>
<section><h2>${escape(t.about.title)}</h2>
<p>${escape(t.about.intro)}</p>
</section>
<section><h2>${escape(t.contactTile.title)}</h2>
<p>${escape(t.contactTile.lead)}</p>
<p><a href="mailto:${escape(profile.email)}">${escape(profile.email)}</a> · <a href="${escape(profile.linkedin)}">LinkedIn</a></p>
</section>
</main>
</div>`
}
