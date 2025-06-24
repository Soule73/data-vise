import AlertModal from "@/presentation/components/AlertModal";
import type { User } from "@/core/types/auth-types";

interface UserDeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  userToDelete: User | null;
}

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
          ? `Cette action supprimera l’utilisateur «${
              userToDelete.username || userToDelete.email
            }», ses widgets et dashboards privés. Les objets publics resteront mais sans propriétaire.`
          : ""
      }
      confirmLabel="Supprimer"
      cancelLabel="Annuler"
      loading={loading}
    />
  );
}
