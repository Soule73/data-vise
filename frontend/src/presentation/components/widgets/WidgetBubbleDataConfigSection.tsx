import SelectField from "@components/SelectField";
import InputField from "@components/forms/InputField";
import DatasetSection from "@components/widgets/DatasetSection";
import DatasetFiltersConfig from "@components/widgets/DatasetFiltersConfig";
import type { BubbleMetricConfig } from "@type/metricBucketTypes";
import type { WidgetBubbleDataConfigSectionProps } from "@type/widgetTypes";

/**
 * Configuration spécialisée pour les graphiques bubble
 * Gère les champs X, Y, R et les filtres par dataset
 */
export default function WidgetBubbleDataConfigSection({
  metrics,
  columns,
  data,
  handleConfigChange,
}: WidgetBubbleDataConfigSectionProps) {

  const xOptions = Array.isArray(columns)
    ? columns.map((col) => ({ value: col, label: col }))
    : [];

  const yOptions = Array.isArray(columns)
    ? columns.map((col) => ({ value: col, label: col }))
    : [];

  const rOptions = Array.isArray(columns)
    ? columns.map((col) => ({ value: col, label: col }))
    : [];

  const renderBubbleDatasetContent = (dataset: BubbleMetricConfig, idx: number, onUpdate: (updatedDataset: BubbleMetricConfig) => void) => (
    <div className="grid gap-2">
      <SelectField
        textSize="sm"
        label="Champ X"
        value={dataset.x || ""}
        onChange={(e) => {
          onUpdate({ ...dataset, x: e.target.value });
        }}
        options={xOptions}
        name={`bubble-x-${idx}`}
        id={`bubble-x-${idx}`}
      />
      <SelectField
        textSize="sm"
        label="Champ Y"
        value={dataset.y || ""}
        onChange={(e) => {
          onUpdate({ ...dataset, y: e.target.value });
        }}
        options={yOptions}
        name={`bubble-y-${idx}`}
        id={`bubble-y-${idx}`}
      />
      <SelectField
        textSize="sm"
        label="Champ Rayon (r)"
        value={dataset.r || ""}
        onChange={(e) => {
          onUpdate({ ...dataset, r: e.target.value });
        }}
        options={rOptions}
        name={`bubble-r-${idx}`}
        id={`bubble-r-${idx}`}
      />
      <InputField
        textSize="sm"
        label="Label du dataset"
        value={dataset.label || ""}
        onChange={(e) => {
          const target = e.target as HTMLInputElement;
          onUpdate({ ...dataset, label: target.value });
        }}
        name={`bubble-label-${idx}`}
        id={`bubble-label-${idx}`}
      />
      <DatasetFiltersConfig
        filters={dataset.datasetFilters || []}
        columns={columns}
        data={data}
        onFiltersChange={(filters) => onUpdate({ ...dataset, datasetFilters: filters })}
        datasetIndex={idx}
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
