import { useCreateUserMutation, useUpdateUserMutation, useDeleteUserMutation } from "@/data/repositories/auth";
import { useState } from "react";
import { useNotificationStore } from "@/core/store/notification";
import { rolesQuery } from "@/data/repositories/roles";
import { usersQuery } from "@/data/repositories/users";
import { useQueryClient } from "@tanstack/react-query";

export function useUserManagement() {
  const showNotification = useNotificationStore((s) => s.showNotification);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [form, setForm] = useState<any>({ email: "", username: "", role: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: users, isLoading } = usersQuery();
  const { roles } = rolesQuery();

  const createMutation = useCreateUserMutation({
    queryClient,
    onSuccess: () => {
      setModalOpen(false);
      showNotification({
        open: true,
        type: "success",
        title: "Utilisateur ajouté",
        description: "Nouvel utilisateur créé.",
      });
    },
    onError: (e: any) => {
      showNotification({
        open: true,
        type: "error",
        title: "Erreur",
        description: e?.response?.data?.message || "Erreur lors de la sauvegarde.",
      });
    },
  });

  const updateMutation = useUpdateUserMutation({
    queryClient,
    onSuccess: () => {
      setModalOpen(false);
      setEditingUser(null);
      showNotification({
        open: true,
        type: "success",
        title: "Utilisateur modifié",
        description: "Utilisateur mis à jour.",
      });
    },
    onError: (e: any) => {
      showNotification({
        open: true,
        type: "error",
        title: "Erreur",
        description: e?.response?.data?.message || "Erreur lors de la sauvegarde.",
      });
    },
  });

  const deleteMutation = useDeleteUserMutation({
    queryClient,
    onSuccess: () => {
      setDeleteModalOpen(false);
      setUserToDelete(null);
      showNotification({
        open: true,
        type: "success",
        title: "Utilisateur supprimé",
        description: "L’utilisateur et ses données privées ont été supprimés.",
      });
    },
    onError: (e: any) => {
      showNotification({
        open: true,
        type: "error",
        title: "Erreur",
        description: e?.response?.data?.message || "Erreur lors de la suppression.",
      });
    },
  });

  function openModal(user?: any) {
    setEditingUser(user || null);
    setForm(
      user
        ? { ...user, role: user.roleId?._id }
        : { email: "", username: "", role: "" }
    );
    setModalOpen(true);
  }

  function handleSaveUser() {
    const payload = { ...form, roleId: form.role };
    if (editingUser) {
      updateMutation.mutate({ id: editingUser._id, payload });
    } else {
      createMutation.mutate(payload);
    }
  }

  function handleDeleteUser() {
    if (userToDelete) deleteMutation.mutate(userToDelete._id);
  }

  function generatePassword() {
    const chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let pwd = "";
    while (pwd.length < 8) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setForm((f: any) => ({ ...f, password: pwd }));
    setShowPassword(true);
  }

  return {
    users: users || [],
    roles,
    isLoading: isLoading,
    modalOpen,
    setModalOpen,
    editingUser,
    setEditingUser,
    form,
    setForm,
    isSaving: createMutation.isPending || updateMutation.isPending,
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
