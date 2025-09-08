/* eslint-disable @typescript-eslint/no-explicit-any */
import SelectField from "@components/SelectField";
import MetricLabelInput from "@components/widgets/MetricLabelInput";
import CollapsibleSection from "@components/widgets/CollapsibleSection";
import WidgetConfigSection from "@components/widgets/WidgetConfigSection";
import type { DefaultMetricConfigSectionProps } from "@type/metricBucketTypes";



/**
 * Section de configuration par défaut pour les métriques
 * Utilisée par les widgets qui n'ont pas de configuration spécialisée
 */
export default function DefaultMetricConfigSection({
    dataConfig,
    config,
    columns,
    handleConfigChange,
    handleMetricAggOrFieldChange,
    allowMultipleMetrics = true,
}: DefaultMetricConfigSectionProps) {
    if (!dataConfig.metrics.label || !config.metrics || !Array.isArray(config.metrics)) {
        return null;
    }

    const handleAddMetric = () => {
        handleConfigChange("metrics", [
            ...config.metrics,
            {
                agg: dataConfig.metrics.defaultAgg,
                field: columns[1] || "",
                label: "",
            },
        ]);
    };

    const handleDeleteMetric = (idx: number) => {
        const newMetrics = [...config.metrics];
        newMetrics.splice(idx, 1);
        handleConfigChange("metrics", newMetrics);
    };

    const handleMoveMetric = (idx: number, direction: 'up' | 'down') => {
        const newMetrics = [...config.metrics];
        const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
        [newMetrics[idx], newMetrics[targetIdx]] = [newMetrics[targetIdx], newMetrics[idx]];
        handleConfigChange("metrics", newMetrics);
    };

    const handleMetricChange = (idx: number, field: string, value: any) => {
        if (handleMetricAggOrFieldChange && (field === 'agg' || field === 'field')) {
            handleMetricAggOrFieldChange(idx, field as 'agg' | 'field', value);
        } else {
            const newMetrics = [...config.metrics];
            newMetrics[idx][field] = value;
            handleConfigChange("metrics", newMetrics);
        }
    };

    const getMetricHeaderLabel = (metric: any) => {
        const aggLabel = dataConfig.metrics.allowedAggs?.find(
            (a: any) => a.value === metric.agg
        )?.label || metric.agg || "";
        const fieldLabel = metric.field || "";
        return `${aggLabel}${fieldLabel ? " · " + fieldLabel : ""}`;
    };

    const isOnlyMetric = config.metrics.length === 1;
    const canShowSettings = allowMultipleMetrics || (dataConfig.metrics.allowMultiple && !isOnlyMetric);

    return (
        <WidgetConfigSection
            title={dataConfig.metrics.label}
            addButtonText="Ajouter une métrique"
            canAdd={dataConfig.metrics.allowMultiple}
            onAdd={handleAddMetric}
        >
            <div className="space-y-3">
                {config.metrics.map((metric: any, idx: number) => (
                    <CollapsibleSection
                        key={idx}
                        title={getMetricHeaderLabel(metric)}
                        canMoveUp={idx > 0}
                        canMoveDown={idx < config.metrics.length - 1}
                        onDelete={() => handleDeleteMetric(idx)}
                        onMoveUp={() => handleMoveMetric(idx, 'up')}
                        onMoveDown={() => handleMoveMetric(idx, 'down')}
                        collapsible={canShowSettings}
                        hideSettings={!canShowSettings}
                        draggable={canShowSettings}
                    >
                        <div className="flex flex-col gap-2 mt-2">
                            <SelectField
                                label="Agrégation"
                                value={metric.agg}
                                onChange={(e) => handleMetricChange(idx, 'agg', e.target.value)}
                                options={Array.isArray(dataConfig.metrics.allowedAggs) ? dataConfig.metrics.allowedAggs : []}
                                name={`metric-agg-${idx}`}
                                id={`metric-agg-${idx}`}
                            />
                            <SelectField
                                label="Champ"
                                value={metric.field}
                                onChange={(e) => handleMetricChange(idx, 'field', e.target.value)}
                                options={columns.map((col) => ({ value: col, label: col }))}
                                name={`metric-field-${idx}`}
                                id={`metric-field-${idx}`}
                            />
                            <MetricLabelInput
                                value={metric.label || ""}
                                onChange={(newValue) => handleMetricChange(idx, 'label', newValue)}
                                name={`metric-label-${idx}`}
                                id={`metric-label-${idx}`}
                                metricIndex={idx}
                            />
                        </div>
                    </CollapsibleSection>
                ))}
            </div>
        </WidgetConfigSection>
    );
}
