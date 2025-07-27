// Fonctions utilitaires pour widgets ChartJS (Pie, Bar, Line)

export function aggregate(rows: any[], agg: string, field: string) {
  if (agg === "none") {
    if (rows.length === 1) return rows[0][field];
    const found = rows.find((r) => r[field] !== undefined && r[field] !== null);
    return found ? found[field] : "";
  }
  const nums = rows.map((r) => Number(r[field])).filter((v) => !isNaN(v));
  if (agg === "sum") return nums.reduce((a, b) => a + b, 0);
  if (agg === "avg")
    return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;
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

// Utilitaire : détecte si un label est un timestamp ISO
export function isIsoTimestamp(val: any): boolean {
  return typeof val === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(val);
}

// Utilitaire : tous les labels sont-ils du même jour ?
export function allSameDay(labels: string[]): boolean {
  if (!labels || labels.length === 0) return false;
  const first = new Date(labels[0]);
  return labels.every((l) => {
    const d = new Date(l);
    return (
      d.getFullYear() === first.getFullYear() &&
      d.getMonth() === first.getMonth() &&
      d.getDate() === first.getDate()
    );
  });
}

// Utilitaire : formate un label timestamp pour l'axe X
export function formatXTicksLabel(raw: string, onlyTimeIfSameDay = false): string {
  if (!isIsoTimestamp(raw)) return raw;
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  if (onlyTimeIfSameDay) {
    return d.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else {
    return d.toLocaleString("fr-FR", {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
}

// Formate une valeur pour affichage dans un tooltip (date/datetime ou autre)
export function formatTooltipValue(val: any): string {
  if (isIsoTimestamp(val)) {
    const d = new Date(val);
    if (!isNaN(d.getTime())) {
      // Affichage date+heure lisible
      return d.toLocaleString("fr-FR", {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    }
  }
  return String(val);
}
