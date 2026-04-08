# HomeInOne — Spécifications fonctionnelles : Module Entretien logement 🏠

## 1. Présentation du module

Le module Entretien logement est le carnet de suivi de la maison. Il permet de planifier, suivre et historiser toutes les opérations de maintenance du logement : entretien périodique (chaudière, VMC, détartrage…), réparations, travaux, avec suivi des coûts, des prestataires et des pièces justificatives.

**Principe clé** : Chaque logement est découpé en pièces. Chaque intervention est classée par pièce ET par catégorie de maintenance. Des rappels périodiques automatiques évitent les oublis.

---

## 2. Concepts clés

### 2.1 Logement

Un foyer peut gérer plusieurs logements (résidence principale, secondaire, location, etc.). Chaque logement a ses propres pièces, interventions et rappels.

**Propriétés d'un logement :**

| Champ | Type | Obligatoire | Description |
|---|---|---|---|
| Nom | Texte | Oui | Nom du logement (ex: "Maison principale", "Appart Paris") |
| Adresse | Texte | Non | Adresse complète |
| Type | Enum | Non | Maison / Appartement / Studio / Autre |
| Surface | Décimal | Non | Surface en m² |
| Date d'emménagement | Date | Non | Depuis quand on y habite |
| Photo | Image | Non | Photo du logement |
| Notes | Texte | Non | Informations complémentaires |

### 2.2 Pièce

Chaque logement est composé de pièces paramétrables.

**Pièces prédéfinies (personnalisables) :**

| Pièce | Icône |
|---|---|
| Cuisine | 🍳 |
| Salon | 🛋 |
| Salle de bain | 🚿 |
| Chambre | 🛏 |
| Toilettes | 🚽 |
| Garage | 🏗 |
| Jardin / Extérieur | 🌿 |
| Cave / Sous-sol | 📦 |
| Buanderie | 👕 |
| Bureau | 🖥 |
| Entrée / Couloir | 🚪 |
| Grenier / Combles | 🏚 |
| Général (tout le logement) | 🏠 |

L'utilisateur peut ajouter des pièces personnalisées, renommer ou désactiver les prédéfinies. Une pièce peut être dupliquée (ex: "Chambre 1", "Chambre 2").

### 2.3 Catégorie de maintenance

Classification par type de maintenance, transversale aux pièces.

**Catégories prédéfinies (personnalisables) :**

| Catégorie | Icône | Couleur |
|---|---|---|
| Plomberie | 🔧 | Bleu |
| Électricité | ⚡ | Jaune |
| Chauffage / Climatisation | 🌡 | Rouge |
| Ventilation (VMC) | 💨 | Gris clair |
| Peinture / Murs | 🎨 | Violet |
| Menuiserie / Portes / Fenêtres | 🪟 | Marron |
| Toiture / Façade | 🏗 | Gris |
| Électroménager | 🔌 | Orange |
| Nettoyage / Entretien courant | 🧹 | Vert |
| Jardin / Extérieur | 🌱 | Vert foncé |
| Sécurité (alarme, détecteurs) | 🔒 | Noir |
| Autre | 📋 | Gris |

L'utilisateur peut ajouter des catégories personnalisées et modifier les couleurs/icônes.

### 2.4 Intervention

L'intervention est l'unité de base : une action de maintenance réalisée ou à réaliser.

**Propriétés d'une intervention :**

| Champ | Type | Obligatoire | Description |
|---|---|---|---|
| Titre | Texte | Oui | Description courte (ex: "Détartrage chauffe-eau") |
| Description | Rich text | Non | Détails, observations, notes |
| Logement | Référence | Oui | Dans quel logement |
| Pièce | Référence | Non | Dans quelle pièce (si applicable) |
| Catégorie | Référence | Non | Type de maintenance |
| Statut | Enum | Oui | À planifier / Planifié / En cours / Terminé / Annulé |
| Priorité | Enum | Non | Basse / Moyenne / Haute / Urgente |
| Date prévue | Date | Non | Quand l'intervention est prévue |
| Date réalisée | Date | Non | Quand elle a été effectivement réalisée |
| Récurrence | RRULE | Non | Règle de répétition (si entretien périodique) |
| Coût estimé | Décimal | Non | Budget prévu |
| Coût réel | Décimal | Non | Montant effectivement dépensé |
| Prestataire | Référence | Non | Lien vers le carnet de prestataires |
| Réalisé par | Enum | Non | Moi-même / Prestataire |
| Assigné à | Références multiples | Non | Membre(s) du foyer responsable(s) |
| Pièces jointes | Fichiers multiples | Non | Photos, factures PDF, devis |
| Créé par | Référence membre | Auto | Auteur |
| Date création | Datetime | Auto | Horodatage |

