# HomeInOne — Spécifications fonctionnelles : Module Agenda partagé 🗓

## 1. Présentation du module

L'agenda partagé est le module central de HomeInOne. Il sert de hub temporel pour toute la famille : événements personnels, rendez-vous, vacances, anniversaires, mais aussi les échéances remontées automatiquement par les autres modules (entretien, inventaire, etc.).

**Principe clé** : Un calendrier unique par foyer, avec assignation optionnelle aux membres. Pas d'événement assigné = événement familial visible par tous.

---

## 2. Concepts clés

### 2.1 Événement

Un événement est l'unité de base de l'agenda. Il peut être :
- **Ponctuel** : une date et heure précises (ex: "RDV dentiste le 15/04 à 14h")
- **Journée entière** : sans heure (ex: "Vacances du 10 au 17 août")
- **Récurrent** : répété selon une règle de récurrence

### 2.2 Assignation

- **Non assigné** : événement familial, concerne tout le foyer. Affiché avec la couleur de la catégorie.
- **Assigné à 1+ membres** : concerne les personnes désignées. Affiché avec un indicateur visuel (pastille couleur du membre). Reste visible par tous les membres du foyer, mais visuellement différencié.

### 2.3 Catégories

Système de catégories avec couleur associée pour organiser visuellement les événements.

**Catégories prédéfinies :**

| Catégorie | Couleur par défaut | Icône |
|---|---|---|
| Rendez-vous | Bleu | 📅 |
| Vacances | Orange | 🏖 |
| Anniversaire | Rose | 🎂 |
| Santé | Rouge | ❤️ |
| Travail | Gris | 💼 |
| Loisirs | Vert | 🎉 |
| Administratif | Violet | 📄 |
| Entretien (auto) | Jaune | 🔧 |

Les catégories sont paramétrables : l'utilisateur peut en ajouter de nouvelles, modifier les couleurs/icônes des existantes, ou désactiver celles qu'il n'utilise pas. Les catégories prédéfinies ne peuvent pas être supprimées, seulement désactivées.

### 2.4 Rappels / Notifications

Chaque événement peut avoir un ou plusieurs rappels configurables :
- Délai avant l'événement : 5 min, 15 min, 30 min, 1h, 2h, 1 jour, 2 jours, 1 semaine
- Type : notification push
- Les rappels sont envoyés aux membres assignés (ou à tous si non assigné)

---

## 3. User Stories

### 3.1 Gestion des événements

| ID | En tant que... | Je veux... | Afin de... |
|---|---|---|---|
| AG-01 | Membre du foyer | Créer un événement avec titre, date, heure début/fin, description | Planifier une activité |
| AG-02 | Membre du foyer | Créer un événement sur une journée entière (ou plusieurs jours) | Marquer des vacances, jours fériés |
| AG-03 | Membre du foyer | Assigner un événement à un ou plusieurs membres | Savoir qui est concerné |
| AG-04 | Membre du foyer | Attribuer une catégorie à un événement | Organiser visuellement mon agenda |
| AG-05 | Membre du foyer | Ajouter un ou plusieurs rappels à un événement | Ne pas oublier un rendez-vous |
| AG-06 | Membre du foyer | Modifier un événement existant | Corriger ou mettre à jour les informations |
| AG-07 | Membre du foyer | Supprimer un événement | Retirer un événement annulé |
| AG-08 | Membre du foyer | Ajouter un lieu (texte libre) à un événement | Savoir où aller |
| AG-09 | Membre du foyer | Ajouter des notes / commentaires à un événement | Préciser des détails |

### 3.2 Récurrences

| ID | En tant que... | Je veux... | Afin de... |
|---|---|---|---|
| AG-10 | Membre du foyer | Créer un événement récurrent simple (tous les X jours/semaines/mois/ans) | Planifier des activités régulières |
| AG-11 | Membre du foyer | Créer un événement récurrent avancé (ex: chaque 2ème mardi du mois) | Gérer des récurrences complexes |
| AG-12 | Membre du foyer | Définir une date de fin ou un nombre d'occurrences pour la récurrence | Limiter la répétition |
| AG-13 | Membre du foyer | Modifier une seule occurrence d'un événement récurrent | Gérer une exception sans toucher aux autres |
| AG-14 | Membre du foyer | Modifier toutes les occurrences futures d'un événement récurrent | Changer la règle à partir d'une date |
| AG-15 | Membre du foyer | Supprimer une seule occurrence d'un événement récurrent | Annuler une séance sans supprimer la série |

