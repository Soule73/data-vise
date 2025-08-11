import ColorField from "@components/forms/ColorField";
import InputField from "@components/forms/InputField";
import SelectField from "@components/SelectField";
import CheckboxField from "@components/forms/CheckboxField";
import Button from "@components/forms/Button";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  WIDGETS,
  WIDGET_CONFIG_FIELDS,
} from "@adapters/visualizations";
import type {
  MetricStyleFieldSchema,
  WidgetMetricStyleConfigSectionProps,
} from "@type/widgetTypes";
import CollapsibleSection from "@components/widgets/CollapsibleSection";

export default function WidgetMetricStyleConfigSection({
  type,
  metrics,
  metricStyles,
  handleMetricStyleChange,
}: WidgetMetricStyleConfigSectionProps) {
  const widgetDef = WIDGETS[type];
  const metricStyleSchema =
    (
      widgetDef.configSchema as {
        metricStyles?: Record<string, MetricStyleFieldSchema>;
      }
    )?.metricStyles || {};
  const safeMetricStyles = (metricStyles ?? []) as Record<
    string,
    string | number | boolean
  >[];
  const safeMetrics = (metrics ?? []) as { label?: string }[];

  if (type === "card") {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Style de la carte</h3>
          <div className="grid grid-cols-1 gap-4">
            {Object.entries(metricStyleSchema).map(([field, metaRaw]) => {
              const meta = metaRaw as MetricStyleFieldSchema;
              const label = meta.label || field;
              const defaultValue = meta.default;
              if (meta.inputType === "color") {
                return (
                  <ColorField
                    key={field}
                    label={label}
                    value={String(
                      safeMetricStyles?.[0]?.[field] ?? defaultValue
                    )}
                    onChange={(val) => handleMetricStyleChange(0, field, val)}
                    name={`metric-style-0-${field}`}
                    id={`metric-style-0-${field}`}
                  />
                );
              }
              if (meta.inputType === "number") {
                return (
                  <InputField
                    key={field}
                    label={label}
                    type="number"
                    value={String(
                      safeMetricStyles?.[0]?.[field] ?? defaultValue
                    )}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleMetricStyleChange(0, field, Number(e.target.value))
                    }
                    name={`metric-style-0-${field}`}
                    id={`metric-style-0-${field}`}
                  />
                );
              }
              if (meta.inputType === "select" && meta.options) {
                return (
                  <SelectField
                    key={field}
                    label={label}
                    value={String(
                      safeMetricStyles?.[0]?.[field] ?? defaultValue
                    )}
                    options={meta.options}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleMetricStyleChange(0, field, e.target.value)
                    }
                    name={`metric-style-0-${field}`}
                    id={`metric-style-0-${field}`}
                  />
                );
              }
              if (meta.inputType === "checkbox") {
                return (
                  <CheckboxField
                    key={field}
                    label={label}
                    checked={Boolean(
                      safeMetricStyles?.[0]?.[field] ?? defaultValue
                    )}
                    onChange={(checked) =>
                      handleMetricStyleChange(0, field, checked)
                    }
                    name={`metric-style-0-${field}`}
                    id={`metric-style-0-${field}`}
                  />
                );
              }
              return null;
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {safeMetrics.map((metric, idx) => (
        <CollapsibleSection
          key={idx}
          title={metric.label || `Métrique ${idx + 1}`}
          hideSettings={true}
        >
          <div className="grid grid-cols-1 gap-4">
            {Object.entries(metricStyleSchema).map(([field, metaRaw]) => {
              const meta = (metaRaw as MetricStyleFieldSchema) || WIDGET_CONFIG_FIELDS[field] || {};
              const label = meta.label || field;
              const defaultValue = meta.default;

              if (meta.inputType === "color-array" || field === "colors") {
                const colorArray = (safeMetricStyles[idx]?.[field] || defaultValue || ["#2563eb"]) as string[];
                return (
                  <div key={field} className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-900 dark:text-white">
                      {label}
                    </label>
                    <div className="flex flex-wrap items-end gap-2">
                      {colorArray.map((color: string, colorIdx: number) => (
                        <div key={colorIdx} className="flex items-center gap-1">
                          <ColorField
                            value={color || "#2563eb"}
                            onChange={(val) => {
                              const newArray = [...colorArray];
                              newArray[colorIdx] = val;
                              handleMetricStyleChange(idx, field, newArray);
                            }}
                            name={`metric-style-${idx}-${field}-${colorIdx}`}
                            id={`metric-style-${idx}-${field}-${colorIdx}`}
                          />
                          <button
                            type="button"
                            className="text-xs text-red-500 hover:underline"
                            onClick={() => {
                              const newArray = [...colorArray];
                              newArray.splice(colorIdx, 1);
                              handleMetricStyleChange(idx, field, newArray.length > 0 ? newArray : ["#2563eb"]);
                            }}
                            title="Supprimer cette couleur"
                          >
                            <XMarkIcon className="w-5 h-5 inline-block" />
                          </button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        type="button"
                        className="w-max text-xs h-max text-indigo-600 border border-indigo-300 rounded px-2 py-1 hover:bg-indigo-50"
                        onClick={() => {
                          const newArray = [...colorArray, "#2563eb"];
                          handleMetricStyleChange(idx, field, newArray);
                        }}
                      >
                        + Couleur
                      </Button>
                    </div>
                  </div>
                );
              }

              if (
                meta.inputType === "color" ||
                field === "color" ||
                field === "borderColor"
              ) {
                return (
                  <ColorField
                    key={field}
                    label={label}
                    value={String(
                      safeMetricStyles[idx]?.[field] ??
                      defaultValue ??
                      (field === "borderColor" ? "#000000" : "#2563eb")
                    )}
                    onChange={(val) =>
                      handleMetricStyleChange(idx, field, val)
                    }
                    name={`metric-style-${idx}-${field}`}
                    id={`metric-style-${idx}-${field}`}
                  />
                );
              }
              if (meta.inputType === "number") {
                return (
                  <InputField
                    key={field}
                    label={label}
                    type="number"
                    value={String(
                      safeMetricStyles[idx]?.[field] ?? defaultValue ?? ""
                    )}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleMetricStyleChange(
                        idx,
                        field,
                        Number(e.target.value)
                      )
                    }
                    name={`metric-style-${idx}-${field}`}
                    id={`metric-style-${idx}-${field}`}
                  />
                );
              }
              if (meta.inputType === "select" && meta.options) {
                return (
                  <SelectField
                    key={field}
                    label={label}
                    value={String(
                      safeMetricStyles[idx]?.[field] ?? defaultValue ?? ""
                    )}
                    options={meta.options}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleMetricStyleChange(idx, field, e.target.value)
                    }
                    name={`metric-style-${idx}-${field}`}
                    id={`metric-style-${idx}-${field}`}
                  />
                );
              }
              if (meta.inputType === "checkbox") {
                return (
                  <CheckboxField
                    key={field}
                    label={label}
                    checked={Boolean(
                      safeMetricStyles[idx]?.[field] ?? defaultValue ?? false
                    )}
                    onChange={(checked) =>
                      handleMetricStyleChange(idx, field, checked)
                    }
                    name={`metric-style-${idx}-${field}`}
                    id={`metric-style-${idx}-${field}`}
                  />
                );
              }
              return null;
            })}
          </div>
        </CollapsibleSection>
      ))}
    </div>
  );
}
