import ColorField from "@/presentation/components/forms/ColorField";
import InputField from "@/presentation/components/forms/InputField";
import {
  WIDGETS,
  WIDGET_CONFIG_FIELDS,
} from "../../../data/adapters/visualizations";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import { useMetricUICollapseStore } from "@/core/store/metricUI";
import type { WidgetMetricStyleConfigSectionProps } from "@/core/types/widget-types";

interface MetricStyleFieldSchema {
  label?: string;
  default?: string | number | boolean;
  inputType?: "color" | "number" | "text";
}

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
  const collapsedMetrics = useMetricUICollapseStore((s) => s.collapsedMetrics);
  const toggleCollapse = useMetricUICollapseStore((s) => s.toggleCollapse);

  // Cas spécial pour Card (et potentiellement KPI/KPIGroup) : styles globaux
  if (type === "card") {
    return (
      <div className="space-y-4">
        <div className="rounded p-3 bg-gray-50">
          <div className="font-semibold mb-2">Style de la carte</div>
          <div className="grid grid-cols-2 gap-2">
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
        <div key={idx} className="rounded p-3 bg-gray-50">
          <div
            className="flex items-center justify-start cursor-pointer mb-2"
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
              aria-label={collapsedMetrics[idx] ? "Déplier" : "Replier"}
            >
              {collapsedMetrics[idx] ? (
                <ChevronDownIcon className="w-5 h-5 cursor-pointer" />
              ) : (
                <ChevronUpIcon className="w-5 h-5 cursor-pointer" />
              )}
            </button>
            <span className="font-semibold">{metric.label}</span>
          </div>
          {!collapsedMetrics[idx] && (
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(metricStyleSchema).map(([field]) => {
                const meta = WIDGET_CONFIG_FIELDS[field] || {};
                const label = meta.label || field;
                const defaultValue = meta.default;
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
                // Ajoute d'autres types si besoin
                return null;
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
