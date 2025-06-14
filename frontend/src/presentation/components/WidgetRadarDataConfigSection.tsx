import SelectField from "@/presentation/components/SelectField";
import InputField from "@/presentation/components/InputField";
import Button from "@/presentation/components/Button";
import CheckboxField from "@/presentation/components/CheckboxField";
import {
  XMarkIcon,
  PlusCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/solid";
import { useState } from "react";

interface WidgetRadarDataConfigSectionProps {
  metrics: any[];
  columns: string[];
  handleConfigChange: (field: string, value: any) => void;
  configSchema?: any; // Ajout pour passer la config centralisée
  // Ajout d'une prop data pour accéder aux valeurs du dataset
  data?: any[];
}

export default function WidgetRadarDataConfigSection({
  metrics,
  columns,
  handleConfigChange,
  configSchema,
  data = [], // Ajout de la prop data
}: WidgetRadarDataConfigSectionProps) {
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({});
  const toggleCollapse = (idx: number) =>
    setCollapsed((prev) => ({ ...prev, [idx]: !prev[idx] }));

  // Champs groupBy et axes depuis la config centralisée
  const groupByFields: string[] =
    configSchema?.dataConfig?.groupByFields || columns;
  const axisFields: string[] = configSchema?.dataConfig?.axisFields || columns;

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 dark:bg-gray-800 rounded p-2 shadow">
        <div className="font-semibold mb-1">Datasets (axes multiples)</div>
        <div className="space-y-2">
          {metrics.map((dataset: any, idx: number) => (
            <div
              key={idx}
              className="flex flex-col border-b pb-2 mb-2 relative group bg-white/60 dark:bg-gray-900/60 p-2 border-gray-200 dark:border-gray-700 "
            >
              <div
                className="flex gap-2 items-center cursor-pointer"
                onClick={() => toggleCollapse(idx)}
              >
                <button
                  type="button"
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                  tabIndex={-1}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCollapse(idx);
                  }}
                  aria-label={collapsed[idx] ? "Déplier" : "Replier"}
                >
                  {collapsed[idx] ? (
                    <ChevronDownIcon className="w-5 h-5 cursor-pointer" />
                  ) : (
                    <ChevronUpIcon className="w-5 h-5 cursor-pointer" />
                  )}
                </button>
                <span className="font-medium text-sm text-gray-700 dark:text-gray-300">
                  {dataset.label && dataset.label.trim() !== ""
                    ? dataset.label
                    : `Dataset ${idx + 1}`}
                </span>
                {metrics.length > 1 && (
                  <button
                    className="ml-auto p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                    onClick={(e) => {
                      e.stopPropagation();
                      const newMetrics = metrics.filter(
                        (_: any, i: number) => i !== idx
                      );
                      handleConfigChange("metrics", newMetrics);
                    }}
                    title="Supprimer ce dataset"
                  >
                    <XMarkIcon className="w-5 h-5 text-red-500" />
                  </button>
                )}
              </div>
              {!collapsed[idx] && (
                <div className="grid gap-2 mt-2">
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
                                (row: any) =>
                                  row[dataset.groupBy] !== undefined &&
                                  row[dataset.groupBy] !== null &&
                                  row[dataset.groupBy] !== ""
                              )
                              .map((row: any) => row[dataset.groupBy])
                          )
                        ).map((v) => ({ value: v, label: String(v) })),
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
        <Button
          color="indigo"
          className="mt-2 w-max mx-auto !bg-gray-300 dark:!bg-gray-700 hover:!bg-gray-200 dark:hover:!bg-gray-600 !border-none"
          variant="outline"
          onClick={() => {
            handleConfigChange("metrics", [
              ...metrics,
              { label: "", fields: [columns[0] || ""] },
            ]);
          }}
        >
          <PlusCircleIcon className="w-5 h-5 mr-1" />
          Ajouter un dataset
        </Button>
      </div>
    </div>
  );
}