### 3.3 Vues et navigation

| ID | En tant que... | Je veux... | Afin de... |
|---|---|---|---|
| AG-16 | Membre du foyer | Voir le calendrier en vue Jour | Consulter le planning détaillé d'une journée |
| AG-17 | Membre du foyer | Voir le calendrier en vue Semaine | Avoir une vision hebdomadaire |
| AG-18 | Membre du foyer | Voir le calendrier en vue Mois | Avoir une vue d'ensemble mensuelle |
| AG-19 | Membre du foyer | Naviguer entre les périodes (précédent/suivant/aujourd'hui) | Parcourir le calendrier |
| AG-20 | Membre du foyer | Filtrer les événements par membre assigné | Voir uniquement mes événements |
| AG-21 | Membre du foyer | Filtrer les événements par catégorie | Me concentrer sur un type d'événement |
| AG-22 | Membre du foyer | Rechercher un événement par mot-clé | Retrouver rapidement un événement |

### 3.4 Interactions avancées

| ID | En tant que... | Je veux... | Afin de... |
|---|---|---|---|
| AG-23 | Membre du foyer | Déplacer un événement par drag & drop (vue jour/semaine) | Réorganiser rapidement mon planning |
| AG-24 | Membre du foyer | Redimensionner un événement par drag (vue jour/semaine) | Modifier la durée rapidement |
| AG-25 | Membre du foyer | Cliquer sur un créneau vide pour créer un événement | Ajouter rapidement un événement |
| AG-26 | Membre du foyer | Cliquer sur un événement pour voir ses détails | Consulter les informations |

### 3.5 Import / Export

| ID | En tant que... | Je veux... | Afin de... |
|---|---|---|---|
| AG-27 | Membre du foyer | Importer un fichier .ics dans l'agenda | Récupérer des événements depuis un autre calendrier |
| AG-28 | Membre du foyer | Exporter l'agenda complet en .ics | Sauvegarder ou partager mon calendrier |
| AG-29 | Membre du foyer | Exporter une sélection d'événements (par période ou catégorie) en .ics | Exporter partiellement |

### 3.6 Paramétrage

| ID | En tant que... | Je veux... | Afin de... |
|---|---|---|---|
| AG-30 | Administrateur du foyer | Gérer les catégories (ajouter, modifier couleur/icône, désactiver) | Personnaliser l'organisation |
| AG-31 | Membre du foyer | Choisir ma vue par défaut (jour/semaine/mois) | Avoir ma vue préférée à l'ouverture |
| AG-32 | Membre du foyer | Choisir le premier jour de la semaine (lundi ou dimanche) | Adapter à mes habitudes |
| AG-33 | Administrateur du foyer | Attribuer une couleur à chaque membre du foyer | Différencier visuellement les assignations |

### 3.7 Intégration inter-modules

| ID | En tant que... | Je veux... | Afin de... |
|---|---|---|---|
| AG-34 | Système | Afficher automatiquement les échéances d'entretien dans l'agenda | Centraliser toutes les dates importantes |
| AG-35 | Système | Afficher les fins de garantie des objets inventoriés dans l'agenda | Ne pas rater une expiration de garantie |
| AG-36 | Membre du foyer | Distinguer visuellement les événements auto-générés par d'autres modules | Savoir d'où vient l'événement |
| AG-37 | Membre du foyer | Cliquer sur un événement auto-généré pour accéder au module source | Naviguer vers le détail (ex: fiche entretien) |

---

## 4. Règles métier

### 4.1 Événements

- Un événement a obligatoirement : un titre et une date de début
- La date de fin est optionnelle (par défaut = date de début + 1h si horaire, ou même jour si journée entière)
- Un événement peut chevaucher d'autres événements (pas de contrôle de conflit)
- Un événement supprimé est supprimé définitivement (pas de corbeille dans le MVP)
- Les événements auto-générés par d'autres modules sont en lecture seule dans l'agenda (modification via le module source)

### 4.2 Récurrences

- Format de stockage : RRULE (standard iCalendar RFC 5545)
- Options simples : quotidien, hebdomadaire, mensuel, annuel, avec intervalle (tous les X)
- Options avancées : par jour de la semaine (ex: tous les mardis et jeudis), par position dans le mois (ex: 2ème mardi)
- Une modification d'occurrence unique crée une exception (EXDATE + événement autonome)
- "Modifier tous les futurs" scinde la série en deux : l'ancienne s'arrête, une nouvelle commence

### 4.3 Notifications

- Les notifications push nécessitent l'autorisation du navigateur (demandée au premier lancement)
- Si l'utilisateur refuse les notifications, un bandeau discret lui rappelle qu'il peut les activer dans les paramètres
- Les rappels sont évalués côté serveur (cron job) pour fonctionner même si l'app n'est pas ouverte

### 4.4 Import/Export .ics

- L'import parse le fichier et crée les événements correspondants (avec récurrences si présentes)
- En cas de doublon détecté (même UID .ics), proposer : ignorer, remplacer, ou créer un doublon
- L'export génère un fichier .ics valide conforme RFC 5545

---

## 5. Parcours utilisateur clés

### 5.1 Créer un événement rapide (mobile)

1. L'utilisateur ouvre l'agenda (vue semaine par défaut)
2. Il tape sur un créneau horaire vide
3. Un formulaire rapide s'ouvre (bottom sheet sur mobile) avec : titre, date/heure pré-remplie
4. Il saisit le titre, ajuste l'heure si besoin
5. Il tape "Enregistrer"
6. L'événement apparaît dans le calendrier
7. Il peut taper dessus pour ajouter des détails (catégorie, assignation, rappel, lieu, notes)

### 5.2 Créer un événement détaillé

1. L'utilisateur tape sur le bouton "+" (FAB en bas à droite)
2. Un formulaire complet s'ouvre :
   - Titre (obligatoire)
   - Date de début / Date de fin
   - Journée entière (toggle)
   - Récurrence (sélecteur)
   - Catégorie (sélecteur avec couleurs)
   - Assigner à (sélecteur multi-membres)
   - Lieu (texte libre)
   - Rappels (ajout multiple)
   - Notes (texte libre)
3. Il remplit les champs souhaités et enregistre

### 5.3 Consulter et filtrer

1. L'utilisateur ouvre l'agenda
2. Il voit tous les événements du foyer, avec un code couleur par catégorie et des pastilles membres
3. Il active le filtre "Mes événements" → seuls ses événements assignés + les événements familiaux s'affichent
4. Il filtre par catégorie "Santé" → seuls les RDV médicaux apparaissent
5. Il utilise la recherche pour trouver "dentiste" → résultats listés chronologiquement

### 5.4 Drag & drop (desktop/tablet)

1. En vue semaine, l'utilisateur attrape un événement
2. Il le glisse vers un autre créneau → l'événement est déplacé (date/heure mises à jour)
3. Il attrape le bord inférieur d'un événement et le tire vers le bas → la durée augmente
4. Sur un événement récurrent, une modale demande : "Cette occurrence uniquement" ou "Toutes les occurrences futures"

---

## 6. États et cas limites

| Situation | Comportement |
|---|---|
| Événement sans heure de fin | Durée par défaut : 1 heure |
| Événement journée entière qui chevauche | Affiché en bannière en haut de la vue jour/semaine |
| Événement récurrent sans date de fin | Se répète indéfiniment (affichage limité à 1 an dans les vues) |
| Drag & drop sur mobile | Non disponible (uniquement desktop/tablet). Utiliser le formulaire d'édition. |
| Import .ics avec événements > 1000 | Traitement en arrière-plan avec barre de progression |
| Membre supprimé du foyer | Ses assignations sont retirées, les événements restent |
| Événement auto-généré supprimé dans le module source | Supprimé automatiquement de l'agenda |

---

## 7. Écrans à concevoir

1. **Vue Mois** — Grille mensuelle avec points/pastilles par jour
2. **Vue Semaine** — Grille horaire 7 jours, événements positionnés
3. **Vue Jour** — Grille horaire détaillée, 1 jour
4. **Formulaire création/édition** — Bottom sheet (mobile) ou modale (desktop)
5. **Détail événement** — Fiche complète avec actions (modifier, supprimer, lien module source)
6. **Panneau de filtres** — Filtres par membre et catégorie
7. **Recherche** — Barre de recherche avec résultats
8. **Import .ics** — Écran d'upload avec prévisualisation
9. **Paramètres agenda** — Gestion des catégories, vue par défaut, premier jour de semaine

---

*Document créé le 08/04/2026 — Version 1.0*
