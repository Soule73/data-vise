import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useLineChartLogic } from "./useLineChartLogic";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

export interface LineChartConfig {
  xField: string;
  yField: string;
  color?: string;
  legend?: boolean;
  title?: string;
  showPoints?: boolean;
  showGrid?: boolean;
  tension?: number;
  borderWidth?: number;
  fill?: boolean;
  legendPosition?: "top" | "left" | "right" | "bottom";
  titleAlign?: "start" | "center" | "end";
  labelColor?: string;
  labelFontSize?: number;
  labelFormat?: string;
  tooltipFormat?: string;
  showValues?: boolean;
  xLabel?: string; // Ajouté pour le label de l'axe x
  yLabel?: string; // Ajouté pour le label de l'axe y
}

export interface MetricConfig {
  agg: string;
  field: string;
  label?: string;
}
export interface BucketConfig {
  field: string;
  type?: string;
}

export default function LineChartWidget({
  data,
  config,
}: {
  data: any[];
  config: any;
  editMode?: boolean;
}) {
  if (
    !data ||
    !config.metrics ||
    !config.bucket ||
    !Array.isArray(config.metrics) ||
    !config.bucket.field
  ) {
    return (
      <div className="text-xs text-gray-500">
        Sélectionnez les métriques et le champ de groupement.
      </div>
    );
  }
  const { chartData, options, showNativeValues, valueLabelsPlugin } =
    useLineChartLogic(data, config);
  return (
    <div className="bg-white dark:bg-gray-900 rounded w-full max-w-full h-full flex items-center justify-center overflow-x-auto">
      <Line
        className="w-full max-w-full h-auto p-1 md:p-2"
        data={chartData}
        options={options}
        plugins={showNativeValues ? [valueLabelsPlugin] : []}
        style={{ width: "100%", maxWidth: "100%", height: "auto", minWidth: 0 }}
      />
    </div>
  );
}
