import { useDeleteSourceMutation, sourcesQuery } from "@/data/repositories/sources";
import { useNotificationStore } from "@/core/store/notification";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

export function useSourcesPage() {
  const queryClient = useQueryClient();
  const { data: sources, isLoading, refetch, refetchSources } = sourcesQuery({queryClient});
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState<any>(null);
  const [modalType, setModalType] = useState<"delete" | "edit" | null>(null);
  const showNotification = useNotificationStore((s) => s.showNotification);

  const handleEditSuccess = () => {
    showNotification({
      open: true,
      type: "success",
      title: "Source modifiée",
      description: "La source a bien été modifiée.",
    });
  };
  const handleEditError = (message: string) => {
    showNotification({
      open: true,
      type: "error",
      title: "Erreur",
      description: message,
    });
  };
  const handleDeleteSuccess = () => {
    showNotification({
      open: true,
      type: "success",
      title: "Source supprimée",
      description: "La source a bien été supprimée.",
    });
  };
  const handleDeleteError = (message: string) => {
    showNotification({
      open: true,
      type: "error",
      title: "Erreur",
      description: message,
    });
  };

  const deleteMutation = useDeleteSourceMutation({
    queryClient,
    onSuccess: () => {
      setModalOpen(false);
      setSelectedSource(null);
      handleDeleteSuccess();
    },
    onError: (e: any) => {
      setModalOpen(false);
      setSelectedSource(null);
      handleDeleteError(
        e.response?.data?.message || "Erreur lors de la suppression"
      );
    },
  });

  return {
    sources,
    isLoading,
    modalOpen,
    setModalOpen,
    selectedSource,
    setSelectedSource,
    modalType,
    setModalType,
    navigate,
    deleteMutation,
    handleEditSuccess,
    handleEditError,
    refetch,
    refetchSources,
  };
}
