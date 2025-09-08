import CheckboxField from "@components/forms/CheckboxField";
import InputField from "@components/forms/InputField";
import { WIDGETS } from "@adapters/visualizations";
import type {
  VisualizationTypeSelectorProps,
  WidgetType,
} from "@type/widgetTypes";
import { useState, type ReactNode } from "react";

export default function VisualizationTypeSelector({
  type,
  setType,
}: VisualizationTypeSelectorProps) {
  const [search, setSearch] = useState("");

  const filtered = Object.entries(WIDGETS).filter(([, def]) =>
    def.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="font-semibold mb-2">Type de visualisation</div>
      <InputField
        placeholder="Rechercher un type de visualisation"
        id="search-visualization-type"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-3"
      />
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 max-h-[calc(100%-4rem)] ">
        {filtered.map(([key, def]) => (
          <Tooltip text={def.description} key={key}>
            <div
              key={key}
              className={`relative border rounded-lg p-3 flex flex-col items-center justify-center cursor-pointer transition-all hover:shadow-md h-32 ${type === key
                ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20"
                : "border-gray-300 bg-white dark:bg-gray-800/40"
                }`}
              onClick={() => setType(key as WidgetType)}
            >
              <div className="absolute top-2 right-2">
                <CheckboxField
                  checked={type === key}
                  onChange={() => setType(key as WidgetType)}
                  name="widget-type"
                  id={`widget-type-${key}`}
                />
              </div>
              <div className="flex flex-col items-center justify-center gap-2 mt-2">
                <def.icon className="w-6 h-5 text-indigo-600" />
                <span className="font-medium text-center text-xs mt-1">
                  {def.label}
                </span>
              </div>
            </div>
          </Tooltip>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-2 text-center text-gray-400 italic">
            Aucun type trouvé
          </div>
        )}
      </div>
    </>
  );
}

//Tooltip
const Tooltip = ({
  text,
  children
}: {
  text: string
  children: ReactNode
}) => {
  return (
    <div className="relative group">
      {children}
      <div className="absolute bg-black text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        {text}
      </div>
    </div>
  );
};
