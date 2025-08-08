import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { useNotificationStore } from "@/core/store/notification";
import { useCreateSourceMutation } from "@/data/repositories/sources";
import { useQueryClient } from "@tanstack/react-query";
import { useSourceFormBase } from "./useSourceFormBase";

export function useCreateDataSourceForm() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const showNotification = useNotificationStore((s) => s.showNotification);
  // Centralise tout l'état et la logique de détection
  const base = useSourceFormBase();

  // Soumission finale (création)
  const mutation = useCreateSourceMutation({
    queryClient,
    onSuccess: () => {
      base.setGlobalError("");
      showNotification({
        open: true,
        type: "success",
        title: "Source ajoutée",
        description: "La source a bien été ajoutée.",
      });
      setTimeout(() => navigate(ROUTES.sources), 1200);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (e: any) => {
      base.setGlobalError(
        e?.response?.data?.message ||
        e?.message ||
        "Erreur lors de la création de la source"
      );
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    // On envoie tous les champs centralisés
    mutation.mutate({
      ...base.form,
      ...data,
    });
  };

  return {
    ...base,
    onSubmit,
  };
}
