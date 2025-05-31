import { useQuery } from '@tanstack/react-query';
import { useState, useEffect, useRef, useContext } from 'react';
import { fetchDashboard, fetchSources, saveDashboardLayout } from '@/services/dashboard';
import { UNSAFE_NavigationContext } from 'react-router-dom';
import { useDashboardStore } from '@/store/dashboard';

export interface DashboardLayoutItem {
  widgetId: string;
  w: number;
  h: number;
  x: number;
  y: number;
  widget?: any;
}

export function useDashboard() {
  const { data: dashboard, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboard,
  });
  const { data: sources = [] } = useQuery({
    queryKey: ['sources'],
    queryFn: fetchSources,
  });
  const [saving, setSaving] = useState(false);
  const [selectOpen, setSelectOpen] = useState(false);
  const [notif, setNotif] = useState<{ open: boolean; type: 'success'|'error'; message: string }>({ open: false, type: 'success', message: '' });
  const didInit = useRef(false);
  // Store Zustand pour l'état global du dashboard
  const layout = useDashboardStore(s => s.layout);
  const setLayout = useDashboardStore(s => s.setLayout);
  const editMode = useDashboardStore(s => s.editMode);
  const setEditMode = useDashboardStore(s => s.setEditMode);
  const hasUnsavedChanges = useDashboardStore(s => s.hasUnsavedChanges);
  const setHasUnsavedChanges = useDashboardStore(s => s.setHasUnsavedChanges);
  const navigator = useContext(UNSAFE_NavigationContext)?.navigator;

  // Ajout d'un widget existant au dashboard
  const handleAddWidget = (widget: any) => {
    if (layout.some(item => item.widgetId === widget.widgetId || item.widgetId === widget._id)) return;
    setLayout([
      ...layout,
      {
        widgetId: widget.widgetId || widget._id,
        w: 6,
        h: 8,
        x: 0,
        y: layout.length,
        widget,
      }
    ]);
    setSelectOpen(false);
    setHasUnsavedChanges(true);
  };

  // Restauration du layout depuis le backend au chargement
  useEffect(() => {
    if (didInit.current) return;
    if (dashboard && dashboard.layout && dashboard.layout.length > 0) {
      setLayout(dashboard.layout);
      didInit.current = true;
    }
  }, [dashboard, setLayout]);

  // Sauvegarde du layout côté backend
  const handleSaveDashboard = async () => {
    if (!dashboard) return;
    setSaving(true);
    try {
      const layoutToSave = layout
        .filter(item => item.widgetId && typeof item.x === 'number' && typeof item.y === 'number' && typeof item.w === 'number' && typeof item.h === 'number')
        .map(({ widgetId, w, h, x, y }) => ({ widgetId, w, h, x, y }));
      await saveDashboardLayout(dashboard._id, layoutToSave);
      setNotif({ open: true, type: 'success', message: 'Dashboard sauvegardé avec succès !' });
      setHasUnsavedChanges(false);
    } catch (e) {
      setNotif({ open: true, type: 'error', message: 'Erreur lors de la sauvegarde du dashboard.' });
    } finally {
      setSaving(false);
    }
  };

  // Gestion du swap et du resize (drag & drop)
  const handleSwapLayout = (newLayout: DashboardLayoutItem[]) => {
    if (!editMode) return;
    setLayout(newLayout);
    setHasUnsavedChanges(true);
  };

  // Blocage navigation interne si édition non sauvegardée
  useEffect(() => {
    if (!editMode || !hasUnsavedChanges || !navigator) return;
    const push = navigator.push;
    const replace = navigator.replace;
    function confirmNav(method: (...args: any[]) => void) {
      return function(this: any, ...args: any[]) {
        if (window.confirm('Vous avez des modifications non sauvegardées. Quitter la page ?')) {
          method.apply(this, args);
        }
      };
    }
    navigator.push = confirmNav(push);
    navigator.replace = confirmNav(replace);
    return () => {
      navigator.push = push;
      navigator.replace = replace;
    };
  }, [editMode, hasUnsavedChanges, navigator]);

  return {
    dashboard,
    isLoading,
    sources,
    saving,
    selectOpen,
    setSelectOpen,
    layout,
    setLayout,
    notif,
    setNotif,
    editMode,
    setEditMode,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    handleAddWidget,
    handleSaveDashboard,
    handleSwapLayout,
  };
}
