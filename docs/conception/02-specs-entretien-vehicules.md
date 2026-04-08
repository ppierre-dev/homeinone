# HomeInOne — Spécifications fonctionnelles : Module Entretien véhicules 🚗

## 1. Présentation du module

Le module Entretien véhicules est le carnet de bord complet de chaque véhicule du foyer. Il centralise les informations pratiques, le suivi d'entretien avec rappels intelligents (kilométrage ET durée), le suivi de la consommation carburant, les coûts, et la gestion des documents administratifs avec alertes d'expiration.

**Principe clé** : Les rappels d'entretien se déclenchent au premier seuil atteint (kilométrage OU durée), comme un carnet d'entretien constructeur. Le suivi kilométrique permet de projeter les échéances.

---

## 2. Concepts clés

### 2.1 Véhicule

Fiche d'identité complète du véhicule.

**Propriétés d'un véhicule :**

| Champ | Type | Obligatoire | Description |
|---|---|---|---|
| Nom | Texte | Oui | Nom d'usage (ex: "Clio de Marie", "La moto") |
| Type | Enum | Oui | Voiture / Moto |
| Marque | Texte | Non | Constructeur (ex: Renault, Yamaha) |
| Modèle | Texte | Non | Modèle (ex: Clio V, MT-07) |
| Année / Millésime | Entier | Non | Année du modèle |
| Immatriculation | Texte | Non | Plaque d'immatriculation |
| Numéro VIN | Texte | Non | Numéro de série du véhicule |
| Motorisation | Enum | Non | Essence / Diesel / Hybride / Électrique / GPL |
| Date de mise en circulation | Date | Non | Première immatriculation |
| Date d'achat | Date | Non | Quand on l'a acquis |
| Kilométrage actuel | Entier | Non | Dernier relevé de compteur |
| Date du dernier relevé km | Date | Auto | Date du dernier relevé kilométrique |
| Kilométrage annuel estimé | Entier | Non | Estimation pour projeter les échéances (calculable automatiquement) |
| Photo | Image | Non | Photo du véhicule |
| Notes | Texte | Non | Informations complémentaires |

### 2.2 Intervention véhicule

Action de maintenance réalisée ou à réaliser sur un véhicule.

**Propriétés d'une intervention :**

| Champ | Type | Obligatoire | Description |
|---|---|---|---|
| Titre | Texte | Oui | Description (ex: "Vidange + filtre à huile") |
| Description | Rich text | Non | Détails, observations |
| Véhicule | Référence | Oui | Sur quel véhicule |
| Catégorie | Référence | Non | Type de maintenance |
| Statut | Enum | Oui | À planifier / Planifié / En cours / Terminé / Annulé |
| Priorité | Enum | Non | Basse / Moyenne / Haute / Urgente |
| Date prévue | Date | Non | Quand l'intervention est prévue |
| Date réalisée | Date | Non | Quand elle a été effectivement réalisée |
| Kilométrage à la réalisation | Entier | Non | Compteur au moment de l'intervention |
| Récurrence durée | RRULE | Non | Règle de récurrence temporelle (ex: tous les ans) |
| Récurrence kilométrage | Entier | Non | Intervalle en km (ex: tous les 15 000 km) |
| Coût estimé | Décimal | Non | Budget prévu |
| Coût réel | Décimal | Non | Montant dépensé |
| Coût pièces | Décimal | Non | Montant des pièces détachées |
| Coût main d'œuvre | Décimal | Non | Montant de la main d'œuvre |
| Prestataire | Référence | Non | Lien vers le carnet de prestataires (partagé avec le module logement) |
| Réalisé par | Enum | Non | Moi-même / Garage / Prestataire |
| Assigné à | Références multiples | Non | Membre(s) responsable(s) |
| Pièces jointes | Fichiers multiples | Non | Photos, factures, devis |
| Créé par | Référence membre | Auto | Auteur |
| Date création | Datetime | Auto | Horodatage |

### 2.3 Catégories de maintenance véhicule

**Catégories prédéfinies (personnalisables) :**

| Catégorie | Icône | Applicable à |
|---|---|---|
| Vidange / Huile | 🛢 | Voiture, Moto |
| Filtres (air, huile, habitacle, carburant) | 🔄 | Voiture, Moto |
| Freins (plaquettes, disques, liquide) | 🛑 | Voiture, Moto |
| Pneus | 🔘 | Voiture, Moto |
| Courroie de distribution | ⛓ | Voiture |
| Batterie | 🔋 | Voiture, Moto |
| Éclairage (ampoules, phares) | 💡 | Voiture, Moto |
| Échappement | 💨 | Voiture, Moto |
| Suspension / Amortisseurs | 🔩 | Voiture, Moto |
| Transmission (embrayage, boîte) | ⚙️ | Voiture, Moto |
| Climatisation | ❄️ | Voiture |
| Chaîne / Kit chaîne | 🔗 | Moto |
| Carrosserie / Esthétique | ✨ | Voiture, Moto |
| Contrôle technique | 📋 | Voiture, Moto |
| Autre | 📌 | Voiture, Moto |

