# HomeInOne — Roadmap & Organisation 🗺

## 1. Philosophie de développement

Le développement suit une approche **incrémentale** : chaque sprint livre une fonctionnalité utilisable. On ne passe pas 3 mois à coder sans rien voir tourner. L'idée est de pouvoir utiliser l'app dès le Sprint 2, même si elle ne fait que le minimum.

**Développement assisté par Claude Code** : chaque sprint est découpé en tâches suffisamment précises pour être déléguées à Claude Code. Les documents de conception (specs, MCD, charte graphique) servent de "brief" que Claude Code peut suivre.

---

## 2. Pré-requis — Sprint 0 : Fondations

**Durée estimée : 1 semaine**

Ce sprint pose les fondations techniques. Aucune fonctionnalité utilisateur, mais tout le socle est en place.

### Tâches

| # | Tâche | Description |
|---|---|---|
| 0.1 | Init projet Next.js | `create-next-app` avec TypeScript, App Router, Tailwind CSS |
| 0.2 | Configuration Tailwind | Intégration de la charte graphique (couleurs, fonts, tokens) |
| 0.3 | Prisma + PostgreSQL | Installation, configuration, schéma initial (User, Household) |
| 0.4 | Docker Compose | Containerisation : app + PostgreSQL + Redis |
| 0.5 | NextAuth.js | Auth Credentials (email/password), sessions Redis |
| 0.6 | Pages auth | Login, Register, création du foyer |
| 0.7 | Layout principal | Shell : sidebar (desktop), bottom nav (mobile), header |
| 0.8 | Thème sombre/clair | next-themes, toggle dans le header |
| 0.9 | i18n | next-intl, structure des fichiers de traduction FR/EN |
| 0.10 | PWA setup | next-pwa, manifest.json, icônes, service worker de base |
| 0.11 | Composants UI de base | Button, Input, Card, Modal, BottomSheet, Badge, Avatar |
| 0.12 | Système d'upload | API Route upload, stockage local/NAS, compression images (sharp) |
| 0.13 | Seed initial | Script de seed : catégories prédéfinies, modèles d'entretien |
| 0.14 | CI — GitHub Actions | Workflow `ci.yml` : lint TS + ESLint + tests Vitest + build (avec services PostgreSQL + Redis) |
| 0.15 | CD — Docker + GHCR | Workflow `cd.yml` : build image Docker multi-stage + push sur ghcr.io au merge sur main |
| 0.16 | Qualité auto | Dependabot (npm weekly), CodeQL (analyse sécurité), PR template, protection de branche main |
| 0.17 | ESLint + Prettier | Configuration ESLint (strict) + Prettier + scripts npm (`lint`, `lint:fix`, `format`) |

### Critère de "done"

- L'app tourne en Docker (`docker compose up`)
- On peut s'inscrire, se connecter, voir le shell vide avec la navigation
- Le thème sombre fonctionne
- Le switch FR/EN fonctionne
- L'app est installable en PWA sur mobile
- La CI passe au vert sur GitHub (lint + tests + build)
- L'image Docker est publiée sur ghcr.io au merge sur main
- Dependabot et CodeQL sont actifs

---

## 3. Sprint 1 : Agenda partagé

**Durée estimée : 2 semaines**

### Lot 1.1 — CRUD événements (semaine 1)

| # | Tâche | Description |
|---|---|---|
| 1.1 | Schéma Prisma | Tables Event, EventAssignment, EventReminder, Category (scope CALENDAR) |
| 1.2 | API Routes CRUD | GET/POST/PUT/DELETE /api/calendar/events |
| 1.3 | Vue mois | Intégration FullCalendar, vue mois avec affichage des événements |
| 1.4 | Vue semaine | Vue semaine avec grille horaire |
| 1.5 | Vue jour | Vue jour détaillée |
| 1.6 | Formulaire création | Bottom sheet (mobile) / modale (desktop), champs : titre, dates, catégorie, membres |
| 1.7 | Formulaire édition | Modification d'un événement existant |
| 1.8 | Suppression | Suppression avec confirmation |
| 1.9 | Assignation membres | Sélecteur multi-membres, pastilles couleur dans le calendrier |
| 1.10 | Catégories calendrier | Seed des catégories prédéfinies, sélecteur dans le formulaire |

