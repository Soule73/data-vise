import type { TabConfig } from "@type/ui";
import { useMemo } from "react";
import { WIDGETS } from "@adapters/visualizations";
import type { WidgetType } from "@type/widgetTypes";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useWidgetTabs(config: any, widgetType?: WidgetType): TabConfig[] {
    return useMemo(() => {
        const availableTabs: TabConfig[] = [];

        availableTabs.push({ key: "data", label: "Données" });

        const hasMetrics = config?.metrics && Array.isArray(config.metrics) && config.metrics.length > 0;

        // Vérifier si le widget utilise des metricStyles dans l'adaptateur
        let hasMetricStyles = false;
        if (widgetType) {
            const widgetDef = WIDGETS[widgetType];
            const metricStylesSchema = widgetDef?.configSchema?.metricStyles;
            hasMetricStyles = metricStylesSchema && Object.keys(metricStylesSchema).length > 0;
        }

        // N'afficher le tab "Métriques & Style" que si le widget a des métriques ET utilise des metricStyles
        if (hasMetrics && hasMetricStyles) {
            availableTabs.push({ key: "metricsAxes", label: "Métriques & Style" });
        }

        const hasConfig = config && Object.keys(config).length > 0;
        if (hasConfig) {
            availableTabs.push({ key: "params", label: "Paramètres" });
        }

        return availableTabs;
    }, [config, widgetType]);
}
