import { PermissionGroup, RoleActions, RoleInfo } from '@/components/RoleManagementParts';
import AlertModal from '../components/AlertModal';
import Button from '@/components/Button';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import CheckboxField from '@/components/CheckboxField';
import { useGlobalPermissions } from '@/store/permissions';
import { useRoleManagement } from '@/hooks/useRoleManagement';
import { roleSchema } from '@/validation/role';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export default function RoleManagementPage() {
  const {
    roles, isLoading, showPerms, setShowPerms, editRoleId, editRole, setEditRole, roleToDelete, setRoleToDelete, editConfirm, setEditConfirm,
    startEdit, cancelEdit, togglePermission, saveEdit, handleEditConfirm, handleDeleteRole, groupedPermissions
  } = useRoleManagement();

  const formHook = useForm({
    resolver: zodResolver(roleSchema),
    defaultValues: editRole,
    values: editRole,
  });


  const permissions = useGlobalPermissions();

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Gestion des rôles</h1>
        <div>
          <Link to={ROUTES.roleCreate}>
            <Button>
              Nouveau rôle
            </Button>
          </Link>
        </div>
      </div>
      {isLoading ? (
        <div>Chargement…</div>
      ) : (
        <div className="space-y-6">
          {roles.map((role: any) => (
            <div key={role._id} className="bg-white dark:bg-gray-900 rounded shadow p-4 border border-gray-200 dark:border-gray-700">
              <RoleActions
                isEditing={editRoleId === role._id}
                onEdit={() => startEdit(role)}
                onCancel={cancelEdit}
                onSave={saveEdit}
                onTogglePerms={() => setShowPerms(showPerms === role._id ? null : role._id)}
                showPerms={showPerms === role._id}
                canDelete={role.canDelete}
                onDelete={role.canDelete ? () => setRoleToDelete(role) : undefined}
              />
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <RoleInfo
                  isEditing={editRoleId === role._id}
                  name={editRoleId === role._id ? editRole.name : role.name}
                  description={editRoleId === role._id ? editRole.description : role.description}
                  onChangeName={v => setEditRole((prev: any) => ({ ...prev, name: v }))}
                  onChangeDescription={v => setEditRole((prev: any) => ({ ...prev, description: v }))}
                />

              </div>
              {showPerms === role._id && editRoleId === role._id && (
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-medium">Permissions</span>
                  <CheckboxField
                    label="Tout sélectionner"
                    checked={editRole && permissions.length > 0 && editRole.permissions.length === permissions.length}
                    onChange={() => {
                      if (!editRole) return;
                      setEditRole((prev: any) => ({
                        ...prev,
                        permissions:
                          prev.permissions.length === permissions.length
                            ? []
                            : permissions.map((p: any) => p._id),
                      }));
                      formHook.setValue('permissions', editRole.permissions.length === permissions.length ? [] : permissions.map((p: any) => p._id));
                    }}
                    id={`select-all-edit-${role._id}`}
                    name="selectAllEditPerms"
                  />
                </div>
              )}
              {showPerms === role._id && (
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  {Object.entries(groupedPermissions).map(([model, perms]) => (
                    <PermissionGroup
                      key={model}
                      model={model}
                      perms={perms as any[]}
                      checkedPerms={editRoleId === role._id ? editRole.permissions : role.permissions.map((p: any) => p._id)}
                      onToggle={togglePermission}
                      editable={editRoleId === role._id}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <div className="mt-10">
        <h2 className="text-lg font-semibold mb-2">Toutes les permissions existantes</h2>
        <div className="flex flex-wrap gap-2">
          {permissions.map((perm: any) => (
            <span key={perm._id} className="inline-block bg-gray-100 dark:bg-gray-800 text-xs px-2 py-1 rounded border border-gray-200 dark:border-gray-700 mb-1">
              {perm.name}
            </span>
          ))}
        </div>
      </div>
      <AlertModal
        key={roleToDelete ? `delete-${roleToDelete._id}` : 'delete-modal'}
        open={!!roleToDelete}
        onClose={() => setRoleToDelete(null)}
        onConfirm={handleDeleteRole}
        type="error"
        title="Confirmer la suppression"
        description={roleToDelete ? `Êtes-vous sûr de vouloir supprimer le rôle « ${roleToDelete.name} » ? Cette action est irréversible.` : ''}
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        loading={false}
      />
      <AlertModal
        key={editRoleId ? `edit-${editRoleId}` : 'edit-modal'}
        open={editConfirm}
        onClose={() => setEditConfirm(false)}
        onConfirm={handleEditConfirm}
        type="info"
        title="Confirmer la modification"
        description={editRole ? `Voulez-vous vraiment enregistrer les modifications du rôle « ${editRole.name} » ?` : ''}
        confirmLabel="Enregistrer"
        cancelLabel="Annuler"
        loading={false}
      />
    </>
  );
}
