# Obsidian Glass

ePortfolio de Felipe Portugal, développeur logiciel polyvalent : une seule page, bilingue (français et anglais), avec mode clair, mode sombre et mode automatique.

React 19, Vite et TypeScript strict. Aucune dépendance d'interface lourde, aucun suivi, aucun cookie.

## Démarrage

Prérequis : Node.js 20.19 ou plus récent, npm.

```bash
npm install
npm run dev
```

Le site est servi sur `http://localhost:5173/`.

## Scripts

| Commande | Rôle |
|---|---|
| `npm run dev` | Serveur de développement avec rechargement à chaud |
| `npm run build` | Vérification TypeScript puis build de production dans `dist/` |
| `npm run preview` | Sert le build de `dist/` localement |
| `npm run typecheck` | TypeScript strict, sans émission |
| `npm run lint` | oxlint (règles React, TypeScript et accessibilité jsx-a11y) |
| `npm run test` | Tests Vitest (contenu, logique, interface) |
| `npm run check` | Les quatre contrôles à la suite : typecheck, lint, tests, build |
| `npm run icons` | Régénère `src/data/icons.generated.ts` à partir des paquets de logos |

`npm run check` est la commande à lancer avant toute publication ; le workflow GitHub Pages exécute la même.

## Organisation

```
src/
  data/          contenu : profil, projets, expérience, compétences, technologies
  i18n/          libellés d'interface FR/EN, détection et mémorisation de la langue
  theme/         thème auto / clair / sombre
  sections/      sections de la page (accueil, projets, expérience, compétences et formation)
  components/    fenêtres, schémas d'architecture, logos, dock, formulaire de contact
  styles/        jetons de design, base, mise en page
  lib/           utilitaires (stockage local, validation du contact, reflet au pointeur)
  test/          tests Vitest
scripts/
  extract-icons.mjs   extraction des logos de technologies
.github/workflows/
  deploy.yml          publication manuelle sur GitHub Pages
```

## Contenu et traductions

Tout le texte vit dans `src/data/` (contenu) et `src/i18n/ui.ts` (interface). Chaque texte traduisible est un objet `{ fr, en }` (type `Localized`) : TypeScript refuse un texte auquel il manque une langue.

- `profile.ts` : nom, courriel, LinkedIn, lieu, CV.
- `projects.ts` : les trois projets, leur fiche détaillée et leur schéma d'architecture.
- `experience.ts`, `skills.ts` : parcours, compétences, formation.
- `technologies.ts` : catalogue des technologies (nom affiché, logo ou monogramme).
- `validation.ts` : précisions en attente de confirmation (voir « Éléments à valider »).
- `ui.ts` : libellés d'interface, messages d'erreur, textes d'accessibilité.

Langue initiale : choix mémorisé, sinon langue du navigateur (`fr*` → français, `en*` → anglais), sinon français. Le choix est mémorisé dans `localStorage` (`og-lang`) ; `<html lang>`, le titre et les métadonnées suivent.

Le contenu est volontairement factuel : aucune métrique, aucune capture d'écran, aucun élément confidentiel des projets clients. Les tests de `src/test/content.test.ts` vérifient une partie de ces règles. Un fichier local facultatif `.content-guard.local` (non versionné, au format `{ "forbidden": ["…"] }`) permet d'ajouter des termes privés que le site ne doit jamais contenir.

## CV en PDF

Le CV n'est pas encore publié : `profile.resume` vaut `null`, et le dock propose alors « CV sur demande », qui ouvre la fenêtre de contact avec un objet prérempli.

Pour publier le CV :

1. Préparer un PDF **sans numéro de téléphone**.
2. Le déposer dans `public/cv/`, par exemple `public/cv/Felipe_Portugal_CV_FR.pdf` et `public/cv/Felipe_Portugal_CV_EN.pdf`.
3. Dans `src/data/profile.ts` :

   ```ts
   resume: { fr: 'cv/Felipe_Portugal_CV_FR.pdf', en: 'cv/Felipe_Portugal_CV_EN.pdf' },
   ```

Un test vérifie que les fichiers déclarés existent bien dans `public/`.

## Formulaire de contact (Formspree)

