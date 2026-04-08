# HomeInOne — Charte graphique & UI/UX 🎨

## 1. Direction artistique

### 1.1 Philosophie visuelle

HomeInOne adopte un style **coloré et chaleureux**, inspiré de Notion et Todoist, avec une touche organique portée par le vert. L'interface doit donner un sentiment de **foyer accueillant** : chaleureuse sans être enfantine, structurée sans être froide, colorée sans être criarde.

**Mots-clés** : Chaleureux · Organique · Lisible · Moderne · Familial · Accueillant

### 1.2 Principes de design

1. **Clarté avant tout** — Chaque écran a un objectif clair. Pas de surcharge visuelle.
2. **Couleur = information** — Les couleurs servent à différencier, catégoriser, alerter. Jamais décoratives sans raison.
3. **Mobile first, touch friendly** — Zones de tap généreuses (min 44px), espacement aéré, gestes naturels.
4. **Cohérence modulaire** — Chaque module a sa couleur d'accent, mais tous partagent le même langage visuel.
5. **Micro-interactions** — Feedback visuel immédiat sur chaque action (tap, swipe, complétion).

---

## 2. Palette de couleurs

### 2.1 Couleurs principales

```
┌─────────────────────────────────────────────────────────┐
│  THÈME CLAIR                                            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  PRIMARY (Vert sauge)                                   │
│  ██████  #4A7C59  — Boutons principaux, liens, accents  │
│  ██████  #5C9A6E  — Hover                               │
│  ██████  #3D6B4A  — Active / pressed                    │
│  ██████  #E8F2EB  — Background subtil                   │
│  ██████  #D1E6D6  — Background accentué                 │
│                                                         │
│  BACKGROUND                                             │
│  ██████  #FAFAF8  — Fond principal (crème très léger)   │
│  ██████  #FFFFFF  — Cartes, surfaces élevées            │
│  ██████  #F3F2EE  — Fond secondaire (sidebar, header)   │
│                                                         │
│  TEXT                                                    │
│  ██████  #1A1A1A  — Texte principal                     │
│  ██████  #4A4A4A  — Texte secondaire                    │
│  ██████  #8A8A8A  — Texte tertiaire / placeholder       │
│                                                         │
│  BORDER                                                 │
│  ██████  #E5E3DC  — Bordures et séparateurs             │
│  ██████  #D4D1C7  — Bordures accentuées                 │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  THÈME SOMBRE                                           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  PRIMARY (Vert sauge, ajusté)                           │
│  ██████  #6BAF7B  — Boutons principaux, liens, accents  │
│  ██████  #7CC28C  — Hover                               │
│  ██████  #5A9D6A  — Active / pressed                    │
│  ██████  #1E2E22  — Background subtil                   │
│  ██████  #253A2A  — Background accentué                 │
│                                                         │
│  BACKGROUND                                             │
│  ██████  #141413  — Fond principal                      │
│  ██████  #1E1E1C  — Cartes, surfaces élevées            │
│  ██████  #252523  — Fond secondaire                     │
│                                                         │
│  TEXT                                                    │
│  ██████  #F0EDE6  — Texte principal                     │
│  ██████  #B0ADA5  — Texte secondaire                    │
│  ██████  #6E6B63  — Texte tertiaire / placeholder       │
│                                                         │
│  BORDER                                                 │
│  ██████  #2E2E2B  — Bordures et séparateurs             │
│  ██████  #3A3A36  — Bordures accentuées                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 2.2 Couleurs sémantiques

```
  ██████  #E74C3C  — Destructive / Erreur / En retard
  ██████  #F39C12  — Warning / Attention / Bientôt dû
  ██████  #27AE60  — Succès / Complété / Fonctionnel
  ██████  #3498DB  — Information / Lien
```

### 2.3 Couleurs par module

Chaque module a une couleur d'accent utilisée dans l'icône de navigation, les headers de module, et les badges :

```
  ██████  #4A7C59  — Agenda (vert principal — module central)
  ██████  #E67E22  — Notes & Listes (orange chaleureux)
  ██████  #2980B9  — Entretien logement (bleu travaux)
  ██████  #8E44AD  — Entretien véhicules (violet)
  ██████  #16A085  — Inventaire objets (teal)
```

### 2.4 Couleurs des priorités

```
  ██████  #95A5A6  — Basse (gris)
  ██████  #3498DB  — Moyenne (bleu)
  ██████  #E67E22  — Haute (orange)
  ██████  #E74C3C  — Urgente (rouge)
