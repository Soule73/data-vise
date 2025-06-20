import React, { useState } from "react";
import { detectColumnsQuery } from "@/data/repositories/sources";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { useNotificationStore } from "@/core/store/notification";
import { useCreateSourceMutation } from "@/data/repositories/sources";
import { mapDetectedColumns, autoDetectTimestampField, buildDetectParams } from "@/core/utils/dataSourceFormUtils";
import { useQueryClient } from "@tanstack/react-query";

export function useDataSourceForm() {
  // Gestion du flow multi-étapes
  const [step, setStep] = useState(1);
  const [endpoint, setEndpoint] = useState("");
  const [filePath, setFilePath] = useState("");
  const [columns, setColumns] = useState<{ name: string; type: string }[]>([]);
  const [columnsError, setColumnsError] = useState("");
  const [dataPreview, setDataPreview] = useState<Record<string, unknown>[]>([]);
  const [name, setName] = useState("");
  const [type, setType] = useState<"json" | "csv">("json");
  const [globalError, setGlobalError] = useState("");
  const [success, setSuccess] = useState(false);
  const [csvOrigin, setCsvOrigin] = useState<"url" | "upload">("url");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const queryClient = useQueryClient();

  // timestampField dynamique, initialisé vide
  const [timestampField, setTimestampField] = useState("");

  const navigate = useNavigate();
  const showNotification = useNotificationStore((s) => s.showNotification);

  // Création de la source (étape 3)
  const mutation = useCreateSourceMutation({
    queryClient,
    onSuccess: () => {
      setGlobalError("");
      setSuccess(true);
      showNotification({
        open: true,
        type: "success",
        title: "Source ajoutée",
        description: "La source a bien été créée.",
      });
      setTimeout(() => navigate(ROUTES.sources), 1200);
    },
    onError: (e: unknown) => {
      setGlobalError("");
      const err = e as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      showNotification({
        open: true,
        type: "error",
        title: "Erreur lors de la création",
        description:
          err.response?.data?.message ||
          err.message ||
          "Erreur lors de la création de la source",
      });
    },
  });

  // Ajout d'un état pour les paramètres de détection
  const [detectParams, setDetectParams] = useState<any | null>(null);
  const {
    data: detectData,
    isLoading: columnsLoading,
    error: detectError,
    isFetching,
  } = detectColumnsQuery(detectParams, !!detectParams);

  // Étape 1 : détection colonnes + preview
  const handleNext = async () => {
    setColumnsError("");
    setColumns([]);
    setDataPreview([]);
    // Construction des params
    const params = buildDetectParams({ type, csvOrigin, csvFile, endpoint });
    setDetectParams(params);
  };

  // Effet pour traiter le résultat de la détection
  React.useEffect(() => {
    if (!detectParams) return;
    if (columnsLoading || isFetching) return;
    if (detectError) {
      setColumnsError(
        (detectError as any)?.response?.data?.message ||
        (detectError as Error)?.message ||
        "Impossible de détecter les colonnes"
      );
      return;
    }
    if (detectData) {
      if (!detectData.columns || detectData.columns.length === 0) {
        setColumnsError("Aucune colonne détectée.");
        return;
      }
      let data: Record<string, unknown>[] = detectData.preview || [];
      setDataPreview(data);
      setColumns(mapDetectedColumns(detectData, data));
      const autoTimestamp = autoDetectTimestampField(detectData.columns);
      setTimestampField(autoTimestamp || "");
      setStep(2);
    }
  }, [detectData, detectError, columnsLoading, isFetching, detectParams]);

  // Étape 3 : création
  const handleCreate = async () => {
    setGlobalError("");
    if (type === "csv" && csvOrigin === "upload" && csvFile) {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("type", type);
      formData.append("file", csvFile);
      if (timestampField) formData.append("timestampField", timestampField);
      mutation.mutate(formData);
    } else {
      mutation.mutate({
        name,
        type,
        endpoint: type === "csv" && csvOrigin === "url" ? endpoint : endpoint,
        filePath: type === "csv" && csvOrigin === "upload" ? undefined : filePath,
        ...(timestampField ? { timestampField } : {}),
      });
    }
  };

  return {
    step,
    setStep,
    endpoint,
    setEndpoint,
    filePath,
    setFilePath,
    columns,
    columnsLoading,
    columnsError,
    dataPreview,
    name,
    setName,
    type,
    setType,
    csvOrigin,
    setCsvOrigin,
    csvFile,
    setCsvFile,
    globalError,
    setGlobalError,
    success,
    handleNext,
    handleCreate,
    loading: mutation.isPending,
    timestampField,
    setTimestampField,
  };
}
