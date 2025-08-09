import { useRoleCreate } from "@hooks/auth/useRoleCreate";
import Button from "@components/forms/Button";
import InputField from "@components/forms/InputField";
import CheckboxField from "@components/forms/CheckboxField";

export default function RoleCreatePage() {
  const {
    form,
    loading,
    handleChange,
    handleTogglePerm,
    allSelected,
    toggleAll,
    handleSubmit,
    permissions,
    groupedPermissions,
  } = useRoleCreate();

  return (
    <>
      <div className="flex items-center justify-between mb-6 flex-wrap">
        <h1 className="text-2xl font-bold">Créer un nouveau rôle</h1>
        <Button
          type="button"
          color="indigo"
          onClick={handleSubmit}
          loading={loading}
          className="w-max"
        >
          <div className=" md:px-8">Créer le rôle</div>
        </Button>
      </div>
      {(permissions ?? []).length === 0 ? (
        <div>Chargement…</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Nom du rôle"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
              id="create-role-name"
              name="name"
              autoComplete="off"
            />
            <InputField
              label="Description"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(groupedPermissions).map(([model, perms]) => (
                <div
                  key={model}
                  className="border rounded p-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
                >
                  <div className="font-semibold mb-1 uppercase text-gray-500 dark:text-gray-400">
                    {model}
                  </div>
                  <div className="space-y-1 grid">
                    {(perms ?? []).map((perm) => (
                      <CheckboxField
                        key={perm._id}
                        label={perm.description || perm.name}
                        checked={form.permissions.includes(perm._id)}
                        onChange={() => handleTogglePerm(perm._id)}
                        id={`perm-${perm._id}`}
                        name="permissions"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </form>
      )}
    </>
  );
}