### Lot 1.2 — Fonctionnalités avancées (semaine 2)

| # | Tâche | Description |
|---|---|---|
| 1.11 | Récurrences simples | RRULE : quotidien, hebdo, mensuel, annuel avec intervalle |
| 1.12 | Récurrences avancées | Par jour de semaine, position dans le mois |
| 1.13 | Gestion exceptions | Modifier/supprimer une occurrence, scinder une série |
| 1.14 | Drag & drop | Déplacement et redimensionnement (desktop/tablet) |
| 1.15 | Création rapide | Clic sur créneau vide → formulaire pré-rempli |
| 1.16 | Filtres | Par membre, par catégorie |
| 1.17 | Recherche | Recherche par mot-clé dans les événements |
| 1.18 | Rappels | Configuration des rappels par événement |
| 1.19 | Import .ics | Upload et parsing d'un fichier .ics |
| 1.20 | Export .ics | Export complet ou filtré |
| 1.21 | Paramètres agenda | Vue par défaut, premier jour de semaine, gestion catégories |

### Critère de "done"

- On peut créer, modifier, supprimer des événements (ponctuels et récurrents)
- Les 3 vues (jour/semaine/mois) fonctionnent avec navigation
- Le drag & drop fonctionne sur desktop
- On peut filtrer par membre et par catégorie
- Import/export .ics fonctionnel

---

## 4. Sprint 2 : Notes & Listes

**Durée estimée : 2 semaines**

### Lot 2.1 — Notes + Tâches (semaine 1)

| # | Tâche | Description |
|---|---|---|
| 2.1 | Schéma Prisma | Tables Note, TaskList, Task, Folder, Tag + tables de liaison |
| 2.2 | API Routes | CRUD notes, listes de tâches, tâches |
| 2.3 | Layout module | 3 onglets (Notes / Tâches / Envies), sidebar dossiers |
| 2.4 | Éditeur rich text | Intégration Tiptap (gras, italique, listes, titres, liens) |
| 2.5 | CRUD notes | Création, édition (auto-save), suppression, épinglage |
| 2.6 | Notes privées | Toggle privé, filtrage côté API |
| 2.7 | Listes de tâches | Création, édition, suppression de listes |
| 2.8 | CRUD tâches | Ajout rapide, édition complète, complétion, suppression |
| 2.9 | Statuts et priorités | Sélecteurs, badges colorés, filtres |
| 2.10 | Assignation tâches | Sélecteur multi-membres |
| 2.11 | Drag & drop tâches | Réordonnancement dans une liste |

### Lot 2.2 — Envies + Transversal (semaine 2)

| # | Tâche | Description |
|---|---|---|
| 2.12 | Schéma Prisma | Tables Wishlist, Wish, WishPriceHistory |
| 2.13 | API Routes | CRUD wishlists, envies, historique de prix |
| 2.14 | Wishlists | Création, édition, budget, assignation membre (cadeaux) |
| 2.15 | Fiches envies | Nom, lien, prix, image, priorité, statut |
| 2.16 | Suivi de prix | Ajout de relevés, graphique Recharts |
| 2.17 | Wishlists privées | Toggle privé pour les cadeaux surprise |
| 2.18 | Dossiers | Arborescence (3 niveaux), CRUD, déplacement d'éléments |
| 2.19 | Tags | CRUD tags, assignation multiple, filtre par tag |
| 2.20 | Recherche globale | Recherche dans notes + tâches + envies |
| 2.21 | Intégration agenda | Tâche avec échéance → événement auto dans l'agenda |

