import type { EducationEntry, SkillGroup } from './types'

/** Sélection de technologies confirmées dans facts_felipe.md, pas la liste brute complète. */
export const skillGroups: readonly SkillGroup[] = [
  {
    id: 'languages',
    label: { fr: 'Langages', en: 'Languages' },
    items: ['python', 'typescript', 'javascript', 'java', 'csharp', 'php', 'cplusplus', 'rust', 'sql', 'bash'],
  },
  {
    id: 'mobile-web',
    label: { fr: 'Interfaces', en: 'Interfaces' },
    items: ['reactnative', 'expo', 'android', 'html5', 'css', 'blazor', 'javafx'],
  },
  {
    id: 'backend-data',
    label: { fr: 'Backend / Données', en: 'Backend / Data' },
    items: ['aspnetcore', 'efcore', 'rest', 'postgresql', 'sqlserver', 'oracle', 'mysql', 'grafana'],
  },
  {
    id: 'devops',
    label: { fr: 'Outils / DevOps', en: 'Tools / DevOps' },
    items: ['git', 'gitea', 'azuredevops', 'docker', 'linux', 'maven', 'pytest'],
  },
  {
    id: 'robotics',
    label: { fr: 'Robotique / Embarqué', en: 'Robotics / Embedded' },
    items: ['spotsdk', 'raspberrypi', 'arduino', 'mqtt', 'buses', 'opencv', 'numpy', 'pillow'],
  },
]

export const education: readonly EducationEntry[] = [
  {
    id: 'ets',
    degree: { fr: 'Baccalauréat en génie logiciel', en: 'Bachelor of Software Engineering' },
    school: {
      fr: 'École de technologie supérieure (ÉTS), Montréal',
      en: 'École de technologie supérieure (ÉTS), Montréal',
    },
    period: {
      fr: 'Depuis 2024 · Diplomation prévue en mai 2029',
      en: 'Since 2024 · Expected graduation: May 2029',
    },
  },
  {
    id: 'dec',
    degree: {
      fr: 'DEC en techniques de l’informatique',
      en: 'DEC (college diploma) in Computer Science Technology',
    },
    school: { fr: 'Cégep de Sept-Îles', en: 'Cégep de Sept-Îles' },
    period: { fr: 'Diplômé en 2024', en: 'Graduated in 2024' },
  },
]
