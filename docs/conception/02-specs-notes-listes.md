# HomeInOne — Spécifications fonctionnelles : Module Notes & Listes 📝

## 1. Présentation du module

Le module Notes & Listes regroupe trois espaces complémentaires sous un même toit :
- **Notes** — Bloc-notes libre en rich text pour capturer idées, mémos, infos à garder
- **Tâches** — Listes de tâches assignables avec priorité et échéance
- **Envies** — Wishlists avec fiches produit détaillées et suivi

L'utilisateur accède au module via un point d'entrée unique dans la navigation, puis navigue entre les 3 onglets. Les dossiers et tags sont transversaux aux 3 types.

---

## 2. Concepts clés

### 2.1 Organisation transversale

#### Dossiers
- Arborescence hiérarchique (dossiers et sous-dossiers)
- Un élément (note, tâche, envie) appartient à un seul dossier
- Dossier par défaut : "Sans dossier" (éléments non classés)
- Profondeur maximale : 3 niveaux (dossier > sous-dossier > sous-sous-dossier)

#### Tags
- Étiquettes libres créées par l'utilisateur
- Un élément peut avoir plusieurs tags
- Les tags sont partagés entre les 3 espaces (Notes, Tâches, Envies)
- Couleur personnalisable par tag

### 2.2 Visibilité et partage

- Par défaut, tout élément créé est visible par tous les membres du foyer
- Un élément peut être marqué comme "privé" → visible uniquement par son créateur
- Les tâches peuvent être assignées à un ou plusieurs membres

---

## 3. Espace Notes

### 3.1 Concept

Une note est un contenu libre en rich text. Elle sert à capturer des idées, stocker des informations, rédiger des mémos. Pas de notion d'état (fait/pas fait).

### 3.2 Propriétés d'une note

| Champ | Type | Obligatoire | Description |
|---|---|---|---|
| Titre | Texte | Oui | Titre de la note |
| Contenu | Rich text | Non | Corps de la note (gras, italique, listes, titres, liens) |
| Dossier | Référence | Non | Classement dans l'arborescence |
| Tags | Références multiples | Non | Étiquettes libres |
| Privée | Booléen | Non | Visible uniquement par le créateur (défaut : non) |
| Épinglée | Booléen | Non | Affichée en haut de la liste (défaut : non) |
| Créée par | Référence membre | Auto | Auteur de la note |
| Date création | Datetime | Auto | Horodatage automatique |
| Date modification | Datetime | Auto | Mis à jour automatiquement |

### 3.3 User Stories — Notes

| ID | En tant que... | Je veux... | Afin de... |
|---|---|---|---|
| NL-01 | Membre du foyer | Créer une note avec un titre et un contenu rich text | Capturer une idée ou information |
| NL-02 | Membre du foyer | Modifier une note existante | Mettre à jour son contenu |
| NL-03 | Membre du foyer | Supprimer une note | Retirer une note obsolète |
| NL-04 | Membre du foyer | Épingler une note en haut de la liste | Garder les notes importantes accessibles |
| NL-05 | Membre du foyer | Marquer une note comme privée | Cacher une note aux autres membres |
| NL-06 | Membre du foyer | Classer une note dans un dossier | Organiser mes notes |
| NL-07 | Membre du foyer | Ajouter un ou plusieurs tags à une note | Retrouver facilement par thème |
| NL-08 | Membre du foyer | Rechercher dans mes notes (titre + contenu) | Retrouver rapidement une information |
| NL-09 | Membre du foyer | Dupliquer une note | Créer une variante sans repartir de zéro |

---

## 4. Espace Tâches

### 4.1 Concept

Une tâche est une action à réaliser avec un état (à faire / en cours / fait), une priorité, et optionnellement une échéance et une assignation. Les tâches sont regroupées dans des listes.

### 4.2 Propriétés d'une liste de tâches

| Champ | Type | Obligatoire | Description |
|---|---|---|---|
| Titre | Texte | Oui | Nom de la liste (ex: "Courses", "Ménage", "Projet jardin") |
| Dossier | Référence | Non | Classement dans l'arborescence |
| Tags | Références multiples | Non | Étiquettes libres |
| Privée | Booléen | Non | Visible uniquement par le créateur |
| Progression | Auto-calculé | Auto | X/Y tâches complétées |

