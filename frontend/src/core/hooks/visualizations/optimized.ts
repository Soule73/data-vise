// Hooks optimisés pour les visualisations Chart.js
// Réduit considérablement la duplication de code entre les différents types de graphiques

export { useBarChartLogic } from './useBarChartVMOptimized';
export { useLineChartLogic } from './useLineChartVMOptimized';
export { usePieChartLogic } from './usePieChartVMOptimized';
export { useScatterChartLogic } from './useScatterChartVMOptimized';
export { useBubbleChartLogic } from './useBubbleChartVMOptimized';
export { useRadarChartLogic } from './useRadarChartVMOptimized';

// Hook commun pour la logique partagée
export { useChartLogic } from './useChartLogic';

// Types pour l'extensibilité
export type { UseChartLogicOptions, BaseChartConfig, ChartType } from './useChartLogic';
