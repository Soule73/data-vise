import { useEffect } from "react";
import { useDashboardStore } from "@/core/store/dashboard";
import { ROUTES } from "@/core/constants/routes";
import {
  sharedDashboardQuery,
  sharedDashboardSourcesQuery,
} from "@/data/repositories/dashboards";

export function useDashboardShare(shareId?: string) {
  const {
    data: dashboard,
    isLoading: loading,
    error: dashboardError,
  } = sharedDashboardQuery(shareId);
  const {
    data: sources = [],
    isLoading: loadingSources,
    error: sourcesError,
  } = sharedDashboardSourcesQuery(shareId);

  const setBreadcrumb = useDashboardStore((s) => s.setBreadcrumb);
  useEffect(() => {
    setBreadcrumb([
      {
        url: ROUTES.dashboardShare.replace(":shareId", shareId || ""),
        label: `Tableau de bord partagé (${dashboard?.title ?? ""})`,
      },
    ]);
  }, [setBreadcrumb, shareId, dashboard]);

  const error = dashboardError || sourcesError;

  return {
    dashboard,
    sources,
    loading: loading || loadingSources,
    error: error
      ? (error as any)?.response?.status === 404
        ? "Ce tableau de bord n'est pas disponible ou le lien a été désactivé."
        : "Erreur lors du chargement du dashboard."
      : null,
    errorCode: (error as any)?.response?.status || 500,
  };
}
