import { useNavigate } from "react-router-dom";
import { useCreateRoleMutation } from "@repositories/roles";
import { useNotificationStore } from "@store/notification";
import { ROUTES } from "@constants/routes";
import { usePermissionsQuery } from "@repositories/roles";
import { useState, useMemo, useEffect } from "react";
import { useDashboardStore } from "@store/dashboard";
import { useQueryClient } from "@tanstack/react-query";
import type { RoleCreateForm } from "@type/authTypes";

export function useRoleCreate() {
  const navigate = useNavigate();
  const showNotification = useNotificationStore((s) => s.showNotification);
  const { data: permissions } = usePermissionsQuery();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<RoleCreateForm>({
    name: "",
    description: "",
    permissions: [],
  });
  const [loading, setLoading] = useState(false);

  const setBreadcrumb = useDashboardStore((s) => s.setBreadcrumb);

  useEffect(() => {
    setBreadcrumb([
      {
        url: ROUTES.roles,
        label: "Rôles",
      },
      {
        url: ROUTES.createRole,
        label: "Créer un Rôle",
      },
    ]);
  }, [setBreadcrumb]);

  const mutation = useCreateRoleMutation({
    queryClient,
    onSuccess: () => {
      setForm({ name: "", description: "", permissions: [] });
      showNotification({
        open: true,
        type: "success",
        title: "Rôle créé",
        description: "Le nouveau rôle a été ajouté.",
      });
      navigate(ROUTES.roles);
      setLoading(false);
    },
    onError: () => {
      showNotification({
        open: true,
        type: "error",
        title: "Erreur",
        description: "Erreur lors de la création du rôle.",
      });
      setLoading(false);
    },
  });

  const handleChange = (field: string, value: string | string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };
  const handleTogglePerm = (permId: string) => {
    setForm((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permId)
        ? prev.permissions.filter((id) => id !== permId)
        : [...prev.permissions, permId],
    }));
  };
  const allPermissionIds = (permissions ?? []).map((p) => p._id);
  const allSelected =
    form.permissions.length === allPermissionIds.length &&
    allPermissionIds.length > 0;
  const toggleAll = () => {
    setForm((prev) => ({
      ...prev,
      permissions: allSelected ? [] : allPermissionIds,
    }));
  };
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!form.name.trim()) {
      showNotification({
        open: true,
        type: "error",
        title: "Nom requis",
        description: "Le nom du rôle est obligatoire.",
      });
      return;
    }
    if (form.permissions.length === 0) {
      showNotification({
        open: true,
        type: "error",
        title: "Permissions requises",
        description: "Veuillez sélectionner au moins une permission.",
      });
      return;
    }
    setLoading(true);
    mutation.mutate(form);
  };

  const groupedPermissions = useMemo(() => {
    return (permissions ?? []).reduce(
      (acc: Record<string, typeof permissions>, perm) => {
        const [model] = perm.name.split(":");
        if (!acc[model]) acc[model] = [];
        acc[model].push(perm);
        return acc;
      },
      {} as Record<string, typeof permissions>
    );
  }, [permissions]);

  return {
    form,
    setForm,
    loading: loading || mutation.isPending,
    handleChange,
    handleTogglePerm,
    allSelected,
    toggleAll,
    handleSubmit,
    permissions,
    groupedPermissions,
  };
}
