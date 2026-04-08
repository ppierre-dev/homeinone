# HomeInOne — Architecture technique 🏗

## 1. Vue d'ensemble

HomeInOne est une PWA modulaire déployée en self-hosted via Docker. L'application est conçue pour fonctionner sur un serveur local (Proxmox, mini PC, Raspberry Pi) avec un stockage de fichiers configurable : local (même machine que l'app) ou déporté (NAS via SMB/NFS).

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENTS                               │
│  📱 Mobile (PWA)    📱 Tablet (PWA)    💻 Desktop (PWA)  │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTPS (reverse proxy)
┌──────────────────────▼──────────────────────────────────┐
│                PROXMOX / SERVEUR LOCAL                    │
│  ┌─────────────────────────────────────────────────┐     │
│  │              Docker Compose                      │     │
│  │  ┌──────────────┐  ┌──────────────┐             │     │
│  │  │  Next.js App  │  │  PostgreSQL  │             │     │
│  │  │  (Frontend +  │  │  (Base de    │             │     │
│  │  │   API Routes) │  │   données)   │             │     │
│  │  │  Port 3000    │  │  Port 5432   │             │     │
│  │  └──────┬───────┘  └──────────────┘             │     │
│  │         │                                        │     │
│  │  ┌──────▼───────┐  ┌──────────────┐             │     │
│  │  │    Prisma     │  │    Redis     │             │     │
│  │  │   (ORM)       │  │  (Sessions,  │             │     │
│  │  │               │  │   cache,     │             │     │
│  │  │               │  │   jobs)      │             │     │
│  │  └──────────────┘  └──────────────┘             │     │
│  └─────────────────────────────────────────────────┘     │
└──────────────────────┬──────────────────────────────────┘
                       │ SMB / NFS (optionnel)
┌──────────────────────▼──────────────────────────────────┐
│              NAS (Ugreen / Synology / ...)                │
│  📁 Stockage fichiers (factures, photos, documents)      │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Stack technique détaillée

### 2.1 Frontend

| Technologie | Version | Rôle |
|---|---|---|
| **Next.js** | 14+ (App Router) | Framework React avec SSR/SSG et API Routes |
| **React** | 18+ | Bibliothèque UI |
| **TypeScript** | 5+ | Typage statique |
| **Tailwind CSS** | 3+ | Framework CSS utilitaire |
| **next-pwa** | Latest | Service Worker, manifest, cache offline |
| **next-intl** | Latest | Internationalisation (FR/EN) |
| **next-themes** | Latest | Gestion thème sombre/clair |
| **React Hook Form** | Latest | Gestion des formulaires |
| **Zod** | Latest | Validation des données (client + serveur) |
| **TanStack Query** | v5 | Cache client, synchronisation serveur, gestion offline |
| **date-fns** | Latest | Manipulation des dates (léger, tree-shakable) |
| **Tiptap** | Latest | Éditeur rich text (notes) |
| **FullCalendar** | Latest | Composant calendrier (vues jour/semaine/mois, drag & drop) |
| **Recharts** | Latest | Graphiques (consommation carburant, suivi de prix, coûts) |
| **Lucide React** | Latest | Icônes |
| **zxing-js** | Latest | Scan code-barres via caméra (bibliothèque pure JS) |
| **Sonner** | Latest | Notifications toast |

### 2.2 Backend

| Technologie | Version | Rôle |
|---|---|---|
| **Next.js API Routes** | 14+ (App Router) | Endpoints REST |
| **Prisma** | 5+ | ORM, migrations, schema |
| **PostgreSQL** | 16+ | Base de données relationnelle |
| **Redis** | 7+ | Sessions, cache, file de tâches (jobs) |
| **NextAuth.js** | v5 (Auth.js) | Authentification, gestion sessions |
| **BullMQ** | Latest | File de tâches asynchrones (rappels, notifications, cron) |
| **web-push** | Latest | Envoi de notifications push (protocole Web Push) |
| **sharp** | Latest | Traitement d'images (compression, thumbnails) |
| **ical.js** | Latest | Parsing et génération de fichiers .ics |
| **node-cron** | Latest | Planification des tâches récurrentes |

### 2.3 Infrastructure / DevOps

