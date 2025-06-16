import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { deleteSource } from "@/data/services/datasource";
import { useNotificationStore } from "@/core/store/notification";
import { useNavigate } from "react-router-dom";
import { useSources } from "./useSources";

export function useSourcesPage() {
  const { data: sources, isLoading, refetch, refetchSources } = useSources();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
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
    queryClient.invalidateQueries({ queryKey: ["sources"] });

    //Recharger la liste de sources
    refetch();
    refetchSources && refetchSources();
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
    queryClient.invalidateQueries({ queryKey: ["sources"] });
    // Recharger la liste de sources après suppression
    refetch();
  };
  const handleDeleteError = (message: string) => {
    showNotification({
      open: true,
      type: "error",
      title: "Erreur",
      description: message,
    });
  };

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteSource(id),
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