Le formulaire utilise [Formspree](https://formspree.io), compatible avec un site statique. Tant qu'aucun formulaire n'est configuré, la fenêtre de contact le dit clairement et propose le courriel direct ; aucun envoi n'est simulé.

1. Créer un compte Formspree et un formulaire ; noter son identifiant (la partie finale de `https://formspree.io/f/<identifiant>`).
2. En local : créer `.env.local` (non versionné) avec `VITE_FORMSPREE_ID=<identifiant>`.
3. Pour GitHub Pages : dans le dépôt, *Settings → Secrets and variables → Actions → Variables*, ajouter la variable `VITE_FORMSPREE_ID`.

L'identifiant Formspree est public par nature (il figure dans le HTML de tout formulaire Formspree) ; ce n'est pas un secret. Le formulaire envoie le courriel, l'objet et le message, avec un champ piège contre les robots. Dans Formspree, restreindre les domaines autorisés au domaine du site est recommandé.

## Publication sur GitHub Pages

Le workflow `.github/workflows/deploy.yml` construit le site et le publie sur GitHub Pages. Il ne se déclenche **que manuellement** (onglet *Actions* → « Publier sur GitHub Pages » → *Run workflow*).

1. Placer ce dossier à la racine d'un dépôt GitHub.
2. *Settings → Pages → Build and deployment → Source* : choisir **GitHub Actions**.
3. Facultatif : définir la variable `VITE_FORMSPREE_ID` (voir plus haut).
4. Lancer le workflow.

Chemin de base : un site de projet est servi sous `/<dépôt>/`, un site utilisateur (`<compte>.github.io`) ou un domaine personnalisé sous `/`. Le workflow obtient le bon chemin de `actions/configure-pages` et le transmet au build par la variable `BASE_PATH`. Pour tester un build local sous un sous-chemin :

```bash
BASE_PATH=/mon-depot npm run build
```

Le site n'a qu'une page et aucun routeur : pas de problème de rafraîchissement des sous-routes sur GitHub Pages. GitHub Pages ne permettant pas d'en-têtes HTTP personnalisés, la politique de sécurité du contenu (CSP) est injectée au build dans une balise `<meta>`, avec l'empreinte du seul script inline (choix du thème et de la langue avant l'affichage).

## Personnalisation visuelle

- **Couleurs, typographie, rayons, ombres, durées** : `src/styles/tokens.css`. Le thème sombre est la référence ; le bloc `[data-theme='light']` en est l'équivalent clair.
- **Police** : Geist (variable, auto-hébergée via `@fontsource-variable/geist`).
- **Mise en page** : `src/styles/layout.css` (grille de 12 colonnes, largeur maximale, sections).
- **Logos** : ajouter une entrée dans `SOURCES` de `scripts/extract-icons.mjs`, lancer `npm run icons`, puis référencer la technologie dans `src/data/technologies.ts`. Le script corrige au besoin la couleur de marque pour garder un contraste d'au moins 3:1 sur les pastilles, dans les deux thèmes. Si les fonds de pastilles changent dans `tokens.css`, mettre à jour `TILE_DARK` et `TILE_LIGHT` dans le script.
- **Mouvement** : toutes les animations respectent `prefers-reduced-motion`.

## Accessibilité et vie privée

- Fenêtres sur `<dialog>` natif : fond inerte, touche Échap, focus déplacé à l'ouverture et rendu à la fermeture, défilement de la page bloqué.
- Rangées de logos navigables aux flèches (une seule tabulation par rangée), avec infobulle au survol, au focus et au toucher.
- Lien d'évitement, contrastes vérifiés dans les deux thèmes, schémas lisibles sans la couleur.
- Aucun outil d'analyse, aucun cookie, aucune requête vers un tiers hormis Formspree à l'envoi du formulaire. Seules les préférences de langue (`og-lang`) et de thème (`og-theme`) sont gardées dans le navigateur.

## Éléments à valider

| Élément | État | Où le modifier |
|---|---|---|
| CV en PDF sans téléphone | À fournir ; « CV sur demande » en attendant | `public/cv/`, `src/data/profile.ts` |
| Identifiant Formspree | À configurer ; courriel direct en attendant | `.env.local`, variable de dépôt |
| Dépôt et adresse GitHub Pages | À choisir ; workflow prêt, non lancé | `.github/workflows/deploy.yml` |
| Détection par PyTorch (projet Spot) | À confirmer ; le site dit « un modèle de détection » | `src/data/validation.ts` |
| Adresse canonique et image de partage | À ajouter une fois le domaine connu | `index.html` |

## Licences

Code et contenu : Felipe Portugal. Licence du code à définir avant publication du dépôt.

Logos de technologies : extraits de [Simple Icons](https://simpleicons.org) (CC0 1.0) et de [Devicon](https://devicon.dev) (MIT). Les marques et logos restent la propriété de leurs détenteurs respectifs et ne sont utilisés que pour désigner les technologies employées.
