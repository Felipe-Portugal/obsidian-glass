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
    label: { fr: 'Mobile / Web', en: 'Mobile / Web' },
    items: ['reactnative', 'expo', 'android', 'html5', 'css', 'aspnetcore', 'blazor', 'javafx'],
  },
  {
    id: 'backend-data',
    label: { fr: 'Backend / Données', en: 'Backend / Data' },
    items: ['postgresql', 'sqlserver', 'oracle', 'mysql', 'efcore', 'rest', 'grafana'],
  },
  {
    id: 'devops',
    label: { fr: 'Dev / DevOps', en: 'Dev / DevOps' },
    items: ['docker', 'git', 'gitea', 'azuredevops', 'linux', 'pytest', 'maven'],
  },
  {
    id: 'robotics',
    label: { fr: 'Robotique / Embarqué', en: 'Robotics / Embedded' },
    items: ['spotsdk', 'raspberrypi', 'arduino', 'opencv', 'numpy', 'pillow', 'mqtt', 'buses'],
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
