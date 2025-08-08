import SelectField from "@/presentation/components/SelectField";
import InputField from "@/presentation/components/forms/InputField";
import CheckboxField from "@/presentation/components/forms/CheckboxField";
import MultiBucketSection from "@/presentation/components/widgets/MultiBucketSection";
import {
  XMarkIcon,
  PlusCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/solid";
import { useState } from "react";
import type { WidgetRadarDataConfigSectionProps } from "@/core/types/widget-types";
import type { RadarMetricConfig } from "@/core/types/metric-bucket-types";

export default function WidgetRadarDataConfigSection({
  metrics,
  columns,
  handleConfigChange,
  configSchema,
  data = [],
  config,
  availableFields,
}: WidgetRadarDataConfigSectionProps) {

  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({});

  const toggleCollapse = (idx: number) =>
    setCollapsed((prev) => ({ ...prev, [idx]: !prev[idx] }));

  const groupByFields: string[] =
    configSchema?.dataConfig?.groupByFields || columns;

  const axisFields: string[] = configSchema?.dataConfig?.axisFields || columns;

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
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Datasets (axes multiples)</h3>
        <div className="space-y-3">
          {metrics.map((dataset: RadarMetricConfig, idx: number) => (
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
                        (_: RadarMetricConfig, i: number) => i !== idx
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
                <div className="space-y-3">
                  <InputField
                    label="Label du dataset"
                    value={dataset.label || ""}
                    onChange={(e) => {
                      const newMetrics = [...metrics];
                      newMetrics[idx] = { ...dataset, label: e.target.value };
                      handleConfigChange("metrics", newMetrics);
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
                            const newMetrics = [...metrics];
                            newMetrics[idx] = { ...dataset, fields: newFields };
                            handleConfigChange("metrics", newMetrics);
                          }}
                          name={`radar-axis-${idx}-${col}`}
                          id={`radar-axis-${idx}-${col}`}
                        />
                      ))}
                    </div>
                  </div>
                  <SelectField
                    label="Grouper par (optionnel)"
                    value={dataset.groupBy || ""}
                    onChange={(e) => {
                      const newMetrics = [...metrics];
                      newMetrics[idx] = {
                        ...dataset,
                        groupBy: e.target.value,
                        groupByValue: "",
                      };
                      handleConfigChange("metrics", newMetrics);
                    }}
                    options={[
                      { value: "", label: "-- Aucun --" },
                      ...groupByFields.map((col: string) => ({
                        value: col,
                        label: col,
                      })),
                    ]}
                    name={`radar-groupby-${idx}`}
                    id={`radar-groupby-${idx}`}
                  />
                  {dataset.groupBy && (
                    <SelectField
                      label={`Valeur pour "${dataset.groupBy}"`}
                      value={dataset.groupByValue || ""}
                      onChange={(e) => {
                        const newMetrics = [...metrics];
                        newMetrics[idx] = {
                          ...dataset,
                          groupByValue: e.target.value,
                        };
                        handleConfigChange("metrics", newMetrics);
                      }}
                      options={[
                        { value: "", label: "-- Choisir --" },
                        ...Array.from(
                          new Set(
                            (data || [])
                              .filter(
                                (row: Record<string, unknown>) =>
                                  dataset.groupBy &&
                                  row[dataset.groupBy] !== undefined &&
                                  row[dataset.groupBy] !== null &&
                                  row[dataset.groupBy] !== ""
                              )
                              .map((row: Record<string, unknown>) =>
                                dataset.groupBy
                                  ? String(row[dataset.groupBy])
                                  : ""
                              )
                          )
                        ).map((val) => ({ value: val, label: String(val) })),
                      ]}
                      name={`radar-groupby-value-${idx}`}
                      id={`radar-groupby-value-${idx}`}
                    />
                  )}
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
                agg: "count",
                field: columns[0] || "",
                label: "",
                fields: [columns[0] || ""],
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