### Critère de "done"

- Les 3 onglets fonctionnent (Notes, Tâches, Envies)
- L'éditeur rich text fonctionne avec auto-save
- Les tâches avec échéance apparaissent dans l'agenda
- Les wishlists privées sont invisibles aux non-propriétaires
- Dossiers et tags fonctionnels

---

## 5. Sprint 3 : Entretien logement

**Durée estimée : 2 semaines**

### Lot 3.1 — Logements et interventions (semaine 1)

| # | Tâche | Description |
|---|---|---|
| 3.1 | Schéma Prisma | Tables Property, Room, MaintenanceIntervention + assignation |
| 3.2 | API Routes | CRUD logements, pièces, interventions |
| 3.3 | Wizard premier usage | Assistant de configuration : logement, pièces, modèles |
| 3.4 | Gestion logements | Ajout, édition, suppression, sélecteur multi-logements |
| 3.5 | Gestion pièces | Ajout, renommage, suppression, pièces prédéfinies |
| 3.6 | CRUD interventions | Formulaire complet (titre, pièce, catégorie, statut, priorité, dates, coûts) |
| 3.7 | Upload fichiers | Photos et factures sur les interventions |
| 3.8 | Assignation | Sélecteur multi-membres |
| 3.9 | Filtres et recherche | Par pièce, catégorie, statut, mot-clé |

### Lot 3.2 — Récurrences, prestataires, stats (semaine 2)

| # | Tâche | Description |
|---|---|---|
| 3.10 | Schéma Prisma | Tables Provider, MaintenanceTemplate |
| 3.11 | Modèles d'entretien | Catalogue prédéfini, activation en un clic |
| 3.12 | Récurrences | Interventions récurrentes, génération auto de la suivante |
| 3.13 | Carnet de prestataires | CRUD prestataires, note de satisfaction, historique |
| 3.14 | Tableau de bord | En retard, à venir, en cours, stats coûts |
| 3.15 | Statistiques coûts | Graphiques par logement / pièce / catégorie / période |
| 3.16 | Intégration agenda | Intervention planifiée → événement auto dans l'agenda |
| 3.17 | Lien inventaire | Champ optionnel pour lier une intervention à un objet |

### Critère de "done"

- Wizard de configuration fonctionnel
- Interventions CRUD avec fichiers joints
- Modèles d'entretien activables
- Interventions récurrentes avec génération automatique
- Carnet de prestataires partagé
- Tableau de bord avec alertes

---

## 6. Sprint 4 : Entretien véhicules

**Durée estimée : 2 semaines**

### Lot 4.1 — Véhicules et interventions (semaine 1)

| # | Tâche | Description |
|---|---|---|
| 4.1 | Schéma Prisma | Tables Vehicle, VehicleIntervention, MileageLog, FuelLog |
| 4.2 | API Routes | CRUD véhicules, interventions, relevés km, pleins |
| 4.3 | Wizard premier usage | Assistant : type, infos, km, modèles d'entretien |
| 4.4 | Gestion véhicules | Ajout, édition, archivage, sélecteur |
| 4.5 | CRUD interventions | Formulaire avec km, coûts détaillés (pièces + MO) |
| 4.6 | Modèles d'entretien | Catalogue voiture + moto, activation |
| 4.7 | Double seuil | Rappels km OU durée, projection basée sur km annuel |
| 4.8 | Suivi kilométrique | Relevés manuels, calcul km annuel, avertissement anomalie |

### Lot 4.2 — Carburant, documents, stats (semaine 2)

