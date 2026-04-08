# HomeInOne — Fiche d'identité du projet

## 1. Vision

**HomeInOne** — Tout pour la maison, en un seul endroit.

Une PWA modulaire pensée pour centraliser la gestion du quotidien familial : organisation, entretien, finances, alimentation, souvenirs. Chaque module fonctionne comme une mini-application spécialisée, mais tous partagent le même écosystème et communiquent entre eux.

**Objectifs principaux :**
- Gain de temps au quotidien
- Meilleure organisation familiale
- Zéro oubli (rappels, alertes, notifications)
- Centralisation de l'information (plus d'apps éparpillées)

---

## 2. Public cible

- **Utilisateurs principaux** : Couple (2 adultes), mais l'architecture doit supporter une famille élargie (enfants, colocataires, etc.)
- **Multi-utilisateurs** : Chaque membre a son compte avec des droits adaptés
- **Profil technique** : Utilisateurs non-techniques (l'interface doit être intuitive et guidante)

---

## 3. Contraintes techniques

| Contrainte | Choix |
|---|---|
| Type d'application | PWA (Progressive Web App) |
| Approche responsive | Mobile / Tablet first |
| Langues | Français + Anglais (i18n dès le départ) |
| Hébergement | Self-hosted (NAS / serveur local) |
| Mode offline | Partiel (consultation hors-ligne, synchronisation au retour) |
| Open-source | Oui, à terme (projet réutilisable et auto-hébergeable) |

---

## 4. Stack technique

### Frontend
- **Next.js** (React) — Framework principal
- **TypeScript** — Typage statique
- **Tailwind CSS** — Styling utilitaire
- **next-pwa** — Capacités PWA (service worker, manifest, cache)
- **next-intl** ou **i18next** — Internationalisation (FR/EN)

### Backend
- **API Routes Next.js** — Endpoints API intégrés
- **Prisma** — ORM pour la base de données
- **PostgreSQL** — Base de données relationnelle

### Authentification
- **NextAuth.js** — Gestion des sessions et des utilisateurs

### Fonctionnalités transversales (dès le MVP)
- **Notifications push** — Rappels, alertes de péremption, échéances d'entretien
- **Thème sombre / clair** — Préférence utilisateur persistée

---

## 5. Catalogue des modules

### MVP (Phase 1)

| Module | Description | Icône |
|---|---|---|
| **Agenda partagé** | Calendrier familial avec événements, rappels, récurrences. Agrège les échéances des autres modules. | 🗓 |
| **Notes / Todo / Wishlist** | Prise de notes, listes de tâches, listes de souhaits. Partageable entre membres. | 📝 |
| **Entretien logement** | Suivi des maintenances du logement (chaudière, filtres, etc.) avec rappels périodiques. | 🏠 |
| **Entretien véhicules** | Carnet d'entretien véhicule (vidange, CT, kilométrage, etc.) avec rappels. | 🚗 |
| **Inventaire objets** | Recensement des biens (date d'achat, garantie, factures, pannes, réparations). | 📦 |

### Phase 2 (post-MVP)

| Module | Description | Icône |
|---|---|---|
| **Planificateur de repas** | Planification des repas de la semaine, lié aux recettes et aux courses. | 🍽 |
| **Liste de courses** | Génération automatique depuis le planificateur ou manuelle. Cochable en magasin. | 🛒 |
| **Carnet de recettes** | Recettes perso ou importées, avec ingrédients, étapes, photos. | 📖 |
| **Stocks alimentaires** | Gestion du garde-manger (scan code-barres, dates de péremption, alertes). Suggère des recettes en fonction du stock. | 🥫 |

### Phase 3 (évolutions)

| Module | Description | Icône |
|---|---|---|
| **Finances** | Suivi des dépenses, budget, investissements, abonnements. | 💰 |
| **Journal de bord** | Anecdotes, moments marquants, souvenirs datés. | 📔 |
| **Stockage fichiers** | Drive familial connecté au NAS local (photos, vidéos, documents). | 📁 |
| **Domotique** | Pilotage de la maison connectée (intégration Home Assistant). | 🏡 |

---

## 6. Interactions entre modules (exemples)

Les modules ne vivent pas en silo. Voici des synergies prévues :

- **Entretien → Agenda** : Un entretien planifié crée automatiquement un événement dans l'agenda
- **Inventaire → Entretien** : Un objet en panne peut déclencher une tâche d'entretien
- **Stocks → Recettes** : Suggestion de recettes basées sur ce qui est disponible
- **Planificateur repas → Liste de courses** : Les repas de la semaine génèrent la liste de courses
- **Stocks → Liste de courses** : Alerte stock bas → ajout automatique à la liste
- **Tous les modules → Agenda** : Tout événement daté remonte dans l'agenda central
- **Finances → Inventaire** : Lien entre un achat et un objet inventorié

---

## 7. Principes directeurs

1. **Modularité** — Chaque module est autonome, activable/désactivable. On peut n'utiliser que ce dont on a besoin.
2. **Simplicité d'usage** — L'interface doit être compréhensible sans formation. Mobile first.
3. **Self-hosted** — Aucune dépendance à un service cloud. Les données restent chez soi.
4. **Open-source friendly** — Architecture propre, documentée, facilement déployable par d'autres.
5. **Évolutif** — Ajouter un nouveau module ne doit pas impacter les existants.
6. **Données privées** — Aucune télémétrie, aucun tracking. Respect total de la vie privée.

---

## 8. Prochaines étapes

- [ ] **Phase 2** — Spécifications fonctionnelles détaillées (user stories par module MVP)
- [ ] **Phase 3** — Architecture technique complète
- [ ] **Phase 4** — Modèle de données (MCD/MLD)
- [ ] **Phase 5** — Charte graphique & UI/UX
- [ ] **Phase 6** — Roadmap & organisation des sprints

---

*Document créé le 08/04/2026 — Version 1.0*
