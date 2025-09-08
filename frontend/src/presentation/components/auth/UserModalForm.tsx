import Modal from "@components/Modal";
import InputField from "@components/forms/InputField";
import SelectField from "@components/SelectField";
import Button from "@components/forms/Button";
import type { User } from "@type/authTypes";
import React from "react";
import type { UserModalFormProps } from "@type/ui";

export default function UserModalForm({
  open,
  onClose,
  onSave,
  loading,
  editingUser,
  form,
  setForm,
  formHook,
  showPassword,
  generatePassword,
  rolesList,
  getErrorMsg,
}: UserModalFormProps) {
  function handleFormChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    let value: string | number = e.target.value;
    if (value && typeof value === "object" && "value" in value) {
      value = (value as { value: string | number }).value;
    }
    setForm((f: User) => ({ ...f, [e.target.name]: value }));
    formHook.setValue(e.target.name, value);
  }

  const formWithPassword = form as User & { password?: string };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editingUser ? "Modifier un utilisateur" : "Ajouter un utilisateur"}
      size="md"
      footer={
        <div className="flex gap-2 justify-baseline w-full ">
          <Button onClick={onClose} variant="outline" color="gray">
            Annuler
          </Button>
          <Button onClick={onSave} loading={loading} disabled={loading}>
            {editingUser ? "Enregistrer" : "Créer"}
          </Button>
        </div>
      }
    >
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          onSave();
        }}
      >
        <InputField
          label="Email"
          name="email"
          value={form.email}
          onChange={handleFormChange}
          required
          error={getErrorMsg(formHook.formState.errors.email)}
        />
        <InputField
          label="Nom d’utilisateur"
          name="username"
          value={form.username}
          onChange={handleFormChange}
          required
          error={getErrorMsg(formHook.formState.errors.username)}
        />
        <div>
          <div className="flex items-end mb-1 gap-2">
            <div className="flex-1">
              <InputField
                label={editingUser ? "Nouveau mot de passe" : "Mot de passe"}
                name="password"
                type={showPassword ? "text" : "password"}
                value={formWithPassword.password || ""}
                onChange={handleFormChange}
                minLength={8}
                required={!editingUser}
                className=" placeholder:text-xs"
                placeholder={
                  editingUser
                    ? "Laisser vide pour conserver le mot de passe actuel"
                    : "Définir un mot de passe..."
                }
                error={getErrorMsg(formHook.formState.errors.password)}
              />
            </div>
            <div>
              <Button
                type="button"
                size="lg"
                className="text-xs cursor-pointer text-indigo-600 hover:underline whitespace-nowrap"
                onClick={generatePassword}
              >
                Générer
              </Button>
            </div>
          </div>
        </div>
        <SelectField
          label="Rôle"
          name="role"
          id="role"
          value={String(form.role) || ""}
          onChange={(e) =>
            handleFormChange({ ...e, target: { ...e.target, name: "role" } })
          }
          required
          options={rolesList}
          error={getErrorMsg(formHook.formState.errors.role)}
        />
      </form>
    </Modal>
  );
}