| Technologie | Rôle |
|---|---|
| **Docker** | Conteneurisation de l'application |
| **Docker Compose** | Orchestration des services (app, PostgreSQL, Redis) |
| **Traefik** ou **Nginx Proxy Manager** | Reverse proxy + HTTPS (Let's Encrypt) |
| **Volume Docker** ou **montage NAS (SMB/NFS)** | Stockage des fichiers uploadés |

---

## 3. Architecture du projet

### 3.1 Structure des dossiers

```
homeinone/
├── docker/
│   ├── docker-compose.yml          # Orchestration des services
│   ├── docker-compose.dev.yml      # Override pour le développement
│   ├── Dockerfile                  # Image de l'application
│   └── .env.example                # Variables d'environnement template
│
├── prisma/
│   ├── schema.prisma               # Schéma de base de données unifié
│   ├── migrations/                 # Historique des migrations
│   └── seed.ts                     # Données initiales (catégories, modèles)
│
├── public/
│   ├── manifest.json               # PWA manifest
│   ├── sw.js                       # Service Worker (généré par next-pwa)
│   ├── icons/                      # Icônes PWA (192x192, 512x512)
│   └── locales/
│       ├── fr/                     # Traductions françaises
│       └── en/                     # Traductions anglaises
│
├── src/
│   ├── app/                        # App Router Next.js
│   │   ├── (auth)/                 # Pages d'authentification
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (app)/                  # Pages protégées (layout principal)
│   │   │   ├── layout.tsx          # Shell principal (sidebar, header)
│   │   │   ├── dashboard/          # Tableau de bord global
│   │   │   ├── calendar/           # Module Agenda
│   │   │   ├── notes/              # Module Notes & Listes
│   │   │   ├── maintenance/        # Module Entretien logement
│   │   │   ├── vehicles/           # Module Entretien véhicules
│   │   │   ├── inventory/          # Module Inventaire objets
│   │   │   └── settings/           # Paramètres (profil, foyer, catégories)
│   │   ├── api/                    # API Routes
│   │   │   ├── auth/               # Endpoints authentification
│   │   │   ├── calendar/           # CRUD événements
│   │   │   ├── notes/              # CRUD notes, tâches, envies
│   │   │   ├── maintenance/        # CRUD interventions logement
│   │   │   ├── vehicles/           # CRUD véhicules, interventions, pleins
│   │   │   ├── inventory/          # CRUD objets, garanties, événements de vie
│   │   │   ├── providers/          # CRUD prestataires
│   │   │   ├── upload/             # Upload de fichiers
│   │   │   ├── notifications/      # Gestion des notifications push
│   │   │   └── barcode/            # Lookup code-barres
│   │   └── layout.tsx              # Root layout
│   │
│   ├── modules/                    # Logique métier par module
│   │   ├── calendar/
│   │   │   ├── components/         # Composants UI du module
│   │   │   ├── hooks/              # Hooks React spécifiques
│   │   │   ├── services/           # Logique métier / appels API
│   │   │   ├── types/              # Types TypeScript
│   │   │   └── utils/              # Utilitaires du module
│   │   ├── notes/
│   │   ├── maintenance/
│   │   ├── vehicles/
│   │   └── inventory/
│   │
│   ├── core/                       # Éléments partagés
│   │   ├── components/             # Composants UI réutilisables
│   │   │   ├── ui/                 # Primitives (Button, Input, Modal, etc.)
│   │   │   ├── layout/             # Shell, Sidebar, Header, BottomNav
│   │   │   ├── forms/              # Composants de formulaire réutilisables
│   │   │   └── shared/             # FileUpload, Scanner, RichEditor, etc.
│   │   ├── hooks/                  # Hooks partagés
│   │   ├── providers/              # Context providers (theme, auth, i18n)
│   │   ├── services/               # Services partagés (upload, notifications)
│   │   ├── types/                  # Types globaux
│   │   └── utils/                  # Utilitaires globaux
│   │
│   ├── lib/                        # Configuration des librairies
│   │   ├── prisma.ts               # Client Prisma (singleton)
│   │   ├── redis.ts                # Client Redis
│   │   ├── auth.ts                 # Configuration NextAuth
│   │   ├── i18n.ts                 # Configuration next-intl
│   │   └── push.ts                 # Configuration web-push
│   │
│   ├── jobs/                       # Tâches asynchrones (BullMQ workers)
│   │   ├── reminders.ts            # Envoi des rappels
│   │   ├── recurring.ts            # Génération des interventions récurrentes
│   │   ├── notifications.ts        # Envoi des notifications push
│   │   └── cleanup.ts              # Nettoyage périodique
│   │
│   └── styles/
│       └── globals.css             # Styles globaux + config Tailwind
│
├── tests/                          # Tests
│   ├── unit/                       # Tests unitaires
│   ├── integration/                # Tests d'intégration API
│   └── e2e/                        # Tests end-to-end
│
├── .env.local                      # Variables d'environnement locales
├── next.config.js                  # Configuration Next.js
├── tailwind.config.ts              # Configuration Tailwind
├── tsconfig.json                   # Configuration TypeScript
├── package.json
└── README.md
```

### 3.2 Architecture par module

Chaque module suit la même structure interne pour garantir la cohérence :

```
modules/{module_name}/
├── components/           # Composants React du module
│   ├── {Module}List.tsx       # Liste principale
│   ├── {Module}Form.tsx       # Formulaire création/édition
│   ├── {Module}Detail.tsx     # Vue détaillée
│   ├── {Module}Dashboard.tsx  # Tableau de bord du module
│   └── ...
├── hooks/                # Hooks React
│   ├── use{Module}.ts         # Hook principal (CRUD via TanStack Query)
│   └── use{Module}Filters.ts  # Hook de filtres
├── services/             # Logique métier
│   ├── {module}.service.ts    # Appels API
│   └── {module}.validation.ts # Schémas Zod
├── types/                # Types TypeScript
│   └── {module}.types.ts
└── utils/                # Utilitaires
    └── {module}.utils.ts
```

---

## 4. API Architecture

### 4.1 Convention des endpoints

Tous les endpoints suivent une convention REST cohérente :

```
GET    /api/{module}              → Liste (avec pagination, filtres)
POST   /api/{module}              → Création
GET    /api/{module}/{id}         → Détail
PUT    /api/{module}/{id}         → Mise à jour complète
PATCH  /api/{module}/{id}         → Mise à jour partielle
DELETE /api/{module}/{id}         → Suppression
```

**Exemples :**

```
GET    /api/calendar/events?from=2026-04-01&to=2026-04-30&member=1
POST   /api/calendar/events
GET    /api/calendar/events/123
PUT    /api/calendar/events/123
DELETE /api/calendar/events/123

GET    /api/inventory/items?category=electronics&room=kitchen
POST   /api/inventory/items/123/events    (carnet de santé)
POST   /api/inventory/items/123/warranties

GET    /api/vehicles/1/fuel-logs
POST   /api/vehicles/1/fuel-logs

POST   /api/upload                        (upload de fichier)
GET    /api/barcode/lookup?code=3017620422003
```

### 4.2 Réponses API

Format standardisé pour toutes les réponses :

```typescript
// Succès (un élément)
{
  "data": { ... },
  "meta": { }
}

// Succès (liste paginée)
{
  "data": [ ... ],
  "meta": {
    "total": 42,
    "page": 1,
    "perPage": 20,
    "totalPages": 3
  }
}

// Erreur
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Le titre est obligatoire",
    "details": [ ... ]
  }
}
```

### 4.3 Validation

Double validation avec Zod (même schéma côté client et serveur) :

```typescript
// Schéma partagé
const EventSchema = z.object({
  title: z.string().min(1, "Le titre est obligatoire"),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  allDay: z.boolean().default(false),
  categoryId: z.string().uuid().optional(),
  memberIds: z.array(z.string().uuid()).optional(),
});

// Utilisé côté client (React Hook Form) ET côté API (validation requête)
```

---

## 5. Authentification et autorisation

### 5.1 Modèle d'authentification

- **NextAuth.js v5 (Auth.js)** avec stratégie **Credentials** (email + mot de passe)
- Sessions stockées côté serveur dans **Redis** (pas de JWT dans les cookies)
- Cookies HTTP-only, Secure, SameSite=Strict

### 5.2 Modèle d'autorisation

Deux niveaux de rôle par foyer :

| Rôle | Droits |
|---|---|
| **Administrateur** | Tout : gestion des membres, paramétrage global (catégories, pièces, logements), suppression de données |
| **Membre** | Utilisation courante : créer, modifier, consulter. Ne peut pas gérer les membres ni les paramètres globaux |

- Le premier utilisateur inscrit est automatiquement administrateur et crée le foyer
- L'administrateur invite les autres membres (lien d'invitation ou code)
- Un membre ne peut accéder qu'aux données de son foyer (isolation stricte)

