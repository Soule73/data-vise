import SelectField from "@/presentation/components/SelectField";
import InputField from "@/presentation/components/InputField";
import Button from "@/presentation/components/Button";
import { XMarkIcon, PlusCircleIcon } from "@heroicons/react/24/solid";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

interface WidgetScatterDataConfigSectionProps {
  metrics: any[];
  columns: string[];
  handleConfigChange: (field: string, value: any) => void;
}

export default function WidgetScatterDataConfigSection({
  metrics,
  columns,
  handleConfigChange,
}: WidgetScatterDataConfigSectionProps) {
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({});
  const toggleCollapse = (idx: number) =>
    setCollapsed((prev) => ({ ...prev, [idx]: !prev[idx] }));

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 dark:bg-gray-800 rounded p-2 shadow">
        <div className="font-semibold mb-1">Datasets (x, y)</div>
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
                  <SelectField
                    label="Champ X"
                    value={dataset.x || ""}
                    onChange={(e) => {
                      const newMetrics = [...metrics];
                      newMetrics[idx] = { ...dataset, x: e.target.value };
                      handleConfigChange("metrics", newMetrics);
                    }}
                    options={columns.map((col) => ({ value: col, label: col }))}
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
                    options={columns.map((col) => ({ value: col, label: col }))}
                    name={`scatter-y-${idx}`}
                    id={`scatter-y-${idx}`}
                  />
                  <InputField
                    label="Label du dataset"
                    value={dataset.label || ""}
                    onChange={(e) => {
                      const newMetrics = [...metrics];
                      newMetrics[idx] = { ...dataset, label: e.target.value };
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
        <Button
          color="indigo"
          className="mt-2 w-max mx-auto !bg-gray-300 dark:!bg-gray-700 hover:!bg-gray-200 dark:hover:!bg-gray-600 !border-none"
          variant="outline"
          onClick={() => {
            handleConfigChange("metrics", [
              ...metrics,
              { x: columns[0] || "", y: columns[1] || "", label: "" },
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