### 4.3 Propriétés d'une tâche

| Champ | Type | Obligatoire | Description |
|---|---|---|---|
| Titre | Texte | Oui | Description de la tâche |
| Description | Rich text | Non | Détails complémentaires |
| Statut | Enum | Oui | À faire / En cours / Fait (défaut : À faire) |
| Priorité | Enum | Non | Basse / Moyenne / Haute / Urgente (défaut : Moyenne) |
| Date d'échéance | Date | Non | Deadline de la tâche |
| Assigné à | Références multiples | Non | Membre(s) responsable(s) |
| Ordre | Entier | Auto | Position dans la liste (tri manuel par drag & drop) |
| Créée par | Référence membre | Auto | Auteur |
| Date création | Datetime | Auto | Horodatage |
| Date complétion | Datetime | Auto | Renseignée quand statut passe à "Fait" |

### 4.4 User Stories — Tâches

| ID | En tant que... | Je veux... | Afin de... |
|---|---|---|---|
| NL-10 | Membre du foyer | Créer une liste de tâches avec un titre | Organiser mes tâches par thème |
| NL-11 | Membre du foyer | Ajouter une tâche rapidement (juste le titre) | Capturer une action sans friction |
| NL-12 | Membre du foyer | Enrichir une tâche (description, priorité, échéance, assignation) | Détailler l'action à réaliser |
| NL-13 | Membre du foyer | Cocher une tâche comme "Fait" | Marquer une action terminée |
| NL-14 | Membre du foyer | Changer le statut d'une tâche (À faire / En cours / Fait) | Suivre la progression |
| NL-15 | Membre du foyer | Réordonner les tâches par drag & drop | Prioriser manuellement |
| NL-16 | Membre du foyer | Assigner une tâche à un ou plusieurs membres | Répartir les responsabilités |
| NL-17 | Membre du foyer | Filtrer les tâches par statut (à faire / fait / tout) | Me concentrer sur ce qui reste |
| NL-18 | Membre du foyer | Filtrer les tâches par membre assigné | Voir qui doit faire quoi |
| NL-19 | Membre du foyer | Voir les tâches en retard (échéance dépassée) | Identifier les urgences |
| NL-20 | Membre du foyer | Supprimer une tâche ou une liste entière | Faire le ménage |
| NL-21 | Membre du foyer | Voir la progression d'une liste (X/Y complétées) | Évaluer l'avancement |
| NL-22 | Membre du foyer | Masquer les tâches complétées | Désencombrer la vue |

### 4.5 Intégration Agenda

| ID | En tant que... | Je veux... | Afin de... |
|---|---|---|---|
| NL-23 | Système | Créer automatiquement un événement dans l'agenda quand une tâche a une date d'échéance | Centraliser les deadlines |
| NL-24 | Système | Mettre à jour l'événement agenda si l'échéance change | Garder la cohérence |
| NL-25 | Système | Supprimer l'événement agenda quand la tâche est complétée ou supprimée | Ne pas polluer l'agenda |
| NL-26 | Membre du foyer | Cliquer sur un événement "tâche" dans l'agenda pour aller à la tâche | Naviguer facilement |

---

## 5. Espace Envies (Wishlist)

### 5.1 Concept

Une envie est une fiche produit détaillée représentant quelque chose que l'on souhaite acquérir ou recevoir. Les envies sont regroupées dans des wishlists thématiques.

### 5.2 Propriétés d'une wishlist

| Champ | Type | Obligatoire | Description |
|---|---|---|---|
| Titre | Texte | Oui | Nom de la liste (ex: "Noël 2026", "Déco salon", "High-tech") |
| Description | Texte | Non | Description de la liste |
| Dossier | Référence | Non | Classement |
| Tags | Références multiples | Non | Étiquettes |
| Privée | Booléen | Non | Visible uniquement par le créateur |
| Membre propriétaire | Référence | Non | À qui est destinée cette wishlist (pour les cadeaux) |
| Budget total | Décimal | Non | Budget alloué à cette liste |

### 5.3 Propriétés d'une envie

