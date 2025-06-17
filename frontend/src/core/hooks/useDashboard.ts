import { useState, useEffect, useRef } from "react";
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
import { intervalToMs } from "@/core/utils/timeUtils";

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
  // Plage absolue
  const [timeRangeFrom, setTimeRangeFrom] = useState<string | null>(
    dashboard?.timeRange?.from ?? null
  );
  const [timeRangeTo, setTimeRangeTo] = useState<string | null>(
    dashboard?.timeRange?.to ?? null
  );
  // Plage relative
  const [relativeValue, setRelativeValue] = useState<number | undefined>(
    undefined
  );
  const [relativeUnit, setRelativeUnit] = useState<IntervalUnit>("minute");
  // Mode de plage : 'absolute' ou 'relative'
  const [timeRangeMode, setTimeRangeMode] = useState<"absolute" | "relative">(
    "absolute"
  );

  // Calcul dynamique du from/to selon le mode
  const getEffectiveTimeRange = () => {
    if (timeRangeMode === "relative" && relativeValue && relativeUnit) {
      const now = new Date();
      let from = new Date(now);
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
    // Absolu
    return {
      from: timeRangeFrom || undefined,
      to: timeRangeTo || undefined,
      intervalValue: undefined,
      intervalUnit: undefined,
    };
  };

  // State pour la plage temporelle effective (from/to)
  const [effectiveTimeRange, setEffectiveTimeRange] = useState(() =>
    getEffectiveTimeRange()
  );
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
    setTimeRangeFrom(dashboard?.timeRange?.from ?? null);
    setTimeRangeTo(dashboard?.timeRange?.to ?? null);
    // Si intervalValue présent, on restaure le mode relatif
    if (
      dashboard?.timeRange?.intervalValue &&
      dashboard?.timeRange?.intervalUnit
    ) {
      setRelativeValue(dashboard.timeRange.intervalValue);
      setRelativeUnit(dashboard.timeRange.intervalUnit);
      setTimeRangeMode("relative");
    } else {
      setTimeRangeMode("absolute");
    }
  }, [dashboard?._id]);

  // Timer pour recalculer la plage from/to en mode relatif + auto-refresh
  useEffect(() => {
    // Nettoyage du timer précédent
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    // Conditions : mode relatif + auto-refresh actif
    if (
      timeRangeMode === "relative" &&
      relativeValue &&
      relativeUnit &&
      autoRefreshIntervalValue &&
      autoRefreshIntervalUnit
    ) {
      // Calcul de l'intervalle en ms
      let ms = 0;
      switch (autoRefreshIntervalUnit) {
        case "second":
          ms = autoRefreshIntervalValue * 1000;
          break;
        case "minute":
          ms = autoRefreshIntervalValue * 60 * 1000;
          break;
        case "hour":
          ms = autoRefreshIntervalValue * 60 * 60 * 1000;
          break;
        case "day":
          ms = autoRefreshIntervalValue * 24 * 60 * 60 * 1000;
          break;
        default:
          ms = 60 * 1000;
      }
      // Tick initial immédiat
      setEffectiveTimeRange(getEffectiveTimeRange());
      timerRef.current = setInterval(() => {
        setEffectiveTimeRange(getEffectiveTimeRange());
      }, ms);
    } else {
      // Mode absolu ou pas d'auto-refresh : on met à jour une fois
      setEffectiveTimeRange(getEffectiveTimeRange());
    }
    // Nettoyage à l'unmount ou si dépendances changent
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
    // eslint-disable-next-line
  }, [
    timeRangeMode,
    relativeValue,
    relativeUnit,
    autoRefreshIntervalValue,
    autoRefreshIntervalUnit,
    timeRangeFrom,
    timeRangeTo,
  ]);

  // Calcul effectif du from/to à propager à la grille et aux widgets
  const { from: effectiveFrom, to: effectiveTo } = effectiveTimeRange;

  // --- Calcul de l'intervalle d'auto-refresh (refreshMs) ---
  const refreshMs = intervalToMs(
    autoRefreshIntervalValue,
    autoRefreshIntervalUnit
  );

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

  // Ajout du state pour la visibilité (public/private)
  const [visibility, setVisibility] = useState<"public" | "private">("private");

  // Synchronise visibility avec le dashboard courant (édition)
  useEffect(() => {
    if (!isCreate && dashboard && dashboard.visibility) {
      setVisibility(dashboard.visibility);
    } else if (isCreate) {
      setVisibility("private");
    }
  }, [isCreate, dashboard?.visibility]);

  // Sauvegarde du layout côté backend
  const handleSaveDashboard = async (
    updates?: Partial<{ title: string; visibility: "public" | "private" }>
  ) => {
    setSaving(true);
    try {
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
          visibility: updates?.visibility ?? visibility,
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
  const handleCreateDashboard = async (
    title: string,
    customVisibility?: "public" | "private"
  ) => {
    setSaving(true);
    try {
      const newDashboard = await apiCreateDashboard({
        title,
        layout: localDashboard.layout,
        visibility: customVisibility ?? visibility,
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

  // Handler pour confirmer la sauvegarde (création ou édition)
  const handleConfirmSave = async (customVisibility?: "public" | "private") => {
    if (isCreate) {
      try {
        await handleCreateDashboard(pendingTitle, customVisibility);
        setTitleModalOpen(false);
      } catch (e) {}
      return;
    }
    await handleSaveDashboard({
      title: pendingTitle,
      visibility: customVisibility ?? visibility,
    });
    setEditMode(false);
    setTitleModalOpen(false);
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

  // --- Handlers centralisés pour la config avancée ---
  const handleChangeAutoRefresh = (
    value: number | undefined,
    unit: IntervalUnit
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
    unit: IntervalUnit
  ) => {
    setRelativeValue(value);
    setRelativeUnit(unit);
    setTimeRangeMode("relative");
  };

  const handleChangeTimeRangeMode = (mode: "absolute" | "relative") => {
    setTimeRangeMode(mode);
  };

  // Handler pour sauvegarder la config avancée
  const handleSaveConfig = async () => {
    const tr = getEffectiveTimeRange();
    await handleSaveDashboard({
      autoRefreshIntervalValue,
      autoRefreshIntervalUnit,
      timeRange: tr,
    } as any);
  };

  const buildTimeRange = () => {
    if (timeRangeMode === "relative") {
      // Mode relatif : on n'envoie que intervalValue et intervalUnit
      if (relativeValue && relativeUnit) {
        return {
          intervalValue: relativeValue,
          intervalUnit: relativeUnit,
        };
      }
      return {};
    } else {
      // Mode absolu : on n'envoie que from/to
      const tr: any = {};
      if (timeRangeFrom) tr.from = timeRangeFrom;
      if (timeRangeTo) tr.to = timeRangeTo;
      return tr;
    }
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
    titleModalOpen,
    setTitleModalOpen,
    pendingTitle,
    setPendingTitle,
    handleSave,
    handleConfirmSave,
    handleCancelEdit,
    isCreate,
    visibility,
    setVisibility,
    // --- config avancée centralisée ---
    autoRefreshIntervalValue: autoRefreshIntervalValue ?? undefined,
    autoRefreshIntervalUnit,
    timeRangeFrom,
    timeRangeTo,
    relativeValue,
    relativeUnit,
    timeRangeMode,
    // Handlers unifiés pour la config avancée
    handleChangeAutoRefresh,
    handleChangeTimeRangeAbsolute,
    handleChangeTimeRangeRelative,
    handleChangeTimeRangeMode,
    handleSaveConfig,
    effectiveFrom,
    effectiveTo,
    refreshMs, // <-- exposé pour la grille/widgets
  };
}
