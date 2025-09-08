# 🚨 Correction d'erreur runtime : widgetParams undefined

## ❌ Erreur identifiée

```
chartUtils.ts:61  Uncaught TypeError: Cannot read properties of undefined (reading 'widgetParams')
    at getLegendPosition (chartUtils.ts:61:17)
    at createBaseOptions (useChartLogic.ts:240:27)
```

## 🔍 Cause du problème

Dans `useChartLogic.ts`, nous appelions les fonctions utilitaires de `chartUtils.ts` avec des valeurs directes :

```typescript
// ❌ PROBLÈME : Passage de valeurs directes à des fonctions qui attendent un objet config
plugins: {
    legend: {
        position: getLegendPosition(params.legendPosition), // ❌ params.legendPosition est une string
    },
    title: {
        text: getTitle(params.title), // ❌ params.title est une string  
        align: getTitleAlign(params.titleAlign), // ❌ params.titleAlign est une string
    },
}
```

Mais les fonctions `chartUtils.ts` attendaient un objet config complet :

```typescript
// chartUtils.ts - Fonctions qui attendent un objet config
export function getLegendPosition(config: any) {
  return config.widgetParams?.legendPosition || config.legendPosition || "top"; // ❌ config est undefined
}

export function getTitle(config: any) {
  return config.widgetParams?.title || config.title; // ❌ config est undefined
}
```

## ✅ Solution appliquée

### 1. Remplacement des appels de fonctions par des valeurs directes

```typescript
// ✅ SOLUTION : Utilisation directe des valeurs avec fallbacks
plugins: {
    legend: {
        display: params.legend !== false,
        position: params.legendPosition || "top", // ✅ Valeur directe avec fallback
    },
    title: {
        display: !!params.title,
        text: params.title || "", // ✅ Valeur directe avec fallback
        align: params.titleAlign || "center", // ✅ Valeur directe avec fallback
    },
}
```

### 2. Suppression des imports inutilisés

```diff
// useChartLogic.ts
import {
    aggregate,
    getLabels,
-   getLegendPosition,
-   getTitle, 
-   getTitleAlign,
    isIsoTimestamp,
    allSameDay,
    formatXTicksLabel,
} from "@utils/chartUtils";
```

## 📋 Changements apportés

### useChartLogic.ts
```diff
plugins: {
    legend: {
        display: params.legend !== false,
-       position: getLegendPosition(params.legendPosition),
+       position: params.legendPosition || "top",
    },
    title: {
        display: !!params.title,
-       text: getTitle(params.title),
-       align: getTitleAlign(params.titleAlign),
+       text: params.title || "",
+       align: params.titleAlign || "center",
    },
```

## 🎯 Bénéfices de la correction

1. **Erreur runtime éliminée** : Plus d'erreur `Cannot read properties of undefined`
2. **Code simplifié** : Moins d'appels de fonctions intermédiaires
3. **Performance améliorée** : Accès direct aux valeurs sans fonction wrapper
4. **Logique plus claire** : Fallbacks explicites visibles directement dans le code

## ✅ Tests de validation

- **BarChartWidget** : ✅ Fonctionne sans erreur
- **LineChartWidget** : ✅ Fonctionne sans erreur  
- **PieChartWidget** : ✅ Fonctionne sans erreur
- **ScatterChartWidget** : ✅ Fonctionne sans erreur
- **BubbleChartWidget** : ✅ Fonctionne sans erreur
- **RadarChartWidget** : ✅ Fonctionne sans erreur

## 🔧 Pattern de correction appliqué

```typescript
// ❌ Avant : Fonction utilitaire avec objet config
position: getLegendPosition(config),

// ✅ Après : Valeur directe avec fallback
position: params.legendPosition || "top",
```

Cette approche est plus simple, plus directe et évite les erreurs liées aux objets undefined.

---

> 🎉 **Correction réussie** : Les widgets de visualisation fonctionnent maintenant sans erreur runtime !
