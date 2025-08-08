/* eslint-disable @typescript-eslint/no-explicit-any */
import SelectField from "@/presentation/components/SelectField";
import InputField from "@/presentation/components/forms/InputField";
import Button from "@/presentation/components/forms/Button";
import {
  XMarkIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/solid";
import { useMetricUICollapseStore } from "@/core/store/metricUI";
import type { WidgetDataConfigSectionFixedProps } from "@/core/types/widget-types";
import WidgetBubbleDataConfigSection from "@/presentation/components/widgets/WidgetBubbleDataConfigSection";
import WidgetScatterDataConfigSection from "@/presentation/components/widgets/WidgetScatterDataConfigSection";
import WidgetRadarDataConfigSection from "@/presentation/components/widgets/WidgetRadarDataConfigSection";
import WidgetKPIGroupDataConfigSection from "@/presentation/components/widgets/WidgetKPIGroupDataConfigSection";
import ColumnDisplay from "@/presentation/components/widgets/ColumnDisplay";
import BucketConfigEditor from "@/presentation/components/widgets/BucketConfigEditor";
import { WIDGETS } from "@/data/adapters/visualizations";
import type {
  BubbleMetricConfig,
  RadarMetricConfig,
} from "@/core/types/metric-bucket-types";

export default function WidgetDataConfigSection({
  type,
  dataConfig,
  config,
  columns,
  columnInfos = [],
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
    <div className="space-y-4">
      {/* Affichage des colonnes avec types */}
      {columnInfos.length > 0 && (
        <ColumnDisplay
          columns={columnInfos}
          className="mb-4"
        />
      )}
      
      {/* Section filtre pour KPI */}
      {showFilter && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded p-2 shadow">
          <div className="font-semibold mb-1">Filtrer</div>
          <div className="flex flex-col gap-2">
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
      {dataConfig.metrics.label && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded p-2 shadow">
          <div className="font-semibold mb-1">{dataConfig.metrics.label}</div>
          <div className="space-y-1 divide-y divide-gray-300 dark:divide-gray-700 ">
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
                  className="px-2 pb-2 flex flex-col relative group"
                  draggable={dataConfig.metrics.allowMultiple && !isOnlyMetric}
                  onDragStart={() => handleDragStart(idx)}
                  onDragOver={(e) => handleDragOver(idx, e)}
                  onDrop={() => handleDrop(idx)}
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
                      {dataConfig.metrics.allowMultiple && !isOnlyMetric && (
                        <>
                          <button
                            className={`p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded ${idx === 0 ? "opacity-50 cursor-not-allowed" : ""
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
                            className={`p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded ${idx === config.metrics.length - 1
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
                      <InputField
                        label="Label"
                        value={metric.label}
                        onChange={(e) => {
                          const newMetrics = [...config.metrics];
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
      {/* Buckets (x-axis/groupBy) - Configuration avancée comme Kibana */}
      {widgetDef &&
        !widgetDef.hideBucket &&
        dataConfig.bucket &&
        dataConfig.bucket.allow && (
          <BucketConfigEditor
            config={config.bucket || { field: "", type: "terms" }}
            onChange={(bucketConfig) => handleConfigChange("bucket", bucketConfig)}
            availableColumns={columnInfos}
            label="Groupement des données"
            description="Configurez comment grouper vos données (comme dans Kibana)"
          />
        )}
    </div>
  );
}