| # | Tâche | Description |
|---|---|---|
| 4.9 | Suivi carburant | Formulaire plein rapide, calcul consommation L/100km |
| 4.10 | Historique pleins | Liste + graphique consommation |
| 4.11 | Schéma Prisma | Table VehicleDocument |
| 4.12 | Documents véhicule | CRUD (carte grise, assurance, CT, permis), scans joints |
| 4.13 | Alertes expiration | Notifications documents expirant bientôt |
| 4.14 | Tableau de bord | km, prochains entretiens (barres progression), alertes docs, conso |
| 4.15 | Statistiques | Coût total possession, coût/km, répartition par catégorie |
| 4.16 | Intégration agenda | Interventions + expirations docs → événements agenda |
| 4.17 | Prestataires partagés | Réutilisation du carnet de prestataires du module logement |

### Critère de "done"

- Véhicules CRUD avec wizard
- Double seuil (km + durée) fonctionnel avec projections
- Suivi carburant avec calcul consommation
- Documents avec alertes d'expiration
- Tableau de bord complet

---

## 7. Sprint 5 : Inventaire objets

**Durée estimée : 2 semaines**

### Lot 5.1 — Objets et garanties (semaine 1)

| # | Tâche | Description |
|---|---|---|
| 5.1 | Schéma Prisma | Tables InventoryItem, Warranty, ItemDocument, ItemEvent |
| 5.2 | API Routes | CRUD objets, garanties, documents, événements de vie |
| 5.3 | CRUD objets | Formulaire complet (nom, catégorie, marque, modèle, prix, pièce) |
| 5.4 | Photos | Upload multiple, galerie, thumbnails |
| 5.5 | Garanties | Ajout (type, dates, scan), suggestion garantie légale 2 ans |
| 5.6 | Documents | Upload factures, manuels, devis |
| 5.7 | Carnet de santé | Timeline événements de vie (panne, réparation, entretien) |
| 5.8 | Changement statut intelligent | En panne → propose événement, réparation → propose fonctionnel |

### Lot 5.2 — Scan, filtres, intégrations (semaine 2)

| # | Tâche | Description |
|---|---|---|
| 5.9 | Scan code-barres | Intégration zxing-js, caméra, lookup API gratuite |
| 5.10 | Scan retrouver | Scanner un code-barres existant → ouvrir la fiche |
| 5.11 | Lien logement/pièce | Association aux pièces du module Entretien |
| 5.12 | Filtres et recherche | Par catégorie, logement, pièce, statut, mot-clé |
| 5.13 | Tri | Par date d'achat, prix, nom |
| 5.14 | Tableau de bord | Nombre d'objets, valeur totale, répartition catégorie, alertes garanties |
| 5.15 | Alertes garantie | Notification 1 mois avant expiration → événement agenda |
| 5.16 | Lien entretien | Créer une intervention logement depuis la fiche objet |
| 5.17 | Prestataires partagés | Réutilisation du carnet pour les réparations |

### Critère de "done"

- Objets CRUD avec photos et documents
- Garanties avec alertes
- Carnet de santé avec timeline
- Scan code-barres fonctionnel (ajout + retrouver)
- Liens avec modules Entretien et Agenda

---

## 8. Sprint 6 : Notifications, offline et polish

**Durée estimée : 1-2 semaines**

### Tâches

| # | Tâche | Description |
|---|---|---|
| 6.1 | Notifications push | Configuration VAPID, abonnement client, envoi serveur |
| 6.2 | Cron BullMQ | Workers pour rappels agenda, échéances, expirations |
| 6.3 | Paramètres notifications | Préférences par utilisateur et par type |
| 6.4 | Mode offline | Cache TanStack Query, queue IndexedDB, sync au retour |
| 6.5 | Bandeau offline | Indicateur visuel hors-ligne + actions en attente |
| 6.6 | Dashboard global | Page d'accueil avec résumé de tous les modules |
| 6.7 | Gestion du foyer | Invitation de membres (lien/code), gestion des rôles |
| 6.8 | Profil utilisateur | Modification profil, couleur, avatar, langue, thème |
| 6.9 | Tests | Tests unitaires critiques, tests E2E des parcours clés |
| 6.10 | Performance | Optimisation Lighthouse, lazy loading, bundle analysis |
| 6.11 | Documentation | README.md, guide d'installation Docker, guide utilisateur |

