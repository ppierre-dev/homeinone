# HomeInOne — Spécifications fonctionnelles : Module Inventaire objets 📦

## 1. Présentation du module

Le module Inventaire objets est le registre de tous les biens du foyer. Il permet de recenser chaque objet avec ses informations clés (date d'achat, prix, garantie, facture), de suivre son historique de pannes et réparations comme un carnet de santé, et d'être alerté avant l'expiration des garanties.

**Principe clé** : Chaque objet a une fiche complète avec son historique de vie. L'organisation se fait par catégorie d'objet, avec une association optionnelle à une pièce du logement (module Entretien logement). Le scan de code-barres permet d'accélérer la saisie.

---

## 2. Concepts clés

### 2.1 Catégorie d'objet

Organisation principale des objets par type.

**Catégories prédéfinies (personnalisables) :**

| Catégorie | Icône |
|---|---|
| Électroménager (gros) | 🧊 |
| Électroménager (petit) | 🍞 |
| High-tech / Informatique | 💻 |
| Téléphonie / Tablettes | 📱 |
| TV / Audio / Vidéo | 📺 |
| Mobilier | 🪑 |
| Literie | 🛏 |
| Luminaires | 💡 |
| Outillage / Bricolage | 🔨 |
| Jardin / Extérieur | 🌿 |
| Électricité / Domotique | ⚡ |
| Plomberie / Sanitaire | 🚿 |
| Décoration | 🖼 |
| Sport / Loisirs | ⚽ |
| Vêtements / Accessoires | 👕 |
| Jeux / Jouets | 🎮 |
| Autre | 📋 |

L'utilisateur peut ajouter des catégories personnalisées, modifier les icônes, ou désactiver les prédéfinies.

### 2.2 Objet

Fiche d'identité complète d'un bien.

**Propriétés d'un objet :**

| Champ | Type | Obligatoire | Description |
|---|---|---|---|
| Nom | Texte | Oui | Nom de l'objet (ex: "Lave-vaisselle Bosch", "MacBook Pro 14") |
| Description | Texte | Non | Détails, caractéristiques |
| Catégorie | Référence | Non | Classification par type |
| Logement | Référence | Non | Dans quel logement (lié au module Entretien logement) |
| Pièce | Référence | Non | Dans quelle pièce (lié au module Entretien logement) |
| Marque | Texte | Non | Fabricant |
| Modèle | Texte | Non | Référence du modèle |
| Numéro de série | Texte | Non | Numéro de série / IMEI |
| Code-barres / EAN | Texte | Non | Code-barres scanné |
| Date d'achat | Date | Non | Quand l'objet a été acheté |
| Prix d'achat | Décimal | Non | Montant payé |
| Lieu d'achat | Texte | Non | Magasin ou site web |
| Statut | Enum | Oui | Fonctionnel / En panne / En réparation / Hors service / Vendu / Donné |
| Photos | Images multiples | Non | Photos de l'objet |
| Notes | Texte | Non | Informations complémentaires |
| Créé par | Référence membre | Auto | Auteur de la fiche |
| Date création | Datetime | Auto | Horodatage |
| Date modification | Datetime | Auto | Mis à jour automatiquement |

### 2.3 Garantie

Informations de garantie associées à un objet.

**Propriétés de la garantie :**

| Champ | Type | Obligatoire | Description |
|---|---|---|---|
| Objet | Référence | Oui | Objet concerné |
| Type de garantie | Enum | Non | Constructeur / Vendeur / Extension / Légale (2 ans EU) |
| Date de début | Date | Oui | Début de la garantie (souvent = date d'achat) |
| Date de fin | Date | Oui | Fin de la garantie |
| Conditions | Texte | Non | Conditions particulières, couverture |
| Document joint | Fichier | Non | Scan de la garantie, facture (PDF, image) |
| Rappel envoyé | Booléen | Auto | Le rappel pré-expiration a-t-il été envoyé |

Un objet peut avoir plusieurs garanties (constructeur + extension par exemple).

### 2.4 Facture / Document

Pièces justificatives associées à un objet.

**Propriétés d'un document :**

| Champ | Type | Obligatoire | Description |
|---|---|---|---|
| Objet | Référence | Oui | Objet concerné |
| Type | Enum | Oui | Facture d'achat / Garantie / Manuel / Devis réparation / Facture réparation / Autre |
| Nom | Texte | Non | Nom du document |
| Fichier | Fichier | Oui | Le document (PDF, image) |
| Date | Date | Non | Date du document |
| Notes | Texte | Non | Commentaires |

### 2.5 Événement de vie (Carnet de santé)

Historique des pannes, réparations et événements marquants d'un objet.

**Propriétés d'un événement de vie :**

| Champ | Type | Obligatoire | Description |
|---|---|---|---|
| Objet | Référence | Oui | Objet concerné |
| Type | Enum | Oui | Panne / Réparation / Entretien / Mise à jour / Modification / Autre |
| Date | Date | Oui | Date de l'événement |
| Titre | Texte | Oui | Description courte (ex: "Plus de chauffe", "Remplacement résistance") |
| Description | Rich text | Non | Détails, diagnostic, solution |
| Coût | Décimal | Non | Coût de la réparation |
| Prestataire | Référence | Non | Lien vers le carnet de prestataires (partagé) |
| Réalisé par | Enum | Non | Moi-même / Prestataire / SAV |
| Sous garantie | Booléen | Non | Réparation couverte par la garantie |
| Pièces jointes | Fichiers multiples | Non | Photos, factures, devis |
| Intervention logement liée | Référence | Non | Lien vers une intervention du module Entretien (si applicable) |

---

## 3. User Stories

### 3.1 Gestion des objets

| ID | En tant que... | Je veux... | Afin de... |
|---|---|---|---|
| IO-01 | Membre du foyer | Ajouter un objet avec ses informations (nom, catégorie, marque, modèle, prix, etc.) | Recenser un bien |
| IO-02 | Membre du foyer | Scanner un code-barres / QR code pour pré-remplir les informations d'un objet | Gagner du temps à la saisie |
| IO-03 | Membre du foyer | Ajouter des photos d'un objet | Avoir un visuel de référence |
| IO-04 | Membre du foyer | Associer un objet à un logement et une pièce | Savoir où se trouve chaque objet |
| IO-05 | Membre du foyer | Modifier les informations d'un objet | Mettre à jour |
| IO-06 | Membre du foyer | Changer le statut d'un objet (fonctionnel, en panne, hors service, vendu, donné) | Refléter l'état réel |
| IO-07 | Membre du foyer | Supprimer un objet | Retirer un objet dont je me suis séparé |
| IO-08 | Membre du foyer | Voir la fiche complète d'un objet (infos, garanties, documents, historique de vie) | Tout savoir sur un objet |

### 3.2 Garanties

| ID | En tant que... | Je veux... | Afin de... |
|---|---|---|---|
| IO-09 | Membre du foyer | Ajouter une garantie à un objet (type, dates, document scanné) | Suivre la couverture |
| IO-10 | Membre du foyer | Ajouter plusieurs garanties à un même objet (constructeur + extension) | Couvrir toutes les garanties |
| IO-11 | Membre du foyer | Voir la date d'expiration de chaque garantie | Savoir si je suis encore couvert |
| IO-12 | Système | Envoyer une notification 1 mois avant l'expiration d'une garantie | Anticiper un renouvellement ou un achat |
| IO-13 | Membre du foyer | Voir la liste de tous les objets dont la garantie expire bientôt | Avoir une vue d'ensemble |

### 3.3 Documents / Factures

| ID | En tant que... | Je veux... | Afin de... |
|---|---|---|---|
| IO-14 | Membre du foyer | Joindre une facture d'achat à un objet (scan ou photo) | Conserver la preuve d'achat |
| IO-15 | Membre du foyer | Joindre un manuel, un devis ou tout autre document | Centraliser la documentation |
| IO-16 | Membre du foyer | Consulter et télécharger les documents d'un objet | Retrouver une facture rapidement |
| IO-17 | Membre du foyer | Supprimer un document | Retirer un document obsolète |

### 3.4 Carnet de santé (événements de vie)

| ID | En tant que... | Je veux... | Afin de... |
|---|---|---|---|
| IO-18 | Membre du foyer | Ajouter un événement de vie (panne, réparation, entretien) à un objet | Historiser la vie de l'objet |
| IO-19 | Membre du foyer | Préciser le type d'événement (panne, réparation, entretien, etc.) | Classifier |
| IO-20 | Membre du foyer | Renseigner le coût d'une réparation et indiquer si c'est sous garantie | Suivre les dépenses |
| IO-21 | Membre du foyer | Associer un prestataire (SAV, réparateur) à un événement | Savoir qui est intervenu |
| IO-22 | Membre du foyer | Joindre des photos ou documents à un événement | Documenter (photo de la panne, facture réparation) |
| IO-23 | Membre du foyer | Voir la chronologie complète d'un objet (timeline) | Visualiser toute l'histoire |
| IO-24 | Membre du foyer | Lier un événement de vie à une intervention du module Entretien logement | Connecter les deux modules |

### 3.5 Scan code-barres

| ID | En tant que... | Je veux... | Afin de... |
|---|---|---|---|
| IO-25 | Membre du foyer | Scanner un code-barres avec la caméra de mon téléphone | Identifier un produit rapidement |
| IO-26 | Membre du foyer | Voir les informations récupérées et les valider/compléter avant enregistrement | Contrôler les données |
| IO-27 | Membre du foyer | Scanner un code-barres d'un objet déjà enregistré pour accéder à sa fiche | Retrouver un objet sans chercher |

### 3.6 Consultation, filtres et recherche

| ID | En tant que... | Je veux... | Afin de... |
|---|---|---|---|
| IO-28 | Membre du foyer | Voir tous les objets par catégorie | Naviguer par type |
| IO-29 | Membre du foyer | Filtrer les objets par logement et/ou pièce | Voir ce qu'il y a dans une pièce |
| IO-30 | Membre du foyer | Filtrer les objets par statut (fonctionnel, en panne, etc.) | Identifier les problèmes |
| IO-31 | Membre du foyer | Rechercher un objet par nom, marque ou modèle | Retrouver rapidement |
| IO-32 | Membre du foyer | Trier les objets par date d'achat, prix, nom | Organiser la vue |
| IO-33 | Membre du foyer | Voir le nombre total d'objets et la valeur totale (somme des prix d'achat) | Avoir une vue patrimoine |

### 3.7 Intégration inter-modules

| ID | En tant que... | Je veux... | Afin de... |
|---|---|---|---|
| IO-34 | Système | Afficher les expirations de garantie dans l'agenda | Centraliser les échéances |
| IO-35 | Membre du foyer | Cliquer sur un événement "garantie" dans l'agenda pour accéder à la fiche objet | Naviguer facilement |
| IO-36 | Membre du foyer | Créer une intervention d'entretien logement depuis la fiche d'un objet | Déclencher une réparation liée à un équipement |
| IO-37 | Membre du foyer | Voir les objets associés à une pièce depuis le module Entretien logement | Croiser les informations |
| IO-38 | Membre du foyer | Utiliser le même carnet de prestataires pour les réparations d'objets | Ne pas ressaisir les contacts |

---

## 4. Règles métier

### 4.1 Objets
- Le nom est le seul champ obligatoire — tous les autres enrichissent la fiche mais ne bloquent pas la création
- Le statut par défaut est "Fonctionnel"
- Un changement de statut vers "En panne" propose automatiquement de créer un événement de vie de type "Panne"
- Un objet au statut "Vendu", "Donné" ou "Hors service" est visuellement grisé dans les listes mais reste consultable
- Les pièces disponibles dans le sélecteur sont celles du logement sélectionné (module Entretien logement)
- Si aucun logement n'est configuré dans le module Entretien, le champ logement/pièce n'est pas proposé

### 4.2 Garanties
- La garantie légale européenne (2 ans) peut être pré-remplie automatiquement si la date d'achat est renseignée — l'utilisateur confirme ou ajuste
- Un objet peut avoir 0, 1 ou plusieurs garanties
- Les alertes d'expiration sont envoyées 1 mois avant la date de fin
- Une garantie expirée est visuellement marquée (badge "Expirée") mais conservée dans l'historique
- Les fichiers acceptés : images (JPG, PNG, WEBP), PDF. Taille max par fichier : 10 Mo

### 4.3 Carnet de santé
- Les événements sont affichés en timeline chronologique inversée (le plus récent en haut)
- Un événement de type "Réparation" avec "Sous garantie" coché affiche le coût barré avec la mention "Sous garantie"
- Créer un événement de type "Réparation" quand le statut est "En panne" propose automatiquement de passer le statut à "Fonctionnel"
- Le lien vers une intervention du module Entretien logement est optionnel et bidirectionnel

### 4.4 Scan code-barres
- Le scan utilise la caméra du smartphone via l'API native du navigateur (pas de plugin)
- Les formats supportés : EAN-13, EAN-8, UPC-A, QR Code
- Les informations produit sont récupérées via une API gratuite (Open Food Facts pour l'alimentaire, Open EAN / UPC Database pour les produits)
- Si le produit n'est pas trouvé dans la base, le code-barres est enregistré mais les champs restent à remplir manuellement
- Le scan d'un code-barres déjà associé à un objet existant redirige vers sa fiche (mode "retrouver un objet")

### 4.5 Valeur du patrimoine
- La valeur totale est la somme des prix d'achat des objets au statut "Fonctionnel", "En panne" ou "En réparation"
- Les objets "Vendu", "Donné" ou "Hors service" sont exclus du calcul
- Cette vue est utile pour les déclarations d'assurance habitation

---

## 5. Parcours utilisateur clés

### 5.1 Ajouter un objet par scan (mobile)

1. L'utilisateur tape sur "+" puis "Scanner un code-barres"
2. La caméra s'ouvre avec un cadre de scan
3. Il scanne le code-barres de son nouveau lave-vaisselle
4. L'app interroge la base de données produit et pré-remplit : marque, modèle, nom
5. L'utilisateur complète : catégorie "Électroménager (gros)", pièce "Cuisine", prix d'achat, date d'achat
6. Il prend une photo de la facture et l'ajoute comme document
7. L'app propose "Ajouter la garantie légale de 2 ans ?" → il confirme
8. L'objet est enregistré avec sa fiche complète

### 5.2 Gérer une panne

1. Le lave-vaisselle tombe en panne
2. L'utilisateur ouvre la fiche de l'objet (recherche ou scan du code-barres)
3. Il change le statut à "En panne"
4. L'app propose : "Créer un événement dans le carnet de santé ?"
5. Il crée un événement "Panne" : "N'évacue plus l'eau, code erreur E15"
6. Il prend une photo du message d'erreur et la joint
7. Il vérifie la garantie → encore couverte pendant 8 mois
8. Il contacte le SAV, ajoute un événement "Réparation" avec prestataire "SAV Bosch", coche "Sous garantie"
9. Une fois réparé, l'app propose de repasser le statut à "Fonctionnel"

### 5.3 Inventaire pour l'assurance

1. L'utilisateur ouvre le module Inventaire
2. Il consulte le tableau de bord : 47 objets recensés, valeur totale 23 400 €
3. Il filtre par logement "Maison principale"
4. Il voit la répartition par catégorie avec les montants
5. Il peut exporter la liste (fonctionnalité future) ou faire des captures d'écran

### 5.4 Retrouver un objet par scan

1. L'utilisateur scanne le code-barres de son aspirateur
2. Le code-barres est reconnu → l'app ouvre directement la fiche de l'aspirateur
3. Il consulte l'historique : dernière réparation il y a 6 mois, garantie expirée

---

## 6. États et cas limites

| Situation | Comportement |
|---|---|
| Scan code-barres non reconnu dans la base | Le code est enregistré, les champs restent vides à remplir manuellement |
| Scan d'un code-barres déjà associé à un objet | Redirige vers la fiche existante avec message "Cet objet est déjà dans votre inventaire" |
| Objet sans catégorie | Classé dans "Autre" |
| Objet sans logement/pièce | Non associé, filtrable via "Sans localisation" |
| Suppression d'une pièce dans le module Entretien | Les objets associés passent en "Sans pièce" (le logement reste) |
| Suppression d'un logement dans le module Entretien | Les objets associés passent en "Sans localisation" |
| Objet avec garantie expirée | Badge "Expirée", la garantie reste visible dans l'historique |
| Garantie légale auto-calculée sur objet d'occasion | Non proposée — uniquement sur achat neuf (l'utilisateur peut l'ajouter manuellement) |
| Caméra non disponible (desktop sans webcam) | Saisie manuelle du code-barres (champ texte) |
| Pièce jointe trop volumineuse (> 10 Mo) | Message d'erreur, compression suggérée |
| Objet vendu ou donné | Grisé dans les listes, exclu de la valeur totale, historique conservé |

---

## 7. Écrans à concevoir

1. **Tableau de bord inventaire** — Nombre d'objets, valeur totale, répartition par catégorie, alertes garanties
2. **Liste des objets** — Grille ou liste, filtrable par catégorie / logement / pièce / statut, recherche
3. **Fiche objet** — Vue complète avec onglets : Infos / Garanties / Documents / Carnet de santé
4. **Formulaire ajout/édition objet** — Avec scan code-barres intégré
5. **Scanner code-barres** — Vue caméra plein écran avec cadre de détection
6. **Timeline carnet de santé** — Chronologie des événements de vie avec icônes par type
7. **Formulaire événement de vie** — Création panne / réparation / entretien
8. **Liste des garanties (vue globale)** — Toutes les garanties avec statut et countdown
9. **Gestion des catégories** — Ajout, modification, désactivation

---

*Document créé le 08/04/2026 — Version 1.0*
