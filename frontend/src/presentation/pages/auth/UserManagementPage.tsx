import { useUserManagement } from "@hooks/auth/useUserManagement";
import Table from "@components/Table";
import Button from "@components/forms/Button";
import { useEffect } from "react";
import { useDashboardStore } from "@store/dashboard";
import type { User } from "@type/authTypes";
import { ROUTES } from "@constants/routes";
import UserModalForm from "@components/auth/UserModalForm";
import UserDeleteModal from "@components/auth/UserDeleteModal";

function getErrorMsg(err: unknown) {
  if (!err) return undefined;
  if (typeof err === "string") return err;
  if (typeof (err as { message?: string }).message === "string")
    return (err as { message?: string }).message;
  return undefined;
}

export default function UserManagementPage() {
  const setBreadcrumb = useDashboardStore((s) => s.setBreadcrumb);
  useEffect(() => {
    setBreadcrumb([{ url: ROUTES.users, label: "Gestion des Utilisateurs" }]);
  }, [setBreadcrumb]);

  const {
    users,
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
    formHook,
    columns,
    hasPermission,
    rolesList,
  } = useUserManagement();

  return (
    <div className="max-w-5xl mx-auto py-4 bg-white dark:bg-gray-900 px-4 sm:px-6 lg:px-8 shadow-sm">
      <div className="flex items-center justify-end mb-6">
        <div>
          {hasPermission("user:canCreate") && (
            <Button
              color="indigo"
              size="sm"
              variant="solid"
              className="w-max"
              onClick={() => openModal()}
            >
              Ajouter un utilisateur
            </Button>
          )}
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
          key: "actions",
          render: (u: User) => (
            <div className="flex items-center flex-wrap gap-2 px-4">
              {hasPermission("user:canUpdate") && (
                <div>
                  <Button
                    color="indigo"
                    size="sm"
                    variant="outline"
                    title="Modfier l’utilisateur"
                    className=" w-max !border-none"
                    onClick={() => openModal(u)}
                  >
                    Modifier
                  </Button>
                </div>
              )}
              {hasPermission("user:canDelete") && (
                <div>
                  <Button
                    color="red"
                    size="sm"
                    variant="outline"
                    title="Supprimer l’utilisateur"
                    className="w-max !border-none "
                    onClick={() => {
                      setUserToDelete(u);
                      setDeleteModalOpen(true);
                    }}
                  >
                    Supprimer
                  </Button>
                </div>
              )}
            </div>
          ),
          className: "text-right",
        }}
      />
      <UserModalForm
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveUser}
        loading={isSaving}
        editingUser={!!editingUser}
        form={form}
        setForm={setForm}
        formHook={formHook}
        showPassword={showPassword}
        generatePassword={generatePassword}
        rolesList={rolesList}
        getErrorMsg={getErrorMsg}
      />
      <UserDeleteModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setUserToDelete(null);
        }}
        onConfirm={handleDeleteUser}
        loading={isDeleting}
        userToDelete={userToDelete}
      />
    </div>
  );
}
