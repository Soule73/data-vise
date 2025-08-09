import type { TabConfig } from "@type/ui";
import { useMemo } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useWidgetTabs(config: any): TabConfig[] {
    return useMemo(() => {
        const availableTabs: TabConfig[] = [];

        availableTabs.push({ key: "data", label: "Données" });

        const hasMetrics = config?.metrics && Array.isArray(config.metrics) && config.metrics.length > 0;

        if (hasMetrics) {
            availableTabs.push({ key: "metricsAxes", label: "Métriques & Style" });
        }

        const hasConfig = config && Object.keys(config).length > 0;
        if (hasConfig) {
            availableTabs.push({ key: "params", label: "Paramètres" });
        }

        return availableTabs;
    }, [config]);
}
