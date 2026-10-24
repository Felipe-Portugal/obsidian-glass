import type { BrandIconId } from './icons.generated'
import type { Localized } from './types'

export interface Technology {
  /** Nom exact affiché en infobulle et lu par les lecteurs d'écran. */
  name: string | Localized
  /** Logo officiel extrait de Simple Icons ou Devicon (voir scripts/extract-icons.mjs). */
  icon?: BrandIconId
  /** Monogramme de repli lorsqu'aucun logo n'est disponible ou lisible à petite taille. */
  short?: string
}

export const technologies = {
  // Langages
  python: { name: 'Python', icon: 'python' },
  typescript: { name: 'TypeScript', icon: 'typescript' },
  javascript: { name: 'JavaScript', icon: 'javascript' },
  java: { name: 'Java', icon: 'java' },
  csharp: { name: 'C#', icon: 'csharp' },
  php: { name: 'PHP', icon: 'php' },
  cplusplus: { name: 'C++', icon: 'cplusplus' },
  rust: { name: 'Rust', icon: 'rust' },
  sql: { name: 'SQL', short: 'SQL' },
  bash: { name: 'Bash', icon: 'bash' },

  // Mobile / Web
  reactnative: { name: 'React Native', icon: 'react' },
  expo: { name: 'Expo', icon: 'expo' },
  android: { name: 'Android', icon: 'android' },
  androidstudio: { name: 'Android Studio', icon: 'androidstudio' },
  html5: { name: 'HTML', icon: 'html5' },
  css: { name: 'CSS', icon: 'css' },
  aspnetcore: { name: 'ASP.NET Core', icon: 'dotnet' },
  blazor: { name: 'Blazor', icon: 'blazor' },
  javafx: { name: 'JavaFX', short: 'FX' },

  // Backend / Données
  postgresql: { name: 'PostgreSQL', icon: 'postgresql' },
  sqlserver: { name: 'SQL Server', icon: 'sqlserver' },
  // Le logo Oracle est un mot-symbole illisible à cette taille : monogramme explicite.
  oracle: { name: 'Oracle (SQL, PL/SQL)', short: 'PL/SQL' },
  mysql: { name: 'MySQL', icon: 'mysql' },
  efcore: { name: 'Entity Framework Core', icon: 'efcore' },
  rest: { name: { fr: 'API REST', en: 'REST APIs' }, short: 'REST' },
  grafana: { name: 'Grafana', icon: 'grafana' },
  influxdb: { name: 'InfluxDB', icon: 'influxdb' },

  // Dev / DevOps
  docker: { name: 'Docker', icon: 'docker' },
  git: { name: 'Git', icon: 'git' },
  gitea: { name: 'Gitea', icon: 'gitea' },
  azuredevops: { name: 'Azure DevOps', icon: 'azuredevops' },
  linux: { name: 'Linux', icon: 'linux' },
  pytest: { name: 'pytest', icon: 'pytest' },
  maven: { name: 'Maven', icon: 'maven' },

  // Robotique / Embarqué
  spotsdk: { name: 'Spot SDK (Boston Dynamics)', short: 'Spot' },
  spotcam: { name: 'Spot CAM+IR', short: 'CAM+IR' },
  raspberrypi: { name: 'Raspberry Pi', icon: 'raspberrypi' },
  arduino: { name: 'Arduino', icon: 'arduino' },
  opencv: { name: 'OpenCV', icon: 'opencv' },
  numpy: { name: 'NumPy', icon: 'numpy' },
  pillow: { name: 'Pillow', short: 'PIL' },
  pytorch: { name: 'PyTorch', icon: 'pytorch' },
  mqtt: { name: 'MQTT', icon: 'mqtt' },
  buses: { name: 'GPIO, I2C, SPI, UART', short: 'GPIO' },
  rtc: { name: { fr: 'Horloge temps réel (RTC)', en: 'Real-time clock (RTC)' }, short: 'RTC' },

  // Services intégrés
  stripe: { name: 'Stripe', icon: 'stripe' },
  msauth: { name: { fr: 'Authentification Microsoft', en: 'Microsoft authentication' }, short: 'MS' },
} as const satisfies Record<string, Technology>

export type TechId = keyof typeof technologies
