import { useState, useEffect } from "react";
import {
  fetchDashboard,
  saveDashboardLayout,
  createDashboard as apiCreateDashboard,
} from "@/data/services/dashboard";
import { useDashboardStore } from "@/core/store/dashboard";
import { useNotificationStore } from "@/core/store/notification";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { DashboardLayoutItem } from "../types/dashboard-types";
import { useSources } from "./useSources";
import type { IntervalUnit } from "@/core/types/dashboard-model";

export function useDashboard(onSaveCallback?: (success: boolean) => void) {
  const params = useParams();
  const location = useLocation();
  const isCreate =
    typeof window !== "undefined" &&
    location.pathname.includes("/dashboards/create");
  const dashboardId = params.id;

  // Query dashboard uniquement si pas en création
  const { data: dashboard, isLoading } = useQuery({
    queryKey: ["dashboard", dashboardId],
    queryFn: () => (dashboardId ? fetchDashboard(dashboardId) : undefined),
    enabled: !isCreate && !!dashboardId,
  });
  const {
    data: sources = [],
    isLoading: isLoadingSources,
    // refetchWidgets
  } = useSources();
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [selectOpen, setSelectOpen] = useState(false);
  // Store Zustand pour l'état global du dashboard
  const layout = useDashboardStore((s) => s.layout);
  const setLayout = useDashboardStore((s) => s.setLayout);
  const editMode = useDashboardStore((s) => s.editMode);
  const setEditMode = useDashboardStore((s) => s.setEditMode);
  const hasUnsavedChanges = useDashboardStore((s) => s.hasUnsavedChanges);
  const setHasUnsavedChanges = useDashboardStore((s) => s.setHasUnsavedChanges);
  const showNotification = useNotificationStore((s) => s.showNotification);
  const setBreadcrumb = useDashboardStore((s) => s.setBreadcrumb);
  const navigate = useNavigate();

  // Dashboard local temporaire pour la création
  const [localDashboard, setLocalDashboard] = useState<{
    _id?: string;
    title: string;
    layout: DashboardLayoutItem[];
  }>({ title: "", layout: [] });

  // Gestion du titre local et du modal
  const [titleModalOpen, setTitleModalOpen] = useState(false);
  const [pendingTitle, setPendingTitle] = useState("");

  // --- Gestion centralisée de la config avancée ---
  const [autoRefreshIntervalValue, setAutoRefreshIntervalValue] = useState<
    number | undefined
  >(dashboard?.autoRefreshIntervalValue);
  const [autoRefreshIntervalUnit, setAutoRefreshIntervalUnit] =
    useState<IntervalUnit>(dashboard?.autoRefreshIntervalUnit ?? "minute");
  // autoRefreshEnabled devient calculé automatiquement
  const [timeRangeIntervalValue, setTimeRangeIntervalValue] = useState<
    number | null
  >(dashboard?.timeRange?.intervalValue ?? null);
  const [timeRangeIntervalUnit, setTimeRangeIntervalUnit] =
    useState<IntervalUnit | null>(dashboard?.timeRange?.intervalUnit ?? null);
  const [timeRangeFrom, setTimeRangeFrom] = useState<string | null>(
    dashboard?.timeRange?.from ?? null
  );
  const [timeRangeTo, setTimeRangeTo] = useState<string | null>(
    dashboard?.timeRange?.to ?? null
  );

  // Synchronise le layout Zustand avec le dashboard local uniquement au premier montage en création
  useEffect(() => {
    if (isCreate && layout.length === 0 && localDashboard.layout.length > 0) {
      setLayout(localDashboard.layout);
    }
    // eslint-disable-next-line
  }, []);

  // Restaure le layout depuis le backend uniquement en mode édition (jamais en création)
  useEffect(() => {
    if (!isCreate && dashboard && dashboard.layout) {
      setLayout(dashboard.layout);
    }
    // eslint-disable-next-line
  }, [dashboard, isCreate]);

  // Gestion du titre local en création et édition
  useEffect(() => {
    if (dashboard && dashboard.title) {
      setPendingTitle(dashboard.title);
    } else if (isCreate) {
      setPendingTitle(dashboard?.title || "");
    }
  }, [dashboard?._id, dashboard?.title, isCreate]);

  // Gestion du breadcrumb (centralisé ici)
  useEffect(() => {
    if (isCreate) {
      setBreadcrumb([
        { url: "/dashboards", label: "Tableaux de bord" },
        {
          url: "/dashboards/create",
          label: pendingTitle || "Nouveau dashboard",
        },
      ]);
    } else if (dashboard && dashboard._id && dashboard.title) {
      setBreadcrumb([
        { url: "/dashboards", label: "Tableaux de bord" },
        { url: `/dashboards/${dashboard._id}`, label: dashboard.title },
      ]);
    }
  }, [isCreate, dashboard?._id, dashboard?.title, pendingTitle, setBreadcrumb]);

  // Restaure la config avancée depuis le backend
  useEffect(() => {
    setAutoRefreshIntervalValue(dashboard?.autoRefreshIntervalValue ?? 1);
    setAutoRefreshIntervalUnit(dashboard?.autoRefreshIntervalUnit ?? "minute");
    setTimeRangeIntervalValue(
      dashboard?.timeRange?.intervalValue !== undefined
        ? dashboard.timeRange.intervalValue
        : null
    );
    setTimeRangeIntervalUnit(
      dashboard?.timeRange?.intervalUnit !== undefined
        ? dashboard.timeRange.intervalUnit
        : null
    );
    setTimeRangeFrom(dashboard?.timeRange?.from ?? null);
    setTimeRangeTo(dashboard?.timeRange?.to ?? null);
  }, [dashboard?._id]);

  // Ajout d'un widget au dashboard (local ou distant)
  const handleAddWidget = (widget: any) => {
    const newItem = {
      widgetId: widget.widgetId,
      width: "48%",
      height: 300,
      x: 0,
      y: isCreate ? localDashboard.layout.length : layout.length,
      widget,
    };
    if (isCreate) {
      setLocalDashboard((ld) => ({ ...ld, layout: [...ld.layout, newItem] }));
    } else {
      setLayout([...layout, newItem]);
    }
    setHasUnsavedChanges(true);
  };

  // Gestion du titre local en création
  const setLocalTitle = (title: string) => {
    if (isCreate) setLocalDashboard((ld) => ({ ...ld, title }));
    setPendingTitle(title);
  };

  // Sauvegarde du layout côté backend
  const handleSaveDashboard = async (updates?: Partial<{ title: string }>) => {
    setSaving(true);
    try {
      // Suppression du log debug
      const layoutToSave = useDashboardStore.getState().layout;
      await saveDashboardLayout(
        (dashboardId || localDashboard._id) ?? "",
        layoutToSave.map(
          ({
            widgetId,
            width,
            height,
            x,
            y,
          }: {
            widgetId: string;
            width: string;
            height: number;
            x: number;
            y: number;
          }) => ({ widgetId, width, height, x, y })
        ),
        updates?.title || localDashboard.title,
        {
          autoRefreshIntervalValue,
          autoRefreshIntervalUnit,
          timeRange: buildTimeRange(),
        }
      );
      setHasUnsavedChanges(false);
      showNotification({
        open: true,
        type: "success",
        title: "Sauvegradé",
        description: "Les modifications ont bien été  sauvegardé !",
      });
      queryClient.invalidateQueries({
        queryKey: ["dashboard", dashboardId ?? ""],
      });
    } catch (e) {
      showNotification({
        open: true,
        type: "error",
        title: "Erreur",
        description: "Erreur lors de la sauvegarde",
      });
      if (onSaveCallback) onSaveCallback(false);
    } finally {
      setSaving(false);
    }
  };

  // Création d'un nouveau dashboard (mode création)
  const handleCreateDashboard = async (title: string) => {
    setSaving(true);
    try {
      const newDashboard = await apiCreateDashboard({
        title,
        layout: localDashboard.layout,
      });
      // Invalide le cache du dashboard et de la liste
      await queryClient.invalidateQueries({
        queryKey: ["dashboard", newDashboard._id],
      });
      await queryClient.invalidateQueries({ queryKey: ["dashboards"] });
      showNotification({
        open: true,
        type: "success",
        title: "Dashboard créé",
        description: "Votre dashboard a bien été créé.",
      });
      navigate(`/dashboards/${newDashboard._id}`);
      return newDashboard;
    } catch (e: any) {
      showNotification({
        open: true,
        type: "error",
        title: "Erreur",
        description: "La création du dashboard a échoué.",
      });
      if (onSaveCallback) onSaveCallback(false);
    } finally {
      setSaving(false);
    }
  };

  // Gestion du swap et du resize (drag & drop)
  const handleSwapLayout = (newLayout: DashboardLayoutItem[]) => {
    // Suppression des logs debug
    const cleanedLayout = newLayout.map(
      ({ widgetId, width, height, x, y }) => ({
        widgetId,
        width,
        height,
        x,
        y,
      })
    );
    if (isCreate) {
      setLocalDashboard((ld) => ({
        ...ld,
        layout: cleanedLayout,
      }));
    } else {
      setLayout(cleanedLayout);
    }
    setHasUnsavedChanges(true);
  };

  // Handler pour ouvrir le modal de titre
  const handleSave = () => setTitleModalOpen(true);

  // Handler pour confirmer la sauvegarde (création ou édition)
  const handleConfirmSave = async () => {
    if (isCreate) {
      try {
        await handleCreateDashboard(pendingTitle);
        setTitleModalOpen(false);
      } catch (e) {}
      return;
    }
    await handleSaveDashboard({ title: pendingTitle });
    setEditMode(false);
    setTitleModalOpen(false);
  };

  // Handler pour annuler l'édition
  const handleCancelEdit = () => {
    if (dashboard && dashboard.layout) {
      handleSwapLayout(dashboard.layout);
    }
    if (dashboard && dashboard.title) {
      setPendingTitle(dashboard.title);
    }
    setEditMode(false);
  };

  // Handler pour sauvegarder la config avancée
  const handleSaveConfig = async () => {
    await handleSaveDashboard({
      autoRefreshIntervalValue,
      autoRefreshIntervalUnit,
      timeRange: buildTimeRange(),
    } as any);
  };

  const buildTimeRange = () => {
    const tr: any = {
      from: timeRangeFrom || undefined,
      intervalValue: timeRangeIntervalValue,
      intervalUnit: timeRangeIntervalUnit,
    };
    if (timeRangeTo && timeRangeTo !== "") {
      tr.to = timeRangeTo;
    }
    return tr;
  };

  // Expose le dashboard à utiliser (local en création, sinon backend)
  const dashboardToUse = isCreate ? localDashboard : dashboard;
  const layoutToUse = isCreate ? localDashboard.layout : layout;

  return {
    isLoading,
    isLoadingSources,
    sources,
    saving,
    selectOpen,
    setSelectOpen,
    layout: layoutToUse,
    editMode,
    setEditMode,
    hasUnsavedChanges,
    handleAddWidget,
    handleSaveDashboard,
    handleSwapLayout,
    handleCreateDashboard,
    dashboard: dashboardToUse,
    setLocalTitle,
    // Ajouts pour centralisation UI
    titleModalOpen,
    setTitleModalOpen,
    pendingTitle,
    setPendingTitle,
    handleSave,
    handleConfirmSave,
    handleCancelEdit,
    isCreate,
    // --- Gestion centralisée de la config avancée ---
    autoRefreshIntervalValue: autoRefreshIntervalValue ?? undefined,
    setAutoRefreshIntervalValue,
    autoRefreshIntervalUnit,
    setAutoRefreshIntervalUnit,
    timeRangeIntervalValue,
    setTimeRangeIntervalValue,
    timeRangeIntervalUnit,
    setTimeRangeIntervalUnit,
    timeRangeFrom,
    setTimeRangeFrom,
    timeRangeTo,
    setTimeRangeTo,
    handleSaveConfig,
  };
}
