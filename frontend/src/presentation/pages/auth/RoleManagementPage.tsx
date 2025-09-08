import type { Role, Permission } from "@type/authTypes";
import {
  PermissionGroup,
  RoleActions,
  RoleInfo,
} from "@components/RoleManagementParts";
import AlertModal from "@components/AlertModal";
import { Link } from "react-router-dom";
import { ROUTES } from "@constants/routes";
import CheckboxField from "@components/forms/CheckboxField";
import { usePermissionsQuery } from "@repositories/roles";
import { useRoleManagement } from "@hooks/auth/useRoleManagement";
import { useUserStore } from "@store/user";

export default function RoleManagementPage() {
  const {
    roles,
    isLoading,
    showPerms,
    setShowPerms,
    editRoleId,
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
    formHook,
  } = useRoleManagement();

  const { data: permissions } = usePermissionsQuery();
  const hasPermission = useUserStore((s) => s.hasPermission);

  return (
    <div className="max-w-5xl mx-auto py-4 bg-white dark:bg-gray-900 px-4 sm:px-6 lg:px-8 shadow-sm">
      <div className="flex items-center justify-end mb-6">
        <div>
          {hasPermission("role:canCreate") && (
            <Link
              to={ROUTES.roleCreate}
              className=" w-max text-indigo-500 underline hover:text-indigo-600 font-medium"
            >
              Nouveau rôle
            </Link>
          )}
        </div>
      </div>
      {isLoading ? (
        <div>Chargement…</div>
      ) : (
        <div className="space-y-6">
          {(Array.isArray(roles) ? roles : []).map((role: Role) => (
            <div
              key={role._id}
              className="bg-white dark:bg-gray-900 rounded p-4 border border-gray-200 dark:border-gray-700"
            >
              <RoleActions
                isEditing={editRoleId === role._id}
                onEdit={
                  hasPermission("role:canUpdate")
                    ? () => startEdit(role)
                    : () => { }
                }
                onCancel={cancelEdit}
                onSave={saveEdit}
                onTogglePerms={() =>
                  setShowPerms(showPerms === role._id ? null : role._id)
                }
                showPerms={showPerms === role._id}
                canDelete={role.canDelete && hasPermission("role:canDelete")}
                onDelete={
                  role.canDelete && hasPermission("role:canDelete")
                    ? () => setRoleToDelete(role)
                    : undefined
                }
              />
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <RoleInfo
                  isEditing={editRoleId === role._id}
                  name={editRoleId === role._id ? editRole.name : role.name}
                  description={
                    editRoleId === role._id
                      ? editRole.description
                      : role.description
                  }
                  onChangeName={(v) =>
                    setEditRole((prev: Role) => ({ ...prev, name: v }))
                  }
                  onChangeDescription={(v) =>
                    setEditRole((prev: Role) => ({ ...prev, description: v }))
                  }
                />
              </div>
              {showPerms === role._id && editRoleId === role._id && (
                <div className="mb-3 flex items-center justify-between">
                  <span className="font-medium">Permissions</span>
                  <CheckboxField
                    label="Tout sélectionner"
                    checked={
                      editRole &&
                      (permissions ?? []).length > 0 &&
                      editRole.permissions.length === (permissions ?? []).length
                    }
                    onChange={() => {
                      if (!editRole) return;
                      const allPermissionIds = (permissions ?? []).map(
                        (p: Permission) => p._id
                      );
                      const shouldSelectAll =
                        editRole.permissions.length !== allPermissionIds.length;
                      setEditRole((prev: Role) => ({
                        ...prev,
                        permissions: shouldSelectAll ? allPermissionIds : [],
                      }));
                      formHook.setValue(
                        "permissions",
                        shouldSelectAll ? allPermissionIds : []
                      );
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
                      perms={perms as Permission[]}
                      checkedPerms={
                        editRoleId === role._id
                          ? editRole.permissions
                          : role.permissions
                      }
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
      {/* <div className="mt-10">
        <h2 className="text-lg font-semibold mb-2">
          Toutes les permissions existantes
        </h2>
        <div className="flex flex-wrap gap-2">
          {(permissions ?? []).map((perm: Permission) => (
            <span
              key={perm._id}
              className="inline-block bg-gray-100 dark:bg-gray-800 text-xs px-2 py-1 rounded border border-gray-200 dark:border-gray-700 mb-1"
            >
              {perm.name}
            </span>
          ))}
        </div>
      </div> */}
      <AlertModal
        key={roleToDelete ? `delete-${roleToDelete._id}` : "delete-modal"}
        open={!!roleToDelete}
        onClose={() => setRoleToDelete(null)}
        onConfirm={handleDeleteRole}
        type="error"
        title="Confirmer la suppression"
        description={
          roleToDelete
            ? `Êtes-vous sûr de vouloir supprimer le rôle « ${roleToDelete.name}» ? Cette action est irréversible.`
            : ""
        }
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        loading={false}
      />
      <AlertModal
        key={editRoleId ? `edit-${editRoleId}` : "edit-modal"}
        open={editConfirm}
        onClose={() => setEditConfirm(false)}
        onConfirm={handleEditConfirm}
        type="info"
        title="Confirmer la modification"
        description={
          editRole
            ? `Voulez-vous vraiment enregistrer les modifications du rôle « ${editRole.name} » ?`
            : ""
        }
        confirmLabel="Enregistrer"
        cancelLabel="Annuler"
        loading={false}
      />
    </div>
  );
}
