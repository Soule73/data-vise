import type { DataSource } from "@/core/types/data-source";

/**
 * Interface pour les options de sélection des sources
 */
export interface SourceOption {
    value: string;
    label: string;
}

/**
 * Transforme les sources de données en options pour un SelectField
 */
export function generateSourceOptions(sources: DataSource[]): SourceOption[] {
    return [
        { value: "", label: "Sélectionner une source" },
        ...sources.map((s: DataSource) => ({
            value: s._id || "",
            label: s.name,
        })),
    ];
}

/**
 * Trouve une source de données par son ID
 */
export function findSourceById(sources: DataSource[], sourceId: string): DataSource | undefined {
    return sources.find((s: DataSource) => s._id === sourceId);
}

/**
 * Extrait les colonnes depuis les données de prévisualisation
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function extractColumnsFromData(data: any[]): string[] {
    if (!Array.isArray(data) || data.length === 0) {
        return [];
    }

    const firstRow = data[0];
    if (!firstRow || typeof firstRow !== "object") {
        return [];
    }

    return Object.keys(firstRow);
}

/**
 * Valide si les données de prévisualisation sont prêtes
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isDataPreviewReady(dataPreview: any[]): boolean {
    return Array.isArray(dataPreview) && dataPreview.length > 0;
}

/**
 * Valide si une configuration de widget est prête pour la prévisualisation
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isConfigReady(config: any): boolean {
    return config && Object.keys(config).length > 0;
}

/**
 * Valide si un widget est prêt pour la prévisualisation complète
 */
export function isWidgetPreviewReady(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    WidgetComponent: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataPreview: any[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    config: any
): boolean {
    return Boolean(
        WidgetComponent &&
        isDataPreviewReady(dataPreview) &&
        isConfigReady(config)
    );
}