### 2.5 Modèle d'entretien prédéfini

Des modèles d'entretien courants sont proposés à l'utilisateur pour l'aider à mettre en place ses rappels. L'utilisateur peut les activer, les personnaliser ou les ignorer.

**Modèles prédéfinis :**

| Modèle | Catégorie | Récurrence | Description |
|---|---|---|---|
| Entretien chaudière | Chauffage | Annuel | Révision annuelle obligatoire par un professionnel |
| Ramonage cheminée | Chauffage | Annuel | Ramonage obligatoire (1 à 2 fois/an selon région) |
| Nettoyage VMC | Ventilation | Trimestriel | Nettoyage des bouches et filtres |
| Purge radiateurs | Chauffage | Annuel | Avant la saison de chauffe |
| Détartrage chauffe-eau | Plomberie | Tous les 2 ans | Prolonge la durée de vie |
| Vérification détecteurs fumée | Sécurité | Semestriel | Test des piles et du fonctionnement |
| Nettoyage gouttières | Toiture | Semestriel | Avant et après l'automne |
| Entretien climatisation | Chauffage | Annuel | Nettoyage filtres, vérification gaz |
| Contrôle installation électrique | Électricité | Tous les 10 ans | Diagnostic électrique |
| Traitement anti-mousse toiture | Toiture | Tous les 5 ans | Protection de la couverture |
| Entretien fosse septique | Plomberie | Tous les 4 ans | Vidange obligatoire |
| Nettoyage filtres hotte | Électroménager | Trimestriel | Nettoyage ou remplacement |

### 2.6 Prestataire

Carnet d'adresses des professionnels réutilisable dans toutes les interventions.

**Propriétés d'un prestataire :**

| Champ | Type | Obligatoire | Description |
|---|---|---|---|
| Nom / Entreprise | Texte | Oui | Nom du prestataire |
| Métier / Spécialité | Texte | Non | Ex: Plombier, Électricien, Couvreur |
| Téléphone | Texte | Non | Numéro de contact |
| Email | Texte | Non | Adresse email |
| Adresse | Texte | Non | Adresse postale |
| Site web | URL | Non | Site internet |
| Notes | Texte | Non | Commentaires, avis, expériences passées |
| Note de satisfaction | Entier (1-5) | Non | Évaluation personnelle |

---

## 3. User Stories

### 3.1 Gestion des logements

| ID | En tant que... | Je veux... | Afin de... |
|---|---|---|---|
| EL-01 | Administrateur du foyer | Ajouter un logement avec ses informations | Gérer plusieurs propriétés |
| EL-02 | Administrateur du foyer | Modifier les informations d'un logement | Mettre à jour les données |
| EL-03 | Administrateur du foyer | Supprimer un logement | Retirer un logement qu'on ne gère plus |
| EL-04 | Administrateur du foyer | Configurer les pièces d'un logement (ajouter, renommer, supprimer) | Adapter au plan réel |
| EL-05 | Membre du foyer | Basculer entre les logements | Consulter l'entretien du bon logement |

### 3.2 Gestion des interventions

| ID | En tant que... | Je veux... | Afin de... |
|---|---|---|---|
| EL-06 | Membre du foyer | Créer une intervention avec titre, pièce, catégorie | Enregistrer une maintenance |
| EL-07 | Membre du foyer | Définir le statut d'une intervention | Suivre l'avancement |
| EL-08 | Membre du foyer | Définir la priorité d'une intervention | Identifier les urgences |
| EL-09 | Membre du foyer | Planifier une date pour l'intervention | Organiser dans le temps |
| EL-10 | Membre du foyer | Marquer une intervention comme terminée (avec date réalisée) | Historiser |
| EL-11 | Membre du foyer | Renseigner le coût estimé et le coût réel | Suivre les dépenses |
| EL-12 | Membre du foyer | Associer un prestataire à une intervention | Savoir qui a fait le travail |
| EL-13 | Membre du foyer | Assigner une intervention à un membre du foyer | Répartir les responsabilités |
| EL-14 | Membre du foyer | Joindre des fichiers (photos, factures, devis) | Conserver les justificatifs |
| EL-15 | Membre du foyer | Modifier une intervention existante | Corriger ou compléter |
| EL-16 | Membre du foyer | Supprimer une intervention | Retirer une entrée erronée |

### 3.3 Entretiens récurrents et modèles

