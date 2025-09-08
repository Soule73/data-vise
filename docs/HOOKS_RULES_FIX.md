# 🔧 Corrections des règles des hooks React

## ❌ Problème identifié

Les hooks React étaient appelés **après des conditions de retour**, violant la règle fondamentale des hooks React :

> Les hooks doivent être appelés dans le **même ordre** à chaque rendu du composant.

## ⚠️ Erreurs ESLint corrigées

```
react-hooks/rules-of-hooks: React Hook "useXXXChartLogic" is called conditionally. 
React Hooks must be called in the exact same order in every component render. 
Did you accidentally call a React Hook after an early return?
```

### Fichiers concernés :
- ✅ `BarChartWidget.tsx` (ligne 57)
- ✅ `LineChartWidget.tsx` (ligne 62) 
- ✅ `PieChartWidget.tsx` (ligne 41)
- ✅ `ScatterChartWidget.tsx` (ligne 55)

## 🔄 Solution appliquée

### Avant (❌ Incorrect)
```tsx
export default function ChartWidget({ data, config }) {
  // ❌ Conditions AVANT le hook
  if (!data || !config.metrics) {
    return <InvalideConfigWidget />;
  }
  
  if (data.length === 0) {
    return <NoDataWidget />;
  }
  
  // ❌ Hook appelé APRÈS les returns conditionnels
  const { chartData, options } = useChartLogic(data, config);
  
  return <Chart data={chartData} options={options} />;
}
```

### Après (✅ Correct)
```tsx
export default function ChartWidget({ data, config }) {
  // ✅ Hook appelé EN PREMIER, avant toute condition
  const { chartData, options } = useChartLogic(data, config);
  
  // ✅ Conditions APRÈS le hook
  if (!data || !config.metrics) {
    return <InvalideConfigWidget />;
  }
  
  if (data.length === 0) {
    return <NoDataWidget />;
  }
  
  return <Chart data={chartData} options={options} />;
}
```

## 📋 Modifications apportées

### 1. BarChartWidget.tsx
```diff
+ // Hook doit être appelé avant toute condition de retour
+ const { chartData, options } = useBarChartLogic(data, config);
+
  if (!data || !config.metrics || !config.bucket || ...) {
    return <InvalideConfigWidget />;
  }
  
  if (data.length === 0) {
    return <NoDataWidget />;
  }
  
- const { chartData, options } = useBarChartLogic(data, config);
```

### 2. LineChartWidget.tsx
```diff
+ // Hook doit être appelé avant toute condition de retour
+ const { chartData, options, showNativeValues, valueLabelsPlugin } =
+   useLineChartLogic(data, config);
+
  if (!data || !config.metrics || !config.bucket || ...) {
    return <InvalideConfigWidget />;
  }
  
  if (data.length === 0) {
    return <NoDataWidget />;
  }
  
- const { chartData, options, showNativeValues, valueLabelsPlugin } =
-   useLineChartLogic(data, config);
```

### 3. PieChartWidget.tsx
```diff
+ // Hook doit être appelé avant toute condition de retour
+ const { chartData, options, showNativeValues, valueLabelsPlugin } =
+   usePieChartLogic(data, config);
+
  if (!data || !config.metrics || !config.bucket || ...) {
    return <InvalideConfigWidget />;
  }
  
  if (data.length === 0) {
    return <NoDataWidget />;
  }
  
- const { chartData, options, showNativeValues, valueLabelsPlugin } =
-   usePieChartLogic(data, config);
```

### 4. ScatterChartWidget.tsx
```diff
+ // Hook doit être appelé avant toute condition de retour
+ const { chartData, options } = useScatterChartLogic(data, config);
+
  if (!data || !config.metrics || ...) {
    return <InvalideConfigWidget />;
  }
  
  if (data.length === 0) {
    return <NoDataWidget />;
  }
  
- const { chartData, options } = useScatterChartLogic(data, config);
```

## ✅ Résultat

- **0 erreur ESLint** liée aux règles des hooks
- **Conformité complète** aux règles React
- **Fonctionnalité préservée** : Les widgets fonctionnent exactement comme avant
- **Performance maintenue** : Aucun impact négatif sur les performances

## 📚 Règle React rappelée

> **Règle #1 des hooks React :** Ne jamais appeler de hooks à l'intérieur de boucles, conditions ou fonctions imbriquées. Toujours appeler les hooks au niveau supérieur de votre fonction React, dans le même ordre.

Cette règle garantit que les hooks sont appelés dans le **même ordre** à chaque rendu, permettant à React de maintenir correctement l'état local entre plusieurs appels `useState` et `useEffect`.

---

> 🎯 **Mission accomplie** : Tous les widgets de visualisation respectent maintenant les règles des hooks React !
