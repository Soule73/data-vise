/* eslint-disable @typescript-eslint/no-explicit-any */
import SelectField from "@components/SelectField";
import Button from "@components/forms/Button";
import {
  XMarkIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/solid";
import { useMetricUICollapseStore } from "@store/metricUI";
import type { WidgetDataConfigSectionFixedProps } from "@type/widget-types";
import WidgetBubbleDataConfigSection from "@components/widgets/WidgetBubbleDataConfigSection";
import WidgetScatterDataConfigSection from "@components/widgets/WidgetScatterDataConfigSection";
import WidgetRadarDataConfigSection from "@components/widgets/WidgetRadarDataConfigSection";
import WidgetKPIGroupDataConfigSection from "@components/widgets/WidgetKPIGroupDataConfigSection";
import MultiBucketSection from "@components/widgets/MultiBucketSection";
import { WIDGETS, WIDGET_DATA_CONFIG } from "@adapters/visualizations";
import { useMultiBuckets } from "@hooks/useMultiBuckets";
import MetricLabelInput from "@components/widgets/MetricLabelInput";
import type { BubbleMetricConfig, RadarMetricConfig } from "@type/metric-bucket-types";

export default function WidgetDataConfigSection({
  type,
  dataConfig,
  config,
  columns,
  handleConfigChange,
  handleDragStart,
  handleDragOver,
  handleDrop,
  handleMetricAggOrFieldChange,
  data = [],
}: WidgetDataConfigSectionFixedProps) {
  const widgetDef = WIDGETS[type];
  const collapsedMetrics = useMetricUICollapseStore((s) => s.collapsedMetrics);
  const toggleCollapse = useMetricUICollapseStore((s) => s.toggleCollapse);

  // Hook pour gérer les buckets multiples
  const dataConfigForWidget = WIDGET_DATA_CONFIG[type];
  const {
    buckets: currentBuckets,
    handleBucketsChange,
  } = useMultiBuckets({
    config,
    columns,
    allowMultiple: dataConfigForWidget.buckets?.allowMultiple,
    onConfigChange: handleConfigChange,
  });

  if (type === "bubble") {
    return (
      <WidgetBubbleDataConfigSection
        metrics={
          Array.isArray(config.metrics)
            ? (config.metrics as BubbleMetricConfig[])
            : []
        }
        columns={columns}
        handleConfigChange={handleConfigChange}
      />
    );
  }
  if (type === "scatter") {
    return (
      <WidgetScatterDataConfigSection
        metrics={
          Array.isArray(config.metrics)
            ? (config.metrics as BubbleMetricConfig[])
            : []
        }
        columns={columns}
        handleConfigChange={handleConfigChange}
      />
    );
  }
  if (type === "radar") {
    return (
      <WidgetRadarDataConfigSection
        metrics={
          Array.isArray(config.metrics)
            ? (config.metrics as RadarMetricConfig[])
            : []
        }
        columns={columns}
        handleConfigChange={handleConfigChange}
        configSchema={{ dataConfig }}
        data={data}
      />
    );
  }
  if (type === "kpi_group") {
    return (
      <WidgetKPIGroupDataConfigSection
        dataConfig={dataConfig}
        config={config}
        columns={columns}
        handleConfigChange={handleConfigChange}
        handleDragStart={handleDragStart}
        handleDragOver={handleDragOver}
        handleDrop={handleDrop}
        handleMetricAggOrFieldChange={handleMetricAggOrFieldChange}
        data={data}
      />
    );
  }
  {/* Section filtre simple pour KPI (champ + valeur) */ }
  const showFilter = widgetDef?.enableFilter;
  return (
    <div className="space-y-6">
      {/* Section filtre pour KPI */}
      {showFilter && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Filtrer</h3>
          <div className="space-y-3">
            <SelectField
              label="Champ"
              value={config.filter?.field || ""}
              onChange={(e) =>
                handleConfigChange("filter", {
                  ...config.filter,
                  field: e.target.value,
                  value: "",
                })
              }
              options={[
                { value: "", label: "-- Aucun --" },
                ...columns.map((col) => ({ value: col, label: col })),
              ]}
              name="filter-field"
              id="filter-field"
            />
            <SelectField
              label="Valeur"
              value={config.filter?.value || ""}
              onChange={(e) =>
                handleConfigChange("filter", {
                  ...config.filter,
                  value: e.target.value,
                })
              }
              options={
                config.filter?.field
                  ? [
                    { value: "", label: "-- Toutes --" },
                    ...Array.from(
                      new Set(
                        (data || [])
                          .map((row) =>
                            config?.filter?.field !== undefined
                              ? row[config.filter.field]
                              : undefined
                          )
                          .filter(
                            (v) => v !== undefined && v !== null && v !== ""
                          )
                      )
                    ).map((v) => ({ value: v, label: String(v) })),
                  ]
                  : [{ value: "", label: "-- Choisir --" }]
              }
              name="filter-value"
              id="filter-value"
              disabled={!config.filter?.field}
            />
          </div>
        </div>
      )}

      {/* Métriques (metrics) */}
      {dataConfig.metrics.label && config.metrics && Array.isArray(config.metrics) && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">{dataConfig.metrics.label}</h3>
          <div className="space-y-3">
            {config.metrics.map((metric: any, idx: number) => {
              const aggLabel =
                dataConfig.metrics.allowedAggs?.find(
                  (a: any) => a.value === metric.agg
                )?.label ||
                metric.agg ||
                "";
              const fieldLabel = metric.field || "";
              const headerLabel = `${aggLabel}${fieldLabel ? " · " + fieldLabel : ""
                }`;
              const isOnlyMetric = config.metrics.length === 1;
              return (
                <div
                  key={idx}
                  className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3"
                  draggable={dataConfig.metrics.allowMultiple && !isOnlyMetric}
                  onDragStart={() => handleDragStart(idx)}
                  onDragOver={(e) => handleDragOver(idx, e)}
                  onDrop={() => handleDrop(idx)}
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
                      {dataConfig.metrics.allowMultiple && !isOnlyMetric && (
                        <>
                          <button
                            className={`p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors ${idx === 0 ? "opacity-50 cursor-not-allowed" : ""
                              }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (idx === 0) return;
                              const newMetrics = [...config.metrics];
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
                            className={`p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors ${idx === config.metrics.length - 1
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                              }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (idx === config.metrics.length - 1) return;
                              const newMetrics = [...config.metrics];
                              [newMetrics[idx], newMetrics[idx + 1]] = [
                                newMetrics[idx + 1],
                                newMetrics[idx],
                              ];
                              handleConfigChange("metrics", newMetrics);
                            }}
                            disabled={idx === config.metrics.length - 1}
                            aria-disabled={idx === config.metrics.length - 1}
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
                            const newMetrics = config.metrics.filter(
                              (_, i: number) => i !== idx
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
                            const newMetrics = [...config.metrics];
                            newMetrics[idx].agg = e.target.value;
                            handleConfigChange("metrics", newMetrics);
                          }
                        }}
                        options={
                          Array.isArray(dataConfig.metrics.allowedAggs)
                            ? dataConfig.metrics.allowedAggs
                            : []
                        }
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
                            const newMetrics = [...config.metrics];
                            newMetrics[idx].field = e.target.value;
                            handleConfigChange("metrics", newMetrics);
                          }
                        }}
                        options={
                          Array.isArray(columns)
                            ? columns.map((col) => ({ value: col, label: col }))
                            : []
                        }
                        name={`metric-field-${idx}`}
                        id={`metric-field-${idx}`}
                      />
                      <MetricLabelInput
                        value={metric.label || ""}
                        onChange={(newValue) => {

                          const newMetrics = [...config.metrics];
                          newMetrics[idx] = { ...newMetrics[idx], label: newValue };


                          handleConfigChange("metrics", newMetrics);
                        }}
                        name={`metric-label-${idx}`}
                        id={`metric-label-${idx}`}
                        metricIndex={idx}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {dataConfig.metrics.allowMultiple && (
            <Button
              color="indigo"
              className="mt-2 w-max mx-auto !bg-gray-300 dark:!bg-gray-700 hover:!bg-gray-200 dark:hover:!bg-gray-600 !border-none"
              variant="outline"
              onClick={() => {
                handleConfigChange("metrics", [
                  ...config.metrics,
                  {
                    agg: dataConfig.metrics.defaultAgg,
                    field: columns[1] || "",
                    label: "",
                  },
                ]);
              }}
              disabled={!dataConfig.metrics.allowMultiple}
            >
              <PlusCircleIcon className="w-5 h-5 mr-1" />
              Ajouter
            </Button>
          )}
        </div>
      )}
      {/* Buckets multiples (nouveaux) ou bucket legacy */}
      {widgetDef && !widgetDef.hideBucket && (
        (() => {
          // Prioriser les buckets multiples si supportés
          if (dataConfigForWidget.buckets?.allow) {
            return (
              <MultiBucketSection
                buckets={currentBuckets}
                columns={columns}
                data={data}
                allowMultiple={dataConfigForWidget.buckets.allowMultiple}
                sectionLabel={dataConfigForWidget.buckets.label || "Buckets"}
                onBucketsChange={handleBucketsChange}
              />
            );
          }

          // Fallback vers l'ancien système de buckets
          if (dataConfig.bucket && dataConfig.bucket.allow) {
            return (
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleCollapse("bucket")}
                >
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Champ de groupement</h3>
                  <button
                    className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-md transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleConfigChange("bucket", {
                        field: "",
                      });
                    }}
                    title="Réinitialiser"
                  >
                    <XMarkIcon className="w-4 h-4 text-red-500" />
                  </button>
                </div>
                {!collapsedMetrics["bucket"] && (
                  <div className="space-y-3 mt-3">
                    <SelectField
                      label="Champ"
                      value={config.bucket?.field}
                      onChange={(e) =>
                        handleConfigChange("bucket", {
                          ...config.bucket,
                          field: e.target.value,
                        })
                      }
                      options={columns.map((col) => ({ value: col, label: col }))}
                      name="bucket-field"
                      id="bucket-field"
                    />
                  </div>
                )}
              </div>
            );
          }

          return null;
        })()
      )}
    </div>
  );
}