### 5.3 Middleware de sécurité

```
Requête entrante
    │
    ├── Route publique (/login, /register) → Passe
    │
    ├── Route protégée (/api/*, /app/*)
    │   ├── Vérification session Redis → 401 si invalide
    │   ├── Vérification appartenance au foyer → 403 si non autorisé
    │   ├── Vérification rôle (admin requis ?) → 403 si insuffisant
    │   └── → Traitement de la requête
```

---

## 6. Stratégie PWA et offline

### 6.1 Service Worker

Géré par **next-pwa**, le service worker assure :

- **Precaching** : shell de l'application (HTML, CSS, JS, icônes) mis en cache à l'installation
- **Runtime caching** : stratégies différenciées par type de ressource

### 6.2 Stratégies de cache

| Ressource | Stratégie | Détail |
|---|---|---|
| Pages HTML / Shell | Cache First, fallback réseau | L'app se charge toujours, même hors-ligne |
| API (lectures) | Network First, fallback cache | On tente le réseau, sinon le cache |
| API (écritures) | Network Only + queue offline | Les écritures sont mises en file d'attente |
| Images / fichiers statiques | Cache First | Chargés une fois, servis depuis le cache |
| Fichiers uploadés (factures, photos) | Network First | Consultables offline si déjà chargés |

