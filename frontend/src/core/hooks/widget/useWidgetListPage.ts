import { useEffect, useState, useMemo } from "react";
import { useDashboardStore } from "@/core/store/dashboard";
import { ROUTES } from "@/core/constants/routes";
import {
  widgetsQuery,
  useDeleteWidgetMutation,
} from "@/data/repositories/widgets";
import { useUserStore } from "@/core/store/user";
import { sourcesQuery } from "@/data/repositories/sources";
import { useQueryClient } from "@tanstack/react-query";
import { WIDGETS } from "@/data/adapters/visualizations";
import type { DataSource } from "@/core/types/data-source";
import type { Widget } from "@/core/types/widget-types";

export function useWidgetListPage() {
  const queryClient = useQueryClient();
  const setBreadcrumb = useDashboardStore((s) => s.setBreadcrumb);
  useEffect(() => {
    setBreadcrumb([{ url: ROUTES.widgets, label: "Visualisations" }]);
  }, [setBreadcrumb]);

  // Chargement des widgets depuis l'API
  const { data: widgets = [], isLoading } = widgetsQuery();
  const widgetsArray: Widget[] = Array.isArray(widgets) ? widgets : [];

  const { data: sources = [] } = sourcesQuery({ queryClient });
  const sourcesArray: DataSource[] = Array.isArray(sources) ? sources : [];

  const tableData = useMemo(
    () =>
      widgetsArray.map((w) => ({
        ...w,
        typeLabel: WIDGETS[w.type as keyof typeof WIDGETS]?.label || w.type,
        dataSourceId:
          sourcesArray.find((s) => String(s._id) === String(w.dataSourceId))
            ?.name || w.dataSourceId,
      })),
    [widgetsArray, sourcesArray]
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