| Champ | Type | Obligatoire | Description |
|---|---|---|---|
| Nom | Texte | Oui | Nom du produit / objet désiré |
| Description | Texte | Non | Détails, commentaires |
| Lien URL | URL | Non | Lien vers le produit en ligne |
| Image | Image (URL ou upload) | Non | Photo du produit |
| Prix estimé | Décimal | Non | Prix constaté |
| Prix suivi | Historique décimaux | Non | Historique des prix relevés (date + montant) |
| Priorité d'envie | Enum | Non | Bof / Sympa / Vraiment envie / Indispensable |
| Statut | Enum | Oui | En attente / Acheté / Offert / Abandonné (défaut : En attente) |
| Date d'ajout | Datetime | Auto | Horodatage |
| Date d'achat | Date | Non | Renseignée quand statut passe à Acheté/Offert |
| Ajouté par | Référence membre | Auto | Qui a ajouté l'envie |
| Ordre | Entier | Auto | Position dans la liste |

### 5.4 User Stories — Envies

| ID | En tant que... | Je veux... | Afin de... |
|---|---|---|---|
| NL-27 | Membre du foyer | Créer une wishlist thématique | Regrouper mes envies par occasion ou thème |
| NL-28 | Membre du foyer | Ajouter une envie avec nom, lien, prix et image | Sauvegarder un produit qui me plaît |
| NL-29 | Membre du foyer | Ajouter un relevé de prix à une envie (suivi de prix) | Suivre l'évolution du prix |
| NL-30 | Membre du foyer | Voir l'historique de prix d'une envie sous forme de graphique | Identifier le bon moment pour acheter |
| NL-31 | Membre du foyer | Changer le statut d'une envie (acheté, offert, abandonné) | Mettre à jour l'état de mes souhaits |
| NL-32 | Membre du foyer | Définir un budget pour une wishlist | Cadrer mes dépenses |
| NL-33 | Membre du foyer | Voir le total des prix vs le budget de la wishlist | Savoir où j'en suis financièrement |
| NL-34 | Membre du foyer | Trier les envies par priorité, prix ou date d'ajout | Organiser ma liste |
| NL-35 | Membre du foyer | Réordonner les envies par drag & drop | Prioriser manuellement |
| NL-36 | Membre du foyer | Marquer une wishlist comme privée | Préparer des cadeaux surprise |
| NL-37 | Membre du foyer | Supprimer une envie ou une wishlist | Faire le ménage |
| NL-38 | Membre du foyer | Attribuer une wishlist à un membre (pour les cadeaux) | Savoir à qui offrir quoi |

---

## 6. Fonctionnalités transversales au module

### 6.1 User Stories transversales

| ID | En tant que... | Je veux... | Afin de... |
|---|---|---|---|
| NL-39 | Membre du foyer | Créer, renommer et supprimer des dossiers | Organiser mes contenus |
| NL-40 | Membre du foyer | Déplacer un élément d'un dossier à un autre | Réorganiser |
| NL-41 | Membre du foyer | Créer et gérer des tags (nom, couleur) | Étiqueter librement |
| NL-42 | Membre du foyer | Filtrer par dossier et/ou par tag dans chaque espace | Retrouver rapidement |
| NL-43 | Membre du foyer | Voir un compteur d'éléments par dossier | Évaluer le volume |
| NL-44 | Membre du foyer | Rechercher globalement dans le module (notes + tâches + envies) | Trouver sans savoir où c'est rangé |

---

## 7. Règles métier

### 7.1 Notes
- Le titre est obligatoire, le contenu peut être vide (note placeholder)
- L'éditeur rich text supporte : gras, italique, souligné, barré, titres (H1-H3), listes à puces, listes numérotées, liens hypertexte
- La recherche porte sur le titre ET le contenu texte (pas le formatage)
- Une note épinglée reste en haut de la liste quel que soit le tri

### 7.2 Tâches
- L'ajout rapide ne nécessite que le titre (tous les autres champs sont optionnels)
- Quand une tâche passe à "Fait", la date de complétion est renseignée automatiquement
- Une tâche avec échéance dépassée et non complétée est visuellement marquée "en retard" (couleur rouge)
- L'événement agenda auto-généré utilise la catégorie "Tâche" (prédéfinie, icône ✅)
- Si une tâche assignée a une échéance, le rappel agenda est envoyé aux membres assignés
- La suppression d'une liste propose "Supprimer aussi toutes les tâches" ou "Déplacer les tâches dans Sans liste"