### 6.3 Mode offline

- **Consultation** : les données déjà chargées sont disponibles offline via le cache TanStack Query + Service Worker
- **Création / modification** : les actions sont stockées dans une file d'attente locale (IndexedDB)
- **Synchronisation** : au retour en ligne, la file est rejouée automatiquement dans l'ordre chronologique
- **Indicateur visuel** : un bandeau discret informe l'utilisateur qu'il est hors-ligne et que X actions sont en attente de sync
- **Conflits** : stratégie "last write wins" avec timestamp — suffisant pour un usage familial

---

## 7. Stockage des fichiers

### 7.1 Architecture de stockage

Le stockage des fichiers (factures, photos, documents) est abstrait derrière une couche de service qui supporte deux modes :

```
┌──────────────────────────────┐
│     FileStorageService       │
│  (interface abstraite)       │
├──────────────────────────────┤
│  upload(file) → path         │
│  download(path) → stream     │
│  delete(path)                │
│  getUrl(path) → url          │
└──────────┬───────────────────┘
           │
    ┌──────┴──────┐
    │             │
┌───▼───┐   ┌────▼────┐
│ Local  │   │   NAS   │
│Storage │   │ Storage │
│        │   │(SMB/NFS)│
└────────┘   └─────────┘
```

### 7.2 Mode local (par défaut)

- Les fichiers sont stockés dans un volume Docker : `/data/uploads/`
- Structure : `/data/uploads/{foyer_id}/{module}/{année}/{mois}/{fichier}`
- Exemple : `/data/uploads/abc123/inventory/2026/04/facture-lave-vaisselle.pdf`

### 7.3 Mode NAS (déporté)

- Le volume Docker est monté sur un partage réseau SMB ou NFS
- Configuration via variables d'environnement :

```env
# Mode de stockage : local | smb | nfs
STORAGE_MODE=smb

# Configuration SMB (NAS Ugreen, Synology, etc.)
SMB_HOST=192.168.1.100
SMB_SHARE=homeinone
SMB_USERNAME=homeinone
SMB_PASSWORD=xxxxx

# Configuration NFS (alternative)
NFS_HOST=192.168.1.100
NFS_PATH=/volume1/homeinone
```

### 7.4 Traitement des fichiers

- **Images** : compressées et redimensionnées à l'upload via **sharp**
  - Thumbnail : 200x200px (pour les listes)
  - Medium : 800x800px (pour la consultation)
  - Original : conservé tel quel
- **PDF** : stockés tels quels, pas de traitement
- **Taille max par fichier** : 10 Mo (configurable)
- **Nommage** : UUID + extension originale pour éviter les collisions

---

## 8. Notifications push

### 8.1 Architecture

