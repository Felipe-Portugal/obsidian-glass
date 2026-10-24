import type { ExperienceEntry } from './types'

/**
 * Rôles de développement et de robotique à l'ITMI uniquement (CISSS et CAPRA exclus).
 * La répartition des réalisations entre le stage et l'emploi qui a suivi n'est pas
 * confirmée : elles sont présentées ensemble, pour toute la période.
 * Dates des rôles en robotique : facts_felipe.md (été 2024; hiver 2024).
 */
export const experience: readonly ExperienceEntry[] = [
  {
    id: 'software',
    roles: [
      {
        title: {
          fr: 'Assistant développeur en visualisation de données industrielles',
          en: 'Industrial Data Visualization Assistant Developer',
        },
        period: { fr: 'Mai – sept. 2025', en: 'May – Sept. 2025' },
      },
      {
        title: {
          fr: 'Stagiaire développeur en visualisation de données industrielles',
          en: 'Industrial Data Visualization Developer Intern',
        },
        period: { fr: 'Janv. – mai 2025', en: 'Jan. – May 2025' },
      },
    ],
    note: {
      fr: 'Réalisations sur l’ensemble de la période, de janvier à septembre 2025.',
      en: 'Work across the whole period, from January to September 2025.',
    },
    points: {
      fr: [
        'Contribution au développement de l’application mobile de gestion des stationnements (React Native, Expo, TypeScript) et développement de l’interface web administrateur du système.',
        'Endpoints d’API REST et composantes backend en PHP avec Nomad, framework interne d’ITMI; PostgreSQL (connexion, requêtes, migrations); schémas et requêtes SQL Server pour certaines plateformes web.',
        'Fonctionnalités d’une application web de gestion d’inventaire et de contrats; visualisations de données avec PHP et Grafana.',
        'Agile/Scrum, tickets Azure DevOps Boards, pull requests et revues de code dans Gitea; maintenance d’applications en production, formation des utilisateurs et échanges avec les clients.',
      ],
      en: [
        'Contributed to the parking management mobile app (React Native, Expo, TypeScript) and built the system’s web admin interface.',
        'REST API endpoints and backend components in PHP on Nomad, ITMI’s internal framework; PostgreSQL (connection, queries, migrations); SQL Server schemas and queries for some web platforms.',
        'Features for an inventory and contract management web app; data visualisations with PHP and Grafana.',
        'Agile/Scrum, Azure DevOps Boards tickets, pull requests and code reviews in Gitea; maintenance of production applications, user training and client communication.',
      ],
    },
  },
  {
    id: 'embedded',
    roles: [
      {
        title: {
          fr: 'Conseiller technique – Systèmes embarqués',
          en: 'Technical Advisor – Embedded Systems',
        },
        period: { fr: 'Été 2024', en: 'Summer 2024' },
      },
    ],
    points: {
      fr: [
        'Prototype fonctionnel en Python avec le Spot SDK\u00a0: sélection de missions autonomes existantes et enregistrement de nouvelles missions.',
        'Traitement automatisé des images des missions sur serveur Linux (OpenCV, Pillow, NumPy) et transmission aux utilisateurs concernés.',
        'Récupération de données de capteurs extérieurs en Rust, exploitées dans Grafana.',
        'Tests automatisés client et serveur avec pytest, incluant des tests de charge; documentation technique et formation du personnel.',
      ],
      en: [
        'Working prototype in Python with the Spot SDK: selecting existing autonomous missions and recording new ones.',
        'Automated processing of mission images on a Linux server (OpenCV, Pillow, NumPy) and delivery to the people concerned.',
        'Outdoor sensor data collection in Rust, used in Grafana.',
        'Automated client and server tests with pytest, including load tests; technical documentation and staff training.',
      ],
    },
  },
  {
    id: 'research',
    roles: [
      {
        title: { fr: 'Auxiliaire de recherche', en: 'Research Assistant' },
        period: { fr: 'Hiver 2024', en: 'Winter 2024' },
      },
    ],
    points: {
      fr: [
        'Preuve de concept en Python pour Boston Dynamics Spot, avec le Spot SDK.',
        'Tests et validation avec des capteurs et des payloads; exploration de C++.',
      ],
      en: [
        'Python proof of concept for Boston Dynamics Spot, with the Spot SDK.',
        'Testing and validation with sensors and payloads; exploration of C++.',
      ],
    },
  },
]
