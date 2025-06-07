import React, { useMemo } from 'react';

import { useNotificationStore } from '@/store/notification';
import { useRoleCreate } from '@/hooks/useRoleCreate';
import Button from '@/components/Button';
import InputField from '@/components/InputField';
import CheckboxField from '@/components/CheckboxField';

interface Permission {
  _id: string;
  name: string;
  description?: string;
}

interface PermissionGroupCheckboxesProps {
  permissions: Permission[];
  checked: string[];
  onToggle: (permId: string) => void;
}

export function PermissionGroupCheckboxes({ permissions, checked, onToggle }: PermissionGroupCheckboxesProps) {
  const grouped = useMemo(() => {
    return permissions.reduce((acc: Record<string, Permission[]>, perm) => {
      const [model] = perm.name.split(':');
      if (!acc[model]) acc[model] = [];
      acc[model].push(perm);
      return acc;
    }, {});
  }, [permissions]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {Object.entries(grouped).map(([model, perms]) => (
        <div key={model} className="border rounded p-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="font-semibold mb-1 uppercase 
           text-gray-500 dark:text-gray-400
          ">{model}</div>
          <div className="space-y-1 grid">
            {perms.map(perm => (
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

export default function RoleCreatePage() {
  const {
    form, loading, handleChange, handleTogglePerm, allSelected, toggleAll, handleSubmit, permissions
  } = useRoleCreate();

  const showNotification = useNotificationStore(s => s.showNotification);

  const handleFormSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!form.name.trim()) {
      showNotification({ open: true, type: 'error', title: 'Nom requis', description: 'Le nom du rôle est obligatoire.' });
      return;
    }
    if (form.permissions.length === 0) {
      showNotification({ open: true, type: 'error', title: 'Permissions requises', description: 'Veuillez sélectionner au moins une permission.' });
      return;
    }
    handleSubmit();
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6 flex-wrap">
        <h1 className="text-2xl font-bold">Créer un nouveau rôle</h1>
        <Button type="button" color="indigo" onClick={handleFormSubmit} loading={loading} className="w-max">
          <div className=' md:px-8'>
          Créer le rôle
          </div>
        </Button>
      </div>
      {permissions.length === 0 ? (
        <div>Chargement…</div>
      ) : (
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <InputField
              label="Nom du rôle"
              value={form.name}
              onChange={e => handleChange('name', e.target.value)}
              required
              id="create-role-name"
              name="name"
              autoComplete="off"
            />
            <InputField
              label="Description"
              value={form.description}
              onChange={e => handleChange('description', e.target.value)}
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
        </form>
      )}
    </>
  );
}