```
┌────────────┐    ┌───────────┐    ┌──────────────┐    ┌──────────┐
│  Cron Job  │───▶│  BullMQ   │───▶│  Web Push    │───▶│  Client  │
│(node-cron) │    │  Queue    │    │  (web-push)  │    │  (PWA)   │
│            │    │  (Redis)  │    │              │    │          │
│ Toutes les │    │           │    │ VAPID keys   │    │ Service  │
│ 15 minutes │    │           │    │              │    │ Worker   │
└────────────┘    └───────────┘    └──────────────┘    └──────────┘
```

### 8.2 Fonctionnement

1. Un **cron job** tourne toutes les 15 minutes et vérifie les échéances à venir
2. Les rappels à envoyer sont ajoutés à une **file BullMQ** dans Redis
3. Un **worker** traite la file et envoie les notifications via le protocole **Web Push** (VAPID)
4. Le **Service Worker** côté client reçoit et affiche la notification

### 8.3 Types de notifications

| Source | Contenu | Délai |
|---|---|---|
| Événement agenda | "RDV dentiste dans 1h" | Configurable par l'utilisateur |
| Tâche avec échéance | "Tâche en retard : Appeler plombier" | Le jour J |
| Entretien logement | "Entretien chaudière prévu dans 1 semaine" | 1 semaine + 1 jour avant |
| Entretien véhicule | "Vidange à prévoir (~65 000 km)" | 1 mois + 1 semaine avant |
| Document véhicule | "Assurance auto expire dans 1 mois" | Selon type de document |
| Garantie objet | "Garantie lave-vaisselle expire dans 1 mois" | 1 mois avant |

### 8.4 Abonnement

- À la première connexion, l'app demande l'autorisation de notifications
- Si refusée, un bandeau discret rappelle la possibilité de les activer
- Chaque appareil a son propre abonnement push (un utilisateur peut recevoir sur téléphone + desktop)
- Les préférences de notification sont paramétrables par utilisateur et par type

---

## 9. Internationalisation (i18n)

### 9.1 Architecture

- **next-intl** pour le routing et les traductions
- Détection automatique de la langue du navigateur au premier accès
- Préférence de langue persistée dans le profil utilisateur
- Langues disponibles au MVP : **Français (fr)** et **Anglais (en)**

### 9.2 Organisation des traductions

```
public/locales/
├── fr/
│   ├── common.json          # Termes génériques (boutons, navigation, erreurs)
│   ├── calendar.json        # Module Agenda
│   ├── notes.json           # Module Notes & Listes
│   ├── maintenance.json     # Module Entretien logement
│   ├── vehicles.json        # Module Entretien véhicules
│   └── inventory.json       # Module Inventaire
└── en/
    ├── common.json
    ├── calendar.json
    └── ...
```

### 9.3 Dates et formats

