# Refactorisation des Data Config Sections

## Vue d'ensemble

Cette refactorisation simplifie et unifie la gestion des sections de configuration de données pour les widgets, en éliminant la duplication de code et en créant une architecture plus maintenable.

## Composants créés

### 1. BaseDataConfigSection
**Fichier**: `BaseDataConfigSection.tsx`
**Rôle**: Composant de base qui fournit une structure commune pour toutes les sections de configuration de données.

**Fonctionnalités**:
- Gestion des filtres globaux (optionnelle)
- Structure de layout commune (`space-y-6`)
- Props standardisées pour la configuration

### 2. DefaultMetricConfigSection
**Fichier**: `DefaultMetricConfigSection.tsx`
**Rôle**: Composant pour la configuration par défaut des métriques, utilisé par tous les widgets sauf les cas spécialisés.

**Fonctionnalités**:
- Configuration des métriques standards (agrégation, champ, label)
- Gestion du drag & drop
- Support des métriques multiples
- Sections collapsibles
- Gestion cohérente des événements

### 3. useSpecializedWidgetConfig
**Fichier**: `useSpecializedWidgetConfig.ts`
**Rôle**: Hook pour identifier et gérer les widgets spécialisés.

**Fonctionnalités**:
- Détection des types de widgets spécialisés
- Cast automatique des métriques vers les types appropriés

## Architecture simplifiée

### Avant la refactorisation
```typescript
// Code dupliqué pour chaque type de widget
if (type === "bubble") {
  return (
    <div className="space-y-6">
      <GlobalFiltersConfig ... />
      <WidgetBubbleDataConfigSection ... />
    </div>
  );
}
if (type === "scatter") {
  return (
    <div className="space-y-6">
      <GlobalFiltersConfig ... />
      <WidgetScatterDataConfigSection ... />
    </div>
  );
}
// ... répétition pour chaque type
```

### Après la refactorisation
```typescript
// Structure unifiée avec BaseDataConfigSection
if (type === "bubble") {
  return (
    <BaseDataConfigSection {...commonProps}>
      <WidgetBubbleDataConfigSection ... />
    </BaseDataConfigSection>
  );
}

// Configuration par défaut simplifiée
return (
  <BaseDataConfigSection {...commonProps}>
    <DefaultMetricConfigSection ... />
    {/* Buckets si nécessaire */}
  </BaseDataConfigSection>
);
```

## Types de widgets

### Widgets spécialisés
Ces widgets ont leur propre composant de configuration :
- **bubble**: Configuration X, Y, R + filtres dataset
- **scatter**: Configuration X, Y + filtres dataset  
- **radar**: Configuration champs multiples + filtres dataset
- **kpi_group**: Configuration spéciale héritée

### Widgets par défaut
Tous les autres widgets utilisent `DefaultMetricConfigSection` :
- **bar**: Métriques + buckets
- **line**: Métriques + buckets
- **pie**: Métriques + buckets
- **table**: Métriques + buckets
- **kpi**: Métriques + buckets
- **card**: Métriques + buckets

## Avantages de la refactorisation

### 1. Réduction du code dupliqué
- **Avant**: ~300 lignes avec beaucoup de duplication
- **Après**: ~100 lignes dans le composant principal + composants réutilisables

### 2. Maintenance simplifiée
- Modifications des filtres globaux : 1 seul endroit (`BaseDataConfigSection`)
- Modifications des métriques par défaut : 1 seul endroit (`DefaultMetricConfigSection`)
- Ajout de nouveaux widgets : simple ajout du type dans la condition

### 3. Cohérence
- Structure HTML identique pour tous les widgets
- Comportements uniformes (drag & drop, collapsible, etc.)
- Gestion d'erreurs centralisée

### 4. Réutilisabilité
- `BaseDataConfigSection` peut être utilisé pour de nouveaux types
- `DefaultMetricConfigSection` peut être étendu facilement
- Patterns clairs pour l'ajout de nouvelles fonctionnalités

## Migration

### Pour ajouter un nouveau widget standard
1. Ajouter le type dans les définitions
2. Aucune modification nécessaire dans `WidgetDataConfigSection` (utilise automatiquement `DefaultMetricConfigSection`)

### Pour ajouter un nouveau widget spécialisé
1. Créer le composant de configuration spécialisé
2. Ajouter une condition dans `WidgetDataConfigSection`
3. Utiliser `BaseDataConfigSection` comme wrapper

## Tests recommandés

1. **Fonctionnalité**: Vérifier que tous les widgets fonctionnent comme avant
2. **UI**: Confirmer que la structure visuelle est identique
3. **Performance**: Mesurer l'impact sur le temps de rendu
4. **Régression**: Tester le drag & drop et les interactions

## Notes d'implémentation

- Les props sont typées strictement pour éviter les erreurs
- Compatible avec le système de buckets existant
- Préserve toutes les fonctionnalités existantes
- Améliore la lisibilité du code
