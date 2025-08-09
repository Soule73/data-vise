/* eslint-disable @typescript-eslint/no-explicit-any */
import type { WidgetType } from "@type/widget-types";
import {
    WIDGETS,
    WIDGET_CONFIG_FIELDS,
} from "@adapters/visualizations";

/**
 * Génère une configuration par défaut pour un widget donné en fonction de ses colonnes
 */
export function generateDefaultWidgetConfig(type: WidgetType, columns: string[]): any {
    const widgetDef = WIDGETS[type];
    const schema = widgetDef?.configSchema;
    if (!schema) return {};

    function extractDefaults(obj: any): any {
        if (!obj || typeof obj !== "object") return obj;
        if ("default" in obj) return obj.default;

        const result: any = {};
        for (const key of Object.keys(obj)) {
            result[key] = extractDefaults(obj[key]);
        }
        return result;
    }

    const baseConfig = extractDefaults(schema);

    // Configuration spécifique par type de widget
    switch (type) {
        case "bar":
        case "line":
            return configureChartWidget(baseConfig, columns);
        case "pie":
            return configurePieWidget(baseConfig, columns);
        case "table":
            return configureTableWidget(baseConfig, columns);
        default:
            return baseConfig;
    }
}

/**
 * Configure un widget de type graphique (bar, line)
 */
function configureChartWidget(baseConfig: any, columns: string[]): any {
    if (columns.length > 0 && !baseConfig.metrics?.length) {
        baseConfig.metrics = [{
            field: columns[0],
            agg: "count",
            label: `Count · ${columns[0]}`
        }];
    }
    if (columns.length > 1 && !baseConfig.bucket?.field) {
        baseConfig.bucket = { field: columns[1] };
    }
    return baseConfig;
}

/**
 * Configure un widget de type pie
 */
function configurePieWidget(baseConfig: any, columns: string[]): any {
    if (columns.length > 0 && !baseConfig.metrics?.length) {
        baseConfig.metrics = [{
            field: columns[0],
            agg: "count",
            label: `Count · ${columns[0]}`
        }];
    }
    if (columns.length > 1 && !baseConfig.bucket?.field) {
        baseConfig.bucket = { field: columns[1] };
    }
    return baseConfig;
}

/**
 * Configure un widget de type table
 */
function configureTableWidget(baseConfig: any, columns: string[]): any {
    if (columns.length > 0 && !baseConfig.columns?.length) {
        baseConfig.columns = columns.slice(0, 5);
    }
    return baseConfig;
}

/**
 * Génère un style par défaut pour une métrique
 */
export function generateDefaultMetricStyle(): Record<string, any> {
    const styleFields = Object.keys(WIDGET_CONFIG_FIELDS).filter((key) =>
        [
            "color",
            "borderColor",
            "borderWidth",
            "labelColor",
            "labelFontSize",
            "pointStyle",
            "barThickness",
            "borderRadius",
        ].includes(key)
    );


    const style: Record<string, any> = {};
    styleFields.forEach((field) => {
        const fieldConfig = WIDGET_CONFIG_FIELDS[field as keyof typeof WIDGET_CONFIG_FIELDS];
        if (fieldConfig && 'default' in fieldConfig) {
            style[field] = fieldConfig.default;
        }
    });

    return style;
}

/**
 * Synchronise les styles des métriques avec la configuration (VERSION SIMPLIFIÉE)
 * Ajoute ou supprime des styles selon le nombre de métriques
 */

export function syncMetricStyles(metrics: any[], metricStyles: any[] | undefined | null): any[] {
    // S'assurer que metricStyles est un tableau
    const safeMetricStyles = Array.isArray(metricStyles) ? metricStyles : [];
    const newStyles = [...safeMetricStyles];

    // Ajouter des styles pour les nouvelles métriques
    for (let i = safeMetricStyles.length; i < metrics.length; i++) {
        newStyles.push(generateDefaultMetricStyle());
    }

    // Supprimer les styles en trop
    if (newStyles.length > metrics.length) {
        return newStyles.slice(0, metrics.length);
    }

    return newStyles;
}
