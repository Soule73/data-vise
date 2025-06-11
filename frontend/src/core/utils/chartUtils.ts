// Fonctions utilitaires pour widgets ChartJS (Pie, Bar, Line)

export function aggregate(rows: any[], agg: string, field: string) {
  if (agg === "none") {
    if (rows.length === 1) return rows[0][field];
    const found = rows.find((r) => r[field] !== undefined && r[field] !== null);
    return found ? found[field] : "";
  }
  const nums = rows.map((r) => Number(r[field])).filter((v) => !isNaN(v));
  if (agg === "sum") return nums.reduce((a, b) => a + b, 0);
  if (agg === "avg") return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;
  if (agg === "min") return nums.length ? Math.min(...nums) : 0;
  if (agg === "max") return nums.length ? Math.max(...nums) : 0;
  if (agg === "count") return rows.length;
  return "";
}

export function getLabels(data: any[], field: string) {
  return Array.from(new Set(data.map((row: any) => row[field])));
}

export const defaultColors = [
  "#6366f1",
  "#f59e42",
  "#10b981",
  "#ef4444",
  "#fbbf24",
  "#3b82f6",
  "#a21caf",
  "#14b8a6",
  "#eab308",
  "#f472b6",
];

export function getColors(labels: string[], config: any, idx = 0) {
  // 1. Tableau de couleurs fourni (priorité)
  const customColors =
    config.metricStyles?.[idx]?.colors || config.widgetParams?.colors;
  if (Array.isArray(customColors) && customColors.length > 0) {
    return labels.map((_, i) => customColors[i % customColors.length]);
  } else if (config.metricStyles?.[idx]?.color) {
    // 2. Couleur unique fournie
    if (labels.length === 1) {
      return [config.metricStyles[idx].color];
    } else {
      return defaultColors;
    }
  } else if (config.color) {
    // 3. Couleur unique globale
    if (labels.length === 1) {
      return [config.color];
    } else {
      return defaultColors;
    }
  }
  return defaultColors;
}

export function getLegendPosition(config: any) {
  return config.widgetParams?.legendPosition || config.legendPosition || "top";
}

export function getTitle(config: any) {
  return config.widgetParams?.title || config.title;
}

export function getTitleAlign(config: any) {
  return config.widgetParams?.titleAlign || config.titleAlign || "center";
}
