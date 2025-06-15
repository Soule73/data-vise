import CheckboxField from "@/presentation/components/CheckboxField";
import InputField from "@/presentation/components/InputField";
import { WIDGETS } from "@/data/adapters/visualizations";
import type { WidgetType } from "@/core/types/widget-types";
import { useState } from "react";

interface VisualizationTypeSelectorProps {
  type: string;
  setType: (type: WidgetType) => void;
}

export default function VisualizationTypeSelector({
  type,
  setType,
}: VisualizationTypeSelectorProps) {
  const [search, setSearch] = useState("");
  const filtered = Object.entries(WIDGETS).filter(([_, def]) =>
    def.label.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="mb-4">
      <div className="font-semibold mb-2">Type de visualisation</div>
      <InputField
        label=""
        placeholder="Rechercher un type de visualisation"
        id="search-visualization-type"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-3"
      />
      <div className="grid grid-cols-2 gap-3">
        {filtered.map(([key, def]) => (
          <div
            key={key}
            className={`relative border rounded-lg p-3 flex flex-col items-center justify-center cursor-pointer transition-all hover:shadow-md min-h-[120px] ${
              type === key
                ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20"
                : "border-gray-300 bg-white dark:bg-gray-800/40"
            }`}
            onClick={() => setType(key as WidgetType)}
          >
            <div className="absolute top-2 right-2">
              <CheckboxField
                checked={type === key}
                onChange={() => setType(key as WidgetType)}
                label=""
                name="widget-type"
                id={`widget-type-${key}`}
              />
            </div>
            <div className="flex flex-col items-center justify-center gap-2 mt-2">
              <def.icon className="w-8 h-8 text-indigo-600" />
              <span className="font-medium text-center text-sm mt-1">
                {def.label}
              </span>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-2 text-center text-gray-400 italic">
            Aucun type trouvé
          </div>
        )}
      </div>
    </div>
  );
}
