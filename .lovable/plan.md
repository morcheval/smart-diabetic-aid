
# Module de suivi des injections d'insuline et de la glycémie

## Objectif
Ajouter une page dédiée au suivi médical : enregistrement des injections d'insuline (type, dose, moment du repas) et des mesures de glycémie, avec un journal historique et des statistiques (moyennes, tendances).

## Architecture des données

### Nouvelle table en base de données : `insulin_logs`
```
id              UUID (clé primaire)
created_at      TIMESTAMP
date            TEXT (YYYY-MM-DD)
time            TEXT (HH:mm)
insulin_type    TEXT  → 'rapide' | 'lente' | 'mixte'
insulin_name    TEXT  → ex: "Novorapid", "Lantus", "Toujeo"
dose_units      NUMERIC → unités injectées (ex: 8)
meal_context    TEXT  → 'avant_repas' | 'apres_repas' | 'couche' | 'matin' | 'aucun'
blood_glucose   NUMERIC (optionnel) → glycémie mesurée en mg/dL ou mmol/L
notes           TEXT (optionnel) → remarques libres
```

### Politiques RLS
Accès public en lecture/écriture/suppression (cohérent avec la table `food_scans` existante).

## Nouveaux fichiers à créer

### 1. `src/types/insulin.ts`
Types TypeScript pour les injections :
- `InsulinType` : `'rapide' | 'lente' | 'mixte'`
- `MealContext` : `'avant_repas' | 'apres_repas' | 'couche' | 'matin' | 'aucun'`
- `InsulinLog` : interface complète de l'entrée
- Constantes de labels en français et codes couleur par type d'insuline

### 2. `src/hooks/useInsulin.ts`
Hook React Query pour interagir avec la base de données :
- `addLog(entry)` → INSERT dans `insulin_logs`
- `removeLog(id)` → DELETE
- `getLogsForDate(date)` → filtre par date
- `getWeeklyStats()` → calcule moyenne glycémie sur 7 jours, total doses
- Invalidation automatique du cache après chaque mutation

### 3. `src/pages/Insulin.tsx` (page principale)
Interface avec 3 onglets :

**Onglet "Enregistrer"**
- Formulaire rapide avec :
  - Sélecteur de type d'insuline (Rapide / Lente / Mixte) avec couleurs distinctives
  - Champ dose (nombre d'unités, spinner numérique)
  - Contexte repas (avant repas, après repas, coucher, matin)
  - Champ glycémie optionnel (mg/dL)
  - Zone notes
  - Bouton "Enregistrer l'injection"

**Onglet "Journal"**
- Navigation par date (même pattern que Journal alimentaire)
- Liste des injections du jour groupées par moment
- Chaque entrée affiche : heure, type d'insuline (badge coloré), dose en unités, glycémie si renseignée
- Bouton suppression

**Onglet "Statistiques"**
- Carte "Moyenne de glycémie sur 7 jours" (valeur en mg/dL, indicateur de zone : normale/élevée/basse)
- Carte "Doses totales cette semaine" (rapide vs lente)
- Graphique barres (Recharts) : glycémie des 7 derniers jours avec ligne de référence à 1g/L (100 mg/dL)
- Tableau récapitulatif : nombre d'injections par type sur 7 jours

## Modifications de fichiers existants

### `src/App.tsx`
Ajout de la route `/insulin` et import de la nouvelle page.

### `src/components/BottomNav.tsx`
Remplacement de l'icône "Stats" par "Insuline" (icône `Syringe` de Lucide) dans la barre de navigation, et déplacement de Stats accessible depuis le Dashboard ou via un lien dans la page Insuline.

> Note : La barre de navigation ne peut afficher que 5 éléments. On remplace l'onglet "Stats" par "Insuline" (Syringe). Les statistiques nutritionnelles restent accessibles via un bouton dans le Dashboard.

## Flux utilisateur

```text
Utilisateur ouvre l'app
       |
       v
  [Barre de nav] → clique sur "Insuline" (icône seringue)
       |
       v
  Page Insuline (onglet Enregistrer par défaut)
  ┌────────────────────────────────┐
  │ Type : [Rapide] [Lente] [Mix] │
  │ Dose : [  8  ] unités         │
  │ Contexte : [Avant repas ▼]    │
  │ Glycémie : [120] mg/dL        │
  │ Notes : ___________           │
  │      [Enregistrer]            │
  └────────────────────────────────┘
       |
       v
  → Sauvegardé en base de données
  → Toast de confirmation
       |
       v
  Onglet Journal → liste du jour
  Onglet Stats → moyennes et graphiques
```

## Indicateurs de glycémie
Zones affichées avec codes couleur :
- Vert : 70–140 mg/dL (normale)
- Orange : 140–180 mg/dL (élevée)
- Rouge : > 180 mg/dL ou < 70 mg/dL (critique)

## Détail technique

- La migration SQL crée la table `insulin_logs` avec RLS identiques à `food_scans`
- Le hook `useInsulin` utilise `@tanstack/react-query` (déjà installé) pour la gestion du cache
- Les données sont persistées dans la base de données (pas seulement localStorage)
- L'unité de glycémie utilisée est mg/dL (standard français)
- L'icône `Syringe` est disponible dans `lucide-react` (version installée 0.462)
