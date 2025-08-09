/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Paramètres par défaut communs pour tous les widgets de visualisation
 * Basé sur COMMON_WIDGET_PARAMS de l'adaptateur visualizations.ts
 */
export const DEFAULT_WIDGET_PARAMS = {
    // Paramètres par défaut COMMON_WIDGET_PARAMS de l'adaptateur
    title: "",
    legendPosition: "top",
    xLabel: "",
    yLabel: "",
    labelFormat: "{label}: {value} ({percent}%)",
    tooltipFormat: "{label}: {value}",
    titleAlign: "center",
    labelFontSize: 12,
    labelColor: "#000000",
    legend: true,
    showGrid: true,
    showValues: false,

    // Paramètres spécifiques par type de widget selon l'adaptateur
    stacked: false,
    horizontal: false,
    cutout: "0%",
    showPoints: true,
    tension: 0,
    fill: false,
    borderWidth: 1,
    borderColor: "#000000",
    barThickness: undefined,
    borderRadius: 0,
    borderDash: "",
    stepped: false,
    pointStyle: "circle",
    colors: [
        "#6366f1", "#f59e42", "#10b981", "#ef4444", "#fbbf24",
        "#3b82f6", "#a21caf", "#14b8a6", "#eab308", "#f472b6"
    ],

    // Paramètres pour widgets spécialisés
    pageSize: 10,
    columns: 2,
    showTrend: true,
    valueColor: "#2563eb",
    iconColor: "#6366f1",
    descriptionColor: "#6b7280",
    showIcon: true,
    icon: "ChartBarIcon",
    description: "",
} as const;

/**
 * Fusionne les paramètres par défaut avec les paramètres utilisateur
 */
export function mergeWidgetParams(userParams?: any): any {
    return {
        ...DEFAULT_WIDGET_PARAMS,
        // Fusionner avec les paramètres réels du config (priorité aux valeurs utilisateur)
        ...userParams,
    };
}

/**
 * Valide et normalise les paramètres de widget
 */
export function validateWidgetParams(params: any): any {
    const merged = mergeWidgetParams(params);

    // Validation et normalisation des valeurs
    return {
        ...merged,
        legendPosition: ["top", "left", "right", "bottom"].includes(merged.legendPosition)
            ? merged.legendPosition
            : "top",
        titleAlign: ["start", "center", "end"].includes(merged.titleAlign)
            ? merged.titleAlign
            : "center",
        labelFontSize: Math.max(8, Math.min(72, merged.labelFontSize)),
        tension: Math.max(0, Math.min(1, merged.tension)),
        borderWidth: Math.max(0, merged.borderWidth),
        cutout: typeof merged.cutout === 'string' ? merged.cutout : "0%",
    };
}
