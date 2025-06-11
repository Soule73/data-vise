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
import type { WidgetDataConfigSectionProps } from "@/core/types/ui";

export default function WidgetDataConfigSection({
  dataConfig,
  config,
  columns,
  handleConfigChange,
  handleDragStart,
  handleDragOver,
  handleDrop,
  handleMetricAggOrFieldChange,
}: WidgetDataConfigSectionProps) {
  const collapsedMetrics = useMetricUICollapseStore((s) => s.collapsedMetrics);
  const toggleCollapse = useMetricUICollapseStore((s) => s.toggleCollapse);
  return (
    <div className="space-y-4">
      {/* Métriques (metrics) */}
      {dataConfig.metrics.label && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded p-2 shadow">
          <div className="font-semibold mb-1">{dataConfig.metrics.label}</div>
          <div className="space-y-1 divide-y divide-gray-300 dark:divide-gray-700 ">
            {config.metrics.map((metric: any, idx: number) => {
              const aggLabel =
                dataConfig.metrics.allowedAggs.find(
                  (a: any) => a.value === metric.agg
                )?.label ||
                metric.agg ||
                "";
              const fieldLabel = metric.field || "";
              const headerLabel = `${aggLabel}${
                fieldLabel ? " · " + fieldLabel : ""
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
                            className={`p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded ${
                              idx === 0 ? "opacity-50 cursor-not-allowed" : ""
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
                            className={`p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded ${
                              idx === config.metrics.length - 1
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
                            const newMetrics = [...config.metrics];
                            newMetrics[idx].agg = e.target.value;
                            handleConfigChange("metrics", newMetrics);
                          }
                        }}
                        options={dataConfig.metrics.allowedAggs}
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
            >
              <PlusCircleIcon className="w-5 h-5 mr-1" />
              Ajouter
            </Button>
          )}
        </div>
      )}
      {/* Buckets (x-axis/groupBy) */}
      {dataConfig.bucket.allow && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded p-2 shadow flex flex-col relative group">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => toggleCollapse("bucket")}
          >
            <span className="font-medium">Champ de groupement</span>
            <button
              className="p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded"
              onClick={(e) => {
                e.stopPropagation();
                handleConfigChange("bucket", {
                  field: "",
                  type: dataConfig.bucket.typeLabel || "x",
                  label: dataConfig.bucket.label || "",
                });
              }}
              title="Réinitialiser"
            >
              <XMarkIcon className="w-5 h-5 text-red-500" />
            </button>
          </div>
          {!collapsedMetrics["bucket"] && (
            <div className="flex flex-col gap-2 mt-2">
              <SelectField
                label="Champ"
                value={config.bucket?.field}
                onChange={(e) =>
                  handleConfigChange("bucket", {
                    ...config.bucket,
                    field: e.target.value,
                    label: config.bucket?.label || dataConfig.bucket.label,
                  })
                }
                options={columns.map((col) => ({ value: col, label: col }))}
                name="bucket-field"
                id="bucket-field"
              />
              <InputField
                label="Label du champ de groupement"
                value={config.bucket?.label ?? dataConfig.bucket.label}
                onChange={(e) =>
                  handleConfigChange("bucket", {
                    ...config.bucket,
                    label: e.target.value,
                  })
                }
                name="bucket-label"
                id="bucket-label"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
