import InputField from "@/presentation/components/InputField";
import CheckboxField from "@/presentation/components/CheckboxField";
import Button from "@/presentation/components/Button";
import { useMemo } from "react";
import React from "react";
import { useNotificationStore } from "@/core/store/notification";
import type { Permission, PermissionGroupCheckboxesProps, RoleCreateFormProps } from "@/core/types/auth-types";


export function PermissionGroupCheckboxes({
  permissions,
  checked,
  onToggle,
}: PermissionGroupCheckboxesProps) {
  const grouped = useMemo(() => {
    return permissions.reduce((acc: Record<string, Permission[]>, perm) => {
      const [model] = perm.name.split(":");
      if (!acc[model]) acc[model] = [];
      acc[model].push(perm);
      return acc;
    }, {});
  }, [permissions]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {Object.entries(grouped).map(([model, perms]) => (
        <div
          key={model}
          className="border rounded p-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
        >
          <div
            className="font-semibold mb-1 uppercase 
           text-gray-500 dark:text-gray-400
          "
          >
            {model}
          </div>
          <div className="space-y-1 grid">
            {perms.map((perm) => (
              <CheckboxField
                key={perm._id}
                label={perm.description || perm.name}
                checked={checked.includes(perm._id)}
                onChange={() => onToggle(perm._id)}
                id={`perm-${perm._id}`}
                name="permissions"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}


export default function RoleCreateForm({
  permissions,
  onSuccess,
}: RoleCreateFormProps) {
  const [form, setForm] = React.useState({
    name: "",
    description: "",
    permissions: [] as string[],
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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      useNotificationStore
        .getState()
        .showNotification({
          open: true,
          type: "error",
          title: "Nom requis",
          description: "Le nom du rôle est obligatoire.",
        });
      return;
    }
    try {
      const api = (await import("@/data/services/api")).default;
      await api.post("/auth/roles", form);
      setForm({ name: "", description: "", permissions: [] });
      useNotificationStore
        .getState()
        .showNotification({
          open: true,
          type: "success",
          title: "Rôle créé",
          description: "Le nouveau rôle a été ajouté.",
        });
      onSuccess();
    } catch (e) {
      useNotificationStore
        .getState()
        .showNotification({
          open: true,
          type: "error",
          title: "Erreur",
          description: "Erreur lors de la création du rôle.",
        });
    }
  };
  const allPermissionIds = permissions.map((p) => p._id);
  const allSelected =
    form.permissions.length === allPermissionIds.length &&
    allPermissionIds.length > 0;
  const toggleAll = () => {
    setForm((prev) => ({
      ...prev,
      permissions: allSelected ? [] : allPermissionIds,
    }));
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Nom du rôle"
          value={form.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("name", e.target.value)}
          required
          id="create-role-name"
          name="name"
          autoComplete="off"
        />
        <InputField
          label="Description"
          value={form.description}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("description", e.target.value)}
          id="create-role-description"
          name="description"
          autoComplete="off"
        />
      </div>
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block font-medium">Permissions</label>
          <CheckboxField
            label="Tout sélectionner"
            checked={allSelected}
            onChange={toggleAll}
            id="select-all-perms"
            name="selectAllPerms"
          />
        </div>
        <PermissionGroupCheckboxes
          permissions={permissions}
          checked={form.permissions}
          onToggle={handleTogglePerm}
        />
      </div>
      <div className="pt-2 w-max">
        <Button type="submit">
          <div className=" px-10">Créer</div>
        </Button>
      </div>
    </form>
  );
}
