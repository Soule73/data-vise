import type { ScatterMetricConfig } from "@/core/types/metric-bucket-types";
import SelectField from "@/presentation/components/SelectField";
import InputField from "@/presentation/components/forms/InputField";
import MultiBucketSection from "@/presentation/components/widgets/MultiBucketSection";
import { XMarkIcon, PlusCircleIcon } from "@heroicons/react/24/solid";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import type { WidgetScatterDataConfigSectionProps } from "@/core/types/widget-types";

export default function WidgetScatterDataConfigSection({
  metrics,
  columns,
  handleConfigChange,
  config,
  availableFields,
}: WidgetScatterDataConfigSectionProps) {
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({});
  const toggleCollapse = (idx: number) =>
    setCollapsed((prev) => ({ ...prev, [idx]: !prev[idx] }));

  return (
    <div className="space-y-6">
      {/* Section Multi-Buckets */}
      <MultiBucketSection
        buckets={config?.buckets || []}
        columns={availableFields || columns}
        allowMultiple={true}
        sectionLabel="Buckets"
        onBucketsChange={(buckets) => handleConfigChange("buckets", buckets)}
      />

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Datasets (x, y)</h3>
        <div className="space-y-3">
          {metrics.map((dataset: ScatterMetricConfig, idx: number) => (
            <div
              key={idx}
              className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3"
            >
              <div
                className="flex gap-2 items-center cursor-pointer mb-3"
                onClick={() => toggleCollapse(idx)}
              >
                <button
                  type="button"
                  className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
                  tabIndex={-1}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCollapse(idx);
                  }}
                  aria-label={collapsed[idx] ? "Déplier" : "Replier"}
                >
                  {collapsed[idx] ? (
                    <ChevronDownIcon className="w-4 h-4" />
                  ) : (
                    <ChevronUpIcon className="w-4 h-4" />
                  )}
                </button>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  {dataset.label && dataset.label.trim() !== ""
                    ? dataset.label
                    : `Dataset ${idx + 1}`}
                </h4>
                {metrics.length > 1 && (
                  <button
                    className="ml-auto p-1.5 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-md transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      const newMetrics = metrics.filter(
                        (_: ScatterMetricConfig, i: number) => i !== idx
                      );
                      handleConfigChange("metrics", newMetrics);
                    }}
                    title="Supprimer ce dataset"
                  >
                    <XMarkIcon className="w-4 h-4 text-red-500" />
                  </button>
                )}
              </div>
              {!collapsed[idx] && (
                <div className="grid gap-2 mt-2">
                  <SelectField
                    label="Champ X"
                    value={dataset.x || ""}
                    onChange={(e) => {
                      const newMetrics = [...metrics];
                      newMetrics[idx] = { ...dataset, x: e.target.value };
                      handleConfigChange("metrics", newMetrics);
                    }}
                    options={
                      Array.isArray(columns)
                        ? columns.map((col) => ({ value: col, label: col }))
                        : []
                    }
                    name={`scatter-x-${idx}`}
                    id={`scatter-x-${idx}`}
                  />
                  <SelectField
                    label="Champ Y"
                    value={dataset.y || ""}
                    onChange={(e) => {
                      const newMetrics = [...metrics];
                      newMetrics[idx] = { ...dataset, y: e.target.value };
                      handleConfigChange("metrics", newMetrics);
                    }}
                    options={
                      Array.isArray(columns)
                        ? columns.map((col) => ({ value: col, label: col }))
                        : []
                    }
                    name={`scatter-y-${idx}`}
                    id={`scatter-y-${idx}`}
                  />
                  <InputField
                    label="Label du dataset"
                    value={dataset.label || ""}
                    onChange={(e) => {
                      const target = e.target as HTMLInputElement;
                      const newMetrics = [...metrics];
                      newMetrics[idx] = { ...dataset, label: target.value };
                      handleConfigChange("metrics", newMetrics);
                    }}
                    name={`scatter-label-${idx}`}
                    id={`scatter-label-${idx}`}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
        <button
          className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/40 transition-colors inline-flex items-center mx-auto mt-3"
          onClick={() => {
            handleConfigChange("metrics", [
              ...metrics,
              {
                agg: "none",
                field: "",
                x: columns[0] || "",
                y: columns[1] || "",
                label: "",
              },
            ]);
          }}
        >
          <PlusCircleIcon className="w-4 h-4 mr-2" />
          Ajouter un dataset
        </button>
      </div>
    </div>
  );
}
