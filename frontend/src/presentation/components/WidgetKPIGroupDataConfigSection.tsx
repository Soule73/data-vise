import SelectField from "@/presentation/components/SelectField";
import InputField from "@/presentation/components/InputField";
import Button from "@/presentation/components/Button";
import {
  XMarkIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/solid";
import { useMetricUICollapseStore } from "@/core/store/metricUI";
import type { WidgetDataConfigSectionProps } from "@/core/types/widget-types";
import type { MetricConfig } from "@/core/types/metric-bucket-types";
import type { KPIGroupWidgetConfig } from "@/core/types/visualization";

interface WidgetKPIGroupDataConfigSectionProps
  extends WidgetDataConfigSectionProps {
  data?: Record<string, unknown>[];
}

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

  return (
    <div className="space-y-4">
      {/* Filtres par KPI (centralisé dans config.filters) */}
      {Array.isArray(kpiConfig.metrics) &&
        kpiConfig.metrics.map((metric: MetricConfig, idx: number) => (
          <div
            key={idx}
            className="bg-gray-50 dark:bg-gray-800 rounded p-2 shadow mb-2"
          >
            <div className="font-semibold mb-1">
              Filtrer KPI {metric.label || metric.field || idx + 1}
            </div>
            <div className="flex flex-col gap-2">
              <SelectField
                label="Champ"
                value={filters[idx]?.field || ""}
                onChange={(e) => {
                  const newFilters = [...filters];
                  newFilters[idx] = {
                    ...(newFilters[idx] || {}),
                    field: e.target.value,
                    value: "",
                  };
                  handleConfigChange("filters", newFilters);
                }}
                options={[
                  { value: "", label: "-- Aucun --" },
                  ...columns.map((col) => ({ value: String(col), label: col })),
                  ...Array.from(
                    new Set(
                      (data || [])
                        .map((row) => row[filters[idx]?.field ?? ""])
                        .filter(
                          (val) =>
                            val !== undefined && val !== null && val !== ""
                        )
                    )
                  ).map((val) => ({ value: String(val), label: String(val) })),
                ]}
                name={`filter-field-${idx}`}
                id={`filter-field-${idx}`}
              />
              <SelectField
                label="Valeur"
                value={filters[idx]?.value || ""}
                onChange={(e) => {
                  const newFilters = [...filters];
                  newFilters[idx] = {
                    ...(newFilters[idx] || {}),
                    value: e.target.value,
                  };
                  handleConfigChange("filters", newFilters);
                }}
                options={
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
                              .filter(
                                (v) => v !== undefined && v !== null && v !== ""
                              )
                          )
                        ).map((v) => ({ value: String(v), label: String(v) })),
                      ]
                    : [{ value: "", label: "-- Choisir --" }]
                }
                name={`filter-value-${idx}`}
                id={`filter-value-${idx}`}
                disabled={!filters[idx]?.field}
              />
            </div>
          </div>
        ))}
      {/* Métriques (metrics) */}
      {kpiDataConfig.metrics?.label && (
        <div className="font-semibold mb-1">{kpiDataConfig.metrics.label}</div>
      )}
      {Array.isArray(kpiConfig.metrics) && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded p-2 shadow">
          <div className="space-y-1 divide-y divide-gray-300 dark:divide-gray-700 ">
            {kpiConfig.metrics.map((metric: MetricConfig, idx: number) => {
              const aggLabel =
                kpiDataConfig.metrics?.allowedAggs.find(
                  (a: any) => a.value === metric.agg
                )?.label ||
                metric.agg ||
                "";
              const fieldLabel = metric.field || "";
              const headerLabel = `${aggLabel}${
                fieldLabel ? " · " + fieldLabel : ""
              }`;
              const isOnlyMetric = kpiConfig.metrics.length === 1;
              return (
                <div
                  key={idx}
                  className="px-2 pb-2 flex flex-col relative group"
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
                    <span className="font-medium text-sm text-gray-700 dark:text-gray-300">
                      <ChevronDownIcon className="w-4 h-4 mr-1 inline-block" />
                      {headerLabel}
                    </span>
                    <div className="flex items-center gap-1">
                      {kpiDataConfig.metrics?.allowMultiple &&
                        !isOnlyMetric && (
                          <>
                            <button
                              className={`p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded ${
                                idx === 0 ? "opacity-50 cursor-not-allowed" : ""
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (idx === 0) return;
                                const newMetrics = [...kpiConfig.metrics];
                                [newMetrics[idx - 1], newMetrics[idx]] = [
                                  newMetrics[idx],
                                  newMetrics[idx - 1],
                                ];
                                handleConfigChange("metrics", newMetrics);
                              }}
                              disabled={idx === 0}
                              aria-disabled={idx === 0}
                              title="Monter"
                            >
                              <ChevronUpIcon className="w-4 h-4" />
                            </button>
                            <button
                              className={`p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded ${
                                idx === kpiConfig.metrics.length - 1
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (idx === kpiConfig.metrics.length - 1)
                                  return;
                                const newMetrics = [...kpiConfig.metrics];
                                [newMetrics[idx], newMetrics[idx + 1]] = [
                                  newMetrics[idx + 1],
                                  newMetrics[idx],
                                ];
                                handleConfigChange("metrics", newMetrics);
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
                            const newMetrics = kpiConfig.metrics.filter(
                              (_: any, i: number) => i !== idx
                            );
                            handleConfigChange("metrics", newMetrics);
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
                        onChange={(e) => {
                          if (handleMetricAggOrFieldChange) {
                            handleMetricAggOrFieldChange(
                              idx,
                              "agg",
                              e.target.value
                            );
                          } else {
                            const newMetrics = [...kpiConfig.metrics];
                            newMetrics[idx].agg = e.target.value;
                            handleConfigChange("metrics", newMetrics);
                          }
                        }}
                        options={kpiDataConfig.metrics?.allowedAggs}
                        name={`metric-agg-${idx}`}
                        id={`metric-agg-${idx}`}
                      />
                      <SelectField
                        label="Champ"
                        value={metric.field}
                        onChange={(e) => {
                          if (handleMetricAggOrFieldChange) {
                            handleMetricAggOrFieldChange(
                              idx,
                              "field",
                              e.target.value
                            );
                          } else {
                            const newMetrics = [...kpiConfig.metrics];
                            newMetrics[idx].field = e.target.value;
                            handleConfigChange("metrics", newMetrics);
                          }
                        }}
                        options={columns.map((col) => ({
                          value: col,
                          label: col,
                        }))}
                        name={`metric-field-${idx}`}
                        id={`metric-field-${idx}`}
                      />
                      <InputField
                        label="Label"
                        value={metric.label}
                        onChange={(e) => {
                          const newMetrics = [...kpiConfig.metrics];
                          newMetrics[idx].label = e.target.value;
                          handleConfigChange("metrics", newMetrics);
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
              onClick={() => {
                handleConfigChange("metrics", [
                  ...kpiConfig.metrics,
                  {
                    agg: kpiDataConfig.metrics.defaultAgg,
                    field: columns[1] || "",
                    label: "",
                  },
                ]);
              }}
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
