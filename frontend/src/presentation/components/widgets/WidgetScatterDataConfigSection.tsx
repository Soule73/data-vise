import type { ScatterMetricConfig } from "@type/metric-bucket-types";
import SelectField from "@components/SelectField";
import InputField from "@components/forms/InputField";
import DatasetSection from "@components/widgets/DatasetSection";
import { useState } from "react";
import type { WidgetScatterDataConfigSectionProps } from "@type/widget-types";

export default function WidgetScatterDataConfigSection({
  metrics,
  columns,
  handleConfigChange,
}: WidgetScatterDataConfigSectionProps) {
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({});

  const toggleCollapse = (idx: number) =>
    setCollapsed((prev) => ({ ...prev, [idx]: !prev[idx] }));

  const renderScatterDatasetContent = (dataset: ScatterMetricConfig, idx: number, onUpdate: (updatedDataset: ScatterMetricConfig) => void) => (
    <div className="grid gap-2 mt-2">
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
        name={`scatter-x-${idx}`}
        id={`scatter-x-${idx}`}
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
      {/* Section Datasets avec le composant générique */}
      <DatasetSection
        title="Datasets (x, y)"
        datasets={metrics}
        onDatasetsChange={(newMetrics) => handleConfigChange("metrics", newMetrics)}
        createNewDataset={createNewDataset}
        renderDatasetContent={renderScatterDatasetContent}
        collapsible={true}
        collapsedState={collapsed}
        onToggleCollapse={toggleCollapse}
        getDatasetLabel={getDatasetLabel}
      />
    </div>
  );
}