```

### 2.5 Couleurs des membres (par défaut, personnalisable)

```
  ██████  #3498DB  — Membre 1 (bleu)
  ██████  #E74C3C  — Membre 2 (rouge)
  ██████  #F39C12  — Membre 3 (jaune)
  ██████  #9B59B6  — Membre 4 (violet)
  ██████  #1ABC9C  — Membre 5 (turquoise)
  ██████  #E67E22  — Membre 6 (orange)
```

---

## 3. Typographie

### 3.1 Familles de polices

| Usage | Police | Fallback | Poids |
|---|---|---|---|
| **Titres / Display** | **DM Serif Display** | Georgia, serif | 400 |
| **Corps / UI** | **DM Sans** | system-ui, sans-serif | 400, 500, 600, 700 |
| **Monospace** (code, données) | **JetBrains Mono** | monospace | 400, 500 |

**Pourquoi ce duo** : DM Serif Display apporte chaleur et personnalité aux titres (serif moderne, lisible), tandis que DM Sans offre une excellente lisibilité en corps de texte avec un look moderne et friendly. Les deux polices sont de la même famille (DM), ce qui crée une harmonie naturelle.

### 3.2 Échelle typographique

| Token | Taille | Line height | Poids | Usage |
|---|---|---|---|---|
| `text-xs` | 12px | 16px | 400 | Labels, badges, meta-données |
| `text-sm` | 14px | 20px | 400 | Texte secondaire, sous-titres |
| `text-base` | 16px | 24px | 400 | Corps de texte principal |
| `text-lg` | 18px | 28px | 500 | Titres de cartes, noms d'items |
| `text-xl` | 20px | 28px | 600 | Titres de sections |
| `text-2xl` | 24px | 32px | 400 (serif) | Titres de pages |
| `text-3xl` | 30px | 36px | 400 (serif) | Titres principaux (dashboard) |

---

## 4. Espacement et grille

### 4.1 Système d'espacement

Base : **4px**. Tous les espacements sont des multiples de 4.

| Token | Valeur | Usage |
|---|---|---|
| `space-1` | 4px | Espacement minimal (entre icône et texte) |
| `space-2` | 8px | Padding interne des badges, petits gaps |
| `space-3` | 12px | Padding interne des boutons, inputs |
| `space-4` | 16px | Gap entre éléments d'une liste, padding cartes |
| `space-5` | 20px | Padding des sections |
| `space-6` | 24px | Gap entre sections |
| `space-8` | 32px | Marges de page (desktop) |
| `space-10` | 40px | Grands espacements |
| `space-12` | 48px | Hauteur du header, espacement majeur |

### 4.2 Grille responsive

| Breakpoint | Largeur | Colonnes | Marges |
|---|---|---|---|
| Mobile | < 640px | 1 | 16px |
| Tablet | 640px — 1024px | 2 | 24px |
| Desktop | > 1024px | 3-4 | 32px |

### 4.3 Largeur max du contenu

- **Contenu principal** : max-width 1280px, centré
- **Formulaires / modales** : max-width 640px
- **Lecture (notes, descriptions)** : max-width 720px

---

## 5. Composants UI

### 5.1 Boutons

```
Primary   [████████████████]  — Fond vert #4A7C59, texte blanc
                                 Border-radius: 10px
                                 Padding: 12px 20px
                                 Font: DM Sans 500, 14px
                                 Shadow: 0 1px 2px rgba(0,0,0,0.05)
                                 Hover: #5C9A6E + shadow légère
                                 Active: #3D6B4A

Secondary [████████████████]  — Fond transparent, bordure #E5E3DC
                                 Texte #1A1A1A
                                 Hover: fond #F3F2EE

Ghost     [████████████████]  — Fond transparent, pas de bordure
                                 Texte #4A4A4A
                                 Hover: fond #F3F2EE

Danger    [████████████████]  — Fond #E74C3C, texte blanc
                                 Réservé aux actions destructives
