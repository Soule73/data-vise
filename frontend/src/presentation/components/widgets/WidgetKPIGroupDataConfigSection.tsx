/* eslint-disable @typescript-eslint/no-explicit-any */
import SelectField from "@components/SelectField";
import InputField from "@components/forms/InputField";
import Button from "@components/forms/Button";
import {
  XMarkIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/solid";
import { useMetricUICollapseStore } from "@store/metricUI";
import type { WidgetKPIGroupDataConfigSectionProps } from "@type/widget-types";
import type { MetricConfig } from "@type/metric-bucket-types";
import type { KPIGroupWidgetConfig } from "@type/visualization";

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
  const collapsedMetrics = useMetricUICollapseStore((s) => s.collapsedMetrics);

  const toggleCollapse = useMetricUICollapseStore((s) => s.toggleCollapse);

  const kpiConfig = config as KPIGroupWidgetConfig;

  const kpiDataConfig = dataConfig as { metrics: any };

  const filters = (kpiConfig.filters ?? []) as {
    field: string;
    value: string;
  }[];

  const handleFilterFieldChange = (idx: number, value: string) => {
    const newFilters = [...filters];
    newFilters[idx] = {
      ...(newFilters[idx] || {}),
      field: value,
      value: "",
    };
    handleConfigChange("filters", newFilters);
  };

  const handleFilterValueChange = (idx: number, value: string) => {
    const newFilters = [...filters];
    newFilters[idx] = {
      ...(newFilters[idx] || {}),
      value,
    };
    handleConfigChange("filters", newFilters);
  };

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
      (_: any, i: number) => i !== idx
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

  const getFilterFieldOptions = (idx: number) => [
    { value: "", label: "-- Aucun --" },
    ...columns.map((col) => ({ value: String(col), label: col })),
    ...Array.from(
      new Set(
        (data || [])
          .map((row) => row[filters[idx]?.field ?? ""])
          .filter((val) => val !== undefined && val !== null && val !== "")
      )
    ).map((val) => ({ value: String(val), label: String(val) })),
  ];

  const getFilterValueOptions = (idx: number) =>
    filters[idx]?.field
      ? [
        { value: "", label: "-- Toutes --" },
        ...Array.from(
          new Set(
            (data || [])
              .map(
                (row: Record<string, unknown>) =>
                  row[filters[idx]?.field ?? ""]
              )
              .filter((v) => v !== undefined && v !== null && v !== "")
          )
        ).map((v) => ({ value: String(v), label: String(v) })),
      ]
      : [{ value: "", label: "-- Choisir --" }];

  const isFilterValueDisabled = (idx: number) => !filters[idx]?.field;

  const getAggLabel = (metric: MetricConfig) =>
    kpiDataConfig.metrics?.allowedAggs.find((a: any) => a.value === metric.agg)
      ?.label ||
    metric.agg ||
    "";

  const getFieldLabel = (metric: MetricConfig) => metric.field || "";

  const getHeaderLabel = (metric: MetricConfig) => {
    const aggLabel = getAggLabel(metric);
    const fieldLabel = getFieldLabel(metric);
    return `${aggLabel}${fieldLabel ? " · " + fieldLabel : ""}`;
  };

  return (
    <div className="space-y-6">
      {/* Filtres par KPI (centralisé dans config.filters) */}
      {Array.isArray(kpiConfig.metrics) &&
        kpiConfig.metrics.map((metric: MetricConfig, idx: number) => (
          <div
            key={idx}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
          >
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Filtrer KPI {metric.label || metric.field || idx + 1}
            </h3>
            <div className="space-y-3">
              <SelectField
                label="Champ"
                value={filters[idx]?.field || ""}
                onChange={(e) => handleFilterFieldChange(idx, e.target.value)}
                options={
                  Array.isArray(getFilterFieldOptions(idx))
                    ? getFilterFieldOptions(idx)
                    : []
                }
                name={`filter-field-${idx}`}
                id={`filter-field-${idx}`}
              />
              <SelectField
                label="Valeur"
                value={filters[idx]?.value || ""}
                onChange={(e) => handleFilterValueChange(idx, e.target.value)}
                options={
                  Array.isArray(getFilterValueOptions(idx))
                    ? getFilterValueOptions(idx)
                    : []
                }
                name={`filter-value-${idx}`}
                id={`filter-value-${idx}`}
                disabled={isFilterValueDisabled(idx)}
              />
            </div>
          </div>
        ))}
      {/* Métriques (metrics) */}
      {kpiDataConfig.metrics?.label && (
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">{kpiDataConfig.metrics.label}</h3>
      )}
      {Array.isArray(kpiConfig.metrics) && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="space-y-3">
            {kpiConfig.metrics.map((metric: MetricConfig, idx: number) => {
              const headerLabel = getHeaderLabel(metric);
              const isOnlyMetric = kpiConfig.metrics.length === 1;
              return (
                <div
                  key={idx}
                  className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3"
                  draggable={
                    kpiDataConfig.metrics?.allowMultiple && !isOnlyMetric
                  }
                  onDragStart={() => handleDragStart && handleDragStart(idx)}
                  onDragOver={(e) => handleDragOver && handleDragOver(idx, e)}
                  onDrop={() => handleDrop && handleDrop(idx)}
                >
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleCollapse(idx)}
                  >
                    <span className="font-medium text-sm text-gray-900 dark:text-white flex items-center">
                      <ChevronDownIcon className="w-4 h-4 mr-2" />
                      {headerLabel}
                    </span>
                    <div className="flex items-center gap-2">
                      {kpiDataConfig.metrics?.allowMultiple &&
                        !isOnlyMetric && (
                          <>
                            <button
                              className={`p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded ${idx === 0 ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMetricMoveUp(idx);
                              }}
                              disabled={idx === 0}
                              aria-disabled={idx === 0}
                              title="Monter"
                            >
                              <ChevronUpIcon className="w-4 h-4" />
                            </button>
                            <button
                              className={`p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded ${idx === kpiConfig.metrics.length - 1
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                                }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMetricMoveDown(idx);
                              }}
                              disabled={idx === kpiConfig.metrics.length - 1}
                              aria-disabled={
                                idx === kpiConfig.metrics.length - 1
                              }
                              title="Descendre"
                            >
                              <ChevronDownIcon className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      {!isOnlyMetric && (
                        <button
                          className="p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMetricDelete(idx);
                          }}
                          title="Supprimer"
                        >
                          <XMarkIcon className="w-5 h-5 text-red-500" />
                        </button>
                      )}
                    </div>
                  </div>
                  {!collapsedMetrics[idx] && (
                    <div className="flex flex-col gap-2 mt-2">
                      <SelectField
                        label="Agrégation"
                        value={metric.agg}
                        onChange={(e) =>
                          handleMetricAggChange(idx, e.target.value)
                        }
                        options={
                          Array.isArray(kpiDataConfig.metrics?.allowedAggs)
                            ? kpiDataConfig.metrics.allowedAggs
                            : []
                        }
                        name={`metric-agg-${idx}`}
                        id={`metric-agg-${idx}`}
                      />
                      <SelectField
                        label="Champ"
                        value={metric.field}
                        onChange={(e) =>
                          handleMetricFieldChange(idx, e.target.value)
                        }
                        options={
                          Array.isArray(columns)
                            ? columns.map((col) => ({ value: col, label: col }))
                            : []
                        }
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
                  )}
                </div>
              );
            })}
          </div>
          {kpiDataConfig.metrics?.allowMultiple && (
            <Button
              color="indigo"
              className="mt-2 w-max mx-auto !bg-gray-300 dark:!bg-gray-700 hover:!bg-gray-200 dark:hover:!bg-gray-600 !border-none"
              variant="outline"
              onClick={handleAddMetric}
              disabled={!kpiDataConfig.metrics.allowMultiple}
            >
              <PlusCircleIcon className="w-5 h-5 mr-1" />
              Ajouter
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