### 7.3 Envies
- Le suivi de prix est manuel (l'utilisateur ajoute un relevé : date + montant)
- Le graphique de suivi de prix est un simple line chart avec les points de relevé
- Le statut "Acheté" ou "Offert" demande confirmation (action non réversible facilement — on ne revient pas en "En attente")
- Le total de la wishlist est la somme des prix des envies en statut "En attente"
- Une wishlist privée et ses envies sont invisibles aux autres membres (utile pour les cadeaux)

### 7.4 Dossiers et Tags
- Un dossier supprimé → les éléments qu'il contenait passent dans "Sans dossier"
- Un tag supprimé → retiré de tous les éléments qui l'avaient
- Les dossiers sont spécifiques à chaque espace (Notes, Tâches, Envies) — pas partagés entre espaces
- Les tags sont partagés entre les 3 espaces

---

## 8. Parcours utilisateur clés

### 8.1 Ajout rapide d'une tâche (mobile)

1. L'utilisateur est sur l'onglet Tâches
2. Il voit ses listes de tâches
3. Il tape sur une liste pour l'ouvrir
4. En bas de la liste, un champ "Ajouter une tâche..." est toujours visible
5. Il tape le titre et valide avec Entrée
6. La tâche apparaît instantanément dans la liste (statut "À faire", priorité "Moyenne")
7. Il peut taper dessus pour enrichir (description, échéance, assignation, priorité)

### 8.2 Créer une wishlist cadeau (privée)

1. L'utilisateur va dans l'onglet Envies
2. Il crée une nouvelle wishlist : "Anniversaire Marie"
3. Il coche "Privée" et assigne le membre "Marie" comme destinataire
4. Il ajoute des envies avec liens, prix, images
5. La wishlist est invisible pour Marie
6. Quand un cadeau est acheté, il passe le statut à "Offert"

### 8.3 Prendre une note rapide

1. L'utilisateur tape sur le "+" (FAB)
2. Un choix rapide apparaît : Note / Tâche / Envie
3. Il choisit "Note"
4. L'éditeur s'ouvre avec le curseur dans le titre
5. Il tape son titre, puis rédige le contenu en rich text
6. La note est sauvegardée automatiquement (auto-save)
7. Il peut ensuite la classer dans un dossier et ajouter des tags

---

## 9. États et cas limites

| Situation | Comportement |
|---|---|
| Note sans contenu | Autorisé (note placeholder avec juste un titre) |
| Tâche sans liste | Placée dans une liste par défaut "Tâches rapides" |
| Wishlist sans budget | Le comparatif budget/total n'est pas affiché |
| Envie sans prix | Non comptabilisée dans le total de la wishlist |
| Suppression d'un membre assigné à des tâches | Les assignations sont retirées, les tâches restent |
| Tâche complétée avec événement agenda | L'événement agenda est automatiquement supprimé |
| Recherche globale | Résultats groupés par type (Notes / Tâches / Envies) avec icône distinctive |
| Dossier avec sous-dossiers supprimé | Les sous-dossiers et leur contenu remontent dans "Sans dossier" |
| Auto-save des notes | Sauvegarde automatique toutes les 5 secondes après modification |

---

## 10. Écrans à concevoir

1. **Vue module** — 3 onglets (Notes / Tâches / Envies) + sidebar dossiers + filtres tags
2. **Liste des notes** — Grille ou liste avec aperçu, épinglées en haut
3. **Éditeur de note** — Rich text plein écran (mobile) ou panneau latéral (desktop)
4. **Liste de tâches** — Checklist avec priorité colorée, progression, filtres
5. **Détail tâche** — Formulaire complet (description, échéance, assignation, priorité)
6. **Liste des wishlists** — Cartes avec titre, progression budget, nombre d'envies
7. **Détail wishlist** — Grille d'envies avec images, prix, statuts
8. **Fiche envie** — Image, lien, prix, historique de prix (graphique), statut
9. **Gestion dossiers** — Arborescence éditable
10. **Gestion tags** — Liste avec couleurs, renommage, suppression

---

*Document créé le 08/04/2026 — Version 1.0*
