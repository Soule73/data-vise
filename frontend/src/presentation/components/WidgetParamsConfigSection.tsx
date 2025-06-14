import ColorField from "@/presentation/components/ColorField";
import InputField from "@/presentation/components/InputField";
import CheckboxField from "@/presentation/components/CheckboxField";
import SelectField from "@/presentation/components/SelectField";
import {
  WIDGETS,
  WIDGET_CONFIG_FIELDS,
} from "../../data/adapters/visualizations";
import Button from "./Button";
import { XMarkIcon } from "@heroicons/react/24/outline";
import * as HeroIcons from "@heroicons/react/24/outline";
import type { WidgetParamsConfigSectionProps } from "@/core/types/widget-types";

export default function WidgetParamsConfigSection({
  type,
  config,
  handleConfigChange,
}: WidgetParamsConfigSectionProps) {
  return (
    <div className="space-y-2">
      {Object.entries(WIDGETS[type]?.configSchema.widgetParams || {}).map(
        ([field]) => {
          const meta = WIDGET_CONFIG_FIELDS[field] || {};
          const label = meta.label || field;
          const defaultValue = meta.default;
          if (meta.inputType === "color") {
            return (
              <ColorField
                key={field}
                label={label}
                value={
                  config.widgetParams?.[field] ?? defaultValue ?? "#2563eb"
                }
                onChange={(val) =>
                  handleConfigChange("widgetParams", {
                    ...config.widgetParams,
                    [field]: val,
                  })
                }
                name={`widget-param-${field}`}
                id={`widget-param-${field}`}
              />
            );
          }
          if (meta.inputType === "checkbox") {
            return (
              <CheckboxField
                key={field}
                label={label}
                checked={config.widgetParams?.[field] ?? defaultValue ?? false}
                onChange={(val) =>
                  handleConfigChange("widgetParams", {
                    ...config.widgetParams,
                    [field]: val,
                  })
                }
                name={`widget-param-${field}`}
                id={`widget-param-${field}`}
              />
            );
          }
          if (meta.inputType === "number") {
            return (
              <InputField
                key={field}
                label={label}
                type="number"
                value={config.widgetParams?.[field] ?? defaultValue ?? ""}
                onChange={(e) =>
                  handleConfigChange("widgetParams", {
                    ...config.widgetParams,
                    [field]: Number(e.target.value),
                  })
                }
                name={`widget-param-${field}`}
                id={`widget-param-${field}`}
              />
            );
          }
          if (meta.inputType === "select" && field !== "title") {
            if (meta.options) {
              return (
                <SelectField
                  key={field}
                  label={label}
                  value={config.widgetParams?.[field] || defaultValue || ""}
                  onChange={(e) =>
                    handleConfigChange("widgetParams", {
                      ...config.widgetParams,
                      [field]: e.target.value,
                    })
                  }
                  name={`widget-param-${field}`}
                  id={`widget-param-${field}`}
                  options={meta.options}
                />
              );
            }
          }
          if (meta.inputType === "select" && field === "icon" && meta.options) {
            return (
              <div key={field} className="flex flex-col gap-1">
                <label
                  className="text-sm font-medium"
                  htmlFor={`widget-param-${field}`}
                >
                  {label}
                </label>
                <select
                  className="border rounded px-2 py-1 bg-white dark:bg-gray-900"
                  value={config.widgetParams?.[field] || defaultValue || ""}
                  onChange={(e) =>
                    handleConfigChange("widgetParams", {
                      ...config.widgetParams,
                      [field]: e.target.value,
                    })
                  }
                  name={`widget-param-${field}`}
                  id={`widget-param-${field}`}
                >
                  {meta.options.map((opt: any) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {/* Aperçu de l'icône sélectionnée */}
                <div className="mt-1 flex items-center gap-2">
                  {config.widgetParams?.[field] &&
                    HeroIcons[
                      config.widgetParams[field] as keyof typeof HeroIcons
                    ] && (
                      <>
                        {HeroIcons[
                          config.widgetParams[field] as keyof typeof HeroIcons
                        ]({
                          className: "w-6 h-6 text-indigo-500",
                        })}
                        <span className="text-xs text-gray-500">
                          {config.widgetParams[field]}
                        </span>
                      </>
                    )}
                </div>
              </div>
            );
          }
          if (meta.inputType === "color-array") {
            // Champ pour sélectionner plusieurs couleurs (tableau)
            return (
              <div key={field} className="flex flex-col gap-1">
                <label
                  className="text-sm font-medium"
                  htmlFor={`widget-param-${field}`}
                >
                  {label}
                </label>
                <div className="flex flex-wrap items-end gap-2">
                  {(config.widgetParams?.[field] || [""]).map(
                    (color: string, i: number) => (
                      <div key={i} className="flex items-center gap-1">
                        <ColorField
                          label=""
                          value={color || "#2563eb"}
                          onChange={(val) => {
                            const arr = [
                              ...(config.widgetParams?.[field] || []),
                            ];
                            arr[i] = val;
                            handleConfigChange("widgetParams", {
                              ...config.widgetParams,
                              [field]: arr,
                            });
                          }}
                          name={`widget-param-${field}-${i}`}
                          id={`widget-param-${field}-${i}`}
                        />
                        <button
                          type="button"
                          className="text-xs text-red-500 hover:underline"
                          onClick={() => {
                            const arr = [
                              ...(config.widgetParams?.[field] || []),
                            ];
                            arr.splice(i, 1);
                            handleConfigChange("widgetParams", {
                              ...config.widgetParams,
                              [field]: arr.length > 0 ? arr : undefined,
                            });
                          }}
                          title="Supprimer cette couleur"
                        >
                          <XMarkIcon className="w-5 h-5 inline-block" />
                        </button>
                      </div>
                    )
                  )}
                  <Button
                    variant="outline"
                    type="button"
                    className="w-max text-xs h-max text-indigo-600 border border-indigo-300 rounded px-2 py-1 hover:bg-indigo-50"
                    onClick={() => {
                      const arr = [...(config.widgetParams?.[field] || [])];
                      arr.push("#2563eb");
                      handleConfigChange("widgetParams", {
                        ...config.widgetParams,
                        [field]: arr,
                      });
                    }}
                  >
                    + Ajouter une couleur
                  </Button>
                </div>
              </div>
            );
          }
          if (field === "showIcon") {
            return (
              <CheckboxField
                key={field}
                label={meta.label || "Afficher une icône"}
                checked={config.widgetParams?.[field] ?? defaultValue ?? true}
                onChange={(val) =>
                  handleConfigChange("widgetParams", {
                    ...config.widgetParams,
                    [field]: val,
                  })
                }
                name={`widget-param-${field}`}
                id={`widget-param-${field}`}
              />
            );
          }
          return (
            <InputField
              key={field}
              label={label}
              value={config.widgetParams?.[field] ?? defaultValue ?? ""}
              onChange={(e) =>
                handleConfigChange("widgetParams", {
                  ...config.widgetParams,
                  [field]: e.target.value,
                })
              }
              name={`widget-param-${field}`}
              id={`widget-param-${field}`}
            />
          );
        }
      )}
    </div>
  );
}
