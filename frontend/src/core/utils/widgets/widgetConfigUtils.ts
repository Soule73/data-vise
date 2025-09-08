/* eslint-disable @typescript-eslint/no-explicit-any */
import type { WidgetType } from "@type/widgetTypes";
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
            // Si c'est metricStyles et qu'il est vide, ne pas l'inclure
            if (key === "metricStyles" && obj[key] && typeof obj[key] === "object" && Object.keys(obj[key]).length === 0) {
                continue;
            }
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
        case "kpi":
            return configureKPIWidget(baseConfig, columns);
        case "card":
            return configureCardWidget(baseConfig, columns);
        case "kpi_group":
            return configureKPIGroupWidget(baseConfig, columns);
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
    if (columns.length > 1 && (!baseConfig.buckets || baseConfig.buckets.length === 0)) {
        baseConfig.buckets = [{
            field: columns[1],
            label: columns[1],
            type: 'terms',
            order: 'desc',
            size: 10,
            minDocCount: 1
        }];
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
    if (columns.length > 1 && (!baseConfig.buckets || baseConfig.buckets.length === 0)) {
        baseConfig.buckets = [{
            field: columns[1],
            label: columns[1],
            type: 'terms',
            order: 'desc',
            size: 10,
            minDocCount: 1
        }];
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
 * Configure un widget de type KPI
 */
function configureKPIWidget(baseConfig: any, columns: string[]): any {
    // Un KPI a besoin d'une seule métrique
    if (columns.length > 0 && !baseConfig.metrics?.length) {
        baseConfig.metrics = [{
            field: columns[0],
            agg: "count",
            label: `Count · ${columns[0]}`
        }];
    }
    return baseConfig;
}

/**
 * Configure un widget de type Card
 */
function configureCardWidget(baseConfig: any, columns: string[]): any {
    // Une Card a besoin d'une seule métrique comme un KPI
    if (columns.length > 0 && !baseConfig.metrics?.length) {
        baseConfig.metrics = [{
            field: columns[0],
            agg: "count",
            label: `Count · ${columns[0]}`
        }];
    }
    return baseConfig;
}

/**
 * Configure un widget de type KPI Group
 */
function configureKPIGroupWidget(baseConfig: any, columns: string[]): any {
    // Un KPI Group peut avoir plusieurs métriques
    if (columns.length > 0 && !baseConfig.metrics?.length) {
        // Commencer par une seule métrique, l'utilisateur peut en ajouter d'autres
        baseConfig.metrics = [{
            field: columns[0],
            agg: "count",
            label: `Count · ${columns[0]}`
        }];
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
 * NE fait rien si le widget n'utilise pas de metricStyles (longueur = 0 dans l'adaptateur)
 */
export function syncMetricStyles(
    metrics: any[],
    metricStyles: any[] | undefined | null,
    widgetType: WidgetType
): any[] | undefined {
    // Vérifier d'abord si ce widget utilise des metricStyles
    const widgetDef = WIDGETS[widgetType];
    const metricStylesSchema = widgetDef?.configSchema?.metricStyles;

    // Si metricStyles est vide dans l'adaptateur, retourner undefined pour ne pas créer de styles
    if (!metricStylesSchema || Object.keys(metricStylesSchema).length === 0) {
        return undefined;
    }

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
