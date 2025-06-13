import ColorField from "@/presentation/components/ColorField";
import CheckboxField from "@/presentation/components/CheckboxField";
import InputField from "@/presentation/components/InputField";
import SelectField from "@/presentation/components/SelectField";
import {
  WIDGETS,
  WIDGET_CONFIG_FIELDS,
} from "../../data/adapters/visualizations";
import type { WidgetStyleConfigSectionProps, WidgetType } from "@/core/types/widget-types";

export default function WidgetStyleConfigSection({
  type,
  config,
  columns,
  handleConfigChange,
}: WidgetStyleConfigSectionProps) {
  const widgetDef = WIDGETS[type as WidgetType];
  return (
    <div className="space-y-2">
      {Object.entries(widgetDef.configSchema)
        .filter(([field]) =>
          [
            "color",
            "legend",
            "legendPosition",
            "title",
            "titleAlign",
            "showGrid",
            "showValues",
            "barThickness",
            "borderRadius",
            "labelColor",
            "labelFontSize",
            "labelFormat",
            "tooltipFormat",
            "xLabel",
            "yLabel",
            "cutout",
            "borderWidth",
            "showPoints",
            "tension",
            "fill",
          ].includes(field)
        )
        .map(([field, typeStr]) => {
          const meta = WIDGET_CONFIG_FIELDS[field] || {};
          const label = meta.label || field;
          const defaultValue = meta.default;
          if (meta.inputType === "color" || field === "color") {
            return (
              <ColorField
                key={field}
                label={label}
                value={config[field] ?? defaultValue ?? "#2563eb"}
                onChange={(val: string) => handleConfigChange(field, val)}
                name={field}
                id={`widget-config-${field}`}
              />
            );
          }
          if (
            typeStr === "boolean" ||
            typeStr === "boolean?" ||
            meta.inputType === "checkbox"
          ) {
            return (
              <CheckboxField
                key={field}
                label={label}
                checked={config[field] ?? defaultValue ?? false}
                onChange={(val: boolean) => handleConfigChange(field, val)}
                name={field}
                id={`widget-config-${field}`}
              />
            );
          }
          if (meta.inputType === "table-columns") {
            // Table columns UI gérée ailleurs
            return null;
          }
          if (typeStr === "string[]" || meta.inputType === "multiselect") {
            return (
              <SelectField
                key={field}
                label={label}
                multiple
                value={config[field] || []}
                onChange={(e) =>
                  handleConfigChange(
                    field,
                    Array.from(e.target.selectedOptions).map((o) => o.value)
                  )
                }
                name={field}
                id={`widget-config-${field}`}
                options={columns.map((col) => ({ value: col, label: col }))}
              />
            );
          }
          if (
            typeStr === "number" ||
            typeStr === "number?" ||
            meta.inputType === "number"
          ) {
            return (
              <InputField
                key={field}
                label={label}
                type="number"
                value={config[field] ?? defaultValue ?? ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleConfigChange(field, Number(e.target.value))
                }
                name={field}
                id={`widget-config-${field}`}
              />
            );
          }
          if (
            (typeStr === "string" || typeStr === "string?") &&
            meta.inputType === "select" &&
            field !== "title"
          ) {
            if (meta.options) {
              return (
                <SelectField
                  key={field}
                  label={label}
                  value={config[field] || defaultValue || ""}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleConfigChange(field, e.target.value)}
                  name={field}
                  id={`widget-config-${field}`}
                  options={meta.options}
                />
              );
            }
            return (
              <SelectField
                key={field}
                label={label}
                value={config[field] || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => handleConfigChange(field, e.target.value)}
                name={field}
                id={`widget-config-${field}`}
                options={[
                  { value: "", label: "Sélectionner" },
                  ...columns.map((col) => ({ value: col, label: col })),
                ]}
              />
            );
          }
          return (
            <InputField
              key={field}
              label={label}
              value={config[field] ?? defaultValue ?? ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleConfigChange(field, e.target.value)}
              name={field}
              id={`widget-config-${field}`}
            />
          );
        })}
    </div>
  );
}
