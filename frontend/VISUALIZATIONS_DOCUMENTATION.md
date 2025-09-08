# Documentation des Visualisations DataVise

## Vue d'ensemble

DataVise propose un système de visualisations unifié et puissant qui permet de créer des graphiques et des tableaux interactifs avec des capacités de filtrage avancées. Toutes les visualisations supportent désormais les **filtres globaux** pour une expérience utilisateur cohérente.

## Architecture du Système

### 🏗️ Structure Générale
- **Adaptateurs** : Configuration et métadonnées des widgets dans `visualizations.ts`
- **Hooks** : Logique métier et traitement des données
- **Composants** : Interface utilisateur et rendu des visualisations
- **Utilitaires** : Fonctions partagées pour le filtrage et le traitement des données

### 🔧 Système de Filtres Unifié
Tous les widgets supportent maintenant les **filtres globaux** avec :
- Interface utilisateur cohérente (`GlobalFiltersConfig`)
- Opérateurs multiples (equals, contains, greater_than, less_than, etc.)
- Sélection de valeurs basée sur les données réelles
- Application des filtres avant le traitement des données

---

## Tableau Récapitulatif des Visualisations

| Visualisation | Type | Filtres Globaux | Multi-Métriques | Buckets | Styles Personnalisés | Hook Principal | Cas d'Usage |
|---------------|------|----------------|-----------------|---------|---------------------|----------------|-------------|
| **KPI** | Indicateur | ✅ | ❌ | ❌ | ❌ | `useKPIWidgetVM` | Valeur clé unique |
| **Card** | Indicateur | ✅ | ❌ | ❌ | ❌ | `useCardWidgetVM` | Synthèse avec icône |
| **KPI Group** | Indicateur | ✅ | ✅ | ❌ | ✅ | `useKPIGroupVM` | Groupe d'indicateurs |
| **Bar Chart** | Graphique | ✅ | ✅ | ✅ | ✅ | `useBarChartLogic` | Comparaisons catégorielles |
| **Line Chart** | Graphique | ✅ | ✅ | ✅ | ✅ | `useLineChartLogic` | Tendances temporelles |
| **Pie Chart** | Graphique | ✅ | ❌ | ✅ | ✅ | `usePieChartLogic` | Répartitions |
| **Table** | Données | ✅ | ✅ | ✅ | ❌ | `useTableWidgetLogic` | Données tabulaires |
| **Radar Chart** | Graphique | ✅ | ✅ | ❌ | ✅ | `useRadarChartVM` | Comparaisons multi-axes |
| **Bubble Chart** | Graphique | ✅ | ✅ | ❌ | ✅ | `useBubbleChartVM` | Relations 3 variables |
| **Scatter Chart** | Graphique | ✅ | ✅ | ❌ | ✅ | `useScatterChartVM` | Corrélations 2 variables |

### Légende
- ✅ : Fonctionnalité supportée
- ❌ : Fonctionnalité non applicable/non supportée

---

## Détail des Visualisations

### 📊 Indicateurs (KPI)

#### KPI Simple
- **Hook** : `useKPIWidgetVM`
- **Fonctionnalités** :
  - Affichage d'une valeur unique agrégée
  - Support des tendances (progression/régression)
  - Formatage personnalisé (nombre, devise, pourcentage)
  - Couleurs configurables
- **Filtres** : Filtres globaux via `applyKPIFilters()`
- **Configuration** : Agrégation + Champ + Paramètres d'affichage

#### Card Widget
- **Hook** : `useCardWidgetVM`
- **Fonctionnalités** :
  - KPI avec icône et description
  - Couleurs personnalisables (icône, valeur, description)
  - Support des icônes Heroicons
  - Formatage avancé
- **Filtres** : Filtres globaux via `applyKPIFilters()`
- **Configuration** : Agrégation + Champ + Icône + Couleurs

#### KPI Group
- **Hook** : `useKPIGroupVM`
- **Fonctionnalités** :
  - Groupe de KPI avec layout en grille
  - Configuration responsive (colonnes adaptatives)
  - Styles par métrique
  - Titre de groupe configurable