### 2.4 Modèles d'entretien prédéfinis

**Pour voiture :**

| Modèle | Catégorie | Récurrence km | Récurrence durée | Notes |
|---|---|---|---|---|
| Vidange + filtre à huile | Vidange | 15 000 km | 1 an | Premier atteint |
| Filtre à air | Filtres | 30 000 km | 2 ans | |
| Filtre à habitacle | Filtres | 20 000 km | 1 an | |
| Plaquettes de frein avant | Freins | 30 000 km | — | Vérifier épaisseur |
| Liquide de frein | Freins | — | 2 ans | Obligatoire |
| Pneus (vérification usure) | Pneus | 20 000 km | 1 an | Vérifier profondeur |
| Courroie de distribution | Courroie | 100 000 km | 5 ans | Critique |
| Batterie | Batterie | — | 4 ans | Durée de vie moyenne |
| Contrôle technique | CT | — | 2 ans | Obligatoire (1er CT à 4 ans) |
| Recharge climatisation | Climatisation | — | 2 ans | Si perte de performance |
| Bougies d'allumage | Autre | 60 000 km | — | Essence uniquement |
| Liquide de refroidissement | Autre | 60 000 km | 4 ans | |

**Pour moto :**

| Modèle | Catégorie | Récurrence km | Récurrence durée | Notes |
|---|---|---|---|---|
| Vidange + filtre à huile | Vidange | 6 000 km | 1 an | Premier atteint |
| Filtre à air | Filtres | 12 000 km | 2 ans | |
| Plaquettes de frein | Freins | 10 000 km | — | Avant + arrière |
| Liquide de frein | Freins | — | 2 ans | |
| Kit chaîne (chaîne + pignons + couronne) | Chaîne | 20 000 km | — | Selon usure |
| Graissage chaîne | Chaîne | 500 km | — | À chaque plein environ |
| Pneus (vérification) | Pneus | 8 000 km | 1 an | |
| Bougies | Autre | 12 000 km | — | |
| Liquide de refroidissement | Autre | 24 000 km | 2 ans | |
| Contrôle technique | CT | — | 2 ans | Obligatoire |

### 2.5 Relevé kilométrique

Le suivi kilométrique permet de suivre l'évolution du compteur et de projeter les échéances d'entretien.

**Propriétés d'un relevé :**

| Champ | Type | Obligatoire | Description |
|---|---|---|---|
| Date | Date | Oui | Date du relevé |
| Kilométrage | Entier | Oui | Valeur du compteur |
| Source | Enum | Auto | Manuel / Intervention / Plein carburant |

Les relevés sont aussi créés automatiquement lorsque l'utilisateur renseigne le kilométrage lors d'une intervention ou d'un plein carburant.

### 2.6 Plein carburant

Suivi de la consommation et des coûts carburant.

**Propriétés d'un plein :**

| Champ | Type | Obligatoire | Description |
|---|---|---|---|
| Date | Date | Oui | Date du plein |
| Kilométrage | Entier | Oui | Compteur au moment du plein |
| Litres | Décimal | Oui | Volume en litres |
| Montant | Décimal | Oui | Prix payé en € |
| Type de carburant | Enum | Non | SP95 / SP98 / E10 / E85 / Diesel / GPL / Électrique (kWh) |
| Plein complet | Booléen | Oui | Plein fait jusqu'en haut (nécessaire pour le calcul de consommation) |
| Station | Texte | Non | Nom ou lieu de la station |
| Notes | Texte | Non | Commentaires |

### 2.7 Documents véhicule

Gestion des documents administratifs avec alertes d'expiration.

**Types de documents prédéfinis :**

| Document | Champs spécifiques | Alerte expiration |
|---|---|---|
| Carte grise | Numéro, date d'émission | Non (pas d'expiration) |
| Assurance | Assureur, numéro contrat, date début, date fin | 1 mois avant expiration |
| Contrôle technique | Date passage, date limite, centre CT, résultat (favorable/défavorable/contre-visite) | 2 mois avant + 1 mois avant |
| Permis de conduire | Numéro, catégories, date d'expiration | 3 mois avant expiration |
| Vignette Crit'Air | Niveau (1-5), date d'obtention | Non |

