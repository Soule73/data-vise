import { useMemo } from "react";

interface TabConfig {
    key: string;
    label: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useWidgetTabs(config: any): TabConfig[] {
    return useMemo(() => {
        const availableTabs: TabConfig[] = [];

        // Onglet data toujours disponible
        availableTabs.push({ key: "data", label: "Données" });

        // Onglet métriques et style si on a des métriques configurées
        const hasMetrics = config?.metrics && Array.isArray(config.metrics) && config.metrics.length > 0;
        if (hasMetrics) {
            availableTabs.push({ key: "metricsAxes", label: "Métriques & Style" });
        }

        // Onglet paramètres - pour l'instant toujours affiché si on a une configuration
        const hasConfig = config && Object.keys(config).length > 0;
        if (hasConfig) {
            availableTabs.push({ key: "params", label: "Paramètres" });
        }

        return availableTabs;
    }, [config]);
}
