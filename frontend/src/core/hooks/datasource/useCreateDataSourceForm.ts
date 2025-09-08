import { useNavigate } from "react-router-dom";
import { ROUTES } from "@constants/routes";
import { useNotificationStore } from "@store/notification";
import { useCreateSourceMutation } from "@/data/repositories/datasources";
import { useQueryClient } from "@tanstack/react-query";
import { useSourceFormBase } from "@hooks/datasource/useSourceFormBase";
import type { ApiError } from "@type/api";
import type { SourceFormState } from "@type/dataSource";

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
    onError: (e: ApiError) => {
      base.setGlobalError(
        e?.message ||
        "Erreur lors de la création de la source"
      );
    },
  });

  const onSubmit = (data: SourceFormState) => {
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