**Propriétés communes :**

| Champ | Type | Obligatoire | Description |
|---|---|---|---|
| Type | Enum | Oui | Type de document |
| Véhicule | Référence | Oui | Véhicule associé |
| Date d'expiration | Date | Non | Date de fin de validité |
| Fichier joint | Fichier | Non | Scan/photo du document (PDF, image) |
| Notes | Texte | Non | Commentaires |

---

## 3. User Stories

### 3.1 Gestion des véhicules

| ID | En tant que... | Je veux... | Afin de... |
|---|---|---|---|
| EV-01 | Membre du foyer | Ajouter un véhicule avec ses informations (nom, marque, modèle, immatriculation, etc.) | Enregistrer mon véhicule |
| EV-02 | Membre du foyer | Modifier les informations d'un véhicule | Mettre à jour les données |
| EV-03 | Membre du foyer | Supprimer un véhicule | Retirer un véhicule vendu ou mis à la casse |
| EV-04 | Membre du foyer | Voir la fiche complète d'un véhicule (infos, km, prochains entretiens, documents) | Avoir une vue d'ensemble |
| EV-05 | Membre du foyer | Basculer entre les véhicules du foyer | Consulter le bon véhicule |

### 3.2 Suivi kilométrique

| ID | En tant que... | Je veux... | Afin de... |
|---|---|---|---|
| EV-06 | Membre du foyer | Saisir un relevé kilométrique (date + km) | Mettre à jour le compteur |
| EV-07 | Membre du foyer | Voir l'historique des relevés kilométriques | Suivre l'évolution |
| EV-08 | Membre du foyer | Voir le kilométrage annuel estimé (calculé automatiquement) | Projeter les échéances |
| EV-09 | Système | Calculer automatiquement le kilométrage annuel moyen à partir des relevés | Affiner les projections d'entretien |

### 3.3 Gestion des interventions

