/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "@repositories/auth";
import { useState, useMemo } from "react";
import { useNotificationStore } from "@store/notification";
import { useRolesQuery } from "@repositories/roles";
import { useUsersQuery } from "@repositories/users";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserStore } from "@store/user";
import type { User, Role } from "@type/authTypes";
import { userSchema } from "@validation/user";

export function useUserManagement() {
  const showNotification = useNotificationStore((s) => s.showNotification);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [form, setForm] = useState<any>({ email: "", username: "", role: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useUsersQuery();
  const { roles } = useRolesQuery();

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
        description:
          e?.response?.data?.message || "Erreur lors de la sauvegarde.",
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
        description:
          e?.response?.data?.message || "Erreur lors de la sauvegarde.",
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
        description:
          e?.response?.data?.message || "Erreur lors de la suppression.",
      });
    },
  });

  const formHook = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: form,
    values: form,
  });

  // Table columns (sans la colonne actions)
  const columns = useMemo(
    () => [
      { key: "email", label: "Email" },
      { key: "username", label: "Nom d’utilisateur" },
      { key: "roleId", label: "Rôle", render: (u: User) => u.roleId?.name },
    ],
    []
  );

  const hasPermission = useUserStore((s) => s.hasPermission);
  const rolesList = useMemo(
    () => roles.map((r: Role) => ({ value: r._id, label: r.name })),
    [roles]
  );

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
    formHook,
    columns,
    hasPermission,
    rolesList,
  };
}
