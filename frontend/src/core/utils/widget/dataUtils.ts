import type { DataSource } from "@/core/types/data-source";

/**
 * Génère les options pour un SelectField de sources de données
 */
export function generateSourceOptions(sources: DataSource[]) {
    return [
        { value: "", label: "Sélectionner une source" },
        ...sources.map((s: DataSource) => ({
            value: s._id || "",
            label: s.name,
        })),
    ];
}

/**
 * Extrait les colonnes à partir des données de prévisualisation
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function extractColumnsFromData(data: any[]): string[] {
    if (!Array.isArray(data) || data.length === 0) {
        return [];
    }
    return Object.keys(data[0]);
}

/**
 * Vérifie si les données de prévisualisation sont prêtes pour l'affichage
 */
export function isPreviewDataReady(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    WidgetComponent: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataPreview: any[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config: any
): boolean {
    return !!(
        WidgetComponent &&
        dataPreview &&
        Array.isArray(dataPreview) &&
        config &&
        Object.keys(config).length > 0
    );
}

/**
 * Valide si une configuration de widget est complète
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isConfigComplete(config: any, widgetType: string): boolean {
    if (!config || Object.keys(config).length === 0) {
        return false;
    }

    // Validations spécifiques par type
    switch (widgetType) {
        case "bar":
        case "line":
        case "pie":
            return !!(config.metrics && config.metrics.length > 0);
        case "table":
            return !!(config.columns && config.columns.length > 0);
        default:
            return true;
    }
}
