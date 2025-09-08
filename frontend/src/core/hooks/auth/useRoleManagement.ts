/* eslint-disable @typescript-eslint/no-explicit-any */

import { useUpdateRoleMutation, useDeleteRoleMutation } from "@repositories/roles";
import { useState, useEffect } from "react";
import { useNotificationStore } from "@store/notification";
import { useRolesQuery, usePermissionsQuery } from "@repositories/roles";
import { useDashboardStore } from "@store/dashboard";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { roleSchema } from "@validation/role";
import { groupPermissionsByModel, toggleArrayValue } from "@utils/roleUtils";
import { useQueryClient } from "@tanstack/react-query";

export function useRoleManagement() {
  const showNotification = useNotificationStore((s) => s.showNotification);
  const { data: permissions } = usePermissionsQuery();
  const { roles, isLoading } = useRolesQuery();
  const [showPerms, setShowPerms] = useState<string | null>(null);
  const [editRoleId, setEditRoleId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState<any>(null);
  const [roleToDelete, setRoleToDelete] = useState<any>(null);
  const [editConfirm, setEditConfirm] = useState(false);
  const queryClient = useQueryClient();

  // Breadcrumb logique déplacée ici
  const setBreadcrumb = useDashboardStore((s) => s.setBreadcrumb);
  useEffect(() => {
    setBreadcrumb([{ url: "/roles", label: "Gestion des Rôles" }]);
  }, [setBreadcrumb]);

  // Déplacement du formHook ici
  const formHook = useForm({
    resolver: zodResolver(roleSchema),
    defaultValues: editRole,
    values: editRole,
  });

  const updateMutation = useUpdateRoleMutation({
    queryClient,
    onSuccess: () => {
      setEditRoleId(null);
      setEditRole(null);
      showNotification({
        open: true,
        type: "success",
        title: "Rôle mis à jour",
        description: "Les modifications ont été enregistrées avec succès.",
      });
    },
    onError: () => {
      showNotification({
        open: true,
        type: "error",
        title: "Erreur",
        description: "Erreur lors de la sauvegarde du rôle.",
      });
    },
  });

  const deleteMutation = useDeleteRoleMutation({
    queryClient,
    onSuccess: () => {
      setRoleToDelete(null);
      showNotification({
        open: true,
        type: "success",
        title: "Rôle supprimé",
        description: "Le rôle a bien été supprimé.",
      });
    },
    onError: (e: any) => {
      showNotification({
        open: true,
        type: "error",
        title: "Erreur",
        description:
          e?.response?.data?.message ||
          "Erreur lors de la suppression du rôle.",
      });
    },
  });

  function startEdit(role: any) {
    setEditRoleId(role._id);
    setEditRole({
      name: role.name,
      description: role.description,
      permissions: role.permissions.map((p: any) => p._id),
    });
    setShowPerms(role._id);
  }
  function cancelEdit() {
    setEditRoleId(null);
    setEditRole(null);
  }
  function togglePermission(permId: string) {
    if (!editRole) return;
    setEditRole((prev: any) => ({
      ...prev,
      permissions: toggleArrayValue(prev.permissions, permId),
    }));
  }
  function saveEdit() {
    setEditConfirm(true);
  }
  function handleEditConfirm() {
    setEditConfirm(false);
    if (!editRoleId || !editRole) return;
    updateMutation.mutate({ id: editRoleId, payload: editRole });
  }
  function handleDeleteRole() {
    if (!roleToDelete) return;
    deleteMutation.mutate(roleToDelete._id);
  }
  const groupedPermissions = groupPermissionsByModel(permissions ?? []);

  return {
    roles,
    isLoading,
    showPerms,
    setShowPerms,
    editRoleId,
    setEditRoleId,
    editRole,
    setEditRole,
    roleToDelete,
    setRoleToDelete,
    editConfirm,
    setEditConfirm,
    startEdit,
    cancelEdit,
    togglePermission,
    saveEdit,
    handleEditConfirm,
    handleDeleteRole,
    groupedPermissions,
    updateLoading: updateMutation.isPending,
    deleteLoading: deleteMutation.isPending,
    formHook,
  };
}
