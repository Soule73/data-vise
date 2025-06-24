import {
  useDeleteSourceMutation,
  sourcesQuery,
  getUploadedFile,
} from "@/data/repositories/sources";
import { useNotificationStore } from "@/core/store/notification";
import { useUserStore } from "@/core/store/user";
import { useDashboardStore } from "@/core/store/dashboard";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import type { DataSource } from "@/core/types/data-source";
import { ROUTES } from "@/core/constants/routes";

export function useSourcesPage() {
  const queryClient = useQueryClient();
  const {
    data: sourcesRaw,
    isLoading,
    refetch,
    refetchSources,
  } = sourcesQuery({ queryClient });
  const sources: DataSource[] = sourcesRaw || [];
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState<DataSource | null>(null);
  const [modalType, setModalType] = useState<"delete" | "edit" | null>(null);
  const showNotification = useNotificationStore((s) => s.showNotification);
  const hasPermission = useUserStore((s) => s.hasPermission);
  const setBreadcrumb = useDashboardStore((s) => s.setBreadcrumb);

  useEffect(() => {
    setBreadcrumb([{ url: ROUTES.sources, label: "Sources" }]);
  }, [setBreadcrumb]);

  const handleDownload = async (
    filename: string | undefined,
    displayName?: string
  ) => {
    if (!filename) {
      showNotification({
        open: true,
        type: "error",
        title: "Téléchargement échoué",
        description: "Aucun fichier à télécharger.",
      });
      return;
    }
    const cleanFilename = filename.startsWith("uploads/")
      ? filename.replace(/^uploads\//, "")
      : filename;
    try {
      const blob = await getUploadedFile(cleanFilename);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = displayName || cleanFilename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Erreur lors du téléchargement du fichier:", e);
      showNotification({
        open: true,
        type: "error",
        title: "Téléchargement échoué",
        description:
          "Erreur lors du téléchargement du fichier. Vérifiez vos droits ou réessayez plus tard.",
      });
    }
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
    deleteMutation,
    hasPermission,
    setBreadcrumb,
    handleDownload,
    navigate,
    refetch,
    refetchSources,
  };
}
