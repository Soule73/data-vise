import { useEffect, useState, useMemo } from "react";
import { useDashboardStore } from "@store/dashboard";
import { ROUTES } from "@constants/routes";
import {
  useWidgetsQuery,
  useDeleteWidgetMutation,
} from "@repositories/widgets";
import { useUserStore } from "@store/user";
import { useSourcesQuery } from "@/data/repositories/datasources";
import { useQueryClient } from "@tanstack/react-query";
import { WIDGETS } from "@adapters/visualizations";
import type { DataSource } from "@type/dataSource";
import type { Widget } from "@type/widgetTypes";

export function useWidgetListPage() {
  const queryClient = useQueryClient();
  const setBreadcrumb = useDashboardStore((s) => s.setBreadcrumb);
  useEffect(() => {
    setBreadcrumb([{ url: ROUTES.widgets, label: "Visualisations" }]);
  }, [setBreadcrumb]);

  // Chargement des widgets depuis l'API
  const { data: widgets = [], isLoading } = useWidgetsQuery();
  const { data: sources = [] } = useSourcesQuery({ queryClient });

  const tableData = useMemo(
    () => {
      const widgetsArray: Widget[] = Array.isArray(widgets) ? widgets : [];
      const sourcesArray: DataSource[] = Array.isArray(sources) ? sources : [];
      return widgetsArray.map((w) => ({
        ...w,
        typeLabel: WIDGETS[w.type as keyof typeof WIDGETS]?.label || w.type,
        dataSourceId:
          sourcesArray.find((s) => String(s._id) === String(w.dataSourceId))
            ?.name || w.dataSourceId,
      }));
    },
    [widgets, sources]
  );

  // Modales et sélection
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<Widget | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState<Widget | null>(null);
  const hasPermission = useUserStore((s) => s.hasPermission);

  const deleteMutation = useDeleteWidgetMutation({
    queryClient,
    onSuccess: () => {
      setDeleteModalOpen(false);
      setSelectedWidget(null);
    },
    onError: () => {
      setDeleteModalOpen(false);
      setSelectedWidget(null);
    },
  });

  return {
    tableData,
    isLoading,
    modalOpen,
    setModalOpen,
    selectedConfig,
    setSelectedConfig,
    deleteModalOpen,
    setDeleteModalOpen,
    selectedWidget,
    setSelectedWidget,
    deleteMutation,
    hasPermission,
  };
}