```

**Zones de tap** : minimum 44×44px sur mobile. Sur les boutons plus petits (icône seule), la zone de tap dépasse visuellement le bouton.

### 5.2 Inputs

```
┌──────────────────────────────┐
│  Label (DM Sans 500, 14px)   │
│  ┌────────────────────────┐  │
│  │ Placeholder...         │  │  — Fond #FFFFFF (light) / #1E1E1C (dark)
│  └────────────────────────┘  │    Bordure: 1px #E5E3DC
│  Helper text (12px, #8A8A8A) │    Border-radius: 10px
└──────────────────────────────┘    Padding: 12px 16px
                                    Focus: bordure #4A7C59 + ring 2px #4A7C5933
                                    Erreur: bordure #E74C3C + message rouge
```

### 5.3 Cartes

```
┌──────────────────────────────────────┐
│                                      │  — Fond #FFFFFF (light) / #1E1E1C (dark)
│  Titre de la carte                   │    Bordure: 1px #E5E3DC
│  Description ou contenu              │    Border-radius: 14px
│                                      │    Padding: 16px
│  [Action]                [Action 2]  │    Shadow: 0 1px 3px rgba(0,0,0,0.04)
└──────────────────────────────────────┘    Hover (si clickable): shadow légère + translate -1px
```

### 5.4 Bottom Sheet (mobile)

Pour les formulaires de création rapide sur mobile :

```
┌──────────────────────────────┐
│         ──────               │  — Poignée de drag (40×4px, arrondie)
│                              │    Fond: surface élevée
│  Titre du formulaire         │    Border-radius top: 20px
│  ┌────────────────────────┐  │    Shadow top: 0 -4px 20px rgba(0,0,0,0.1)
│  │ Champ 1                │  │    Animation: slide up (300ms, ease-out)
│  └────────────────────────┘  │    Backdrop: overlay noir 40% opacity
│  ┌────────────────────────┐  │
│  │ Champ 2                │  │
│  └────────────────────────┘  │
│                              │
│  [Annuler]    [Enregistrer]  │
└──────────────────────────────┘
```

### 5.5 Badges / Tags

```
  Catégorie   — Pill arrondi (border-radius: 99px)
                Fond: couleur de la catégorie à 15% opacité
                Texte: couleur de la catégorie
                Padding: 4px 10px
                Font: DM Sans 500, 12px

  Statut      — Même style, couleurs sémantiques
   ● À faire     — Fond #3498DB15, texte #3498DB
   ● En cours    — Fond #F39C1215, texte #F39C12
   ● Terminé     — Fond #27AE6015, texte #27AE60
   ● En retard   — Fond #E74C3C15, texte #E74C3C

  Membre      — Cercle avec initiale (32×32px)
                Fond: couleur du membre
                Texte: blanc, DM Sans 600, 14px
```

### 5.6 Navigation

#### Sidebar (desktop/tablet)

```
┌──────────┐
│ HomeInOne│  — Logo + nom (DM Serif Display)
│          │
│ 🗓 Agenda │  — Icônes Lucide + label
│ 📝 Notes  │    Item actif: fond #E8F2EB, texte #4A7C59, barre gauche 3px
│ 🏠 Maison │    Item hover: fond #F3F2EE
│ 🚗 Véhic. │    Espacement: 4px entre items
│ 📦 Invent.│    Padding item: 10px 16px
│          │    Border-radius item: 8px
│──────────│
│ ⚙ Params │
│ 👤 Profil │
└──────────┘
  Largeur: 240px (collapsible à 64px avec icônes seules)
```

#### Bottom Navigation (mobile)

```
┌──────────────────────────────────────┐
│  🗓      📝      ➕      🏠      📦   │  — 5 items max
│ Agenda  Notes   (FAB)  Maison Objets │    Fond: surface élevée
│                                      │    Hauteur: 64px + safe area
└──────────────────────────────────────┘    Item actif: icône remplie + couleur primary
                                           Item inactif: icône outline + gris
                                           FAB central: bouton rond vert, 56px, élevé
```

Le module Véhicules est accessible depuis Maison (sous-navigation ou tab) pour garder la bottom bar à 5 items.

### 5.7 FAB (Floating Action Button)

```
         ┌────┐
         │ +  │  — Rond 56×56px
         └────┘    Fond: #4A7C59
                   Icône: + blanc, 24px
                   Shadow: 0 4px 12px rgba(74,124,89,0.3)
                   Position: fixed bottom-right (24px du bord)
                   Au-dessus de la bottom nav (mobile)
                   Tap: ouvre un menu radial ou bottom sheet selon le contexte
```

---

## 6. Iconographie

### 6.1 Bibliothèque

**Lucide React** — Icônes en ligne, cohérentes, taille 20-24px, stroke-width 1.75.

### 6.2 Règles

- Taille standard dans les listes : 20px
- Taille dans la navigation : 22px
- Taille dans les headers de page : 24px
- Couleur par défaut : texte secondaire (#4A4A4A)
- Couleur active : primary (#4A7C59)
- Toujours accompagnées d'un label (sauf dans les barres d'outils où le tooltip suffit)

---

## 7. Animations et micro-interactions

### 7.1 Principes

- **Rapide** : durée max 300ms pour les transitions UI courantes
- **Naturel** : easing `ease-out` pour les entrées, `ease-in` pour les sorties
- **Subtil** : les animations guident l'attention, elles ne distraient pas

### 7.2 Transitions standards

| Action | Animation | Durée | Easing |
|---|---|---|---|
| Ouverture modale/bottom sheet | Slide up + fade in | 300ms | ease-out |
| Fermeture modale | Slide down + fade out | 200ms | ease-in |
| Changement de page | Fade in | 150ms | ease-out |
| Hover sur carte | Scale 1.01 + shadow | 200ms | ease-out |
| Toggle switch | Slide + couleur | 200ms | ease-out |
| Complétion tâche (check) | Scale bounce 1.2 → 1.0 + couleur | 300ms | spring |
| Ajout à une liste | Slide in from top + fade | 250ms | ease-out |
| Suppression | Slide out left + fade + collapse height | 300ms | ease-in |
| Notification toast | Slide in from top-right | 300ms | ease-out |

### 7.3 Feedback de complétion

Quand une tâche est cochée ou un statut passe à "Terminé" :
- La checkbox fait un micro-bounce
- Une coche animée apparaît (stroke-dashoffset animation)
- La ligne se grise progressivement (200ms)
- Confetti subtil optionnel pour les milestones (toute une liste complétée)

---

## 8. Layout des pages

### 8.1 Structure globale (desktop)

```
┌─────────┬──────────────────────────────────────────────┐
│         │  Header (48px)                               │
│         │  [← Retour]  Titre de la page  [🔍] [🔔] [👤]│
│         ├──────────────────────────────────────────────┤
│ Sidebar │                                              │
│ (240px) │  Contenu principal                           │
│         │  (scrollable)                                │
│         │                                              │
│         │                                              │
│         │                                              │
│         │                                              │
│         │                                              │
└─────────┴──────────────────────────────────────────────┘
```

### 8.2 Structure globale (mobile)

```
┌──────────────────────────────────────┐
│ Header (48px)                        │
│ [☰]  Titre de la page        [🔍][🔔]│
├──────────────────────────────────────┤
│                                      │
│ Contenu principal                    │
│ (scrollable)                         │
│                                      │
│                                      │
│                                      │
│                               [FAB]  │
├──────────────────────────────────────┤
│ Bottom Navigation (64px)             │
│ 🗓    📝    ➕    🏠    📦             │
└──────────────────────────────────────┘
```

### 8.3 Dashboard global

Le dashboard est la page d'accueil après connexion. Il résume tous les modules :

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│  Bonjour, [Prénom] 👋                (DM Serif Display, 30px)│
│  Mardi 8 avril 2026                                         │
│                                                              │
│  ┌─────────────────────┐ ┌─────────────────────┐            │
│  │ 🗓 Aujourd'hui       │ │ ✅ Tâches du jour    │            │
│  │                     │ │                     │            │
│  │ 14h00 RDV dentiste  │ │ □ Appeler plombier  │            │
│  │ 19h00 Dîner Marc    │ │ ☑ Courses           │            │
│  │                     │ │ □ Poster colis       │            │
│  └─────────────────────┘ └─────────────────────┘            │
│                                                              │
│  ┌─────────────────────┐ ┌─────────────────────┐            │
│  │ ⚠️ Alertes           │ │ 🏠 Entretien         │            │
│  │                     │ │                     │            │
│  │ 🔴 CT en retard     │ │ Chaudière dans 23j  │            │
│  │ 🟠 Assurance -30j   │ │ VMC dans 45j        │            │
│  │ 🟠 Garantie -28j    │ │                     │            │
│  └─────────────────────┘ └─────────────────────┘            │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 9. Ombres et élévation

### 9.1 Niveaux d'élévation

| Niveau | Shadow | Usage |
|---|---|---|
| `shadow-none` | Aucune | Éléments plats (inputs, badges) |
| `shadow-sm` | 0 1px 2px rgba(0,0,0,0.04) | Cartes, items de liste |
| `shadow-md` | 0 4px 8px rgba(0,0,0,0.06) | Dropdowns, popovers |
| `shadow-lg` | 0 8px 24px rgba(0,0,0,0.1) | Modales, bottom sheets |
| `shadow-xl` | 0 16px 40px rgba(0,0,0,0.12) | FAB, éléments flottants |

### 9.2 Mode sombre

En mode sombre, les ombres sont remplacées par des bordures subtiles (#2E2E2B) et un fond légèrement élevé pour créer la hiérarchie visuelle (au lieu d'ombres sur fond noir qui sont invisibles).

---

## 10. Border radius

| Token | Valeur | Usage |
|---|---|---|
| `rounded-sm` | 6px | Badges, petits éléments |
| `rounded` | 10px | Boutons, inputs, tags |
| `rounded-lg` | 14px | Cartes, conteneurs |
| `rounded-xl` | 20px | Bottom sheets, modales |
| `rounded-full` | 99px | Avatars, pills, FAB |

---

## 11. Variables CSS (Tailwind config)

```css
/* globals.css */

@layer base {
  :root {
    /* Primary */
    --color-primary: 74 124 89;          /* #4A7C59 */
    --color-primary-hover: 92 154 110;   /* #5C9A6E */
    --color-primary-active: 61 107 74;   /* #3D6B4A */
    --color-primary-light: 232 242 235;  /* #E8F2EB */
    --color-primary-muted: 209 230 214;  /* #D1E6D6 */

    /* Background */
    --color-bg: 250 250 248;             /* #FAFAF8 */
    --color-bg-card: 255 255 255;        /* #FFFFFF */
    --color-bg-secondary: 243 242 238;   /* #F3F2EE */

    /* Text */
    --color-text: 26 26 26;             /* #1A1A1A */
    --color-text-secondary: 74 74 74;    /* #4A4A4A */
    --color-text-muted: 138 138 138;     /* #8A8A8A */

    /* Border */
    --color-border: 229 227 220;         /* #E5E3DC */
    --color-border-strong: 212 209 199;  /* #D4D1C7 */

    /* Semantic */
    --color-destructive: 231 76 60;      /* #E74C3C */
    --color-warning: 243 156 18;         /* #F39C12 */
    --color-success: 39 174 96;          /* #27AE60 */
    --color-info: 52 152 219;            /* #3498DB */

    /* Modules */
    --color-module-calendar: 74 124 89;
    --color-module-notes: 230 126 34;
    --color-module-maintenance: 41 128 185;
    --color-module-vehicles: 142 68 173;
    --color-module-inventory: 22 160 133;
  }

  [data-theme="dark"] {
    --color-primary: 107 175 123;        /* #6BAF7B */
    --color-primary-hover: 124 194 140;  /* #7CC28C */
    --color-primary-active: 90 157 106;  /* #5A9D6A */
    --color-primary-light: 30 46 34;     /* #1E2E22 */
    --color-primary-muted: 37 58 42;     /* #253A2A */

    --color-bg: 20 20 19;               /* #141413 */
    --color-bg-card: 30 30 28;           /* #1E1E1C */
    --color-bg-secondary: 37 37 35;      /* #252523 */

    --color-text: 240 237 230;           /* #F0EDE6 */
    --color-text-secondary: 176 173 165; /* #B0ADA5 */
    --color-text-muted: 110 107 99;      /* #6E6B63 */

    --color-border: 46 46 43;            /* #2E2E2B */
    --color-border-strong: 58 58 54;     /* #3A3A36 */
  }
}
```

---

## 12. Accessibilité

### 12.1 Contrastes

- Tous les textes respectent un ratio de contraste WCAG AA minimum (4.5:1 pour le texte normal, 3:1 pour le grand texte)
- Les couleurs sémantiques (erreur, succès, warning) ne sont jamais le seul indicateur — toujours accompagnées d'un texte ou d'une icône

### 12.2 Navigation

- Focus visible sur tous les éléments interactifs (ring 2px couleur primary)
- Navigation au clavier complète (tab order logique)
- Aria-labels sur les boutons icône-seule
- Skip-to-content link masqué visuellement

### 12.3 Touch

- Zones de tap minimum 44×44px
- Espacement minimum entre éléments interactifs : 8px
- Pas de hover-only interactions sur mobile

---

## 13. Récapitulatif des tokens de design

| Catégorie | Token | Valeur |
|---|---|---|
| Font display | `font-serif` | DM Serif Display |
| Font body | `font-sans` | DM Sans |
| Font mono | `font-mono` | JetBrains Mono |
| Border radius standard | `rounded` | 10px |
| Border radius carte | `rounded-lg` | 14px |
| Transition standard | `transition` | 200ms ease-out |
| Shadow carte | `shadow-sm` | 0 1px 2px rgba(0,0,0,0.04) |
| Padding carte | `p-4` | 16px |
| Gap liste | `gap-4` | 16px |
| Hauteur header | `h-12` | 48px |
| Hauteur bottom nav | `h-16` | 64px |
| Largeur sidebar | `w-60` | 240px |
| Taille FAB | `w-14 h-14` | 56px |
| Taille avatar | `w-8 h-8` | 32px |
| Taille icône nav | | 22px |
| Taille icône contenu | | 20px |

---

*Document créé le 08/04/2026 — Version 1.0*
