import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateWidgetMutation } from "@repositories/widgets";
import { useNotificationStore } from "@store/notification";
import { useDashboardStore } from "@store/dashboard";
import { ROUTES } from "@constants/routes";
import type { WidgetFormInitialValues } from "@type/widgetTypes";
import { useCommonWidgetForm } from "@hooks/widget/useCommonWidgetForm";

export function useWidgetCreateForm(initialValues?: WidgetFormInitialValues) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const showNotification = useNotificationStore((s) => s.showNotification);
  const setBreadcrumb = useDashboardStore((s) => s.setBreadcrumb);

  // Utilise le hook centralisé pour toute la logique de formulaire
  const form = useCommonWidgetForm(initialValues);

  // Mutation de création
  const createMutation = useCreateWidgetMutation({
    queryClient,
    onSuccess: (widget) => {
      showNotification({
        open: true,
        type: "success",
        title: "Succès",
        description: "Widget créé avec succès ! Redirection...",
      });
      setTimeout(() => {
        const id = widget._id || "";
        navigate(ROUTES.editWidget.replace(":id", String(id)));
      }, 1000);
    },
    onError: (e) => {
      showNotification({
        open: true,
        type: "error",
        title: "Erreur",
        description: e.message || "Erreur lors de la création du widget",
      });
    },
  });

  // Breadcrumb dynamique pour la création
  useEffect(() => {
    setBreadcrumb([
      { url: ROUTES.widgets, label: "Visualisations" },
      { url: ROUTES.createWidget, label: form.widgetTitle || "Créer" },
    ]);
  }, [form.widgetTitle, setBreadcrumb]);

  // Handler de création (validation + mutation)
  function handleCreate() {
    if (!form.widgetTitle.trim()) {
      form.setWidgetTitleError("Le titre est requis");
      return;
    }
    form.setTitle(form.widgetTitle);
    form.setShowSaveModal(false);
    const payload = {
      title: form.widgetTitle.trim(),
      type: form.type,
      dataSourceId: form.sourceId,
      config: form.config,
      visibility: form.visibility,
    };
    createMutation.mutate(payload);
  }

  return {
    ...form,
    createMutation,
    handleCreate,
  };
}
