import SelectField from "@/presentation/components/SelectField";
import InputField from "@/presentation/components/forms/InputField";
import { XMarkIcon, PlusCircleIcon } from "@heroicons/react/24/solid";
import MultiBucketSection from "@/presentation/components/widgets/MultiBucketSection";
import type { BubbleMetricConfig } from "@/core/types/metric-bucket-types";
import type { WidgetBubbleDataConfigSectionProps } from "@/core/types/widget-types";

export default function WidgetBubbleDataConfigSection({
  metrics,
  columns,
  handleConfigChange,
  config,
  availableFields,
}: WidgetBubbleDataConfigSectionProps) {
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
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Datasets (x, y, r)</h3>
        <div className="space-y-3">
          {metrics.map((dataset: BubbleMetricConfig, idx: number) => (
            <div
              key={idx}
              className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3"
            >
              <div className="flex gap-2 items-center mb-3">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Dataset {idx + 1}
                </h4>
                {metrics.length > 1 && (
                  <button
                    className="ml-auto p-1.5 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-md transition-colors"
                    onClick={() => {
                      const newMetrics = metrics.filter(
                        (_: BubbleMetricConfig, i: number) => i !== idx
                      );
                      handleConfigChange("metrics", newMetrics);
                    }}
                    title="Supprimer ce dataset"
                  >
                    <XMarkIcon className="w-4 h-4 text-red-500" />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
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
                  name={`bubble-x-${idx}`}
                  id={`bubble-x-${idx}`}
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
                  name={`bubble-y-${idx}`}
                  id={`bubble-y-${idx}`}
                />
                <SelectField
                  label="Champ Rayon (r)"
                  value={dataset.r || ""}
                  onChange={(e) => {
                    const newMetrics = [...metrics];
                    newMetrics[idx] = { ...dataset, r: e.target.value };
                    handleConfigChange("metrics", newMetrics);
                  }}
                  options={
                    Array.isArray(columns)
                      ? columns.map((col) => ({ value: col, label: col }))
                      : []
                  }
                  name={`bubble-r-${idx}`}
                  id={`bubble-r-${idx}`}
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
                  name={`bubble-label-${idx}`}
                  id={`bubble-label-${idx}`}
                />
              </div>
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
                r: columns[2] || "",
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
