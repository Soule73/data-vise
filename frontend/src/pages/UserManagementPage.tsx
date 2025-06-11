import { useUserManagement } from "@/hooks/useUserManagement";
import { userSchema } from "@/validation/user";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Table from "@/components/Table";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import InputField from "@/components/InputField";
import SelectField from "@/components/SelectField";
import AlertModal from "@/components/AlertModal";
import { useEffect } from "react";
import { useDashboardStore } from "@/store/dashboard";
import { Link } from "react-router-dom";

interface User {
  _id: string;
  email: string;
  username: string;
  roleId?: { _id: string; name: string };
}

function getErrorMsg(err: any) {
  if (!err) return undefined;
  if (typeof err === "string") return err;
  if (typeof err.message === "string") return err.message;
  return undefined;
}

export default function UserManagementPage() {
  const setBreadcrumb = useDashboardStore((s) => s.setBreadcrumb);
  useEffect(() => {
    setBreadcrumb([{ url: "/users", label: "Gestion des Utilisateurs" }]);
  }, [setBreadcrumb]);

  const {
    users,
    roles,
    isLoading,
    modalOpen,
    setModalOpen,
    editingUser,
    form,
    setForm,
    isSaving,
    showPassword,
    openModal,
    handleSaveUser,
    deleteModalOpen,
    setDeleteModalOpen,
    userToDelete,
    setUserToDelete,
    handleDeleteUser,
    isDeleting,
    generatePassword,
  } = useUserManagement();

  const formHook = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: form,
    values: form,
  });

  // Synchronise le form local et react-hook-form
  function handleFormChange(e: any) {
    setForm((f: any) => ({ ...f, [e.target.name]: e.target.value }));
    formHook.setValue(e.target.name, e.target.value);
  }

  // Table columns (sans la colonne actions)
  const columns = [
    { key: "email", label: "Email" },
    { key: "username", label: "Nom d’utilisateur" },
    { key: "roleId", label: "Rôle", render: (u: any) => u.roleId?.name },
  ];

  return (
    <div className="max-w-5xl mx-auto py-4 bg-white dark:bg-gray-900 px-4 sm:px-6 lg:px-8 shadow-sm">
      <div className="flex items-center justify-end mb-6">
        <div>
          <Link
            className=" w-max text-indigo-500 underline hover:text-indigo-600 font-medium"
            to={"#"}
            onClick={() => openModal()}
          >
            Ajouter un utilisateur
          </Link>
        </div>
      </div>
      <Table
        searchable={true}
        paginable={true}
        rowPerPage={5}
        columns={columns}
        data={users}
        emptyMessage={isLoading ? "Chargement..." : "Aucun utilisateur."}
        actionsColumn={{
          label: "",
          render: (u: User) => (
            <div className="flex items-center flex-wrap gap-2 px-4">
              <div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openModal(u)}
                >
                  Modifier
                </Button>
              </div>
              <div>
                <Button
                  size="sm"
                  color="red"
                  variant="outline"
                  onClick={() => {
                    setUserToDelete(u);
                    setDeleteModalOpen(true);
                  }}
                >
                  Supprimer
                </Button>
              </div>
            </div>
          ),
          className: "text-right",
        }}
      />
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={
          editingUser ? "Modifier un utilisateur" : "Ajouter un utilisateur"
        }
        size="md"
        footer={
          <div className="flex gap-2 justify-end">
            <Button onClick={() => setModalOpen(false)} variant="outline">
              Annuler
            </Button>
            <Button onClick={handleSaveUser} loading={isSaving}>
              {editingUser ? "Enregistrer" : "Créer"}
            </Button>
          </div>
        }
      >
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveUser();
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
                  label="Mot de passe"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password || ""}
                  onChange={handleFormChange}
                  minLength={8}
                  required={!editingUser}
                  placeholder="Définir un mot de passe..."
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
            value={form.role}
            onChange={handleFormChange}
            required
            options={roles.map((r: any) => ({ value: r._id, label: r.name }))}
            error={getErrorMsg(formHook.formState.errors.role)}
          />
        </form>
      </Modal>
      <AlertModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setUserToDelete(null);
        }}
        onConfirm={handleDeleteUser}
        type="error"
        title="Supprimer l’utilisateur ?"
        description={
          userToDelete
            ? `Cette action supprimera l’utilisateur «${
                userToDelete.username || userToDelete.email
              }», ses widgets et dashboards privés. Les objets publics resteront mais sans propriétaire.`
            : ""
        }
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        loading={isDeleting}
      />
    </div>
  );
}
