import { useCardWidgetVM } from "@/core/hooks/visualizations/useCardWidgetVM";
import { ChartBarIcon } from "@heroicons/react/24/outline";
import InvalideConfigWidget from "./charts/InvalideConfigWidget";
import NoDataWidget from "./charts/NoDataWidget";
import type { CardWidgetConfig } from "@/core/types/visualization";

export default function CardWidget({
  data,
  config,
}: {
  data: Record<string, any>[];
  config: CardWidgetConfig;
}) {
  if (
    !data ||
    !config.metrics ||
    !Array.isArray(config.metrics) ||
    !config.metrics[0]
  ) {
    return <InvalideConfigWidget />;
  }
  if (data.length === 0) {
    return (
      <NoDataWidget
        icon={
          <ChartBarIcon className="w-12 h-12 stroke-gray-300 dark:stroke-gray-700" />
        }
      />
    );
  }

  const {
    value,
    title,
    description,
    iconColor,
    valueColor,
    descriptionColor,
    showIcon,
    IconComponent,
  } = useCardWidgetVM(data, config);

  return (
    <div className="flex flex-col items-center justify-center h-full shadow text-gray-700 dark:text-gray-200 rounded-lg p-4 bg-white dark:bg-gray-800 min-w-[180px] min-h-[120px]">
      {showIcon && IconComponent && (
        <span className="mb-2">
          <IconComponent className="w-8 h-8" style={{ color: iconColor }} />
        </span>
      )}
      <span className="text-2xl font-bold">{title}</span>
      <span
        className="text-3xl font-extrabold mt-1"
        style={{ color: valueColor }}
      >
        {value}
      </span>
      {description && (
        <span className="text-xs mt-1" style={{ color: descriptionColor }}>
          {description}
        </span>
      )}
    </div>
  );
}
