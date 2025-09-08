import type { UserDeleteModalProps } from "@type/ui";
import AlertModal from "@components/AlertModal";


export default function UserDeleteModal({
  open,
  onClose,
  onConfirm,
  loading,
  userToDelete,
}: UserDeleteModalProps) {
  return (
    <AlertModal
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      type="error"
      title="Supprimer l’utilisateur ?"
      description={
        userToDelete
          ? `Cette action supprimera l’utilisateur «${userToDelete.username || userToDelete.email
          }», ses widgets et dashboards privés. Les objets publics resteront mais sans propriétaire.`
          : ""
      }
      confirmLabel="Supprimer"
      cancelLabel="Annuler"
      loading={loading}
    />
  );
}
