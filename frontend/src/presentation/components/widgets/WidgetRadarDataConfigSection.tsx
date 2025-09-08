import InputField from "@components/forms/InputField";
import CheckboxField from "@components/forms/CheckboxField";
import DatasetSection from "@components/widgets/DatasetSection";
import DatasetFiltersConfig from "@components/widgets/DatasetFiltersConfig";
import type { WidgetRadarDataConfigSectionProps } from "@type/widgetTypes";
import type { RadarMetricConfig } from "@type/metricBucketTypes";

/**
 * Configuration spécialisée pour les graphiques radar
 * Gère les champs/axes multiples et les filtres par dataset
 */
export default function WidgetRadarDataConfigSection({
  metrics,
  columns,
  handleConfigChange,
  configSchema,
  data = [],
}: WidgetRadarDataConfigSectionProps) {

  const axisFields: string[] = configSchema?.dataConfig?.axisFields || columns;

  const renderRadarDatasetContent = (dataset: RadarMetricConfig, idx: number, onUpdate: (updatedDataset: RadarMetricConfig) => void) => (
    <div className="space-y-3">
      <InputField
        label="Label du dataset"
        value={dataset.label || ""}
        onChange={(e) => {
          const target = e.target as HTMLInputElement;
          onUpdate({ ...dataset, label: target.value });
        }}
        name={`radar-label-${idx}`}
        id={`radar-label-${idx}`}
      />
      <div>
        <div className="font-medium text-xs mb-1">
          Axes (champs à comparer)
        </div>
        <div className=" grid md:grid-cols-2 gap-2 lg:grid-cols-3">
          {axisFields.map((col: string, colIdx: number) => (
            <CheckboxField
              key={colIdx}
              label={col}
              checked={
                Array.isArray(dataset.fields) &&
                dataset.fields.includes(col)
              }
              onChange={(checked: boolean) => {
                const newFields = Array.isArray(dataset.fields)
                  ? [...dataset.fields]
                  : [];
                if (checked) {
                  newFields.push(col);
                } else {
                  const idxToRemove = newFields.indexOf(col);
                  if (idxToRemove > -1)
                    newFields.splice(idxToRemove, 1);
                }
                onUpdate({ ...dataset, fields: newFields });
              }}
              name={`radar-axis-${idx}-${col}`}
              id={`radar-axis-${idx}-${col}`}
            />
          ))}
        </div>
      </div>

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
    agg: "count",
    field: columns[0] || "",
    label: "",
    fields: [columns[0] || ""],
  });

  const getDatasetLabel = (dataset: RadarMetricConfig, idx: number) => {
    return dataset.label && dataset.label.trim() !== ""
      ? dataset.label
      : `Dataset ${idx + 1}`;
  };

  return (
    <div className="space-y-6">
      <DatasetSection
        title="Datasets (axes multiples)"
        datasets={metrics}
        onDatasetsChange={(newMetrics) => handleConfigChange("metrics", newMetrics)}
        createNewDataset={createNewDataset}
        renderDatasetContent={renderRadarDatasetContent}
        getDatasetLabel={getDatasetLabel}
      />
    </div>
  );
}
