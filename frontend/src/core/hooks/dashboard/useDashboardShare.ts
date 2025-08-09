/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useDashboardStore } from "@store/dashboard";
import { ROUTES } from "@constants/routes";
import {
  useSharedDashboardQuery,
  useSharedDashboardSourcesQuery,
} from "@repositories/dashboards";

export function useDashboardShare(shareId?: string) {
  const {
    data: dashboard,
    isLoading: loading,
    error: dashboardError,
  } = useSharedDashboardQuery(shareId);
  const {
    data: sources = [],
    isLoading: loadingSources,
    error: sourcesError,
  } = useSharedDashboardSourcesQuery(shareId);

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