| ID | En tant que... | Je veux... | Afin de... |
|---|---|---|---|
| EL-17 | Membre du foyer | Créer une intervention récurrente (tous les X jours/mois/ans) | Planifier un entretien périodique |
| EL-18 | Membre du foyer | Parcourir les modèles d'entretien prédéfinis | Découvrir les entretiens recommandés |
| EL-19 | Membre du foyer | Activer un modèle prédéfini pour mon logement | Mettre en place un rappel en un clic |
| EL-20 | Membre du foyer | Personnaliser un modèle activé (changer la fréquence, la pièce, etc.) | Adapter à ma situation |
| EL-21 | Système | Générer automatiquement la prochaine intervention quand la précédente est terminée | Assurer la continuité du suivi |
| EL-22 | Système | Envoyer un rappel (notification push) avant l'échéance d'un entretien | Éviter les oublis |

### 3.4 Consultation et filtres

| ID | En tant que... | Je veux... | Afin de... |
|---|---|---|---|
| EL-23 | Membre du foyer | Voir le tableau de bord d'un logement (prochains entretiens, en retard, stats) | Avoir une vue d'ensemble |
| EL-24 | Membre du foyer | Filtrer les interventions par pièce | Voir tout ce qui concerne la cuisine |
| EL-25 | Membre du foyer | Filtrer les interventions par catégorie | Voir toute la plomberie |
| EL-26 | Membre du foyer | Filtrer les interventions par statut | Voir ce qui reste à faire |
| EL-27 | Membre du foyer | Voir l'historique complet des interventions d'une pièce | Consulter le passé d'une pièce |
| EL-28 | Membre du foyer | Rechercher une intervention par mot-clé | Retrouver rapidement |
| EL-29 | Membre du foyer | Voir le total des dépenses par logement / pièce / catégorie / période | Suivre le budget entretien |

### 3.5 Carnet de prestataires

| ID | En tant que... | Je veux... | Afin de... |
|---|---|---|---|
| EL-30 | Membre du foyer | Ajouter un prestataire au carnet d'adresses | Constituer mon répertoire |
| EL-31 | Membre du foyer | Modifier ou supprimer un prestataire | Mettre à jour mes contacts |
| EL-32 | Membre du foyer | Rechercher un prestataire par nom ou spécialité | Retrouver un contact |
| EL-33 | Membre du foyer | Voir toutes les interventions réalisées par un prestataire | Évaluer sa fiabilité |
| EL-34 | Membre du foyer | Noter un prestataire (1 à 5 étoiles) et ajouter un commentaire | Garder un avis pour plus tard |
| EL-35 | Membre du foyer | Sélectionner un prestataire depuis le carnet lors de la création d'une intervention | Associer rapidement |

### 3.6 Intégration inter-modules

| ID | En tant que... | Je veux... | Afin de... |
|---|---|---|---|
| EL-36 | Système | Créer automatiquement un événement dans l'agenda quand une intervention est planifiée | Centraliser les échéances |
| EL-37 | Système | Mettre à jour l'événement agenda si la date d'intervention change | Garder la cohérence |
| EL-38 | Système | Supprimer l'événement agenda quand l'intervention est terminée ou annulée | Ne pas polluer l'agenda |
| EL-39 | Membre du foyer | Cliquer sur un événement "entretien" dans l'agenda pour accéder à l'intervention | Naviguer facilement |
| EL-40 | Membre du foyer | Lier une intervention à un objet de l'inventaire (module Inventaire) | Connecter entretien et équipement |

---

## 4. Règles métier

### 4.1 Logements et pièces
- Un foyer peut avoir un nombre illimité de logements
- Chaque logement a sa propre liste de pièces
- La pièce "Général" est toujours présente et ne peut pas être supprimée (pour les interventions qui concernent tout le logement)
- Supprimer une pièce → les interventions associées passent dans "Général"
- Supprimer un logement demande confirmation et supprime toutes ses pièces et interventions

### 4.2 Interventions
- Le titre et le logement sont obligatoires, tout le reste est optionnel
- Le statut suit le flux : À planifier → Planifié → En cours → Terminé (ou Annulé à tout moment)
- Quand le statut passe à "Terminé", la date réalisée est pré-remplie avec la date du jour (modifiable)
- Le coût réel peut différer du coût estimé — les deux sont conservés pour analyse
- Les pièces jointes acceptées : images (JPG, PNG, WEBP), PDF. Taille max par fichier : 10 Mo

### 4.3 Entretiens récurrents
- Les modèles prédéfinis sont des suggestions — l'utilisateur choisit de les activer ou non
- Quand un modèle est activé, une première intervention est créée avec la date calculée
- Quand une intervention récurrente est marquée "Terminé", la suivante est automatiquement créée selon la règle de récurrence
- La prochaine occurrence est calculée à partir de la date réalisée (pas la date prévue) pour éviter le décalage
- Un entretien récurrent peut être désactivé (arrête de générer les suivants)
- Les rappels sont envoyés 1 semaine avant et 1 jour avant l'échéance (configurable)

