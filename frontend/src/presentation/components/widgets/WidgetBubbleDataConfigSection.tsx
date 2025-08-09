import SelectField from "@/presentation/components/SelectField";
import InputField from "@/presentation/components/forms/InputField";
import CommonMultiBucketSection from "@/presentation/components/widgets/CommonMultiBucketSection";
import DatasetSection from "@/presentation/components/widgets/DatasetSection";
import type { BubbleMetricConfig } from "@/core/types/metric-bucket-types";
import type { WidgetBubbleDataConfigSectionProps } from "@/core/types/widget-types";

export default function WidgetBubbleDataConfigSection({
  metrics,
  columns,
  handleConfigChange,
  config,
  availableFields,
}: WidgetBubbleDataConfigSectionProps) {
  const renderBubbleDatasetContent = (dataset: BubbleMetricConfig, idx: number, onUpdate: (updatedDataset: BubbleMetricConfig) => void) => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
      <SelectField
        label="Champ X"
        value={dataset.x || ""}
        onChange={(e) => {
          onUpdate({ ...dataset, x: e.target.value });
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
          onUpdate({ ...dataset, y: e.target.value });
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
          onUpdate({ ...dataset, r: e.target.value });
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
          onUpdate({ ...dataset, label: target.value });
        }}
        name={`bubble-label-${idx}`}
        id={`bubble-label-${idx}`}
      />
    </div>
  );

  const createNewDataset = () => ({
    agg: "none",
    field: "",
    x: columns[0] || "",
    y: columns[1] || "",
    r: columns[2] || "",
    label: "",
  });

  return (
    <div className="space-y-6">
      {/* Section Multi-Buckets avec le composant générique */}
      <CommonMultiBucketSection
        config={config}
        columns={columns}
        availableFields={availableFields}
        onConfigChange={handleConfigChange}
        sectionLabel="Buckets"
        allowMultiple={true}
      />

      {/* Section Datasets avec le composant générique */}
      <DatasetSection
        title="Datasets (x, y, r)"
        datasets={metrics}
        onDatasetsChange={(newMetrics) => handleConfigChange("metrics", newMetrics)}
        createNewDataset={createNewDataset}
        renderDatasetContent={renderBubbleDatasetContent}
      />
    </div>
  );
}
