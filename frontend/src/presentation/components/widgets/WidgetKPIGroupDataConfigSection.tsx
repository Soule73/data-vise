/* eslint-disable @typescript-eslint/no-explicit-any */
import SelectField from "@components/SelectField";
import InputField from "@components/forms/InputField";
import type { WidgetKPIGroupDataConfigSectionProps } from "@type/widgetTypes";
import type { Metric } from "@type/metricBucketTypes";
import type { KPIGroupWidgetConfig } from "@type/visualization";
import GlobalFiltersConfig from "@components/widgets/GlobalFiltersConfig";
import CollapsibleSection from "@components/widgets/CollapsibleSection";
import WidgetConfigSection from "@components/widgets/WidgetConfigSection";

export default function WidgetKPIGroupDataConfigSection({
  dataConfig,
  config,
  columns,
  handleConfigChange,
  handleDragStart,
  handleDragOver,
  handleDrop,
  handleMetricAggOrFieldChange,
  data = [],
}: WidgetKPIGroupDataConfigSectionProps) {

  const kpiConfig = config as KPIGroupWidgetConfig;

  const kpiDataConfig = dataConfig as { metrics: any };

  const handleMetricMoveUp = (idx: number) => {
    if (idx === 0) return;
    const newMetrics = [...kpiConfig.metrics];
    [newMetrics[idx - 1], newMetrics[idx]] = [
      newMetrics[idx],
      newMetrics[idx - 1],
    ];
    handleConfigChange("metrics", newMetrics);
  };

  const handleMetricMoveDown = (idx: number) => {
    if (idx === kpiConfig.metrics.length - 1) return;
    const newMetrics = [...kpiConfig.metrics];
    [newMetrics[idx], newMetrics[idx + 1]] = [
      newMetrics[idx + 1],
      newMetrics[idx],
    ];
    handleConfigChange("metrics", newMetrics);
  };

  const handleMetricDelete = (idx: number) => {
    const newMetrics = kpiConfig.metrics.filter(
      (_: Metric, i: number) => i !== idx
    );
    handleConfigChange("metrics", newMetrics);
  };

  const handleMetricAggChange = (idx: number, value: string) => {
    if (handleMetricAggOrFieldChange) {
      handleMetricAggOrFieldChange(idx, "agg", value);
    } else {
      const newMetrics = [...kpiConfig.metrics];
      newMetrics[idx].agg = value;
      handleConfigChange("metrics", newMetrics);
    }
  };

  const handleMetricFieldChange = (idx: number, value: string) => {
    if (handleMetricAggOrFieldChange) {
      handleMetricAggOrFieldChange(idx, "field", value);
    } else {
      const newMetrics = [...kpiConfig.metrics];
      newMetrics[idx].field = value;
      handleConfigChange("metrics", newMetrics);
    }
  };

  const handleMetricLabelChange = (idx: number, value: string) => {
    const newMetrics = [...kpiConfig.metrics];
    newMetrics[idx].label = value;
    handleConfigChange("metrics", newMetrics);
  };

  const handleAddMetric = () => {
    handleConfigChange("metrics", [
      ...kpiConfig.metrics,
      {
        agg: kpiDataConfig.metrics.defaultAgg,
        field: columns[1] || "",
        label: "",
      },
    ]);
  };

  const getAggLabel = (metric: Metric) =>

    kpiDataConfig.metrics?.allowedAggs.find((a: Metric) => a.label === metric.agg)?.label || metric.agg || "";

  const getFieldLabel = (metric: Metric) => metric.field || "";

  const getHeaderLabel = (metric: Metric) => {
    const aggLabel = getAggLabel(metric);
    const fieldLabel = getFieldLabel(metric);
    return `${aggLabel}${fieldLabel ? " · " + fieldLabel : ""}`;
  };

  const aggsOptions = Array.isArray(kpiDataConfig.metrics?.allowedAggs)
    ? kpiDataConfig.metrics.allowedAggs
    : [];

  const fieldOptions =
    Array.isArray(columns)
      ? columns.map((col) => ({ value: col, label: col }))
      : []
    ;

  return (
    <div className="space-y-6">
      <GlobalFiltersConfig
        filters={kpiConfig.globalFilters || []}
        columns={columns}
        data={data}
        onFiltersChange={(filters) => handleConfigChange('globalFilters', filters)}
      />
      <WidgetConfigSection
        title={kpiDataConfig.metrics.label}
        canAdd={kpiDataConfig.metrics?.allowMultiple}
        onAdd={() => handleAddMetric()}
      >

        {Array.isArray(kpiConfig.metrics) && (
          <div className="space-y-3">
            {kpiConfig.metrics.map((metric: Metric, idx: number) => {
              const headerLabel = getHeaderLabel(metric);
              const isOnlyMetric = kpiConfig.metrics.length === 1;
              return (
                <CollapsibleSection
                  key={idx}
                  title={headerLabel}
                  canMoveDown={idx < kpiConfig.metrics.length - 1}
                  canMoveUp={idx > 0}
                  onDelete={() => handleMetricDelete(idx)}
                  hideSettings={kpiDataConfig.metrics?.allowMultiple && isOnlyMetric}
                  draggable={
                    kpiDataConfig.metrics?.allowMultiple && !isOnlyMetric
                  }
                  onDragStart={() => handleDragStart && handleDragStart(idx)}
                  onDragOver={(e) => handleDragOver && handleDragOver(idx, e)}
                  onDrop={() => handleDrop && handleDrop(idx)}

                  onMoveDown={() => handleMetricMoveDown(idx)}
                  onMoveUp={() => handleMetricMoveUp(idx)}

                >
                  <div className="flex flex-col gap-2 mt-2">
                    <SelectField
                      label="Agrégation"
                      value={metric.agg}
                      onChange={(e) =>
                        handleMetricAggChange(idx, e.target.value)
                      }
                      options={aggsOptions}
                      name={`metric-agg-${idx}`}
                      id={`metric-agg-${idx}`}
                    />
                    <SelectField
                      label="Champ"
                      value={metric.field}
                      onChange={(e) =>
                        handleMetricFieldChange(idx, e.target.value)
                      }
                      options={fieldOptions}
                      name={`metric-field-${idx}`}
                      id={`metric-field-${idx}`}
                    />
                    <InputField
                      label="Label"
                      value={metric.label || ""}
                      onChange={(e) => {
                        const target = e.target as HTMLInputElement;
                        handleMetricLabelChange(idx, target.value);
                      }}
                      name={`metric-label-${idx}`}
                      id={`metric-label-${idx}`}
                    />
                  </div>
                </CollapsibleSection>
              );
            })}
          </div>
        )}
      </WidgetConfigSection>
    </div>
  );
}
