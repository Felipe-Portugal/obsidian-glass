import type { TechId } from './technologies'
import type { DiagramNode, Project } from './types'
import { validated } from './validation'

const pytorch = validated.pytorchDetection

const detectionNode: DiagramNode = {
  id: 'detection',
  label: { fr: 'Détection', en: 'Detection' },
  detail: pytorch
    ? { fr: 'Repérage des manomètres (PyTorch)', en: 'Locating the gauges (PyTorch)' }
    : { fr: 'Repérage des manomètres', en: 'Locating the gauges' },
  kind: 'step',
  contributed: true,
  ...(pytorch ? { tech: ['pytorch'] as const } : {}),
}

const spotImageTech: TechId[] = ['python', 'spotsdk', 'spotcam', 'linux', 'opencv', 'pillow', 'numpy']
if (pytorch) spotImageTech.push('pytorch')

export const projects: readonly Project[] = [
  {
    id: 'parking',
    layout: 'wide',
    title: { fr: 'Gestion des stationnements', en: 'Parking management' },
    context: { fr: 'ITMI · Cégep de Sept-Îles', en: 'ITMI · Cégep de Sept-Îles' },
    maturity: {
      kind: 'deployed',
      label: { fr: 'Déployée à l’interne', en: 'Deployed internally' },
    },
    summary: {
      fr: 'Une application mobile et une interface d’administration pour simplifier la demande et la gestion des vignettes de stationnement du Cégep de Sept-Îles.',
      en: 'A mobile app and an admin interface to simplify parking permit requests and management at Cégep de Sept-Îles.',
    },
    contribution: {
      fr: 'Application mobile, pages d’administration, certains endpoints d’API REST et composantes backend, paiement Stripe.',
      en: 'Mobile app, admin pages, some REST API endpoints and backend components, Stripe payments.',
    },
    result: {
      fr: 'Les demandes de vignettes sont plus rapides à traiter. L’administration et les surveillants disposent d’un historique, des factures et du lien entre chaque vignette et le bon véhicule.',
      en: 'Permit requests are faster to process. Administrators and parking staff can access the history, invoices and the vehicle linked to each permit.',
    },
    cardTech: ['reactnative', 'expo', 'typescript', 'php', 'postgresql'],
    detail: {
      context: {
        fr: [
          'Auparavant, une personne devait faire la file pour obtenir un formulaire, le transmettre à un autre bureau pour approbation, puis payer avant de recevoir une vignette physique. Le projet visait à accélérer ce parcours pour les utilisateurs, l’administration et les surveillants.',
          'L’application est déployée à l’interne pour le personnel du Cégep et quelques utilisateurs externes. Elle n’est pas publiée sur les magasins d’applications.',
        ],
        en: [
          'Previously, a person had to queue for a form, send it to another office for approval, then pay before receiving a physical permit. The project aimed to speed up this process for users, administrators and parking staff.',
          'The app is deployed internally for the Cégep’s staff and a few external users. It is not published on the app stores.',
        ],
      },
      role: {
        fr: [
          'Contribuer au développement de l’application mobile côté client, avec React Native, Expo et TypeScript.',
          'Développer des pages de l’interface web administrateur\u00a0: traitement des demandes de vignettes, consultation de l’historique et des factures, et lien entre chaque vignette et son véhicule, avec les formulaires et les vues associés.',
          'Développer certains endpoints d’API REST et certaines composantes backend en PHP, avec Nomad, le framework interne d’ITMI.',
          'Travailler sur la connexion PostgreSQL, les requêtes et les migrations.',
          'Intégrer l’authentification de base et l’authentification Microsoft dans l’application client.',
          'Intégrer le paiement Stripe avec les outils fournis par Stripe, côté client dans l’application mobile et côté serveur dans l’API PHP.',
        ],
        en: [
          'Contributed to the development of the client-side mobile app, with React Native, Expo and TypeScript.',
          'Built pages of the web admin interface: processing permit requests, viewing the history and invoices, and linking each permit to its vehicle, with the related forms and views.',
          'Developed some of the REST API endpoints and backend components in PHP, on Nomad, ITMI’s internal framework.',
          'Worked on the PostgreSQL connection, queries and migrations.',
          'Integrated basic authentication and Microsoft authentication in the client app.',
          'Integrated Stripe payments with the tools Stripe provides, on the client side in the mobile app and on the server side in the PHP API.',
        ],
      },
      challenge: {
        fr: 'Implémenter le paiement avec Stripe, dont le traitement devait s’accorder côté client, dans l’application mobile, et côté serveur, dans l’API PHP.',
        en: 'Implementing payments with Stripe, with processing that had to line up on the client side, in the mobile app, and on the server side, in the PHP API.',
      },
      approach: {
        fr: [
          'Le paiement s’appuie sur les outils fournis par Stripe des deux côtés\u00a0: côté client, dans le parcours de l’application mobile, et côté serveur, dans le backend PHP construit sur Nomad.',
          'Le détail du flux de paiement appartient au client et n’est pas exposé ici.',
        ],
        en: [
          'Payments rely on the tools Stripe provides on both sides: on the client, in the mobile app’s flow, and on the server, in the PHP backend built on Nomad.',
          'The details of the payment flow belong to the client and are not disclosed here.',
        ],
      },
      practices: {
        fr: [
          'Agile/Scrum\u00a0: sprints et réunions quotidiennes, tickets dans Azure DevOps Boards.',
          'Pull requests et revues de code dans Gitea, avec une stratégie de branches.',
          'Docker comme fondement des projets.',
        ],
        en: [
          'Agile/Scrum: sprints and daily stand-ups, tickets in Azure DevOps Boards.',
          'Pull requests and code reviews in Gitea, with a branching strategy.',
          'Docker as the foundation of the projects.',
        ],
      },
      diagram: {
        title: { fr: 'Architecture conceptuelle', en: 'Conceptual architecture' },
        description: {
          fr: 'Vue simplifiée et non exhaustive du système.',
          en: 'A simplified, non-exhaustive view of the system.',
        },
        flows: [
          {
            id: 'core',
            link: 'exchange',
            summary: {
              fr: 'L’application mobile échange avec l’API REST en PHP, qui échange avec la base PostgreSQL.',
              en: 'The mobile app exchanges data with the PHP REST API, which exchanges data with the PostgreSQL database.',
            },
            nodes: [
              {
                id: 'mobile',
                label: { fr: 'Application mobile', en: 'Mobile app' },
                detail: { fr: 'React Native · Expo · TypeScript', en: 'React Native · Expo · TypeScript' },
                tech: ['reactnative', 'expo', 'typescript'],
                kind: 'component',
                contributed: true,
              },
              {
                id: 'api',
                label: { fr: 'API REST', en: 'REST API' },
                detail: { fr: 'PHP · Nomad (framework interne)', en: 'PHP · Nomad (internal framework)' },
                tech: ['php'],
                kind: 'component',
                contributed: true,
              },
              {
                id: 'db',
                label: { fr: 'PostgreSQL', en: 'PostgreSQL' },
                detail: { fr: 'Base de données', en: 'Database' },
                tech: ['postgresql'],
                kind: 'store',
              },
            ],
          },
        ],
        groups: [
          {
            id: 'services',
            variant: 'service',
            title: { fr: 'Services tiers intégrés', en: 'Integrated third-party services' },
            nodes: [
              {
                id: 'microsoft',
                label: { fr: 'Authentification Microsoft', en: 'Microsoft authentication' },
                tech: ['msauth'],
                kind: 'service',
              },
              {
                id: 'stripe',
                label: { fr: 'Paiement Stripe', en: 'Stripe payments' },
                tech: ['stripe'],
                kind: 'service',
              },
            ],
          },
        ],
        legend: ['contributed', 'exchange', 'service'],
        note: {
          fr: 'Les échanges exacts avec les services tiers ne sont pas représentés.',
          en: 'The exact exchanges with the third-party services are not shown.',
        },
      },
      tech: [
        {
          title: { fr: 'Application et services', en: 'App and services' },
          items: ['reactnative', 'expo', 'typescript', 'php', 'rest', 'postgresql', 'stripe', 'msauth'],
        },
        {
          title: { fr: 'Outils d’équipe', en: 'Team tooling' },
          items: ['docker', 'gitea', 'azuredevops'],
        },
      ],
      limits: {
        fr: [
          'Une lecture de plaques par OCR était en développement\u00a0: elle n’est pas présentée comme une fonctionnalité terminée.',
          'Projet client\u00a0: le code, les données et les captures d’écran ne sont pas publiés.',
        ],
        en: [
          'Licence plate recognition (OCR) was still in development: it is not presented as a finished feature.',
          'Client project: code, data and screenshots are not published.',
        ],
      },
    },
  },
  {
    id: 'spot',
    layout: 'tall',
    title: { fr: 'Robotique Boston Dynamics Spot', en: 'Boston Dynamics Spot robotics' },
    context: { fr: 'ITMI · Systèmes embarqués', en: 'ITMI · Embedded systems' },
    maturity: {
      kind: 'prototype',
      label: { fr: 'Prototype fonctionnel', en: 'Working prototype' },
    },
    summary: {
      fr: 'Exploiter automatiquement les photos et les données recueillies par le robot Spot pendant ses missions.',
      en: 'Automatically processing the photos and data the Spot robot collects during its missions.',
    },
    contribution: {
      fr: 'Python et Spot SDK\u00a0: missions, détection et lecture des manomètres, export des données, capteurs dans InfluxDB et Grafana.',
      en: 'Python and Spot SDK: missions, gauge detection and reading, data export, sensors in InfluxDB and Grafana.',
    },
    result: {
      fr: 'Le personnel accède rapidement aux données des missions, traitées sur le serveur et déposées dans un répertoire en fichiers Excel et CSV.',
      en: 'Staff can quickly access mission data processed on the server and placed in a directory as Excel and CSV files.',
    },
    cardTech: ['python', 'spotsdk', 'pytorch', 'opencv', 'rust'],
    detail: {
      context: {
        fr: [
          'Pendant ses missions, Spot photographie des manomètres et d’autres instruments avec sa caméra Spot CAM+IR.',
          'Au retour à la station, où il dispose d’une connexion Ethernet, les données sont téléversées vers un serveur Linux pour y être traitées.',
        ],
        en: [
          'During its missions, Spot photographs pressure gauges and other instruments with its Spot CAM+IR camera.',
          'Back at the station, where it has an Ethernet connection, the data is uploaded to a Linux server for processing.',
        ],
      },
      role: {
        fr: [
          'Développer en Python, avec le Spot SDK, un prototype fonctionnel qui permet de sélectionner des missions autonomes existantes et d’en enregistrer de nouvelles.',
          'Implémenter sur le serveur Linux la chaîne de traitement des photos de mission\u00a0: détection des manomètres avec un modèle PyTorch, lecture de leurs valeurs par OCR (OpenCV, Pillow, NumPy), puis export des données formatées en fichiers Excel et CSV dans un répertoire accessible au personnel concerné.',
          'Récupérer en Rust les données de différents capteurs extérieurs, les stocker dans InfluxDB et les visualiser dans Grafana.',
          'Écrire des tests automatisés client et serveur en Python avec pytest, incluant des tests de charge.',
          'Rédiger la documentation technique et former le personnel.',
        ],
        en: [
          'Developed in Python, with the Spot SDK, a working prototype for selecting existing autonomous missions and recording new ones.',
          'Implemented the mission photo pipeline on the Linux server: gauge detection with a PyTorch model, reading their values with OCR (OpenCV, Pillow, NumPy), then exporting the formatted data as Excel and CSV files to a directory accessible to the relevant staff.',
          'Collected data from various outdoor sensors in Rust, stored it in InfluxDB and visualised it in Grafana.',
          'Wrote automated client and server tests in Python with pytest, including load tests.',
          'Wrote the technical documentation and trained staff.',
        ],
      },
      challenge: {
        fr: 'Identifier de façon fiable les bons objets dans l’image, les manomètres, puis lire leurs valeurs avec précision par OCR.',
        en: 'Reliably identifying the right objects in the image, the pressure gauges, then reading their values accurately with OCR.',
      },
      approach: {
        fr: [
          pytorch
            ? 'Sur le serveur Linux, le traitement se fait en deux temps\u00a0: un modèle PyTorch repère les manomètres dans chaque photo, puis l’OCR extrait leurs valeurs.'
            : 'Sur le serveur Linux, le traitement se fait en deux temps\u00a0: un modèle de détection repère les manomètres dans chaque photo, puis l’OCR extrait leurs valeurs.',
          'Les données des capteurs suivent une chaîne distincte\u00a0: collecte en Rust, stockage dans InfluxDB, visualisation dans Grafana.',
        ],
        en: [
          pytorch
            ? 'On the Linux server, processing happens in two stages: a PyTorch model locates the gauges in each photo, then OCR extracts their values.'
            : 'On the Linux server, processing happens in two stages: a detection model locates the gauges in each photo, then OCR extracts their values.',
          'Sensor data follows a separate pipeline: collection in Rust, storage in InfluxDB, visualisation in Grafana.',
        ],
      },
      diagram: {
        title: { fr: 'Deux chaînes de traitement', en: 'Two processing pipelines' },
        description: {
          fr: 'Vue conceptuelle\u00a0: images des missions d’un côté, données des capteurs de l’autre.',
          en: 'Conceptual view: mission images on one side, sensor data on the other.',
        },
        flows: [
          {
            id: 'images',
            title: { fr: 'Images des missions', en: 'Mission images' },
            link: 'sequence',
            summary: {
              fr: 'Les photos de la Spot CAM+IR sont transférées au retour à la station et traitées sur le serveur Linux. Les données formatées sont déposées dans un répertoire en fichiers Excel et CSV.',
              en: 'Spot CAM+IR photos are transferred back at the station and processed on the Linux server. The formatted data is placed in a directory as Excel and CSV files.',
            },
            nodes: [
              {
                id: 'cam',
                label: { fr: 'Spot CAM+IR', en: 'Spot CAM+IR' },
                detail: { fr: 'Photos des instruments en mission', en: 'Instrument photos during missions' },
                kind: 'device',
              },
              {
                id: 'station',
                label: { fr: 'Station', en: 'Station' },
                detail: { fr: 'Transfert au retour (Ethernet)', en: 'Transfer on return (Ethernet)' },
                kind: 'step',
              },
              {
                id: 'server',
                label: { fr: 'Serveur Linux', en: 'Linux server' },
                detail: { fr: 'Réception et traitement', en: 'Intake and processing' },
                tech: ['linux', 'python'],
                kind: 'component',
                contributed: true,
              },
              detectionNode,
              {
                id: 'ocr',
                label: { fr: 'OCR', en: 'OCR' },
                detail: { fr: 'Lecture des valeurs', en: 'Reading the values' },
                kind: 'step',
                contributed: true,
              },
              {
                id: 'values',
                label: { fr: 'Fichiers Excel et CSV', en: 'Excel and CSV files' },
                detail: { fr: 'Répertoire accessible au personnel', en: 'Directory accessible to staff' },
                kind: 'result',
                contributed: true,
              },
            ],
          },
          {
            id: 'sensors',
            title: { fr: 'Données des capteurs', en: 'Sensor data' },
            link: 'sequence',
            summary: {
              fr: 'Les données des capteurs sont collectées en Rust, stockées dans InfluxDB et visualisées dans Grafana.',
              en: 'Sensor data is collected in Rust, stored in InfluxDB and visualised in Grafana.',
            },
            nodes: [
              {
                id: 'sensors',
                label: { fr: 'Capteurs', en: 'Sensors' },
                detail: { fr: 'Capteurs extérieurs', en: 'Outdoor sensors' },
                kind: 'device',
              },
              {
                id: 'rust',
                label: { fr: 'Collecte', en: 'Collection' },
                detail: { fr: 'Rust', en: 'Rust' },
                tech: ['rust'],
                kind: 'component',
                contributed: true,
              },
              {
                id: 'influx',
                label: { fr: 'InfluxDB', en: 'InfluxDB' },
                detail: { fr: 'Séries temporelles', en: 'Time series' },
                tech: ['influxdb'],
                kind: 'store',
                contributed: true,
              },
              {
                id: 'grafana',
                label: { fr: 'Grafana', en: 'Grafana' },
                detail: { fr: 'Visualisation', en: 'Visualisation' },
                tech: ['grafana'],
                kind: 'result',
                contributed: true,
              },
            ],
          },
        ],
        legend: ['contributed', 'sequence'],
        note: {
          fr: 'Schéma conceptuel\u00a0: l’emplacement des autres composants et le détail des flux ne sont pas représentés.',
          en: 'Conceptual diagram: the location of other components and the detail of the flows are not shown.',
        },
      },
      tech: [
        { title: { fr: 'Images des missions', en: 'Mission images' }, items: spotImageTech },
        {
          title: { fr: 'Capteurs et qualité', en: 'Sensors and quality' },
          items: ['rust', 'influxdb', 'grafana', 'pytest'],
        },
      ],
      limits: {
        fr: [
          'Prototype fonctionnel\u00a0: la détection et la lecture des valeurs ne sont pas présentées comme déployées en production.',
          'Les images et les données des missions ne sont pas publiées.',
        ],
        en: [
          'Working prototype: detection and value reading are not presented as deployed in production.',
          'Mission images and data are not published.',
        ],
      },
    },
  },
  {
    id: 'embedded',
    layout: 'compact',
    title: { fr: 'Surveillance d’un logement temporaire', en: 'Temporary accommodation monitoring' },
    context: { fr: 'Cégep de Sept-Îles', en: 'Cégep de Sept-Îles' },
    maturity: {
      kind: 'individual',
      label: { fr: 'Projet individuel', en: 'Individual project' },
    },
    summary: {
      fr: 'Une solution Android, Raspberry Pi et Arduino conçue pour surveiller un hébergement temporaire, comme une chambre d’hôtel.',
      en: 'An Android, Raspberry Pi and Arduino solution designed to monitor temporary lodging, such as a hotel room.',
    },
    contribution: {
      fr: 'Conception du système, capteurs (mouvement, micro, caméra), programmation embarquée et application Android.',
      en: 'System design, sensors (motion, microphone, camera), embedded programming and the Android app.',
    },
    result: {
      fr: 'Le projet a réuni une application Android et des composants embarqués pour répondre au besoin des personnes en déplacement de surveiller leur logement temporaire en continu.',
      en: 'The project brought together an Android app and embedded components to address travellers’ need to monitor their temporary lodging continuously.',
    },
    cardTech: ['android', 'java', 'raspberrypi', 'python', 'arduino'],
    detail: {
      context: {
        fr: ['Projet individuel réalisé pour le Cégep de Sept-Îles. Il a été pensé pour les personnes en déplacement qui veulent s’assurer que leur logement temporaire, par exemple une chambre d’hôtel, est surveillé en tout temps.'],
        en: ['An individual project built for Cégep de Sept-Îles. It was designed for travellers who want their temporary lodging, such as a hotel room, monitored at all times.'],
      },
      role: {
        fr: [
          'Concevoir seul un véritable système de surveillance, qui combine plusieurs capteurs\u00a0: détecteur de mouvement, microphone et caméra, entre autres.',
          'Programmer le Raspberry Pi en Python et l’Arduino pour lire ces capteurs, avec les interfaces matérielles GPIO, I2C, SPI et UART et une horloge temps réel (RTC).',
          'Mettre en œuvre le traitement local et les communications réseau entre les composantes.',
          'Développer l’application Android en Java, avec Android Studio.',
        ],
        en: [
          'As an individual project, designed a real monitoring system combining several sensors: a motion detector, a microphone and a camera, among others.',
          'Programmed the Raspberry Pi in Python and the Arduino to read these sensors, through GPIO, I2C, SPI and UART hardware interfaces and a real-time clock (RTC).',
          'Implemented local processing and network communications between the components.',
          'Developed the Android app in Java, with Android Studio.',
        ],
      },
      practices: {
        fr: [
          'Cahier des charges et échéancier.',
          'Rencontres avec le client.',
          'Documentation et validation des livrables.',
        ],
        en: [
          'Requirements specification and schedule.',
          'Meetings with the client.',
          'Documentation and deliverable sign-off.',
        ],
      },
      diagram: {
        title: { fr: 'Composantes du projet', en: 'Project components' },
        description: {
          fr: 'Les trois composantes attestées et les capacités communes au projet.',
          en: 'The three documented components and the capabilities shared across the project.',
        },
        flows: [
          {
            id: 'components',
            link: 'none',
            summary: {
              fr: 'Le projet réunit une application Android, un Raspberry Pi et un Arduino; leurs liaisons précises ne sont pas représentées.',
              en: 'The project combines an Android app, a Raspberry Pi and an Arduino; their exact connections are not shown.',
            },
            nodes: [
              {
                id: 'android',
                label: { fr: 'Application Android', en: 'Android app' },
                detail: { fr: 'Java · Android Studio', en: 'Java · Android Studio' },
                tech: ['android', 'java'],
                kind: 'component',
                contributed: true,
              },
              {
                id: 'rpi',
                label: { fr: 'Raspberry Pi', en: 'Raspberry Pi' },
                detail: { fr: 'Python', en: 'Python' },
                tech: ['raspberrypi', 'python'],
                kind: 'device',
                contributed: true,
              },
              {
                id: 'arduino',
                label: { fr: 'Arduino', en: 'Arduino' },
                detail: { fr: 'Microcontrôleur', en: 'Microcontroller' },
                tech: ['arduino'],
                kind: 'device',
                contributed: true,
              },
            ],
          },
        ],
        groups: [
          {
            id: 'capabilities',
            variant: 'band',
            title: { fr: 'Commun au projet', en: 'Across the project' },
            nodes: [
              { id: 'sensors', label: { fr: 'Capteurs\u00a0: mouvement, micro, caméra', en: 'Sensors: motion, microphone, camera' } },
              { id: 'local', label: { fr: 'Traitement local', en: 'Local processing' } },
              { id: 'network', label: { fr: 'Communications réseau', en: 'Network communications' } },
              { id: 'buses', label: { fr: 'GPIO · I2C · SPI · UART', en: 'GPIO · I2C · SPI · UART' } },
              { id: 'rtc', label: { fr: 'Horloge temps réel (RTC)', en: 'Real-time clock (RTC)' } },
            ],
          },
        ],
        legend: ['contributed', 'band'],
        note: {
          fr: 'Les liaisons précises entre l’application, le Raspberry Pi et l’Arduino ne sont pas représentées.',
          en: 'The exact connections between the app, the Raspberry Pi and the Arduino are not shown.',
        },
      },
      tech: [
        {
          title: { fr: 'Technologies', en: 'Technologies' },
          items: ['android', 'java', 'androidstudio', 'raspberrypi', 'python', 'arduino', 'buses', 'rtc'],
        },
      ],
    },
  },
]