- Les dates suivent le format de la locale (dd/MM/yyyy en FR, MM/dd/yyyy en EN)
- Les montants utilisent la devise configurée (€ par défaut, paramétrable pour l'open-source)
- Le premier jour de la semaine est paramétrable (lundi par défaut en FR, dimanche en EN)

---

## 10. Thème sombre / clair

### 10.1 Implémentation

- **next-themes** pour la gestion du thème
- 3 modes : Clair / Sombre / Système (suit les préférences OS)
- Persistance dans le profil utilisateur
- Tailwind CSS avec le mode `dark:` pour les variantes

### 10.2 Variables CSS

```css
:root {
  /* Thème clair */
  --background: #ffffff;
  --foreground: #0a0a0a;
  --card: #f8f9fa;
  --primary: #2563eb;
  --primary-foreground: #ffffff;
  --muted: #6b7280;
  --border: #e5e7eb;
  --destructive: #ef4444;
  --success: #22c55e;
  --warning: #f59e0b;
}

[data-theme="dark"] {
  --background: #0a0a0a;
  --foreground: #fafafa;
  --card: #1a1a1a;
  --primary: #3b82f6;
  --primary-foreground: #ffffff;
  --muted: #9ca3af;
  --border: #2d2d2d;
  --destructive: #f87171;
  --success: #4ade80;
  --warning: #fbbf24;
}
```

---

## 11. Déploiement Docker

### 11.1 docker-compose.yml

```yaml
version: "3.8"

services:
  app:
    build: .
    container_name: homeinone-app
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://homeinone:${DB_PASSWORD}@db:5432/homeinone
      - REDIS_URL=redis://redis:6379
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=${APP_URL}
      - STORAGE_MODE=${STORAGE_MODE:-local}
      - VAPID_PUBLIC_KEY=${VAPID_PUBLIC_KEY}
      - VAPID_PRIVATE_KEY=${VAPID_PRIVATE_KEY}
    volumes:
      - uploads:/data/uploads        # Volume local ou montage NAS
    depends_on:
      - db
      - redis

  db:
    image: postgres:16-alpine
    container_name: homeinone-db
    restart: unless-stopped
    environment:
      - POSTGRES_USER=homeinone
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=homeinone
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    container_name: homeinone-redis
    restart: unless-stopped
    volumes:
      - redisdata:/data
    ports:
      - "6379:6379"

volumes:
  pgdata:
  redisdata:
  uploads:
    # Pour un montage NAS, remplacer par :
    # driver: local
    # driver_opts:
    #   type: cifs
    #   o: "addr=192.168.1.100,username=xxx,password=xxx,vers=3.0"
    #   device: "//192.168.1.100/homeinone"
```

### 11.2 Variables d'environnement (.env)

```env
# Application
APP_URL=https://home.mondomaine.local
NODE_ENV=production

# Base de données
DB_PASSWORD=un_mot_de_passe_fort

# Authentification
NEXTAUTH_SECRET=une_clef_secrete_aleatoire_32_chars

# Notifications Push (VAPID keys, générées une fois)
VAPID_PUBLIC_KEY=BxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxQ=
VAPID_PRIVATE_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxQ=
VAPID_MAILTO=mailto:admin@mondomaine.local

# Stockage fichiers
STORAGE_MODE=local        # local | smb | nfs
# SMB_HOST=192.168.1.100
# SMB_SHARE=homeinone
# SMB_USERNAME=homeinone
# SMB_PASSWORD=xxxxx

# API code-barres (optionnel)
# BARCODE_API_KEY=xxxxx

# Langue par défaut
DEFAULT_LOCALE=fr
```

### 11.3 Reverse proxy

Pour l'accès HTTPS en local, utiliser **Traefik** ou **Nginx Proxy Manager** devant le conteneur :
- Certificat auto-signé pour le réseau local
- Ou Let's Encrypt si accessible depuis internet (via un nom de domaine)
- Headers de sécurité : HSTS, X-Frame-Options, CSP

---

## 12. Sécurité

### 12.1 Mesures appliquées

| Domaine | Mesure |
|---|---|
| Authentification | Mots de passe hashés avec bcrypt (cost 12) |
| Sessions | Stockées dans Redis, cookies HTTP-only, Secure, SameSite=Strict |
| API | Rate limiting (100 req/min par IP), CORS restreint à l'APP_URL |
| Uploads | Validation du type MIME réel (pas juste l'extension), taille max 10 Mo |
| Injection SQL | Prisma ORM (requêtes paramétrées) |
| XSS | Sanitisation du rich text (Tiptap + DOMPurify), échappement React natif |
| CSRF | Token CSRF automatique via NextAuth |
| Données | Isolation par foyer (toutes les requêtes filtrées par householdId) |
| Fichiers uploadés | Servis via l'API (pas de lien direct), vérification d'autorisation |
| Headers | Helmet.js pour les headers de sécurité |

### 12.2 Sauvegarde

- **Base de données** : pg_dump quotidien automatique (cron), rétention 30 jours
- **Fichiers** : si sur NAS, gérés par la politique de backup du NAS (snapshots, RAID)
- **Export** : fonctionnalité d'export complète prévue (JSON + fichiers) pour portabilité

---

## 13. Performance

### 13.1 Optimisations

| Domaine | Technique |
|---|---|
| Rendu | Composants React Server Components (RSC) pour les pages statiques |
| Données | TanStack Query avec stale-while-revalidate, pagination serveur |
| Images | Thumbnails pré-générés (200px), lazy loading, format WebP |
| Bundle | Tree-shaking, code splitting par route (automatique Next.js) |
| Cache | Redis pour les sessions et les résultats de requêtes fréquentes |
| Base de données | Index Prisma sur les colonnes filtrées/triées (voir Phase 4 — MCD) |

### 13.2 Cibles de performance

| Métrique | Objectif |
|---|---|
| First Contentful Paint | < 1.5s |
| Time to Interactive | < 3s |
| Lighthouse Performance Score | > 90 |
| Taille du bundle initial | < 200 KB gzip |
| Temps de réponse API | < 200ms (p95) |

---

## 14. Tests

### 14.1 Stratégie

| Type | Outil | Couverture |
|---|---|---|
| Unitaires | Vitest | Logique métier, utilitaires, validations Zod |
| Intégration | Vitest + Supertest | Endpoints API, services Prisma |
| E2E | Playwright | Parcours utilisateur critiques |
| Linting | ESLint + Prettier | Qualité de code |
| Types | TypeScript strict | Sécurité du typage |

### 14.2 Parcours E2E prioritaires

1. Inscription → Création du foyer → Invitation d'un membre
2. Création d'un événement récurrent → Vérification dans l'agenda
3. Ajout d'un objet par scan → Ajout de garantie → Vérification alerte
4. Configuration d'un logement → Activation d'un modèle d'entretien → Rappel
5. Enregistrement d'un plein carburant → Vérification consommation calculée

---

## 15. CI/CD — GitHub Actions

Le projet étant open-source (repo public), les GitHub Actions sont gratuites et illimitées. La CI/CD est mise en place dès le Sprint 0.

### 15.1 CI — Intégration continue (à chaque push et PR)

**Workflow : `.github/workflows/ci.yml`**

Déclenché sur chaque `push` et chaque `pull_request` vers `main` :

| Étape | Commande | But |
|---|---|---|
| Checkout | `actions/checkout@v4` | Récupérer le code |
| Setup Node | `actions/setup-node@v4` (Node 20) | Installer Node.js |
| Install deps | `npm ci` | Installer les dépendances (lockfile exact) |
| Lint TypeScript | `npx tsc --noEmit` | Vérifier le typage strict |
| Lint ESLint | `npx eslint src/` | Vérifier la qualité du code |
| Tests unitaires | `npx vitest run` | Exécuter les tests Vitest |
| Build | `npm run build` | Vérifier que l'app compile |

Le workflow utilise un service PostgreSQL et un service Redis en containers pour les tests d'intégration :

```yaml
services:
  postgres:
    image: postgres:16-alpine
    env:
      POSTGRES_USER: homeinone
      POSTGRES_PASSWORD: test
      POSTGRES_DB: homeinone_test
    ports:
      - 5432:5432
  redis:
    image: redis:7-alpine
    ports:
      - 6379:6379
```

**Règle de protection de branche** : le merge sur `main` est bloqué tant que la CI ne passe pas.

### 15.2 CD — Déploiement continu (au merge sur main)

**Workflow : `.github/workflows/cd.yml`**

Déclenché au `push` sur `main` (donc après merge d'une PR) :

| Étape | Description |
|---|---|
| Build de l'image Docker | Multi-stage build optimisé |
| Tag de l'image | `latest` + tag semver si release |
| Push sur GHCR | `ghcr.io/{org}/homeinone:latest` |

L'image est publiée sur **GitHub Container Registry** (ghcr.io), gratuit sur repo public. N'importe qui peut ensuite déployer avec :

```bash
docker pull ghcr.io/{org}/homeinone:latest
```

Sur ton Proxmox, tu peux automatiser le pull avec un cron ou un Watchtower pour les mises à jour automatiques.

### 15.3 Qualité automatique

**Dependabot** (`.github/dependabot.yml`) :
- Vérifie les mises à jour npm chaque semaine
- Crée automatiquement des PR pour les dépendances outdated
- Groupé par type (patch, minor, major)

**CodeQL** (`.github/workflows/codeql.yml`) :
- Analyse de sécurité statique gratuite sur repo public
- Détecte les vulnérabilités JavaScript/TypeScript
- Exécuté chaque semaine + à chaque PR

### 15.4 Fichiers CI/CD à créer

```
.github/
├── workflows/
│   ├── ci.yml              # CI : lint + tests + build
│   ├── cd.yml              # CD : build Docker + push GHCR
│   └── codeql.yml          # Analyse de sécurité
├── dependabot.yml          # Mises à jour dépendances auto
└── PULL_REQUEST_TEMPLATE.md # Template PR
```

---

## 16. Prochaines étapes

- [ ] **Phase 4** — Modèle de données (MCD/MLD) basé sur Prisma schema
- [ ] **Phase 5** — Charte graphique & UI/UX
- [ ] **Phase 6** — Roadmap & sprints

---

*Document créé le 08/04/2026 — Version 1.0*
