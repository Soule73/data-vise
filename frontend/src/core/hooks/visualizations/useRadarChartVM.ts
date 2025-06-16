import { useMemo } from "react";
import type { ChartOptions, ChartData } from "chart.js";

export function useRadarChartLogic(data: any[], config: any) {
  // On suppose que chaque dataset correspond à une métrique (ex: une série de valeurs sur les axes)
  const validDatasets = useMemo(
    () =>
      Array.isArray(config.metrics)
        ? config.metrics.filter(
            (ds: any) =>
              ds.fields && Array.isArray(ds.fields) && ds.fields.length > 0
          )
        : [],
    [config.metrics]
  );

  // Les labels des axes (ex: "axes" ou "features")
  const axisLabels = useMemo(() => {
    // On prend les labels des axes du premier dataset, ou on infère depuis les colonnes
    if (validDatasets.length > 0 && validDatasets[0].fields) {
      return validDatasets[0].fields.map((f: string) => f);
    }
    return [];
  }, [validDatasets]);

  const datasets = useMemo(
    () =>
      validDatasets.map((ds: any, i: number) => {
        let color =
          config.metricStyles?.[i]?.color || `hsl(${(i * 60) % 360}, 70%, 60%)`;
        let opacity = config.metricStyles?.[i]?.opacity ?? 0.7;
        if (color.startsWith("#") && opacity < 1) {
          const hex = color.replace("#", "");
          const bigint = parseInt(hex, 16);
          const r = (bigint >> 16) & 255;
          const g = (bigint >> 8) & 255;
          const b = bigint & 255;
          color = `rgba(${r},${g},${b},${opacity})`;
        }
        // Filtrage par groupBy si défini
        let filteredData = data;
        if (ds.groupBy && ds.groupByValue) {
          filteredData = data.filter(
            (row: any) => row[ds.groupBy] === ds.groupByValue
          );
        }
        // Pour chaque axe, on agrège la valeur selon l'agg choisie (sum, avg, ...)
        return {
          label: ds.label || `Dataset ${i + 1}`,
          data: axisLabels.map((field: string) => {
            // On supporte l'agrégation (sum, avg, etc.) si ds.agg existe, sinon on prend la première valeur
            if (ds.agg && filteredData.length > 0) {
              if (ds.agg === "sum")
                return filteredData.reduce(
                  (acc: number, row: any) => acc + (Number(row[field]) || 0),
                  0
                );
              if (ds.agg === "avg")
                return (
                  filteredData.reduce(
                    (acc: number, row: any) => acc + (Number(row[field]) || 0),
                    0
                  ) / filteredData.length
                );
              if (ds.agg === "min")
                return Math.min(
                  ...filteredData.map((row: any) => Number(row[field]) || 0)
                );
              if (ds.agg === "max")
                return Math.max(
                  ...filteredData.map((row: any) => Number(row[field]) || 0)
                );
              if (ds.agg === "count") return filteredData.length;
            }
            // Par défaut, on prend la première valeur trouvée
            return filteredData.length > 0
              ? Number(filteredData[0][field]) || 0
              : 0;
          }),
          backgroundColor: color,
          borderColor: config.metricStyles?.[i]?.borderColor || undefined,
          borderWidth: config.metricStyles?.[i]?.borderWidth || 1,
          pointBackgroundColor: color,
        };
      }),
    [validDatasets, data, config.metricStyles, axisLabels]
  );

  const chartTitle = config.widgetParams?.title || "";
  const showLegend =
    config.widgetParams?.legend !== undefined
      ? config.widgetParams.legend
      : true;

  const chartData: ChartData<"radar"> = useMemo(
    () => ({
      labels: axisLabels,
      datasets,
    }),
    [datasets, axisLabels]
  );

  const options: ChartOptions<"radar"> = useMemo(
    () => ({
      responsive: true,
      animation: false,
      plugins: {
        legend: { display: showLegend },
        title: chartTitle
          ? {
              display: true,
              text: chartTitle,
            }
          : undefined,
        tooltip: { enabled: true },
      },
      scales: {
        r: {
          angleLines: { display: true },
          suggestedMin: 0,
        },
      },
    }),
    [showLegend, chartTitle]
  );

  return { chartData, options, validDatasets, axisLabels };
}
