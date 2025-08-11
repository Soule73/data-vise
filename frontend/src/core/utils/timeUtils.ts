import type { IntervalUnit } from "@type/dashboardTypes";

/**
 * Convertit une valeur et une unité d'intervalle en millisecondes.
 * @param value Valeur numérique de l'intervalle
 * @param unit Unité de l'intervalle (second, minute, hour, day, week, month, year)
 * @returns Nombre de millisecondes correspondant, ou undefined si non supporté
 */
export function intervalToMs(
  value: number | undefined,
  unit: IntervalUnit | undefined
): number | undefined {
  if (!value || !unit) return undefined;
  switch (unit) {
    case "second":
      return value * 1000;
    case "minute":
      return value * 60 * 1000;
    case "hour":
      return value * 60 * 60 * 1000;
    case "day":
      return value * 24 * 60 * 60 * 1000;
    case "week":
      return value * 7 * 24 * 60 * 60 * 1000;
    case "month":
      return value * 30 * 24 * 60 * 60 * 1000; // approximation
    case "year":
      return value * 365 * 24 * 60 * 60 * 1000; // approximation
    default:
      return undefined;
  }
}

/**
 * Formate l'unité d'intervalle en français (singulier/pluriel)
 */
export function formatUnitFr(
  unit: IntervalUnit | undefined,
  value: number
): string {
  if (!unit) return "inconnu";
  switch (unit) {
    case "second":
      return value > 1 ? "secondes" : "seconde";
    case "minute":
      return value > 1 ? "minutes" : "minute";
    case "hour":
      return value > 1 ? "heures" : "heure";
    case "day":
      return value > 1 ? "jours" : "jour";
    case "week":
      return value > 1 ? "semaines" : "semaine";
    case "month":
      return "mois";
    case "year":
      return value > 1 ? "années" : "année";
    default:
      return unit;
  }
}

export const INTERVAL_UNITS: { label: string; value: IntervalUnit }[] = [
  { label: "Secondes", value: "second" },
  { label: "Minutes", value: "minute" },
  { label: "Heures", value: "hour" },
  { label: "Jours", value: "day" },
  { label: "Semaines", value: "week" },
  { label: "Mois", value: "month" },
  { label: "Années", value: "year" },
];

/**
 * Formate une date en chaîne courte (fr-FR, date + heure)
 */
export function formatShortDateTime(date: Date): string {
  return date.toLocaleString("fr-FR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
