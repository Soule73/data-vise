import { useState, useEffect } from 'react';
import { fetchDashboard, fetchSources, saveDashboardLayout, createDashboard as apiCreateDashboard } from '@/services/dashboard';
import { useDashboardStore } from '@/store/dashboard';
import { useNotificationStore } from '@/store/notification';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export interface DashboardLayoutItem {
  widgetId: string;
  w: number;
  h: number;
  x: number;
  y: number;
  widget?: any;
}

export function useDashboard(onSaveCallback?: (success: boolean) => void) {
  const params = useParams();
  const location = useLocation();
  const isCreate = typeof window !== 'undefined' && location.pathname.includes('/dashboards/create');
  const dashboardId = params.id;

  // Query dashboard uniquement si pas en création
  const { data: dashboard, isLoading } = useQuery({
    queryKey: ['dashboard', dashboardId],
    queryFn: () => dashboardId ? fetchDashboard(dashboardId) : undefined,
    enabled: !isCreate && !!dashboardId,
  });
  const { data: sources = [] } = useQuery({
    queryKey: ['sources'],
    queryFn: fetchSources,
  });
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [selectOpen, setSelectOpen] = useState(false);
  // Store Zustand pour l'état global du dashboard
  const layout = useDashboardStore(s => s.layout);
  const setLayout = useDashboardStore(s => s.setLayout);
  const editMode = useDashboardStore(s => s.editMode);
  const setEditMode = useDashboardStore(s => s.setEditMode);
  const hasUnsavedChanges = useDashboardStore(s => s.hasUnsavedChanges);
  const setHasUnsavedChanges = useDashboardStore(s => s.setHasUnsavedChanges);
  const showNotification = useNotificationStore((s) => s.showNotification);
  const navigate = useNavigate();

  // Dashboard local temporaire pour la création
  const [localDashboard, setLocalDashboard] = useState<{ _id?: string; title: string; layout: DashboardLayoutItem[] }>({ title: '', layout: [] });

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

  // Ajout d'un widget au dashboard (local ou distant)
  const handleAddWidget = (widget: any) => {
    const newItem = {
      widgetId: widget.widgetId || widget._id,
      w: 6,
      h: 8,
      x: 0,
      y: (isCreate ? localDashboard.layout.length : layout.length),
      widget,
    };
    if (isCreate) {
      setLocalDashboard(ld => {
        const updated = { ...ld, layout: [...ld.layout, newItem] };
        setLayout(updated.layout); // synchronise Zustand pour l'affichage
        return updated;
      });
    } else {
      setLayout([...layout, newItem]);
    }
    setSelectOpen(false);
    setHasUnsavedChanges(true);
  };

  // Gestion du titre local en création
  const setLocalTitle = (title: string) => {
    if (isCreate) setLocalDashboard(ld => ({ ...ld, title }));
  };

  // Sauvegarde du layout côté backend
  const handleSaveDashboard = async (updates?: Partial<{ title: string }>) => {
    if (!dashboard) return;
    setSaving(true);
    try {
      if (updates && updates.title !== undefined) {
        dashboard.title = updates.title;
      }
      const layoutToSave = layout
        .filter(item => item.widgetId && typeof item.x === 'number' && typeof item.y === 'number' && typeof item.w === 'number' && typeof item.h === 'number')
        .map(({ widgetId, w, h, x, y }) => ({ widgetId, w, h, x, y }));
      await saveDashboardLayout(dashboard._id, layoutToSave, updates?.title);
      setHasUnsavedChanges(false);
      showNotification({
        open: true,
        type: 'success',
        title: 'Dashboard sauvegardé',
        description: 'Les modifications ont bien été enregistrées.'
      });
      if (onSaveCallback) onSaveCallback(true);
    } catch (e) {
      showNotification({
        open: true,
        type: 'error',
        title: 'Erreur',
        description: "La sauvegarde du dashboard a échoué."
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
      const newDashboard = await apiCreateDashboard({ title, layout: localDashboard.layout });
      // Invalide le cache du dashboard et de la liste
      await queryClient.invalidateQueries({ queryKey: ['dashboard', newDashboard._id] });
      await queryClient.invalidateQueries({ queryKey: ['dashboards'] });
      showNotification({
        open: true,
        type: 'success',
        title: 'Dashboard créé',
        description: 'Votre dashboard a bien été créé.'
      });
      navigate(`/dashboards/${newDashboard._id}`);
      return newDashboard;
    } catch (e: any) {
      showNotification({
        open: true,
        type: 'error',
        title: 'Erreur',
        description: "La création du dashboard a échoué."
      });
      if (onSaveCallback) onSaveCallback(false);
    } finally {
      setSaving(false);
    }
  };

  // Gestion du swap et du resize (drag & drop)
  const handleSwapLayout = (newLayout: DashboardLayoutItem[]) => {
    if (isCreate) {
      setLocalDashboard(ld => {
        const updated = { ...ld, layout: newLayout };
        setLayout(updated.layout);
        return updated;
      });
    } else {
      setLayout(newLayout);
    }
    setHasUnsavedChanges(true);
  };

  // Expose le dashboard à utiliser (local en création, sinon backend)
  const dashboardToUse = isCreate ? localDashboard : dashboard;
  const layoutToUse = isCreate ? localDashboard.layout : layout;

  return {
    isLoading,
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
  };
}
