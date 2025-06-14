import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { fetchRoles, updateRole, deleteRole } from "@/data/services/role";
import { useNotificationStore } from "@/core/store/notification";
import { useGlobalPermissions } from "@/core/store/permissions";
import { useGlobalRoles } from "@/core/hooks/useGlobalRoles";
import { useRoleStore } from "@/core/store/roles";

export function useRoleManagement() {
  const queryClient = useQueryClient();
  const showNotification = useNotificationStore((s) => s.showNotification);
  const permissions = useGlobalPermissions();
  const roles = useGlobalRoles();
  const [showPerms, setShowPerms] = useState<string | null>(null);
  const [editRoleId, setEditRoleId] = useState<string | null>(null);
  const [editRole, setEditRole] = useState<any>(null);
  const [roleToDelete, setRoleToDelete] = useState<any>(null);
  const [editConfirm, setEditConfirm] = useState(false);

  const rolesQuery = useQuery({
    queryKey: ["roles"],
    queryFn: fetchRoles,
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) =>
      updateRole(id, payload),
    onSuccess: () => {
      setEditRoleId(null);
      setEditRole(null);
      useRoleStore.getState().setRoles([]); // Vide le cache Zustand
      queryClient.invalidateQueries({ queryKey: ["roles"] });
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

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => deleteRole(id),
    onSuccess: () => {
      setRoleToDelete(null);
      useRoleStore.getState().setRoles([]);
      queryClient.invalidateQueries({ queryKey: ["roles"] });
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
      permissions: prev.permissions.includes(permId)
        ? prev.permissions.filter((id: string) => id !== permId)
        : [...prev.permissions, permId],
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
  const groupedPermissions = permissions.reduce(
    (acc: Record<string, any[]>, perm: any) => {
      const [model] = perm.name.split(":");
      if (!acc[model]) acc[model] = [];
      acc[model].push(perm);
      return acc;
    },
    {}
  );

  return {
    roles,
    isLoading: rolesQuery.isLoading,
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
  };
}
