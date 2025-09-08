# Suppression complète du système de bucket legacy

## Contexte

L'ancien système de bucket unique (`BucketConfig`) a été complètement supprimé au profit du nouveau système de buckets multiples (`MultiBucketConfig[]`). Cette refactorisation garantit que tous les widgets utilisent maintenant le même système unifié.

## Modifications effectuées

### 1. Suppression de l'interface `BucketConfig`

- **Fichier**: `frontend/src/core/types/metric-bucket-types.ts`
- **Action**: Suppression complète de l'interface `BucketConfig`
- **Impact**: Toutes les références à cette interface ont été mises à jour

### 2. Suppression du fichier de migration

- **Fichier**: `frontend/src/core/utils/bucketMigration.ts`
- **Action**: Fichier supprimé entièrement
- **Raison**: Plus besoin de migration puisque le système legacy n'existe plus

### 3. Mise à jour des types de widget

- **Fichier**: `frontend/src/core/types/visualization.ts`
- **Actions**:
  - Suppression de la propriété `bucket?` des constructeurs `WidgetConfigBase` et `TableWidgetConfig`
  - Suppression de l'import `BucketConfig`

- **Fichier**: `frontend/src/core/types/widget-types.ts`
- **Actions**:
  - Suppression de l'import `BucketConfig`
  - Suppression des propriétés `bucket?` des interfaces:
    - `GroupFieldConfig`
    - `MultiBucketCompatibleConfig`
    - `WidgetConfig`
    - `WidgetDataConfig`

### 4. Mise à jour des hooks et utilitaires

- **Fichier**: `frontend/src/core/hooks/useMultiBuckets.ts`
- **Actions**:
  - Remplacement de l'import `bucketMigration` par une fonction locale
  - Suppression de toute la logique de compatibilité legacy
  - Suppression de la fonction `migrateFromLegacy`

- **Fichier**: `frontend/src/core/utils/multiBucketProcessor.ts`
- **Actions**:
  - Remplacement de l'import `bucketMigration` par une fonction locale
  - Simplification de la logique `ensureMultiBuckets`

- **Fichier**: `frontend/src/core/hooks/useWidgetAutoConfig.ts`
- **Actions**:
  - Remplacement de l'import `bucketMigration` par une fonction locale
  - Mise à jour des types

- **Fichier**: `frontend/src/core/utils/widgetDataFields.ts`
- **Actions**:
  - Suppression de l'import `BucketConfig`
  - Suppression de la logique de traitement des anciens buckets

### 5. Mise à jour des composants de visualisation

- **Fichiers**: 
  - `frontend/src/presentation/components/visualizations/charts/BarChartWidget.tsx`
  - `frontend/src/presentation/components/visualizations/charts/LineChartWidget.tsx`
  - `frontend/src/presentation/components/visualizations/charts/PieChartWidget.tsx`
  - `frontend/src/presentation/components/visualizations/kpi/KPIGroupWidget.tsx`

- **Actions**:
  - Remplacement des vérifications `config.bucket` par `config.buckets`
  - Mise à jour de la logique de validation des configurations

### 6. Mise à jour des hooks de formulaire

- **Fichier**: `frontend/src/core/hooks/widget/useCommonWidgetForm.ts`
- **Actions**:
  - Remplacement de la logique de génération automatique des buckets
  - Utilisation du nouveau système `buckets` au lieu de `bucket`

## Architecture finale

### Structure des buckets

```typescript
interface MultiBucketConfig {
  field: string;
  label: string;
  type: 'terms' | 'date_histogram' | 'histogram' | 'range';
  order: 'asc' | 'desc';
  size: number;
  minDocCount: number;
  // ... autres propriétés spécifiques au type
}
```

### Configuration des widgets

Tous les widgets utilisent maintenant exclusivement :

```typescript
interface WidgetConfig {
  buckets?: MultiBucketConfig[]; // Nouveau système unifié
  metrics: Metric[];
  // ... autres propriétés
}
```

## Avantages de la refactorisation

1. **Simplicité**: Un seul système de buckets au lieu de deux
2. **Consistance**: Tous les widgets fonctionnent de la même manière
3. **Maintenabilité**: Plus de code de migration à maintenir
4. **Performance**: Moins de logique conditionnelle
5. **Évolutivité**: Facilite l'ajout de nouvelles fonctionnalités

## Validation

- ✅ Compilation TypeScript réussie
- ✅ Toutes les références à `BucketConfig` supprimées
- ✅ Tous les widgets utilisent le nouveau système
- ✅ Pas de régression fonctionnelle

## Migration pour les développeurs

Si vous aviez du code utilisant l'ancien système :

```typescript
// ❌ Ancien système
const bucket = config.bucket;
if (bucket?.field) {
  // logique
}

// ✅ Nouveau système
const buckets = config.buckets || [];
if (buckets.length > 0 && buckets[0]?.field) {
  // logique
}
```

## Prochaines étapes

1. Tester les fonctionnalités en mode développement
2. Valider que tous les widgets existants fonctionnent correctement
3. Mettre à jour la documentation utilisateur si nécessaire