### 4.4 Prestataires
- Le carnet de prestataires est global au foyer (partagé entre tous les logements)
- Supprimer un prestataire ne supprime pas les interventions associées — le nom est conservé en texte dans l'historique
- Un prestataire peut être associé à plusieurs catégories de maintenance

### 4.5 Coûts
- Les montants sont en euros (€) — la devise sera paramétrable plus tard pour l'open-source
- Les statistiques de coûts sont calculées dynamiquement (pas de pré-calcul)
- Les filtres de coûts permettent : par logement, par pièce, par catégorie, par période (mois/année)

---

## 5. Parcours utilisateur clés

### 5.1 Configurer son logement (premier usage)

1. L'utilisateur ouvre le module Entretien pour la première fois
2. Un assistant de configuration l'accueille : "Ajoutez votre premier logement"
3. Il saisit le nom (ex: "Maison"), le type, l'adresse
4. L'app propose les pièces prédéfinies avec des cases à cocher
5. Il coche les pièces correspondant à son logement, en ajoute si besoin (ex: "Chambre 2")
6. L'app propose les modèles d'entretien prédéfinis : "Quels entretiens voulez-vous suivre ?"
7. Il active ceux qui le concernent (ex: chaudière, VMC, détecteurs fumée)
8. Les interventions récurrentes sont créées automatiquement avec les bonnes échéances
9. Le tableau de bord s'affiche avec les prochains entretiens

### 5.2 Enregistrer une intervention (panne)

1. L'utilisateur constate une fuite sous l'évier
2. Il ouvre le module et tape "+"
3. Il crée une intervention : titre "Fuite sous évier", pièce "Cuisine", catégorie "Plomberie", priorité "Haute"
4. Il prend une photo de la fuite et la joint
5. Il contacte un plombier et l'ajoute au carnet de prestataires
6. Il associe le prestataire à l'intervention et planifie la date
7. → L'événement apparaît dans l'agenda
8. Après réparation, il passe le statut à "Terminé", renseigne le coût réel, joint la facture
9. → L'événement agenda est supprimé, l'intervention est dans l'historique

### 5.3 Consulter le tableau de bord

1. L'utilisateur ouvre le module Entretien
2. Il voit le tableau de bord de son logement principal :
   - **En retard** : entretiens dont l'échéance est dépassée (en rouge)
   - **À venir (30 jours)** : prochains entretiens planifiés
   - **En cours** : interventions en cours de traitement
   - **Statistiques** : dépenses du mois, dépenses de l'année, nombre d'interventions
3. Il peut basculer vers un autre logement via un sélecteur

---

## 6. États et cas limites

| Situation | Comportement |
|---|---|
| Intervention sans pièce | Classée dans "Général" |
| Intervention sans catégorie | Classée dans "Autre" |
| Entretien récurrent : occurrence sautée | L'intervention en retard reste visible, la suivante n'est générée que quand celle-ci est terminée |
| Prestataire supprimé | Le nom est conservé en texte brut dans les interventions passées |
| Logement supprimé | Confirmation requise. Toutes les pièces, interventions et récurrences sont supprimées |
| Photo/fichier supprimé d'une intervention | Suppression définitive |
| Changement de devise (futur) | Les montants existants ne sont pas convertis, juste l'affichage change |
| Modèle prédéfini activé puis désactivé | L'intervention en cours reste, les futures ne sont plus générées |
| Intervention liée à un objet de l'inventaire supprimé | Le lien est cassé, l'intervention reste avec une mention "objet supprimé" |

---

## 7. Écrans à concevoir

1. **Tableau de bord logement** — Vue d'ensemble avec entretiens en retard, à venir, en cours, stats coûts
2. **Sélecteur de logement** — Bascule entre logements (header ou dropdown)
3. **Liste des interventions** — Filtrable par pièce, catégorie, statut, avec recherche
4. **Formulaire intervention** — Création / édition complète avec pièces jointes
5. **Détail intervention** — Fiche complète avec historique, fichiers, lien prestataire
6. **Configuration logement** — Gestion des pièces (ajout, renommage, suppression)
7. **Modèles d'entretien** — Catalogue des modèles prédéfinis avec activation en un clic
8. **Carnet de prestataires** — Liste, recherche, fiche détaillée avec historique d'interventions
9. **Statistiques coûts** — Graphiques dépenses par logement / pièce / catégorie / période
10. **Assistant premier usage** — Wizard de configuration initiale du logement

---

*Document créé le 08/04/2026 — Version 1.0*
