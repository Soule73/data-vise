import SelectField from "@/presentation/components/SelectField";
import InputField from "@/presentation/components/InputField";
import Button from "@/presentation/components/Button";
import { XMarkIcon, PlusCircleIcon } from "@heroicons/react/24/solid";

interface WidgetBubbleDataConfigSectionProps {
  metrics: any[];
  columns: string[];
  handleConfigChange: (field: string, value: any) => void;
}

export default function WidgetBubbleDataConfigSection({
  metrics,
  columns,
  handleConfigChange,
}: WidgetBubbleDataConfigSectionProps) {
  return (
    <div className="space-y-4">
      <div className="bg-gray-50 dark:bg-gray-800 rounded p-2 shadow">
        <div className="font-semibold mb-1">Datasets (x, y, r)</div>
        <div className="space-y-2">
          {metrics.map((dataset: any, idx: number) => (
            <div
              key={idx}
              className="flex flex-col gap-2 border-b pb-2 mb-2 relative group bg-white/60 dark:bg-gray-900/60 rounded p-2"
            >
              <div className="flex gap-2 items-center">
                <span className="font-medium text-sm text-gray-700 dark:text-gray-300">
                  Dataset {idx + 1}
                </span>
                {metrics.length > 1 && (
                  <button
                    className="ml-auto p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                    onClick={() => {
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <SelectField
                  label="Champ X"
                  value={dataset.x || ""}
                  onChange={(e) => {
                    const newMetrics = [...metrics];
                    newMetrics[idx] = { ...dataset, x: e.target.value };
                    handleConfigChange("metrics", newMetrics);
                  }}
                  options={columns.map((col) => ({ value: col, label: col }))}
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
                  options={columns.map((col) => ({ value: col, label: col }))}
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
                  options={columns.map((col) => ({ value: col, label: col }))}
                  name={`bubble-r-${idx}`}
                  id={`bubble-r-${idx}`}
                />
                <InputField
                  label="Label du dataset"
                  value={dataset.label || ""}
                  onChange={(e) => {
                    const newMetrics = [...metrics];
                    newMetrics[idx] = { ...dataset, label: e.target.value };
                    handleConfigChange("metrics", newMetrics);
                  }}
                  name={`bubble-label-${idx}`}
                  id={`bubble-label-${idx}`}
                />
              </div>
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
              {
                x: columns[0] || "",
                y: columns[1] || "",
                r: columns[2] || "",
                label: "",
              },
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
