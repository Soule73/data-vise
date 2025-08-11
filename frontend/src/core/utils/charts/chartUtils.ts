/* eslint-disable @typescript-eslint/no-explicit-any */
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
    config.metricStyles?.[idx]?.colors;

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

// Utilitaire : détecte si un label est un timestamp ISO ou une date formatée
export function isIsoTimestamp(val: any): boolean {
  return typeof val === "string" &&
    (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(val) || // ISO avec heures
      /^\d{4}-\d{2}-\d{2}$/.test(val) ||           // Date simple
      /^\d{4}-\d{2}$/.test(val) ||                 // Année-mois
      /^\d{4}-W\d{1,2}$/.test(val));               // Semaine
}

// Utilitaire : tous les labels sont-ils du même jour ?
export function allSameDay(labels: string[]): boolean {
  if (!labels || labels.length === 0) return false;

  // Pour les dates ISO avec heures
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(labels[0])) {
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

  return false;
}

// Utilitaire : formate un label timestamp pour l'axe X
export function formatXTicksLabel(raw: string, onlyTimeIfSameDay = false): string {
  if (!raw || typeof raw !== 'string') return String(raw);

  // Déjà formaté (format lisible français) - ne pas reformater
  if (!/^\d{4}/.test(raw) && !raw.includes('T') && !raw.includes('Z')) {
    return raw;
  }

  // Format ISO avec timezone (ex: 2023-01-15T14:30:00Z)
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z?$/.test(raw)) {
    const d = new Date(raw);
    if (isNaN(d.getTime())) return raw;

    if (onlyTimeIfSameDay) {
      return d.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return d.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  }

  // Format date simple (ex: 2023-01-15)
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    const d = new Date(raw);
    if (isNaN(d.getTime())) return raw;
    return d.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
    });
  }

  // Format année-mois (ex: 2023-01)
  if (/^\d{4}-\d{2}$/.test(raw)) {
    const [year, month] = raw.split('-');
    const d = new Date(parseInt(year), parseInt(month) - 1);
    return d.toLocaleDateString("fr-FR", { month: "short" });
  }

  // Format semaine (ex: 2023-W1)
  if (/^\d{4}-W\d{1,2}$/.test(raw)) {
    const match = raw.match(/(\d{4})-W(\d{1,2})/);
    if (match) {
      return `S${match[2]}`;
    }
  }

  // Format année seule (ex: 2023)
  if (/^\d{4}$/.test(raw)) {
    return raw;
  }

  return raw;
}

// Formate une valeur pour affichage dans un tooltip (date/datetime ou autre)
export function formatTooltipValue(val: any): string {
  if (!val || typeof val !== 'string') return String(val);

  // Format ISO avec timezone (ex: 2023-01-15T14:30:00Z)
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z?$/.test(val)) {
    const d = new Date(val);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  }

  // Format date simple (ex: 2023-01-15)
  if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
    const d = new Date(val);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    }
  }

  return String(val);
}