- **Filtres** : Filtres globaux partagés
- **Configuration** : Métriques multiples + Paramètres de groupe

### 📈 Graphiques Chart.js

#### Bar Chart
- **Hook** : `useBarChartLogic` (via `useChartLogic`)
- **Fonctionnalités** :
  - Graphiques à barres verticales/horizontales
  - Métriques multiples
  - Buckets pour groupement
  - Styles avancés (couleurs, bordures, épaisseur)
- **Filtres** : Filtres globaux via `useChartLogic`
- **Configuration** : Métriques + Buckets + Styles

#### Line Chart
- **Hook** : `useLineChartLogic` (via `useChartLogic`)
- **Fonctionnalités** :
  - Graphiques linéaires pour tendances
  - Métriques multiples sur le même graphique
  - Lissage des courbes configurable
  - Points et lignes personnalisables
- **Filtres** : Filtres globaux via `useChartLogic`
- **Configuration** : Métriques + Buckets + Styles de ligne

#### Pie Chart
- **Hook** : `usePieChartLogic` (via `useChartLogic`)
- **Fonctionnalités** :
  - Graphiques circulaires
  - Métrique unique avec buckets
  - Couleurs personnalisées par segment
  - Légendes configurables
- **Filtres** : Filtres globaux via `useChartLogic`
- **Configuration** : Métrique + Bucket + Palette de couleurs

### 🎯 Graphiques Spécialisés

#### Radar Chart
- **Hook** : `useRadarChartVM`
- **Fonctionnalités** :
  - Graphiques radar multi-axes
  - Métriques multiples pour comparaison
  - Agrégations configurables par axe
  - Groupement par valeurs
- **Filtres** : Filtres globaux + filtres par dataset
- **Configuration** : Métriques + Champs + Groupement

#### Bubble Chart
- **Hook** : `useBubbleChartVM`
- **Fonctionnalités** :
  - Graphiques à bulles (X, Y, Rayon)
  - Datasets multiples
  - Taille des bulles basée sur une métrique
  - Labels personnalisables
- **Filtres** : Filtres globaux + filtres par dataset
- **Configuration** : Métriques (X, Y, R) + Labels

#### Scatter Chart
- **Hook** : `useScatterChartVM`
- **Fonctionnalités** :
  - Graphiques de dispersion (X, Y)
  - Datasets multiples pour comparaison
  - Corrélations entre variables
  - Styles par dataset
- **Filtres** : Filtres globaux + filtres par dataset
- **Configuration** : Métriques (X, Y) + Labels

### 📋 Données Tabulaires

#### Table Widget
- **Hook** : `useTableWidgetLogic`
- **Fonctionnalités** :
  - Affichage tabulaire des données
  - Pagination configurable
  - Recherche intégrée
  - Colonnes personnalisables
  - Support multi-buckets et métriques
- **Filtres** : Filtres globaux appliqués aux données
- **Configuration** : Métriques + Buckets + Colonnes + Pagination

---

## Système de Filtrage

### 🎯 Filtres Globaux

Tous les widgets supportent les filtres globaux avec les caractéristiques suivantes :

#### Opérateurs Supportés
- **equals** : Égalité stricte
- **not_equals** : Différent de
- **contains** : Contient (texte)
- **not_contains** : Ne contient pas
- **greater_than** : Supérieur à
- **less_than** : Inférieur à
- **greater_equal** : Supérieur ou égal
- **less_equal** : Inférieur ou égal
- **starts_with** : Commence par
- **ends_with** : Finit par

#### Interface Utilisateur
- **Champ** : Sélection parmi les colonnes disponibles
- **Opérateur** : Choix de l'opérateur de comparaison
- **Valeur** : Sélection basée sur les valeurs réelles du dataset

#### Application des Filtres
1. **KPI/Card/KPI Group** : Via `applyKPIFilters()` avec priorité aux filtres globaux
2. **Charts classiques** : Via `useChartLogic()` avant traitement Chart.js
3. **Charts spécialisés** : Via `applyAllFilters()` dans les hooks spécifiques
4. **Table** : Via `applyAllFilters()` avant génération du tableau

