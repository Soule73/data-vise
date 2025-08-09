# Système de Buckets Multiples - Guide d'implémentation

## Vue d'ensemble

Le système de buckets multiples remplace l'ancien système de "champ de groupement" unique par un système flexible similaire à Kibana, permettant de créer des agrégations complexes avec plusieurs niveaux de groupement.

## Fonctionnalités principales

### Types de buckets supportés

1. **Terms** - Groupement par valeurs distinctes (équivalent à l'ancien système)
2. **Histogram** - Groupement par intervalles numériques
3. **Date Histogram** - Groupement par intervalles de temps
4. **Range** - Groupement par plages personnalisées
5. **Split Series** - Division en séries multiples
6. **Split Rows** - Division en lignes (pour les tables)
7. **Split Chart** - Division en graphiques séparés

### Architecture

```
frontend/src/
├── core/
│   ├── types/
│   │   └── metric-bucket-types.ts    # Types pour buckets multiples
│   ├── utils/
│   │   ├── bucketUtils.ts            # Utilitaires pour buckets
│   │   ├── bucketMigration.ts        # Migration legacy → nouveau
│   │   ├── multiBucketProcessor.ts   # Processeur de données
│   │   └── widgetConfigDefaults.ts   # Configurations par défaut
│   ├── hooks/
│   │   ├── useMultiBuckets.ts        # Hook principal pour buckets
│   │   └── visualizations/
│   │       └── useBarChartVMMultiBucket.ts  # Hook adapté pour graphiques
│   └── store/
│       └── bucketUI.ts               # Store pour l'état UI des buckets
└── presentation/
    └── components/
        └── widgets/
            ├── MultiBucketSection.tsx      # Section principale
            ├── BucketConfigComponent.tsx   # Configuration d'un bucket
            └── WidgetDataConfigSection.tsx # Composant principal adapté
```

## Utilisation

### 1. Configuration d'un bucket simple

```typescript
import { createDefaultBucket } from '@utils/bucketUtils';

const bucket = createDefaultBucket('terms', 'category');
// Résultat: { field: 'category', type: 'terms', order: 'desc', size: 10, ... }
```

### 2. Configuration de buckets multiples

```typescript
import { useMultiBuckets } from '@hooks/useMultiBuckets';

const {
  buckets,
  handleBucketsChange,
  addBucket,
  removeBucket,
  updateBucket
} = useMultiBuckets({
  config: widgetConfig,
  columns: ['category', 'region', 'date'],
  allowMultiple: true,
  onConfigChange: handleConfigChange
});
```

### 3. Traitement des données

```typescript
import { useMultiBucketProcessor } from '@utils/multiBucketProcessor';

const processedData = useMultiBucketProcessor(data, config);
// Résultat: { groupedData, labels, bucketHierarchy, splitData }
```

## Types de buckets en détail

### Terms Bucket
```typescript
{
  field: 'category',
  type: 'terms',
  order: 'desc',     // 'asc' | 'desc'
  size: 10,          // Nombre max d'éléments
  minDocCount: 1     // Minimum de documents par bucket
}
```

### Histogram Bucket
```typescript
{
  field: 'price',
  type: 'histogram',
  interval: 100,     // Intervalle numérique
  order: 'asc',
  size: 50
}
```

### Date Histogram Bucket
```typescript
{
  field: 'date',
  type: 'date_histogram',
  dateInterval: 'day', // 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year'
  order: 'asc',
  size: 100
}
```

### Range Bucket
```typescript
{
  field: 'age',
  type: 'range',
  ranges: [
    { from: 0, to: 18, label: 'Enfants' },
    { from: 18, to: 65, label: 'Adultes' },
    { from: 65, label: 'Seniors' }
  ]
}
```

### Split Buckets
```typescript
{
  field: 'region',
  type: 'split_series',  // Créer une série par région
  splitType: 'series',   // 'series' | 'rows' | 'chart'
  size: 5
}
```

## Migration depuis l'ancien système

Le système assure la compatibilité avec l'ancien système de buckets :

```typescript
// Ancien format (supporté)
config = {
  bucket: { field: 'category' }
}

// Nouveau format (recommandé)
config = {
  buckets: [{ field: 'category', type: 'terms', ... }]
}

// Migration automatique avec ensureMultiBuckets()
const buckets = ensureMultiBuckets(config);
```

## Composants UI

### MultiBucketSection
Composant principal pour gérer la liste des buckets :

```typescript
<MultiBucketSection
  buckets={buckets}
  columns={columns}
  data={data}
  allowMultiple={true}
  sectionLabel="Buckets"
  onBucketsChange={handleBucketsChange}
/>
```

### BucketConfigComponent
Composant pour configurer un bucket individuel :

```typescript
<BucketConfigComponent
  bucket={bucket}
  index={0}
  isCollapsed={false}
  columns={columns}
  onUpdate={handleUpdate}
  onDelete={handleDelete}
  // ... autres props
/>
```

## Intégration avec les visualisations

### Adapter un hook de visualisation existant

1. Importer le processeur de buckets multiples
2. Remplacer la logique de groupement simple
3. Gérer les split series/rows/charts

Exemple pour un graphique en barres :

```typescript
// Avant
const labels = getLabels(data, config.bucket?.field);

// Après
const processedData = useMultiBucketProcessor(data, config);
const labels = processedData.labels;

// Gérer les split series
if (processedData.splitData.series.length > 0) {
  // Créer un dataset par série
  datasets = processedData.splitData.series.map(splitItem => ({
    label: splitItem.key,
    data: calculateValues(splitItem.data),
    // ... styles
  }));
}
```

## Configuration des adaptateurs

Les adaptateurs de visualisation incluent maintenant la configuration des buckets multiples :

```typescript
export const WIDGET_DATA_CONFIG = {
  bar: {
    metrics: COMMON_METRICS,
    bucket: { ...COMMON_BUCKET },           // Legacy
    buckets: { ...COMMON_MULTI_BUCKETS }   // Nouveau
  }
}
```

## Bonnes pratiques

1. **Toujours utiliser `ensureMultiBuckets()`** pour la compatibilité
2. **Limiter le nombre de buckets** selon le type de visualisation
3. **Valider les buckets** avec `validateBucket()` avant utilisation
4. **Utiliser les suggestions automatiques** avec `suggestBuckets()`
5. **Optimiser les configurations** avec `optimizeWidgetConfig()`

## Tests et débogage

Un composant de test est disponible :
```typescript
import MultiBucketTestComponent from '@components/test/MultiBucketTestComponent';
```

Ce composant permet de :
- Tester différents types de widgets
- Voir la configuration en temps réel
- Valider le comportement des buckets

## Évolutions futures

1. **Buckets imbriqués** - Support complet des hiérarchies de buckets
2. **Buckets conditionnels** - Buckets qui dépendent d'autres buckets
3. **Agrégations personnalisées** - Support d'agrégations métier spécifiques
4. **Optimisations de performance** - Cache et virtualisation pour gros volumes
5. **Export/Import** - Sauvegarder et partager des configurations de buckets

## Support et documentation

- Types TypeScript complets avec documentation JSDoc
- Validation automatique des configurations
- Messages d'erreur descriptifs
- Suggestions intelligentes basées sur les données
