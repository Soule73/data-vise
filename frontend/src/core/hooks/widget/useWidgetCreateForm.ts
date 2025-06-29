import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateWidgetMutation } from "@/data/repositories/widgets";
import { useNotificationStore } from "@/core/store/notification";
import { useDashboardStore } from "@/core/store/dashboard";
import { ROUTES } from "@/core/constants/routes";
import type { WidgetFormInitialValues } from "@/core/types/widget-types";
import { useWidgetForm } from "./useWidgetForm";
import { v4 as uuidv4 } from "uuid";

export function useWidgetCreateForm(initialValues?: WidgetFormInitialValues) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const showNotification = useNotificationStore((s) => s.showNotification);
  const setBreadcrumb = useDashboardStore((s) => s.setBreadcrumb);

  // Centralise toute la logique de formulaire dans le hook partagé
  const form = useWidgetForm(initialValues);

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
    // eslint-disable-next-line
  }, [form.widgetTitle, setBreadcrumb]);

  // Génère un widgetId unique au format UUID
  function generateWidgetId() {
    return uuidv4();
  }

  // Handler de création (validation + mutation)
  function handleCreate() {
    if (!form.widgetTitle.trim()) {
      form.setWidgetTitleError("Le titre est requis");
      return;
    }
    form.setTitle(form.widgetTitle);
    form.setShowSaveModal(false);
    const payload = {
      widgetId: generateWidgetId(),
      title: form.widgetTitle.trim(),
      type: form.type,
      dataSourceId: form.sourceId, // correspondance backend
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
