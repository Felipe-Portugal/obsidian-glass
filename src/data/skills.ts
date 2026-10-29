import type { EducationEntry, SkillGroup } from './types'

/** Sélection des technologies réellement employées dans les projets et les emplois. */
export const skillGroups: readonly SkillGroup[] = [
  {
    id: 'languages',
    label: { fr: 'Langages', en: 'Languages' },
    items: ['python', 'typescript', 'javascript', 'java', 'csharp', 'php', 'c', 'cplusplus', 'rust', 'sql', 'bash', 'powershell'],
  },
  {
    id: 'mobile-web',
    label: { fr: 'Interfaces', en: 'Interfaces' },
    items: ['reactnative', 'expo', 'android', 'html5', 'css', 'bootstrap', 'jquery', 'blazor', 'javafx'],
  },
  {
    id: 'backend-data',
    label: { fr: 'Backend / Données', en: 'Backend / Data' },
    items: ['aspnetcore', 'efcore', 'rest', 'postgresql', 'sqlserver', 'oracle', 'mysql', 'mariadb', 'sqlite', 'grafana'],
  },
  {
    id: 'devops',
    label: { fr: 'Outils / DevOps', en: 'Tools / DevOps' },
    items: ['git', 'gitea', 'azuredevops', 'gitlab', 'docker', 'linux', 'vmware', 'maven', 'pytest'],
  },
  {
    id: 'robotics',
    label: { fr: 'Robotique / Embarqué', en: 'Robotics / Embedded' },
    items: ['spotsdk', 'raspberrypi', 'arduino', 'mqtt', 'bluetooth', 'lorawan', 'buses', 'opencv', 'numpy', 'pillow'],
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
    groups: [
      {
        items: {
          fr: [
            'Tests et qualité logicielle, application Java (2025, en équipe, LOG240) : rétro-ingénierie, analyse d’impact d’une demande de changement, tests boîte noire, tests unitaires et d’intégration de la couche d’accès aux données (couverture de 99 %, JaCoCo), suivi des défauts dans GitLab.',
            'Conception orientée objet, application JavaFX (2025, en équipe, LOG121) : manipulation d’images (zoom, translation, annulation, sauvegarde) selon l’architecture MVC et des patrons de conception.',
            'Analyse et conception logicielle (2026, LOG210) : modèles du domaine UML, contrats d’opération et réalisations de cas d’utilisation avec les patrons GRASP.',
          ],
          en: [
            'Software testing and quality, Java application (2025, team, LOG240): reverse engineering, impact analysis of a change request, black-box tests, unit and integration tests of the data access layer (99% coverage, JaCoCo), defect tracking in GitLab.',
            'Object-oriented design, JavaFX application (2025, team, LOG121): image manipulation (zoom, pan, undo, save) following the MVC architecture and design patterns.',
            'Software analysis and design (2026, LOG210): UML domain models, operation contracts and use case realizations with GRASP patterns.',
          ],
        },
      },
    ],
    tech: ['java', 'javafx', 'gitlab'],
  },
  {
    id: 'dec',
    degree: {
      fr: 'DEC en techniques de l’informatique',
      en: 'DEC (college diploma) in Computer Science Technology',
    },
    school: { fr: 'Cégep de Sept-Îles', en: 'Cégep de Sept-Îles' },
    period: { fr: 'Diplômé en 2024', en: 'Graduated in 2024' },
    groups: [
      {
        label: { fr: 'Applications, web et données', en: 'Applications, web and data' },
        items: {
          fr: [
            'Applications web ASP.NET Core (2023–2024) : applications MVC avec Entity Framework et SQL Server ; application Blazor de gestion des étudiants, des cours et des inscriptions ; API REST Web API consommée par un client Blazor et déployée sur IIS.',
            'Sites web avec authentification en PHP et MySQL (2024) : mots de passe hachés, sessions, rôles, requêtes préparées PDO et protection contre le XSS ; OAuth (Google, Facebook, GitHub), double authentification par code QR, activation par courriel et reCAPTCHA.',
            'Programmation côté client (2023) : site multipage en HTML, CSS et Bootstrap ; manipulation du DOM et recherche en temps réel avec jQuery et AJAX.',
            'Bases de données Oracle (2023) : PL/SQL, procédures et fonctions stockées, curseurs, modélisation et normalisation.',
            'Bataille navale (2023) : jeu en Java avec JavaFX, structuré et compilé avec Maven.',
          ],
          en: [
            'ASP.NET Core web applications (2023–2024): MVC applications with Entity Framework and SQL Server; a Blazor app managing students, courses and enrolments; a Web API REST service consumed by a Blazor client and deployed on IIS.',
            'Websites with authentication in PHP and MySQL (2024): hashed passwords, sessions, roles, PDO prepared statements and XSS protection; OAuth (Google, Facebook, GitHub), QR code two-factor authentication, email activation and reCAPTCHA.',
            'Client-side programming (2023): a multipage website in HTML, CSS and Bootstrap; DOM manipulation and live search with jQuery and AJAX.',
            'Oracle databases (2023): PL/SQL, stored procedures and functions, cursors, modelling and normalization.',
            'Battleship (2023): a Java game with JavaFX, structured and built with Maven.',
          ],
        },
      },
      {
        label: { fr: 'Robotique et objets connectés', en: 'Robotics and connected devices' },
        items: {
          fr: [
            'Plateforme robotique Spot connectée (2023, équipe de deux) : mission Autowalk enregistrée, avec orientation du robot vers la source de chaleur repérée par la caméra thermique ; collecte d’audio, d’images et de données de capteurs ; conteneur Docker lancé par SSH sur Spot.',
            'Système de surveillance sous Android (2024, individuel) : application Android en Java, Raspberry Pi en Python et Arduino ; cahier des charges, échéancier et validation des livrables avec le client.',
            'Objets connectés (2023–2024) : détection de mouvement avec Android, Raspberry Pi et MQTT (historique SQLite et vidéo), panneau de DEL programmables sur Arduino, laboratoires Bluetooth LE et LoRaWAN.',
          ],
          en: [
            'Connected Spot robotics platform (2023, team of two): a recorded Autowalk mission, with the robot oriented toward the heat source spotted by the thermal camera; audio, image and sensor data collection; a Docker container launched over SSH on Spot.',
            'Android monitoring system (2024, individual): an Android app in Java, a Raspberry Pi in Python and an Arduino; requirements, schedule and deliverable validation with the client.',
            'Connected devices (2023–2024): motion detection with Android, Raspberry Pi and MQTT (SQLite history and video), a programmable LED panel on Arduino, Bluetooth LE and LoRaWAN labs.',
          ],
        },
      },
      {
        label: { fr: 'Infrastructure, réseaux et sécurité', en: 'Infrastructure, networks and security' },
        items: {
          fr: [
            'Infrastructure serveur, inventaire et supervision (2023) : VMware ESXi, Ubuntu Server, clients Ubuntu et Windows, DHCP ; OCS Inventory, GLPI et Zabbix avec Apache, MariaDB et PHP.',
            'Serveurs et réseaux (2022–2023) : Windows Server (Active Directory, GPO, IIS, RAID) ; cours de réseautique Cisco (OSPF, VLAN, VPN IPsec, sécurité des ports).',
            'Sécurité informatique (2023, équipe de trois) : analyse de risques et plan de sécurité ; analyse de la vulnérabilité Log4j.',
          ],
          en: [
            'Server infrastructure, inventory and monitoring (2023): VMware ESXi, Ubuntu Server, Ubuntu and Windows clients, DHCP; OCS Inventory, GLPI and Zabbix with Apache, MariaDB and PHP.',
            'Servers and networks (2022–2023): Windows Server (Active Directory, GPO, IIS, RAID); Cisco networking courses (OSPF, VLAN, IPsec VPN, port security).',
            'IT security (2023, team of three): risk analysis and security plan; analysis of the Log4j vulnerability.',
          ],
        },
      },
    ],
    tech: ['aspnetcore', 'blazor', 'efcore', 'sqlserver', 'php', 'mysql', 'html5', 'css', 'bootstrap', 'jquery', 'spotsdk', 'docker', 'android', 'java', 'python', 'raspberrypi', 'arduino', 'mqtt', 'sqlite', 'bluetooth', 'lorawan', 'oracle', 'linux', 'vmware', 'mariadb', 'javafx', 'maven'],
  },
]
