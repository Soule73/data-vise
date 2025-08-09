# Guide de migration vers les hooks optimisés

## Remplacement des hooks de visualisation

### 1. Graphiques en barres

```typescript
// AVANT
import { useBarChartVM } from '@hooks/visualizations/useBarChartVM';
const { chartData, options } = useBarChartVM(data, config);

// APRÈS
import { useBarChartLogic } from '@hooks/visualizations/optimized';
const { chartData, options } = useBarChartLogic(data, config);
```

### 2. Graphiques linéaires

```typescript
// AVANT
import { useLineChartVM } from '@hooks/visualizations/useLineChartVM';
const result = useLineChartVM(data, config);

// APRÈS
import { useLineChartLogic } from '@hooks/visualizations/optimized';
const result = useLineChartLogic(data, config);
```

### 3. Graphiques en secteurs

```typescript
// AVANT
import { usePieChartVM } from '@hooks/visualizations/usePieChartVM';
const { chartData, options } = usePieChartVM(data, config);

// APRÈS
import { usePieChartLogic } from '@hooks/visualizations/optimized';
const { chartData, options } = usePieChartLogic(data, config);
```

### 4. Graphiques de dispersion

```typescript
// AVANT
import { useScatterChartVM } from '@hooks/visualizations/useScatterChartVM';
const { chartData, options } = useScatterChartVM(data, config);

// APRÈS
import { useScatterChartLogic } from '@hooks/visualizations/optimized';
const { chartData, options } = useScatterChartLogic(data, config);
```

### 5. Graphiques à bulles

```typescript
// AVANT
import { useBubbleChartVM } from '@hooks/visualizations/useBubbleChartVM';
const { chartData, options } = useBubbleChartVM(data, config);

// APRÈS
import { useBubbleChartLogic } from '@hooks/visualizations/optimized';
const { chartData, options } = useBubbleChartLogic(data, config);
```

### 6. Graphiques radar

```typescript
// AVANT
import { useRadarChartVM } from '@hooks/visualizations/useRadarChartVM';
const { chartData, options } = useRadarChartVM(data, config);

// APRÈS
import { useRadarChartLogic } from '@hooks/visualizations/optimized';
const { chartData, options } = useRadarChartLogic(data, config);
```

## Script de recherche et remplacement

### PowerShell (Windows)
```powershell
# Rechercher tous les fichiers utilisant les anciens hooks
Get-ChildItem -Path "frontend/src" -Recurse -Include "*.ts","*.tsx" | 
Select-String "useBarChartVM|useLineChartVM|usePieChartVM|useScatterChartVM|useBubbleChartVM|useRadarChartVM" -List

# Remplacer dans tous les fichiers
Get-ChildItem -Path "frontend/src" -Recurse -Include "*.ts","*.tsx" | 
ForEach-Object {
    (Get-Content $_.FullName) -replace 
    "import \{ useBarChartVM \} from.*", 
    "import { useBarChartLogic } from '@hooks/visualizations/optimized';" |
    Set-Content $_.FullName
}
```

## Fichiers probablement concernés

Cherchez ces patterns d'import dans:
- `frontend/src/presentation/components/widgets/`
- `frontend/src/presentation/pages/`
- `frontend/src/data/`

## Changements d'API

Les hooks optimisés maintiennent la même interface que les originaux:
- Même signature de fonction
- Même valeur de retour
- Même types TypeScript

Aucun changement dans les composants n'est nécessaire au-delà du changement d'import.

## Validation

Après migration:
1. Vérifier que tous les graphiques s'affichent correctement
2. Tester les interactions (hover, click, legend)
3. Valider les styles métriques personnalisés
4. Confirmer les performances (devrait être améliorées)

## Nettoyage

Une fois la migration validée, vous pouvez supprimer les anciens hooks:
- `useBarChartVM.ts`
- `useLineChartVM.ts` 
- `usePieChartVM.ts`
- `useScatterChartVM.ts`
- `useBubbleChartVM.ts`
- `useRadarChartVM.ts`
- Et leurs variantes `*MultiBucket.ts` si elles existent
