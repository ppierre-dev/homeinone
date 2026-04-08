# CLAUDE.md — HomeInOne

## Identité du projet

**HomeInOne** — PWA modulaire de gestion du quotidien familial. Self-hosted via Docker (Proxmox), stockage fichiers sur NAS Ugreen DH2300 (SMB). Projet open-source et auto-hébergeable.

---

## Documents de référence

Les spécifications complètes sont dans `/docs/conception/`. Lis le document correspondant au module en cours AVANT de toucher au code.

| Document | Contenu |
|---|---|
| `01-vision-et-perimetre.md` | Vision, modules, principes directeurs |
| `02-specs-agenda-partage.md` | Specs agenda (37 user stories) |
| `02-specs-notes-listes.md` | Specs notes/tâches/envies (44 user stories) |
| `02-specs-entretien-logement.md` | Specs entretien logement (40 user stories) |
| `02-specs-entretien-vehicules.md` | Specs entretien véhicules (43 user stories) |
| `02-specs-inventaire-objets.md` | Specs inventaire objets (38 user stories) |
| `03-architecture-technique.md` | Stack, structure projet, API, sécurité, Docker |
| `04-modele-de-donnees.md` | Schéma Prisma complet (~35 tables) |
| `05-charte-graphique.md` | Palette, typo, composants UI, tokens |
| `06-roadmap-sprints.md` | Sprints, tâches, critères de done |

---

## Stack technique

| Couche | Technologie |
|---|---|
| Frontend | Next.js 14+ (App Router), React 18+, TypeScript 5+, Tailwind CSS 3+ |
| Backend | API Routes Next.js, Prisma 5+, PostgreSQL 16+ |
| Cache/Jobs | Redis 7+, BullMQ |
| Auth | NextAuth.js v5 (Auth.js), sessions Redis |
| PWA | next-pwa |
| i18n | next-intl (FR + EN) |
| Thème | next-themes (clair / sombre / système) |
| Tests | Vitest + React Testing Library (unitaires), Playwright (e2e) |
| Déploiement | Docker Compose (app + PostgreSQL + Redis) |

---

## Structure du projet

```
src/
├── app/                    # App Router (pages + API routes)
│   ├── (auth)/             # Pages publiques (login, register)
│   ├── (app)/              # Pages protégées (layout principal)
│   │   ├── dashboard/
│   │   ├── calendar/       # Module Agenda
│   │   ├── notes/          # Module Notes & Listes
│   │   ├── maintenance/    # Module Entretien logement
│   │   ├── vehicles/       # Module Entretien véhicules
│   │   ├── inventory/      # Module Inventaire objets
│   │   └── settings/
│   └── api/                # Endpoints REST
├── modules/                # Logique métier isolée par module
│   └── {module}/
│       ├── components/     # Composants React du module
│       ├── hooks/          # Hooks (TanStack Query)
│       ├── services/       # Appels API, logique métier
│       ├── types/          # Types TypeScript
│       └── utils/          # Utilitaires
├── core/                   # Éléments partagés
│   ├── components/ui/      # Primitives (Button, Input, Card, Modal...)
│   ├── components/layout/  # Shell, Sidebar, Header, BottomNav
│   ├── components/shared/  # FileUpload, Scanner, RichEditor
│   ├── hooks/
│   ├── providers/
│   └── services/
├── lib/                    # Config librairies (prisma, redis, auth, i18n, push)
├── jobs/                   # Workers BullMQ
└── styles/                 # globals.css (tokens Tailwind)
```

Ne mélange jamais la logique d'un module avec un autre. Chaque module est autonome dans `src/modules/{module}/`.

---

## Intégration avec claude-tools (agents + Notion)

