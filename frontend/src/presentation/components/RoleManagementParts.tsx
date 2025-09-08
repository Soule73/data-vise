import Button from "@components/forms/Button";
import InputField from "@components/forms/InputField";
import CheckboxField from "@components/forms/CheckboxField";
import type { PermissionGroupProps, RoleActionsProps, RoleInfoProps } from "@type/authTypes";



export function PermissionGroup({
  model,
  perms,
  checkedPerms,
  onToggle,
  editable,
}: PermissionGroupProps) {
  return (
    <div>
      <div className="font-semibold text-xs uppercase text-indigo-700 dark:text-indigo-300 mb-1">
        {model}
      </div>
      <ul className="space-y-1">
        {perms.map((perm) => (
          <li key={perm._id} className="flex items-center">
            <CheckboxField
              label={perm.description || perm.name}
              checked={checkedPerms.includes(perm._id)}
              onChange={() => onToggle(perm._id)}
              disabled={!editable}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function RoleActions({
  isEditing,
  onEdit,
  onCancel,
  onSave,
  onTogglePerms,
  showPerms,
  canDelete,
  onDelete,
}: RoleActionsProps) {
  return (
    <div className="flex gap-2 mb-2 justify-end">
      <div>
        {isEditing ? (
          <div className="flex gap-2">
            <Button size="sm" color="gray" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
            <Button size="sm" color="indigo" onClick={onSave}>
              Enregistrer
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button size="sm" color="indigo" variant="outline" onClick={onEdit}>
              Modifier
            </Button>
            {canDelete && onDelete && (
              <Button
                size="sm"
                color="red"
                variant="outline"
                onClick={onDelete}
              >
                Supprimer
              </Button>
            )}
          </div>
        )}
      </div>
      <div>
        <Button
          size="sm"
          color="indigo"
          variant="outline"
          onClick={onTogglePerms}
        >
          {showPerms ? "Masquer les permissions" : "Voir les permissions"}
        </Button>
      </div>
    </div>
  );
}


export function RoleInfo({
  isEditing,
  name,
  description,
  onChangeName,
  onChangeDescription,
}: RoleInfoProps) {
  return (
    <div className="flex-1 min-w-0">
      {isEditing ? (
        <InputField
          label="Nom du rôle"
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangeName(e.target.value)}
          className="mb-2"
        />
      ) : (
        <div className="font-semibold text-lg">{name}</div>
      )}
      {isEditing ? (
        <InputField
          label="Description"
          value={description}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangeDescription(e.target.value)}
          className="mb-2"
        />
      ) : (
        <div className="text-xs text-gray-500 mb-2">{description}</div>
      )}
    </div>
  );
}
