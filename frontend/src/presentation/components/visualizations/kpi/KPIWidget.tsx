import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import { useKPIWidgetVM } from "@hooks/visualizations/kpi/useKPIWidgetVM";
import InvalideConfigWidget from "@components/widgets/InvalideConfigWidget";
import NoDataWidget from "@components/widgets/NoDataWidget";
import type { KPIWidgetProps } from "@type/widgetTypes";

export default function KPIWidget({
  data,
  config,
}: KPIWidgetProps) {
  const {
    value,
    title,
    valueColor,
    titleColor,
    showTrend,
    showValue,
    formatValue,
    trendType,
    showPercent,
    trend,
    trendValue,
    trendPercent,
    getTrendColor,
  } = useKPIWidgetVM({ data, config });

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


  function TrendIcon({ direction }: { direction: "up" | "down" }) {
    if (trendType === "caret") {
      return direction === "up" ? (
        <ChevronUpIcon className="w-4 h-4" />
      ) : (
        <ChevronDownIcon className="w-4 h-4" />
      );
    }
    return direction === "up" ? (
      <ArrowTrendingUpIcon className="w-4 h-4" />
    ) : (
      <ArrowTrendingDownIcon className="w-4 h-4" />
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full max-h-full bg-white dark:bg-gray-900 w-full max-w-full rounded-lg">
      <span
        className="text-xs text-gray-500 dark:text-gray-400 mb-1"
        style={{ color: titleColor }}
      >
        {title}
      </span>
      {showValue && (
        <span className="text-4xl font-bold" style={{ color: valueColor }}>
          {formatValue(value)}
        </span>
      )}
      {showTrend && trend && (
        <span
          className={`flex items-center gap-1 text-xs mt-1 ${getTrendColor()}`}
        >
          <TrendIcon direction={trend as "up" | "down"} />
          {showPercent
            ? `${trendPercent > 0 ? "+" : ""}${trendPercent.toFixed(1)}%`
            : `${trend === "up" ? "+" : ""}${formatValue(trendValue)}`}
        </span>
      )}
    </div>
  );
}