Ce projet utilise les agents de [claude-tools](https://github.com/AyLabsCode/claude-tools) pour structurer le développement. Chaque agent a un rôle précis dans le cycle de vie d'une tâche.

### Cycle de vie des tâches

```
Backlog → To do → In progress → [Code review →] Functional review → Done
```

### Flux par sprint

1. Le **PO** crée les tâches du sprint dans Notion (à partir de `06-roadmap-sprints.md`)
2. `/start-task` → le PO trouve la prochaine tâche "To do" et demande confirmation
3. Le **DEV** est réveillé, lit la tâche, code, committe, passe en "Functional review"
4. Si demandé, le **Tech Lead** fait la code review
5. Le **QA** peut être invoqué pour écrire les tests
6. L'utilisateur valide → "Done"

---

## Instructions par agent

### Pour le PO

Quand tu crées des tâches Notion pour HomeInOne :

- Chaque tâche correspond à UNE user story ou UNE tâche technique de `06-roadmap-sprints.md`
- Le titre doit être clair et atomique. Bons exemples :
  - "Créer le schéma Prisma pour le module Agenda et générer la migration"
  - "Créer l'API Route GET /api/calendar/events avec pagination et filtres"
  - "Intégrer FullCalendar en vue mois avec affichage des événements"
- Mauvais exemples :
  - "Faire le module Agenda" → trop gros
  - "Coder le frontend" → trop vague
- Le brief de chaque tâche doit inclure :
  - Les user stories concernées (ex: AG-01, AG-02, AG-03)
  - Le document de specs à consulter (ex: "Lire `02-specs-agenda-partage.md` sections 3.1 et 4.1")
  - Les critères d'acceptation précis tirés des specs
- Suis l'ordre des sprints. Ne crée pas les tâches de tous les sprints d'un coup. Sprint par sprint.
- Après chaque sprint terminé, fais un checkpoint (voir section Checkpoints).

### Pour le DEV

#### Avant de coder

1. Lis la tâche Notion (brief + critères d'acceptation)
2. Lis le document de specs du module dans `/docs/conception/`
3. Consulte `04-modele-de-donnees.md` pour le schéma Prisma
4. Consulte `05-charte-graphique.md` pour les tokens visuels

#### Ordre de travail par tâche

Pour chaque tâche, suis cet ordre :

1. **Schéma Prisma** → migration (`npx prisma migrate dev --name description_courte`)
2. **Validation Zod** → schéma partagé client/serveur dans `modules/{module}/services/{module}.validation.ts`
3. **API Route** → endpoint REST avec validation + filtre `householdId`
4. **Types TypeScript** → dans `modules/{module}/types/`
5. **Hook TanStack Query** → dans `modules/{module}/hooks/`
6. **Composants** → dans `modules/{module}/components/`
7. **Page Next.js** → dans `app/(app)/{module}/`
8. **i18n** → traductions FR dans `public/locales/fr/` et EN dans `public/locales/en/`
9. **Commit** → message conventionnel (voir ci-dessous)
10. **Mise à jour Notion** → commentaire résumant le travail, passage en "Functional review"

#### Règles strictes

- TypeScript strict. Pas de `any`, pas de `@ts-ignore`.
- Imports absolus avec `@/` (ex: `@/core/components/ui/Button`).
- React Server Components par défaut. `"use client"` uniquement si nécessaire (interactivité, hooks client).
- Toute requête Prisma filtre par `householdId`. SANS EXCEPTION. C'est une faille de sécurité sinon.
- Toute requête API vérifie : session valide → appartenance au foyer → rôle si nécessaire.
- Les formulaires utilisent React Hook Form + Zod.
- Les données serveur passent par TanStack Query (useQuery, useMutation). Pas de `fetch` brut dans les composants.
- Aucun texte en dur dans le JSX. Tout passe par i18n.
- Mobile first. Chaque composant fonctionne en thème clair ET sombre.
- Utilise les composants UI de `@/core/components/ui/`. N'en recrée pas s'ils existent déjà.
- Format de réponse API standardisé :
  ```
  Succès : { data: T, meta?: { total, page, perPage, totalPages } }
  Erreur : { error: { code: string, message: string, details?: any[] } }
  ```

#### Convention de commit

```
type(scope): description
```

- Types : `feat`, `fix`, `refactor`, `chore`, `style`, `docs`, `test`
- Scopes : `calendar`, `notes`, `maintenance`, `vehicles`, `inventory`, `core`, `auth`, `prisma`, `docker`, `i18n`, `ci`
- Exemples :
  - `feat(calendar): add event CRUD API routes with Zod validation`
  - `feat(calendar): implement month view with FullCalendar`
  - `fix(notes): fix auto-save debounce losing content`
  - `refactor(core): extract FileUpload into shared component`
- Un commit = une tâche fonctionnelle. Ne committe pas du code cassé.

### Pour le QA

- Tests unitaires (Vitest) : logique métier, utilitaires, validations Zod, services
- Tests composants (React Testing Library) : composants UI isolés
- Tests e2e (Playwright) : parcours utilisateur complets
- Parcours e2e prioritaires (voir `03-architecture-technique.md` section 14.2) :
  1. Inscription → Création foyer → Invitation membre
  2. Création événement récurrent → Vérification dans l'agenda
  3. Ajout objet par scan → Garantie → Alerte
  4. Configuration logement → Modèle d'entretien → Rappel
  5. Plein carburant → Calcul consommation
- Fichiers test colocalisés : `EventForm.test.tsx` à côté de `EventForm.tsx`
- Fichiers e2e dans `e2e/`
- Ne modifie jamais le code source pour faire passer un test. Signale le bug.

### Pour le Tech Lead

Critères de review HomeInOne :

- Structure respectée (logique métier isolée par module, pas de cross-import sauvage)
- TypeScript strict (pas de `any`, pas de cast dangereux)
- Toute requête Prisma filtre par `householdId`
- Validation Zod présente côté API
- Composants UI de `@/core/components/ui/` réutilisés (pas de duplication)
- Charte graphique respectée (couleurs, fonts, border-radius, spacing — voir `05-charte-graphique.md`)
- i18n complète (FR + EN, pas de texte en dur)
- Responsive (mobile first) et dark mode fonctionnels
- Critères d'acceptation de la tâche Notion couverts
- Pas de secrets hardcodés
- Si KO : commentaire précis dans Notion, tâche repassée en "In progress"

---

## Charte graphique — Aide-mémoire

| Token | Valeur |
|---|---|
| Primary (light) | `#4A7C59` (vert sauge) |
| Primary (dark) | `#6BAF7B` |
| Fond (light) | `#FAFAF8` (crème) |
| Fond (dark) | `#141413` |
| Font titres | DM Serif Display |
| Font corps | DM Sans |
| Font mono | JetBrains Mono |
| Border radius boutons/inputs | `10px` |
| Border radius cartes | `14px` |
| Border radius modales/bottom sheets | `20px` |
| Shadow cartes (light) | `0 1px 2px rgba(0,0,0,0.04)` |
| Zones de tap mobile | min `44×44px` |

Couleurs modules : Agenda `#4A7C59`, Notes `#E67E22`, Logement `#2980B9`, Véhicules `#8E44AD`, Inventaire `#16A085`

Consulte `05-charte-graphique.md` pour la palette complète, les variantes dark mode et tous les composants.

---

## Conventions de nommage

| Élément | Convention | Exemple |
|---|---|---|
| Composants React | PascalCase | `EventForm.tsx` |
| Services/utils | camelCase | `calendar.service.ts` |
| Types | camelCase | `calendar.types.ts` |
| Dossiers | kebab-case | `fuel-logs/` |
| Variables/fonctions | camelCase | `getEventById` |
| Types/Interfaces | PascalCase, sans préfixe I | `Event` |
| Enums Prisma | PascalCase / UPPER_SNAKE | `TaskStatus.TODO` |
| Clés i18n | dot notation | `calendar.event.title` |

---

## Optimisation tokens — RTK

Ce projet utilise [RTK (Rust Token Killer)](https://github.com/rtk-ai/rtk) pour réduire la consommation de tokens de 60-90% sur les commandes CLI. RTK est installé globalement via `rtk init -g`.

### Commandes à préfixer avec `rtk`

Utilise toujours `rtk` devant les commandes à sortie verbeuse :

```bash
# Git
rtk git status
rtk git diff
rtk git log --oneline -20
rtk git diff --staged

# NPM / Node
rtk npm install
rtk npm run build
rtk npm test
rtk npx tsc --noEmit
rtk npx prisma migrate status
rtk npx prisma migrate dev --name description

# Docker
rtk docker compose up -d
rtk docker compose logs app
rtk docker ps

# Fichiers et recherche
rtk find src -name "*.tsx" -type f
rtk cat package.json
rtk ls -la src/modules/

# Tests
rtk npx vitest run
rtk npx playwright test
```

### Commandes à NE PAS préfixer

Les commandes courtes ou interactives ne bénéficient pas de RTK :

```bash
# Pas besoin de rtk
mkdir -p src/modules/calendar
touch src/modules/calendar/index.ts
cp .env.example .env
echo "done"
cd src
```

### Règle simple

Si la commande produit plus de ~10 lignes de sortie, préfixe avec `rtk`. Si elle produit peu ou pas de sortie, ne préfixe pas.

### Suivi des économies

Vérifie régulièrement les économies réalisées :

```bash
rtk gain           # Résumé des tokens économisés
rtk gain --history # Historique détaillé
```

---

## Checkpoints

Après chaque lot de tâches (fin d'un lot de sprint, ou ~5-10 commits) :

- [ ] L'app démarre sans erreur (`docker compose up`)
- [ ] Migrations Prisma propres (`npx prisma migrate status`)
- [ ] Zéro erreur TypeScript (`npx tsc --noEmit`)
- [ ] ESLint passe sans erreur (`npx eslint src/`)
- [ ] Tests passent (`npm test`)
- [ ] CI GitHub Actions au vert
- [ ] Rendu correct sur mobile (Chrome DevTools responsive)
- [ ] Thème sombre fonctionne
- [ ] Textes traduits FR + EN
- [ ] Mettre à jour `TODO.md` avec les problèmes connus et la dette technique

---

## Interdictions

- Implémenter des features non présentes dans les specs
- Changer la structure du projet définie dans `03-architecture-technique.md`
- Ajouter des librairies hors stack sans justification
- Ignorer les erreurs TypeScript
- Hardcoder des chaînes en français dans le JSX
- Oublier le dark mode ou le responsive mobile
- Faire des requêtes Prisma sans filtre `householdId`
- Stocker des secrets dans le code (tout passe par `.env`)
- Committer du code qui ne compile pas
- Coder un module entier en une seule tâche géante
- Merger une PR avec la CI au rouge
- Désactiver ou skip des étapes de la CI pour faire passer un build
