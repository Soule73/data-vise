import ColorField from "@components/forms/ColorField";
import InputField from "@components/forms/InputField";
import CheckboxField from "@components/forms/CheckboxField";
import SelectField from "@components/SelectField";
import {
  WIDGETS,
  WIDGET_CONFIG_FIELDS,
} from "@adapters/visualizations";
import * as HeroIcons from "@heroicons/react/24/outline";
import type { WidgetParamsConfigSectionProps } from "@type/widgetTypes";

export default function WidgetParamsConfigSection({
  type,
  config,
  handleConfigChange,
}: WidgetParamsConfigSectionProps) {

  const getWidgetParamMeta = (field: string) =>
    WIDGETS[type]?.configSchema?.widgetParams?.[field] || {};

  const getLabel = (field: string) =>
    getWidgetParamMeta(field).label ||
    WIDGET_CONFIG_FIELDS[field]?.label ||
    field;

  const getDefaultValue = (field: string) =>
    getWidgetParamMeta(field).default ?? WIDGET_CONFIG_FIELDS[field]?.default;

  const getOptions = (field: string) =>
    getWidgetParamMeta(field).options ||
    WIDGET_CONFIG_FIELDS[field]?.options ||
    [];

  const getInputType = (field: string) =>
    getWidgetParamMeta(field).inputType ||
    WIDGET_CONFIG_FIELDS[field]?.inputType;

  const getSelectValue = (field: string) =>
    config.widgetParams?.[field] || getDefaultValue(field) || "";

  const getInputValue = (field: string) =>
    config.widgetParams?.[field] ?? getDefaultValue(field) ?? "";

  const getCheckboxValue = (field: string, fallback = false) =>
    config.widgetParams?.[field] ?? getDefaultValue(field) ?? fallback;

  const getIconComponent = (field: string) => {
    const iconName = config.widgetParams?.[field];
    if (iconName && HeroIcons[iconName as keyof typeof HeroIcons]) {
      return HeroIcons[iconName as keyof typeof HeroIcons]({
        className: "w-6 h-6 text-indigo-500",
      });
    }
    return null;
  };

  return (
    <div className="space-y-2 grid grid-cols-2 place-items-stretch items-end gap-2">
      {Object.entries(WIDGETS[type]?.configSchema.widgetParams || {}).map(
        ([field]) => {
          const label = getLabel(field);
          const options = getOptions(field);
          const inputType = getInputType(field);

          if (inputType === "color") {
            return (
              <ColorField
                key={field}
                label={label}
                value={getInputValue(field) || "#2563eb"}
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
          if (inputType === "checkbox") {
            return (
              <CheckboxField
                key={field}
                label={label}
                checked={getCheckboxValue(field)}
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
          if (inputType === "number") {
            return (
              <InputField
                key={field}
                label={label}
                type="number"
                value={getInputValue(field)}
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
          if (inputType === "select" && field !== "title") {
            if (options) {
              return (
                <SelectField
                  key={field}
                  label={label}
                  value={getSelectValue(field)}
                  onChange={(e) =>
                    handleConfigChange("widgetParams", {
                      ...config.widgetParams,
                      [field]: e.target.value,
                    })
                  }
                  name={`widget-param-${field}`}
                  id={`widget-param-${field}`}
                  options={Array.isArray(options) ? options : []}
                />
              );
            }
          }
          if (inputType === "select" && field === "icon" && options) {
            return (
              <div key={field} className="flex flex-col gap-1">
                <SelectField
                  label={label}
                  value={getSelectValue(field)}
                  onChange={(e) =>
                    handleConfigChange("widgetParams", {
                      ...config.widgetParams,
                      [field]: e.target.value,
                    })
                  }
                  name={`widget-param-${field}`}
                  id={`widget-param-${field}`}
                  options={Array.isArray(options) ? options : []}
                />
                {/* Aperçu de l'icône sélectionnée */}
                <div className="mt-1 flex items-center gap-2">
                  {getSelectValue(field) && getIconComponent(field) && (
                    <>
                      {getIconComponent(field)}
                      <span className="text-xs text-gray-500">
                        {getSelectValue(field)}
                      </span>
                    </>
                  )}
                </div>
              </div>
            );
          }
          if (field === "showIcon") {
            return (
              <CheckboxField
                key={field}
                label={label || "Afficher une icône"}
                checked={getCheckboxValue(field, true)}
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
              value={getInputValue(field)}
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
