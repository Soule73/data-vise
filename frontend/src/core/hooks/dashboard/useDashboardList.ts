import { useState, useCallback, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useDashboardsQuery,
  deleteDashboardQuery,
} from "@repositories/dashboards";
import { useNotificationStore } from "@store/notification";
import { useNavigate } from "react-router-dom";
import { useDashboardStore } from "@store/dashboard";
import { useUserStore } from "@store/user";
import type { Dashboard } from "@type/dashboardTypes";

export function useDashboardList() {
  const { data: dashboards = [], isLoading } = useDashboardsQuery();
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDashboard, setSelectedDashboard] = useState<Dashboard | null>(
    null
  );
  const [deleteLoading, setDeleteLoading] = useState(false);
  const showNotification = useNotificationStore((s) => s.showNotification);
  const setBreadcrumb = useDashboardStore((s) => s.setBreadcrumb);
  const navigate = useNavigate();
  const hasPermission = useUserStore((s) => s.hasPermission);

  useEffect(() => {
    setBreadcrumb([{ url: "/dashboards", label: "Tableaux de bord" }]);
  }, [setBreadcrumb]);

  const handleDelete = useCallback(async () => {
    if (!selectedDashboard) return;
    setDeleteLoading(true);
    try {
      await deleteDashboardQuery({
        dashboardId: selectedDashboard._id,
        queryClient,
      });
      setModalOpen(false);
      setSelectedDashboard(null);
      showNotification({
        open: true,
        type: "success",
        title: "Dashboard supprimé",
        description: `Le dashboard a bien été supprimé.`,
      });
    } catch (error) {
      console.error("Erreur lors de la suppression du dashboard:", error);
      showNotification({
        open: true,
        type: "error",
        title: "Erreur de suppression",
        description: `Une erreur est survenue lors de la suppression du dashboard.`,
      });
    } finally {
      setDeleteLoading(false);
    }
  }, [selectedDashboard, queryClient, showNotification]);

  const columns = [
    { key: "title", label: "Titre" },
    {
      key: "widgets",
      label: "Widgets",
      render: (row: Dashboard) => row.layout?.length || 0,
    },
  ];

  return {
    dashboards,
    isLoading,
    modalOpen,
    setModalOpen,
    selectedDashboard,
    setSelectedDashboard,
    deleteLoading,
    handleDelete,
    columns,
    navigate,
    hasPermission,
  };
}
