import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { fetchUsers, fetchRoles, createUser, updateUser, deleteUser } from '@/services/user';
import { useNotificationStore } from '@/store/notification';

export function useUserManagement() {
  const queryClient = useQueryClient();
  const showNotification = useNotificationStore(s => s.showNotification);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [form, setForm] = useState<any>({ email: '', username: '', role: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);

  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });
  const rolesQuery = useQuery({
    queryKey: ['roles'],
    queryFn: fetchRoles,
  });

  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      if (editingUser) {
        return await updateUser(editingUser._id, payload);
      } else {
        return await createUser(payload);
      }
    },
    onSuccess: () => {
      setModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['users'] });
      showNotification({ open: true, type: 'success', title: editingUser ? 'Utilisateur modifié' : 'Utilisateur ajouté', description: editingUser ? 'Utilisateur mis à jour.' : 'Nouvel utilisateur créé.' });
    },
    onError: (e: any) => {
      showNotification({ open: true, type: 'error', title: 'Erreur', description: e?.response?.data?.message || 'Erreur lors de la sauvegarde.' });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => deleteUser(id),
    onSuccess: () => {
      setDeleteModalOpen(false);
      setUserToDelete(null);
      queryClient.invalidateQueries({ queryKey: ['users'] });
      showNotification({ open: true, type: 'success', title: 'Utilisateur supprimé', description: 'L’utilisateur et ses données privées ont été supprimés.' });
    },
    onError: (e: any) => {
      showNotification({ open: true, type: 'error', title: 'Erreur', description: e?.response?.data?.message || 'Erreur lors de la suppression.' });
    }
  });

  function openModal(user?: any) {
    setEditingUser(user || null);
    setForm(user ? { ...user, role: user.roleId?._id } : { email: '', username: '', role: '' });
    setModalOpen(true);
  }

  function handleSaveUser() {
    const payload = { ...form, roleId: form.role };
    mutation.mutate(payload);
  }

  function handleDeleteUser() {
    if (userToDelete) deleteMutation.mutate(userToDelete._id);
  }

  function generatePassword() {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let pwd = '';
    while (pwd.length < 8) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setForm((f: any) => ({ ...f, password: pwd }));
    setShowPassword(true);
  }

  return {
    users: usersQuery.data || [],
    roles: rolesQuery.data || [],
    isLoading: usersQuery.isLoading,
    modalOpen,
    setModalOpen,
    editingUser,
    setEditingUser,
    form,
    setForm,
    isSaving: mutation.isPending,
    showPassword,
    setShowPassword,
    openModal,
    handleSaveUser,
    deleteModalOpen,
    setDeleteModalOpen,
    userToDelete,
    setUserToDelete,
    handleDeleteUser,
    isDeleting: deleteMutation.isPending,
    generatePassword,
  };
}