| ID | En tant que... | Je veux... | Afin de... |
|---|---|---|---|
| EV-10 | Membre du foyer | Créer une intervention avec titre, catégorie, statut | Enregistrer un entretien |
| EV-11 | Membre du foyer | Renseigner le kilométrage au moment de l'intervention | Historiser précisément |
| EV-12 | Membre du foyer | Renseigner les coûts (estimé, réel, pièces, main d'œuvre) | Suivre les dépenses |
| EV-13 | Membre du foyer | Associer un prestataire (garage) à une intervention | Savoir qui a fait le travail |
| EV-14 | Membre du foyer | Joindre des fichiers (factures, photos) | Conserver les justificatifs |
| EV-15 | Membre du foyer | Marquer une intervention comme terminée | Historiser et déclencher la prochaine occurrence |
| EV-16 | Membre du foyer | Modifier ou supprimer une intervention | Corriger les données |
| EV-17 | Membre du foyer | Assigner une intervention à un membre du foyer | Savoir qui s'en occupe |

### 3.4 Entretiens récurrents et modèles

| ID | En tant que... | Je veux... | Afin de... |
|---|---|---|---|
| EV-18 | Membre du foyer | Parcourir les modèles d'entretien prédéfinis (adaptés au type de véhicule) | Découvrir les entretiens recommandés |
| EV-19 | Membre du foyer | Activer un modèle prédéfini pour mon véhicule | Mettre en place un suivi en un clic |
| EV-20 | Membre du foyer | Personnaliser les seuils d'un modèle (km et/ou durée) | Adapter à mon véhicule |
| EV-21 | Membre du foyer | Créer un entretien récurrent personnalisé (seuil km et/ou durée) | Suivre un entretien spécifique |
| EV-22 | Système | Déclencher un rappel quand le premier seuil est atteint (km OU durée) | Alerter au bon moment |
| EV-23 | Système | Projeter la date approximative du prochain entretien basé km (via le kilométrage annuel estimé) | Anticiper les échéances |
| EV-24 | Système | Générer la prochaine occurrence quand l'intervention est terminée | Assurer la continuité |

### 3.5 Suivi carburant

| ID | En tant que... | Je veux... | Afin de... |
|---|---|---|---|
| EV-25 | Membre du foyer | Enregistrer un plein carburant (date, km, litres, montant) | Suivre ma consommation |
| EV-26 | Membre du foyer | Voir ma consommation moyenne (L/100 km) | Évaluer l'efficacité |
| EV-27 | Membre du foyer | Voir le coût moyen au kilomètre (carburant) | Suivre le budget carburant |
| EV-28 | Membre du foyer | Voir l'historique des pleins avec graphique d'évolution | Détecter des anomalies |
| EV-29 | Membre du foyer | Voir le total dépensé en carburant par période | Budgéter |

### 3.6 Documents véhicule

| ID | En tant que... | Je veux... | Afin de... |
|---|---|---|---|
| EV-30 | Membre du foyer | Ajouter un document véhicule (assurance, CT, carte grise, etc.) | Centraliser l'administratif |
| EV-31 | Membre du foyer | Joindre un scan/photo du document | Avoir une copie numérique |
| EV-32 | Membre du foyer | Voir les dates d'expiration de mes documents | Anticiper les renouvellements |
| EV-33 | Système | Envoyer une notification avant l'expiration d'un document (selon les délais configurés) | Ne pas rouler sans assurance ou CT |
| EV-34 | Membre du foyer | Modifier ou supprimer un document | Mettre à jour |

### 3.7 Consultation et statistiques

| ID | En tant que... | Je veux... | Afin de... |
|---|---|---|---|
| EV-35 | Membre du foyer | Voir le tableau de bord d'un véhicule (prochains entretiens, km, documents, alertes) | Vue d'ensemble rapide |
| EV-36 | Membre du foyer | Filtrer les interventions par catégorie ou statut | Retrouver un type d'entretien |
| EV-37 | Membre du foyer | Voir l'historique complet d'un véhicule (interventions + pleins, chronologique) | Consulter tout le parcours |
| EV-38 | Membre du foyer | Voir les statistiques de coûts (entretien + carburant) par véhicule et par période | Connaître le coût total de possession |
| EV-39 | Membre du foyer | Rechercher dans les interventions par mot-clé | Retrouver rapidement |

### 3.8 Intégration inter-modules

| ID | En tant que... | Je veux... | Afin de... |
|---|---|---|---|
| EV-40 | Système | Créer un événement dans l'agenda quand une intervention est planifiée ou un document expire bientôt | Centraliser les échéances |
| EV-41 | Système | Mettre à jour / supprimer l'événement agenda en cohérence avec l'intervention | Garder la cohérence |
| EV-42 | Membre du foyer | Accéder à l'intervention depuis l'événement agenda | Naviguer facilement |
| EV-43 | Membre du foyer | Utiliser le même carnet de prestataires que le module logement | Ne pas ressaisir mes contacts |

---

## 4. Règles métier

### 4.1 Véhicules
- Un foyer peut avoir un nombre illimité de véhicules
- Supprimer un véhicule demande confirmation et supprime toutes ses interventions, pleins et documents
- Le type (Voiture/Moto) détermine les modèles d'entretien proposés et les catégories disponibles

### 4.2 Kilométrage
- Le kilométrage ne peut qu'augmenter — un relevé inférieur au précédent affiche un avertissement (saisie erronée probable)
- Le kilométrage annuel estimé est calculé automatiquement : (dernier relevé - premier relevé) / nombre de jours × 365. Recalculé à chaque nouveau relevé
- L'utilisateur peut forcer une valeur de kilométrage annuel estimé (override du calcul auto)
- Un relevé kilométrique est automatiquement créé lors d'une intervention ou d'un plein (si le km est renseigné)

### 4.3 Rappels d'entretien (double seuil)
- Chaque entretien récurrent peut avoir un seuil kilométrique ET/OU un seuil temporel
- Le rappel se déclenche au **premier seuil atteint** :
  - Seuil km : basé sur le kilométrage de la dernière intervention + l'intervalle. La projection utilise le kilométrage annuel estimé pour calculer la date approximative
  - Seuil durée : basé sur la date de la dernière intervention + l'intervalle
- Exemple : Vidange à 15 000 km OU 1 an. Dernière vidange : 01/01/2026 à 50 000 km. Si l'utilisateur roule 20 000 km/an, le rappel km se déclenchera vers ~septembre 2026 (65 000 km). Mais le rappel temporel (01/01/2027) sera aussi actif. Le premier atteint déclenche la notification.
- Les rappels sont envoyés : 1 mois avant la date projetée (km) ou la date d'échéance (durée), puis 1 semaine avant, puis le jour J

### 4.4 Consommation carburant
- La consommation (L/100 km) n'est calculée qu'entre deux pleins complets consécutifs (sinon le calcul est faux)
- Formule : litres du plein actuel / (km actuel - km du plein précédent) × 100
- Les pleins partiels (non complets) sont enregistrés mais exclus du calcul de consommation
- Pour les véhicules électriques : kWh/100 km au lieu de L/100 km

### 4.5 Documents
- Les alertes d'expiration sont envoyées aux délais configurés par type de document
- Un document expiré est visuellement marqué en rouge sur le tableau de bord
- Le permis de conduire est lié au membre du foyer, pas au véhicule (mais affiché dans le contexte véhicule)

### 4.6 Prestataires
- Le carnet de prestataires est **partagé** avec le module Entretien logement (même entité)
- Un garage peut être associé à la spécialité "Mécanique auto", "Mécanique moto", etc.

### 4.7 Coûts
- Le coût total de possession = entretiens + carburant (somme sur une période)
- Les coûts sont détaillables : pièces + main d'œuvre
- Statistiques disponibles : coût total, coût/km, coût/mois, répartition par catégorie

---

## 5. Parcours utilisateur clés

### 5.1 Configurer son véhicule (premier usage)

1. L'utilisateur ouvre le module Véhicules pour la première fois
2. Un assistant l'accueille : "Ajoutez votre premier véhicule"
3. Il choisit le type (Voiture), saisit le nom, la marque, le modèle, l'immatriculation
4. Il renseigne le kilométrage actuel et la date de mise en circulation
5. L'app propose les modèles d'entretien adaptés : "Quels entretiens voulez-vous suivre ?"
6. Il active ceux qui le concernent, ajuste les seuils si nécessaire
7. Il peut ajouter ses documents (assurance, CT) avec dates d'expiration
8. Le tableau de bord s'affiche avec les prochaines échéances

### 5.2 Enregistrer un plein carburant (mobile)

1. L'utilisateur est à la pompe
2. Il ouvre le module, sélectionne son véhicule
3. Il tape sur "Ajouter un plein"
4. Il saisit : km au compteur, litres, montant, coche "plein complet"
5. Enregistré en 10 secondes
6. La consommation moyenne se met à jour

### 5.3 Consulter le tableau de bord véhicule

1. L'utilisateur ouvre le module et sélectionne son véhicule
2. Il voit :
   - **Kilométrage actuel** et kilométrage annuel estimé
   - **Prochains entretiens** avec barre de progression (km restant / jours restants)
   - **Alertes** : entretiens en retard (rouge), documents expirant bientôt (orange)
   - **Dernière consommation** : X L/100 km
   - **Coût du mois / de l'année**
3. Il peut accéder à chaque section en tapant dessus

---

## 6. États et cas limites

| Situation | Comportement |
|---|---|
| Véhicule sans relevé kilométrique | Pas de projection possible — seuls les rappels temporels fonctionnent |
| Un seul relevé km | Pas de calcul de km annuel — l'utilisateur peut le saisir manuellement |
| Plein non complet | Enregistré mais exclu du calcul de consommation, avec indication visuelle |
| Kilométrage saisi inférieur au dernier relevé | Avertissement "Le kilométrage semble inférieur au dernier relevé (X km). Vérifiez la saisie." |
| Véhicule électrique | kWh au lieu de litres, kWh/100 km au lieu de L/100 km, pas de type carburant |
| Document expiré | Badge rouge sur le tableau de bord, notification envoyée |
| Entretien récurrent avec seuil km ET durée, aucun relevé km récent | Seul le rappel temporel fonctionne, avec mention "Mettez à jour votre kilométrage" |
| Véhicule supprimé | Confirmation requise. Tout est supprimé (interventions, pleins, documents) |
| Changement de véhicule (vente + achat) | L'ancien véhicule peut être archivé (masqué mais données conservées) au lieu de supprimé |

---

## 7. Écrans à concevoir

1. **Tableau de bord véhicule** — Vue d'ensemble : km, prochains entretiens (barres de progression), alertes documents, consommation, coûts
2. **Sélecteur de véhicule** — Bascule entre véhicules (header ou dropdown)
3. **Fiche véhicule** — Informations détaillées, photo, immatriculation
4. **Liste des interventions** — Filtrable par catégorie, statut, avec recherche
5. **Formulaire intervention** — Création / édition avec coûts détaillés et pièces jointes
6. **Modèles d'entretien** — Catalogue adaptés au type de véhicule avec activation
7. **Historique pleins carburant** — Liste + graphique consommation L/100 km
8. **Formulaire plein** — Saisie rapide (km, litres, montant)
9. **Documents véhicule** — Liste avec badges d'expiration, scan joints
10. **Statistiques** — Graphiques coûts (entretien + carburant), coût/km, répartition par catégorie
11. **Assistant premier usage** — Wizard de configuration initiale

---

*Document créé le 08/04/2026 — Version 1.0*
