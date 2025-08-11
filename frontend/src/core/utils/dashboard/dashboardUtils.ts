/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Dashboard, IntervalUnit } from "@type/dashboardTypes";

/**
 * Calcule la période effective selon le mode (absolu/relatif).
 */
export function getEffectiveTimeRange({
  timeRangeMode,
  relativeValue,
  relativeUnit,
  timeRangeFrom,
  timeRangeTo,
}: {
  timeRangeMode: "absolute" | "relative";
  relativeValue?: number;
  relativeUnit?: IntervalUnit;
  timeRangeFrom?: string | null;
  timeRangeTo?: string | null;
}) {
  if (timeRangeMode === "relative" && relativeValue && relativeUnit) {
    const now = new Date();
    const from = new Date(now);
    switch (relativeUnit) {
      case "second":
        from.setSeconds(now.getSeconds() - relativeValue);
        break;
      case "minute":
        from.setMinutes(now.getMinutes() - relativeValue);
        break;
      case "hour":
        from.setHours(now.getHours() - relativeValue);
        break;
      case "day":
        from.setDate(now.getDate() - relativeValue);
        break;
      case "week":
        from.setDate(now.getDate() - 7 * relativeValue);
        break;
      case "month":
        from.setMonth(now.getMonth() - relativeValue);
        break;
      case "year":
        from.setFullYear(now.getFullYear() - relativeValue);
        break;
    }
    return {
      from: from.toISOString(),
      to: now.toISOString(),
      intervalValue: relativeValue,
      intervalUnit: relativeUnit,
    };
  }
  return {
    from: timeRangeFrom || undefined,
    to: timeRangeTo || undefined,
    intervalValue: undefined,
    intervalUnit: undefined,
  };
}

/**
 * Construit l'objet timeRange à sauvegarder selon le mode.
 */
export function buildTimeRange({
  timeRangeMode,
  relativeValue,
  relativeUnit,
  timeRangeFrom,
  timeRangeTo,
}: {
  timeRangeMode: "absolute" | "relative";
  relativeValue?: number;
  relativeUnit?: IntervalUnit;
  timeRangeFrom?: string | null;
  timeRangeTo?: string | null;
}) {
  if (timeRangeMode === "relative") {
    if (relativeValue && relativeUnit) {
      return { intervalValue: relativeValue, intervalUnit: relativeUnit };
    }
    return {};
  } else {
    const tr: any = {};
    if (timeRangeFrom) tr.from = timeRangeFrom;
    if (timeRangeTo) tr.to = timeRangeTo;
    return tr;
  }
}

/**
 * Calcule l'intervalle d'auto-refresh en ms selon l'unité.
 */
export function getAutoRefreshMs(value?: number, unit?: IntervalUnit): number {
  if (!value || !unit) return 60 * 1000;
  switch (unit) {
    case "second":
      return value * 1000;
    case "minute":
      return value * 60 * 1000;
    case "hour":
      return value * 60 * 60 * 1000;
    case "day":
      return value * 24 * 60 * 60 * 1000;
    default:
      return 60 * 1000;
  }
}

/**
 * Retourne le breadcrumb pour le dashboard (création ou édition).
 */
export function getDashboardBreadcrumb({
  isCreate,
  dashboard,
  pendingTitle,
  ROUTES,
}: {
  isCreate: boolean;
  dashboard: any;
  pendingTitle: string;
  ROUTES: any;
}) {
  if (isCreate) {
    return [
      { url: ROUTES.dashboard, label: "Tableaux de bord" },
      {
        url: ROUTES.createDashboard,
        label: pendingTitle || "Nouveau dashboard",
      },
    ];
  } else if (dashboard && dashboard._id && dashboard.title) {
    return [
      { url: ROUTES.dashboard, label: "Tableaux de bord" },
      {
        url: ROUTES.dashboardDetail.replace(":id", dashboard._id),
        label: dashboard.title,
      },
    ];
  }
  return [];
}

/**
 * Initialise les valeurs de timeRange et autoRefresh à partir du dashboard.
 */
export function initDashboardTimeConfig(dashboard: Dashboard | undefined) {
  return {
    autoRefreshIntervalValue: dashboard?.autoRefreshIntervalValue ?? 1,
    autoRefreshIntervalUnit: dashboard?.autoRefreshIntervalUnit ?? "minute",
    timeRangeFrom: dashboard?.timeRange?.from ?? null,
    timeRangeTo: dashboard?.timeRange?.to ?? null,
    relativeValue: dashboard?.timeRange?.intervalValue,
    relativeUnit: dashboard?.timeRange?.intervalUnit,
    timeRangeMode:
      dashboard?.timeRange?.intervalValue && dashboard?.timeRange?.intervalUnit
        ? "relative"
        : "absolute",
  };
}


/**
 * Utilitaire pour générer un nom de fichier PDF propre à partir du titre du dashboard
 * @param title - Titre du dashboard
 * @returns - Nom de fichier formaté pour l'export PDF
 */
export function getDashboardPDFFileName(title?: string) {
  if (!title) return "dashboard.pdf";

  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "") + ".pdf"
  );
}