### 🔄 Rétrocompatibilité

Le système maintient la compatibilité avec les anciens filtres :
- **KPI** : `config.filter` (simple) → `config.globalFilters` (avancé)
- **KPI Group** : `config.filters` (multiple simple) → `config.globalFilters` (avancé)

---

## Architecture Technique

### 🏗️ Hooks et Logique Métier

#### Hook Commun : `useChartLogic`
Utilisé par les charts Chart.js (Bar, Line, Pie) :
```typescript
const result = useChartLogic({
  chartType: "bar|line|pie",
  data,
  config,
  customDatasetCreator?, // Création datasets spécifiques
  customOptionsCreator?, // Options Chart.js spécifiques
});
```

#### Hooks Spécialisés
- **KPI** : Calculs d'agrégation et formatage
- **Charts spécialisés** : Traitement données spécifique (radar, bubble, scatter)
- **Table** : Génération colonnes et données d'affichage

### 🔧 Utilitaires Partagés

#### `filterUtils.ts`
- `applyAllFilters()` : Application filtres globaux et dataset
- `applyFilter()` : Application d'un filtre unique
- Validation et nettoyage des filtres

#### `chartConfigUtils.ts`
- Configuration de base Chart.js
- Fusion des options personnalisées
- Plugins communs (labels, valeurs)

#### Utilitaires spécialisés
- `kpiUtils.ts` : Logique KPI et formatage
- `tableDataUtils.ts` : Traitement données tabulaires
- `*ChartUtils.ts` : Utilitaires par type de chart

---

## Exemples d'Usage

### Configuration KPI avec Filtres
```json
{
  "metrics": [{"agg": "sum", "field": "revenue"}],
  "globalFilters": [
    {
      "field": "region",
      "operator": "equals",
      "value": "Europe"
    }
  ],
  "widgetParams": {
    "title": "Revenus Europe",
    "format": "currency",
    "currency": "EUR"
  }
}
```

### Configuration Bar Chart avec Multi-Métriques
```json
{
  "metrics": [
    {"agg": "sum", "field": "sales", "label": "Ventes"},
    {"agg": "count", "field": "*", "label": "Commandes"}
  ],
  "bucket": {"field": "month"},
  "globalFilters": [
    {
      "field": "year", 
      "operator": "equals", 
      "value": "2024"
    }
  ]
}
```

### Configuration Table avec Buckets
```json
{
  "buckets": [
    {"field": "region", "label": "Région"},
    {"field": "product", "label": "Produit"}
  ],
  "metrics": [
    {"agg": "sum", "field": "revenue", "label": "CA"},
    {"agg": "avg", "field": "price", "label": "Prix Moyen"}
  ],
  "globalFilters": [
    {
      "field": "status",
      "operator": "equals", 
      "value": "active"
    }
  ]
}
```

---

## Performance et Bonnes Pratiques

### 🚀 Optimisations
1. **Filtrage en amont** : Filtres appliqués avant le traitement des données
2. **Mémorisation** : Hooks utilisent `useMemo` pour éviter les recalculs
3. **Données nettoyées** : Validation et sanitisation automatiques

### 📏 Recommandations
1. **Filtres** : Utiliser les filtres globaux pour de meilleures performances
2. **Métriques** : Limiter le nombre de métriques pour la lisibilité
3. **Buckets** : Éviter trop de groupements pour préserver les performances
4. **Données** : Préférer l'agrégation côté serveur pour de gros volumes

---

## Évolutions Futures

### 🔮 Fonctionnalités Prévues
- Filtres temporels avancés
- Annotations sur les graphiques
- Export des visualisations
- Thèmes personnalisés globaux
- Drill-down interactif

### 🛠️ Améliorations Techniques
- Lazy loading des composants
- Streaming des données
- Cache intelligent
- Optimisations WebGL pour gros volumes

---

Cette documentation reflète l'état actuel du système de visualisations DataVise avec le support complet des filtres globaux sur toutes les visualisations.
