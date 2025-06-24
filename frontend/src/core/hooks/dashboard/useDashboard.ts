import { useState, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useDashboardStore } from "@/core/store/dashboard";
import { useNotificationStore } from "@/core/store/notification";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import type { DashboardLayoutItem } from "../../types/dashboard-types";
import { sourcesQuery } from "../../../data/repositories/sources";
import type { IntervalUnit } from "@/core/types/dashboard-types";
import { useUserStore } from "../../store/user";
import { ROUTES } from "../../constants/routes";
import { dashboardIdQuery } from "@/data/repositories/dashboards";
import {
  updateDashboardQuery,
  createDashboardQuery,
} from "@/data/repositories/dashboards";
import {
  getEffectiveTimeRange,
  buildTimeRange,
  getAutoRefreshMs,
  getDashboardBreadcrumb,
  initDashboardTimeConfig,
} from "@/core/utils/dashboardUtils";
import {
  enableDashboardShare,
  disableDashboardShare,
} from "@/data/services/dashboard";
import { exportDashboardToPDF } from "@/core/utils/dashboardExportUtils";

// Hook principal pour la gestion d'un dashboard (création/édition)
export function useDashboard(onSaveCallback?: (success: boolean) => void) {
  // --- Routing & état global ---
  const params = useParams();
  const location = useLocation();
  const isCreate =
    typeof window !== "undefined" &&
    location.pathname.includes("/dashboards/create");
  const dashboardId = params.id;

  // --- QueryClient React Query ---
  const queryClient = useQueryClient();

  // --- Query dashboard (lecture backend) ---
  const { data: dashboard, isLoading } = dashboardIdQuery(
    dashboardId,
    !isCreate && !!dashboardId
  );
  const { data: sources = [], isLoading: isLoadingSources } = sourcesQuery({
    queryClient,
  });

  // --- Stores Zustand ---
  const layout = useDashboardStore((s) => s.layout);
  const setLayout = useDashboardStore((s) => s.setLayout);
  const editMode = useDashboardStore((s) => s.editMode);
  const setEditMode = useDashboardStore((s) => s.setEditMode);
  const hasUnsavedChanges = useDashboardStore((s) => s.hasUnsavedChanges);
  const setHasUnsavedChanges = useDashboardStore((s) => s.setHasUnsavedChanges);
  const showNotification = useNotificationStore((s) => s.showNotification);
  const setBreadcrumb = useDashboardStore((s) => s.setBreadcrumb);
  const navigate = useNavigate();

  const hasPermission = useUserStore((s) => s.hasPermission);

  // --- États locaux ---
  const [saving, setSaving] = useState(false);
  const [selectOpen, setSelectOpen] = useState(false);
  const [localDashboard, setLocalDashboard] = useState<{
    _id?: string;
    title: string;
    layout: DashboardLayoutItem[];
  }>({ title: "", layout: [] });
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [pendingTitle, setPendingTitle] = useState("");
  const [autoRefreshIntervalValue, setAutoRefreshIntervalValue] = useState<
    number | undefined
  >(dashboard?.autoRefreshIntervalValue);
  const [autoRefreshIntervalUnit, setAutoRefreshIntervalUnit] = useState<
    IntervalUnit | undefined
  >(dashboard?.autoRefreshIntervalUnit ?? "minute");
  const [timeRangeFrom, setTimeRangeFrom] = useState<string | null>(
    dashboard?.timeRange?.from ?? null
  );
  const [timeRangeTo, setTimeRangeTo] = useState<string | null>(
    dashboard?.timeRange?.to ?? null
  );
  const [forceRefreshKey, setForceRefreshKey] = useState(0);
  const [relativeValue, setRelativeValue] = useState<number | undefined>(
    undefined
  );
  const [relativeUnit, setRelativeUnit] = useState<IntervalUnit | undefined>(
    "minute"
  );
  const [timeRangeMode, setTimeRangeMode] = useState<"absolute" | "relative">(
    "absolute"
  );
  const [visibility, setVisibility] = useState<"public" | "private">("private");
  // --- Export PDF Modal ---
  const [exportPDFModalOpen, setExportPDFModalOpen] = useState(false);

  // Utilitaire pour générer un nom de fichier PDF propre à partir du titre du dashboard
  function getDashboardPDFFileName(title?: string) {
    if (!title) return "dashboard.pdf";
    // Remplace les espaces par des tirets, enlève les caractères spéciaux, minuscule
    return (
      title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "") + ".pdf"
    );
  }

  // Handler appelé par le bouton d'export (ouvre le modal)
  const handleOpenExportPDFModal = () => setExportPDFModalOpen(true);
  // Handler appelé par le modal pour lancer l'export
  const handleExportPDFConfirm = async (options: {
    orientation: "portrait" | "landscape";
  }) => {
    setExportPDFModalOpen(false);
    const filename = getDashboardPDFFileName(dashboard?.title);
    await exportDashboardToPDF({
      gridSelector: ".dashboard-grid",
      filename,
      orientation: options.orientation,
    });
  };

  // --- Partage public ---
  const [shareLoading, setShareLoading] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);
  const [shareLink, setShareLink] = useState<string | null>(null);

  const isShareEnabled = !isCreate && dashboard?.shareEnabled;
  const currentShareId = !isCreate ? dashboard?.shareId : null;

  const handleEnableShare = async () => {
    if (!dashboardId) return;
    setShareLoading(true);
    setShareError(null);
    try {
      const { shareId } = await enableDashboardShare(dashboardId);
      setShareLink(window.location.origin + "/dashboard/share/" + shareId);
      await queryClient.invalidateQueries({
        queryKey: ["dashboard", dashboardId],
      });
    } catch (e: any) {
      setShareError(e?.message || "Erreur lors de l'activation du partage");
    } finally {
      setShareLoading(false);
    }
  };

  const handleDisableShare = async () => {
    if (!dashboardId) return;
    setShareLoading(true);
    setShareError(null);
    try {
      await disableDashboardShare(dashboardId);
      setShareLink(null);
      await queryClient.invalidateQueries({
        queryKey: ["dashboard", dashboardId],
      });
    } catch (e: any) {
      setShareError(e?.message || "Erreur lors de la désactivation du partage");
    } finally {
      setShareLoading(false);
    }
  };

  const handleCopyShareLink = async () => {
    if (!currentShareId) return;
    const url = window.location.origin + "/dashboard/share/" + currentShareId;
    try {
      await navigator.clipboard.writeText(url);
      showNotification({
        open: true,
        type: "success",
        title: "Lien copié",
        description: "Le lien de partage a été copié dans le presse-papiers.",
      });
    } catch {
      showNotification({
        open: true,
        type: "error",
        title: "Erreur",
        description: "Impossible de copier le lien.",
      });
    }
  };

  // --- Handlers UI ---
  const openAddWidgetModal = (e: React.MouseEvent) => {
    e.preventDefault();
    setSelectOpen(true);
  };

  // --- Helpers : calculs dynamiques ---
  const [effectiveTimeRange, setEffectiveTimeRange] = useState(() =>
    getEffectiveTimeRange({
      timeRangeMode,
      relativeValue,
      relativeUnit,
      timeRangeFrom,
      timeRangeTo,
    })
  );
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // --- Effets : synchronisation et restauration ---
  useEffect(() => {
    if (isCreate && layout.length === 0 && localDashboard.layout.length > 0) {
      setLayout(localDashboard.layout);
    }
  }, []);
  useEffect(() => {
    if (!isCreate && dashboard && dashboard.layout) {
      setLayout(dashboard.layout);
    }
  }, [dashboard, isCreate]);
  useEffect(() => {
    if (dashboard && dashboard.title) {
      setPendingTitle(dashboard.title);
    } else if (isCreate) {
      setPendingTitle(dashboard?.title || "");
    }
  }, [dashboard?._id, dashboard?.title, isCreate]);
  useEffect(() => {
    setBreadcrumb(
      getDashboardBreadcrumb({
        isCreate,
        dashboard,
        pendingTitle,
        ROUTES,
      })
    );
  }, [isCreate, dashboard?._id, dashboard?.title, pendingTitle, setBreadcrumb]);
  useEffect(() => {
    const cfg = initDashboardTimeConfig(dashboard);
    setAutoRefreshIntervalValue(cfg.autoRefreshIntervalValue);
    setAutoRefreshIntervalUnit(cfg.autoRefreshIntervalUnit);
    setTimeRangeFrom(cfg.timeRangeFrom);
    setTimeRangeTo(cfg.timeRangeTo);
    setRelativeValue(cfg.relativeValue);
    setRelativeUnit(cfg.relativeUnit);
    setTimeRangeMode(cfg.timeRangeMode as "absolute" | "relative");
  }, [dashboard?._id]);
  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (
      timeRangeMode === "relative" &&
      relativeValue &&
      relativeUnit &&
      autoRefreshIntervalValue &&
      autoRefreshIntervalUnit
    ) {
      const ms = getAutoRefreshMs(
        autoRefreshIntervalValue,
        autoRefreshIntervalUnit
      );
      setEffectiveTimeRange(
        getEffectiveTimeRange({
          timeRangeMode,
          relativeValue,
          relativeUnit,
          timeRangeFrom,
          timeRangeTo,
        })
      );
      timerRef.current = setInterval(() => {
        setEffectiveTimeRange(
          getEffectiveTimeRange({
            timeRangeMode,
            relativeValue,
            relativeUnit,
            timeRangeFrom,
            timeRangeTo,
          })
        );
      }, ms);
    } else {
      setEffectiveTimeRange(
        getEffectiveTimeRange({
          timeRangeMode,
          relativeValue,
          relativeUnit,
          timeRangeFrom,
          timeRangeTo,
        })
      );
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [
    timeRangeMode,
    relativeValue,
    relativeUnit,
    autoRefreshIntervalValue,
    autoRefreshIntervalUnit,
    timeRangeFrom,
    timeRangeTo,
  ]);
  useEffect(() => {
    if (!isCreate && dashboard && dashboard.visibility) {
      setVisibility(dashboard.visibility);
    } else if (isCreate) {
      setVisibility("private");
    }
  }, [isCreate, dashboard?.visibility]);

  // --- Helpers : calculs secondaires ---
  const { from: effectiveFrom, to: effectiveTo } = effectiveTimeRange;
  const refreshMs = getAutoRefreshMs(
    autoRefreshIntervalValue,
    autoRefreshIntervalUnit
  );

  // --- Handlers principaux ---
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
  const setLocalTitle = (title: string) => {
    if (isCreate) setLocalDashboard((ld) => ({ ...ld, title }));
    setPendingTitle(title);
  };
  const handleSaveDashboard = async (
    updates?: Partial<{ title: string; visibility: "public" | "private" }>
  ) => {
    setSaving(true);
    try {
      // Correction : choisir le bon layout selon le mode
      const layoutToSave = isCreate
        ? localDashboard.layout
        : useDashboardStore.getState().layout;
      // DEBUG : log des données envoyées
      console.log("[DEBUG] updateDashboardQuery", {
        dashboardId,
        updates: {
          ...updates,
          layout: layoutToSave,
          autoRefreshIntervalValue,
          autoRefreshIntervalUnit,
          timeRange: buildTimeRange({
            timeRangeMode,
            relativeValue,
            relativeUnit,
            timeRangeFrom,
            timeRangeTo,
          }),
          visibility: updates?.visibility ?? visibility,
        },
      });
      await updateDashboardQuery({
        dashboardId,
        updates: {
          ...updates,
          layout: layoutToSave,
          autoRefreshIntervalValue,
          autoRefreshIntervalUnit,
          timeRange: buildTimeRange({
            timeRangeMode,
            relativeValue,
            relativeUnit,
            timeRangeFrom,
            timeRangeTo,
          }),
          visibility: updates?.visibility ?? visibility,
        },
        queryClient,
      });
      setHasUnsavedChanges(false);
      showNotification({
        open: true,
        type: "success",
        title: "Sauvegradé",
        description: "Les modifications ont bien été  sauvegardé !",
      });
    } catch (e: any) {
      // Affichage de l'erreur réelle si possible
      console.error("[ERROR] updateDashboardQuery", e);
      const errorMsg =
        e?.response?.data?.message ||
        e?.message ||
        "Erreur lors de la sauvegarde";
      showNotification({
        open: true,
        type: "error",
        title: "Erreur",
        description: errorMsg,
      });
      if (onSaveCallback) onSaveCallback(false);
    } finally {
      setSaving(false);
    }
  };
  const handleCreateDashboard = async (
    title: string,
    customVisibility?: "public" | "private"
  ) => {
    setSaving(true);
    try {
      const newDashboard = await createDashboardQuery({
        localDashboard: { ...localDashboard, title },
        visibility: customVisibility ?? visibility,
        queryClient,
      });
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
  const handleConfirmSave = async (customVisibility?: "public" | "private") => {
    if (isCreate) {
      try {
        await handleCreateDashboard(pendingTitle, customVisibility);
        setSaveModalOpen(false);
      } catch (e) {}
      return;
    }
    await handleSaveDashboard({
      title: pendingTitle,
      visibility: customVisibility ?? visibility,
    });
    setEditMode(false);
    setSaveModalOpen(false);
  };
  const handleSwapLayout = (newLayout: DashboardLayoutItem[]) => {
    if (isCreate) {
      setLocalDashboard((ld) => ({ ...ld, layout: newLayout }));
    } else {
      setLayout(newLayout);
    }
    setHasUnsavedChanges(true);
  };
  const handleSave = () => setSaveModalOpen(true);
  const handleCancelEdit = () => {
    if (dashboard && dashboard.layout) {
      handleSwapLayout(dashboard.layout);
    }
    if (dashboard && dashboard.title) {
      setPendingTitle(dashboard.title);
    }
    setEditMode(false);
  };
  const handleChangeAutoRefresh = (
    value: number | undefined,
    unit: IntervalUnit | undefined
  ) => {
    setAutoRefreshIntervalValue(value);
    setAutoRefreshIntervalUnit(unit);
  };
  const handleChangeTimeRangeAbsolute = (
    from: string | null,
    to: string | null
  ) => {
    setTimeRangeFrom(from);
    setTimeRangeTo(to);
    setTimeRangeMode("absolute");
  };
  const handleChangeTimeRangeRelative = (
    value: number | undefined,
    unit: IntervalUnit | undefined
  ) => {
    setRelativeValue(value);
    setRelativeUnit(unit);
    setTimeRangeMode("relative");
  };
  const handleChangeTimeRangeMode = (mode: "absolute" | "relative") => {
    setTimeRangeMode(mode);
  };
  const handleSaveConfig = async () => {
    const tr = getEffectiveTimeRange({
      timeRangeMode,
      relativeValue,
      relativeUnit,
      timeRangeFrom,
      timeRangeTo,
    });
    await handleSaveDashboard({
      autoRefreshIntervalValue,
      autoRefreshIntervalUnit,
      timeRange: tr,
    } as any);
  };

  // --- Sélecteur dashboard exposé ---
  const dashboardToUse = isCreate ? localDashboard : dashboard;
  const layoutToUse = isCreate ? localDashboard.layout : layout;

  return {
    dashboardId,
    isLoading,
    isLoadingSources,
    sources,
    saving,
    selectOpen,
    hasPermission,
    openAddWidgetModal,
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
    saveModalOpen,
    setSaveModalOpen,
    pendingTitle,
    setPendingTitle,
    handleSave,
    handleConfirmSave,
    handleCancelEdit,
    isCreate,
    visibility,
    setVisibility,
    autoRefreshIntervalValue: autoRefreshIntervalValue ?? undefined,
    autoRefreshIntervalUnit,
    timeRangeFrom,
    timeRangeTo,
    relativeValue,
    relativeUnit,
    timeRangeMode,
    forceRefreshKey,
    setForceRefreshKey,
    handleChangeAutoRefresh,
    handleChangeTimeRangeAbsolute,
    handleChangeTimeRangeRelative,
    handleChangeTimeRangeMode,
    handleSaveConfig,
    effectiveFrom,
    effectiveTo,
    refreshMs,
    shareLoading,
    shareError,
    shareLink,
    isShareEnabled,
    currentShareId,
    handleEnableShare,
    handleDisableShare,
    handleCopyShareLink,
    exportPDFModalOpen,
    setExportPDFModalOpen,
    handleOpenExportPDFModal,
    handleExportPDF: handleExportPDFConfirm,
  };
}
