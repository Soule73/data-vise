import type { WidgetType } from "@/core/types/widget-types";
import { WIDGETS, WIDGET_CONFIG_FIELDS } from "@/data/adapters/visualizations";

/**
 * Extrait les valeurs par défaut d'un objet de configuration
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractDefaults(obj: any): any {
    if (!obj || typeof obj !== "object") return obj;
    if ("default" in obj) return obj.default;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any = {};
    for (const key of Object.keys(obj)) {
        result[key] = extractDefaults(obj[key]);
    }
    return result;
}

/**
 * Génère la configuration par défaut pour un type de widget donné
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getDefaultConfig(type: WidgetType, columns: string[]): any {
    const widgetDef = WIDGETS[type];
    const schema = widgetDef?.configSchema;
    if (!schema) return {};

    const baseConfig = extractDefaults(schema);

    // Configuration spécifique par type de widget
    if (type === "bar" || type === "line") {
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
    }

    if (type === "pie") {
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
    }

    if (type === "table") {
        if (columns.length > 0 && !baseConfig.columns?.length) {
            baseConfig.columns = columns.slice(0, 5);
        }
    }

    return baseConfig;
}

/**
 * Génère le style par défaut pour une métrique
 */
export function getDefaultMetricStyle() {
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const style: Record<string, any> = {};
    styleFields.forEach((field) => {
        const fieldConfig = WIDGET_CONFIG_FIELDS[field as keyof typeof WIDGET_CONFIG_FIELDS];
        if (fieldConfig && 'default' in fieldConfig) {
            style[field] = fieldConfig.default;
        }
    });

    return style;
}
