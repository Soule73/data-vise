import type { ScatterMetricConfig } from "@type/metricBucketTypes";
import SelectField from "@components/SelectField";
import InputField from "@components/forms/InputField";
import DatasetSection from "@components/widgets/DatasetSection";
import DatasetFiltersConfig from "@components/widgets/DatasetFiltersConfig";
import type { WidgetScatterDataConfigSectionProps } from "@type/widgetTypes";

/**
 * Configuration spécialisée pour les graphiques scatter
 * Gère les champs X, Y et les filtres par dataset
 */
export default function WidgetScatterDataConfigSection({
  metrics,
  columns,
  data,
  handleConfigChange,
}: WidgetScatterDataConfigSectionProps) {

  const xOptions = Array.isArray(columns)
    ? columns.map((col) => ({ value: col, label: col }))
    : [];

  const yOptions = Array.isArray(columns)
    ? columns.map((col) => ({ value: col, label: col }))
    : [];



  const renderScatterDatasetContent = (dataset: ScatterMetricConfig, idx: number, onUpdate: (updatedDataset: ScatterMetricConfig) => void) => (
    <div className="grid gap-2 mt-2">
      <SelectField
        label="Champ X"
        value={dataset.x || ""}
        onChange={(e) => {
          onUpdate({ ...dataset, x: e.target.value });
        }}
        options={xOptions}
        name={`scatter-x-${idx}`}
        id={`scatter-x-${idx}`}
      />
      <SelectField
        label="Champ Y"
        value={dataset.y || ""}
        onChange={(e) => {
          onUpdate({ ...dataset, y: e.target.value });
        }}
        options={yOptions}
        name={`scatter-y-${idx}`}
        id={`scatter-y-${idx}`}
      />
      <InputField
        label="Label du dataset"
        value={dataset.label || ""}
        onChange={(e) => {
          const target = e.target as HTMLInputElement;
          onUpdate({ ...dataset, label: target.value });
        }}
        name={`scatter-label-${idx}`}
        id={`scatter-label-${idx}`}
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
    label: "",
  });

  const getDatasetLabel = (dataset: ScatterMetricConfig, idx: number) => {
    return dataset.label && dataset.label.trim() !== ""
      ? dataset.label
      : `Dataset ${idx + 1}`;
  };

  return (
    <div className="space-y-6">
      <DatasetSection
        title="Datasets (x, y)"
        datasets={metrics}
        onDatasetsChange={(newMetrics) => handleConfigChange("metrics", newMetrics)}
        createNewDataset={createNewDataset}
        renderDatasetContent={renderScatterDatasetContent}
        getDatasetLabel={getDatasetLabel}
      />
    </div>
  );
}
