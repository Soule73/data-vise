import { useMemo } from "react";
import type { ChartData } from "chart.js";
import { useMultiBucketProcessor } from "@utils/bucketMetrics/multiBucketProcessor";
import type { ChartType, UseChartVM } from "@type/widgetTypes";
import { createBaseOptions, createValueLabelsPlugin, mergeOptions } from "@utils/charts/chartConfigUtils";
import { mergeWidgetParams } from "@utils/widgets/widgetParamsUtils";
import { validateChartInput, sanitizeChartData } from "@utils/charts/chartValidationUtils";
import { getChartLabels, createGetValuesFunction } from "@utils/charts/chartDataUtils";
import { createChartDatasets, prepareMetricStyles } from "@utils/charts/chartDatasetUtils";
import { getCustomChartOptions } from "@utils/charts/chartOptionsUtils";
import { applyAllFilters } from "@utils/filterUtils";


/**
 * Hook commun optimisé pour toutes les visualisations Chart.js
 */
export function useChartLogic<T extends ChartType>({
    chartType,
    data,
    config,
    customDatasetCreator,
    customOptionsCreator,
}: UseChartVM) {
    // Application des filtres globaux en premier
    const filteredData = useMemo(() => {
        if (config.globalFilters && config.globalFilters.length > 0) {
            return applyAllFilters(data, config.globalFilters, []);
        }
        return data;
    }, [data, config.globalFilters]);

    // Validation et nettoyage des données filtrées
    const cleanData = useMemo(() => sanitizeChartData(filteredData), [filteredData]);

    // Validation de la configuration
    const validationResult = useMemo(() =>
        validateChartInput({
            chartType,
            data: cleanData,
            metrics: config.metrics,
            buckets: config.buckets
        }),
        [chartType, cleanData, config.metrics, config.buckets]
    );

    // Utiliser le processeur de buckets multiples avec les données nettoyées
    const processedData = useMultiBucketProcessor(cleanData, config);

    // Labels communs en utilisant l'utilitaire
    const labels = useMemo(() => {
        return getChartLabels(processedData, cleanData, config.buckets?.[0]?.field);
    }, [processedData, cleanData, config.buckets]);

    // Fonction commune pour obtenir les valeurs en utilisant l'utilitaire
    const getValues = useMemo(() =>
        createGetValuesFunction(processedData, cleanData),
        [processedData, cleanData]
    );

    // Paramètres communs mémorisés avec fusion des valeurs par défaut
    const widgetParams = useMemo(() => mergeWidgetParams(config.widgetParams), [config.widgetParams]);

    // Préparer les métriques et styles
    const validMetrics = useMemo(() => config.metrics || [], [config.metrics]);
    const metricStyles = useMemo(() => prepareMetricStyles(config.metricStyles), [config.metricStyles]);

    // Contexte pour la création de datasets
    const datasetContext = useMemo(() => ({
        chartType,
        labels,
        widgetParams,
        metrics: validMetrics,
        metricStyles,
        processedData,
        getValues,
    }), [chartType, labels, widgetParams, validMetrics, metricStyles, processedData, getValues]);

    // Datasets en utilisant l'utilitaire
    const datasets = useMemo(() => {
        return createChartDatasets(datasetContext, customDatasetCreator);
    }, [datasetContext, customDatasetCreator]);

    // Options communes
    const options = useMemo(() => {
        const baseOptions = createBaseOptions(chartType, widgetParams, labels);

        if (customOptionsCreator) {
            const customOptions = customOptionsCreator(widgetParams);
            return mergeOptions(baseOptions, customOptions);
        }

        // Utiliser les options par défaut selon le type de chart
        const defaultCustomOptions = getCustomChartOptions(chartType, widgetParams);
        return mergeOptions(baseOptions, defaultCustomOptions);
    }, [chartType, widgetParams, labels, customOptionsCreator]);

    // Plugin commun pour affichage des valeurs
    const valueLabelsPlugin = useMemo(() => {
        return createValueLabelsPlugin(chartType, widgetParams.showValues);
    }, [chartType, widgetParams.showValues]);

    // Données du chart
    const chartData: ChartData<T> = useMemo(() => ({
        labels,
        datasets,
    }), [labels, datasets]);

    return {
        chartData,
        options,
        showNativeValues: widgetParams.showValues === true,
        valueLabelsPlugin,
        processedData,
        labels,
        getValues,
        validDatasets: validMetrics,
        // Informations de validation
        isValid: validationResult.isValid,
        validationErrors: validationResult.errors,
        validationWarnings: validationResult.warnings,
    };
}