### Critère de "done"

- Les notifications push arrivent sur le téléphone
- L'app fonctionne offline en consultation
- Le dashboard global agrège tous les modules
- Le README permet à quelqu'un d'autre de déployer l'app

---

## 9. Planning récapitulatif

```
Sprint 0  ████                          Fondations (1 sem)
Sprint 1  ████████                      Agenda partagé (2 sem)
Sprint 2  ████████                      Notes & Listes (2 sem)
Sprint 3  ████████                      Entretien logement (2 sem)
Sprint 4  ████████                      Entretien véhicules (2 sem)
Sprint 5  ████████                      Inventaire objets (2 sem)
Sprint 6  ██████                        Notif, offline, polish (1-2 sem)
          ─────────────────────────────
          Total estimé : 12-13 semaines (~3 mois)
```

**Note** : ces durées sont estimées pour un développement assisté par Claude Code avec toi en pilotage. Le rythme réel dépendra de ton temps disponible et de la complexité des bugs rencontrés. C'est un projet perso/familial, pas une deadline client — prends le temps qu'il faut.

---

## 10. Post-MVP — Phases futures

Une fois le MVP stable et utilisé au quotidien, les modules suivants peuvent être développés dans l'ordre de priorité :

### Phase 2 — Bloc alimentation (estimé : 4-6 semaines)

| Sprint | Module | Durée |
|---|---|---|
| 7 | Planificateur de repas | 2 sem |
| 8 | Liste de courses + Carnet de recettes | 2 sem |
| 9 | Stocks alimentaires (scan code-barres) | 2 sem |

### Phase 3 — Extensions (estimé : 4-6 semaines)

| Sprint | Module | Durée |
|---|---|---|
| 10 | Finances (dépenses, budget, abonnements) | 2-3 sem |
| 11 | Journal de bord | 1 sem |
| 12 | Stockage fichiers / Drive (connexion NAS) | 2 sem |

### Phase 4 — Intégrations (estimé : 2-4 semaines)

| Sprint | Module | Durée |
|---|---|---|
| 13 | Domotique (intégration Home Assistant) | 2-4 sem |
| 14 | Multi-foyers (plusieurs familles sur une instance) | 1-2 sem |
| 15 | Import/Export complet (backup JSON + fichiers) | 1 sem |

---

## 11. Définition of Done (globale)

Chaque fonctionnalité livrée doit respecter :

- [ ] Fonctionnelle sur mobile (Chrome Android, Safari iOS)
- [ ] Fonctionnelle sur desktop (Chrome, Firefox, Safari)
- [ ] Responsive (mobile first, tablet, desktop)
- [ ] Thème clair ET sombre
- [ ] Traductions FR ET EN
- [ ] Validation des formulaires (client + serveur)
- [ ] Gestion des erreurs (messages clairs, pas de crash)
- [ ] Isolation par foyer (un utilisateur ne voit pas les données d'un autre foyer)
- [ ] Accessible (focus visible, labels, contrastes)

---

## 12. Comment travailler avec Claude Code

Pour chaque sprint, la méthode recommandée :

1. **Briefer Claude Code** avec les documents de conception (specs du module + MCD + charte graphique)
2. **Découper en tâches atomiques** : une tâche = un prompt Claude Code. Ex: "Crée le schéma Prisma pour le module Agenda" puis "Crée l'API Route GET /api/calendar/events avec pagination et filtres"
3. **Itérer** : tester chaque livraison, ajuster, relancer
4. **Committer régulièrement** : un commit par tâche complétée
5. **Ne pas tout faire d'un coup** : Claude Code est meilleur sur des tâches précises que sur "code-moi tout le module"

---

*Document créé le 08/04/2026 — Version 1.0*
