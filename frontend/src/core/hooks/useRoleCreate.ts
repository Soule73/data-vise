import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createRole } from '@/data/services/role';
import { useNotificationStore } from '@/core/store/notification';
import { ROUTES } from '@/core/constants/routes';
import { useGlobalPermissions } from '@/core/store/permissions';
import { useState } from 'react';

export function useRoleCreate() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const showNotification = useNotificationStore(s => s.showNotification);
  const permissions = useGlobalPermissions();
  const [form, setForm] = useState({ name: '', description: '', permissions: [] as string[] });
  const [loading, setLoading] = useState(false);

  const mutation = useMutation({
    mutationFn: async (payload: any) => createRole(payload),
    onSuccess: () => {
      setForm({ name: '', description: '', permissions: [] });
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      showNotification({ open: true, type: 'success', title: 'Rôle créé', description: 'Le nouveau rôle a été ajouté.' });
      navigate(ROUTES.roles);
    },
    onError: () => {
      showNotification({ open: true, type: 'error', title: 'Erreur', description: 'Erreur lors de la création du rôle.' });
    },
    onSettled: () => setLoading(false),
  });

  const handleChange = (field: string, value: string | string[]) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };
  const handleTogglePerm = (permId: string) => {
    setForm(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permId)
        ? prev.permissions.filter(id => id !== permId)
        : [...prev.permissions, permId],
    }));
  };
  const allPermissionIds = permissions.map(p => p._id);
  const allSelected = form.permissions.length === allPermissionIds.length && allPermissionIds.length > 0;
  const toggleAll = () => {
    setForm(prev => ({
      ...prev,
      permissions: allSelected ? [] : allPermissionIds,
    }));
  };
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!form.name.trim()) {
      showNotification({ open: true, type: 'error', title: 'Nom requis', description: 'Le nom du rôle est obligatoire.' });
      return;
    }
    if (form.permissions.length === 0) {
      showNotification({ open: true, type: 'error', title: 'Permissions requises', description: 'Veuillez sélectionner au moins une permission.' });
      return;
    }
    setLoading(true);
    mutation.mutate(form);
  };

  return {
    form, setForm, loading: loading || mutation.isPending, handleChange, handleTogglePerm, allSelected, toggleAll, handleSubmit, permissions
  };
}