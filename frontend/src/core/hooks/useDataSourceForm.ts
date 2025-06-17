import { useMutation } from "@tanstack/react-query";
import { createSource, detectColumns } from "@/data/services/datasource";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { useNotificationStore } from "@/core/store/notification";

export function useDataSourceForm() {
  // Gestion du flow multi-étapes
  const [step, setStep] = useState(1);
  const [endpoint, setEndpoint] = useState("");
  const [filePath, setFilePath] = useState("");
  const [columns, setColumns] = useState<{ name: string; type: string }[]>([]);
  const [columnsLoading, setColumnsLoading] = useState(false);
  const [columnsError, setColumnsError] = useState("");
  const [dataPreview, setDataPreview] = useState<Record<string, unknown>[]>([]);
  const [name, setName] = useState("");
  const [type, setType] = useState<"json" | "csv">("json");
  const [globalError, setGlobalError] = useState("");
  const [success, setSuccess] = useState(false);
  const [csvOrigin, setCsvOrigin] = useState<"url" | "upload">("url");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  // timestampField dynamique, initialisé vide
  const [timestampField, setTimestampField] = useState("");
  const navigate = useNavigate();
  const showNotification = useNotificationStore((s) => s.showNotification);

  // Création de la source (étape 3)
  const mutation = useMutation({
    mutationFn: async () => {
      // Préparation des données à envoyer
      if (type === "csv" && csvOrigin === "upload" && csvFile) {
        console.log("[CREATE] Upload CSV file:", csvFile);
        // Envoi multipart/form-data
        const formData = new FormData();
        formData.append("name", name);
        formData.append("type", type);
        formData.append("file", csvFile);
        if (timestampField) formData.append("timestampField", timestampField);
        // endpoint non envoyé
        return await createSource(formData);
      } else {
        console.log("[CREATE] Création source JSON ou CSV URL", {
          name,
          type,
          endpoint,
          filePath,
        });
        // JSON classique
        return await createSource({
          name,
          type,
          endpoint: type === "csv" && csvOrigin === "url" ? endpoint : endpoint, // endpoint seulement si url
          filePath:
            type === "csv" && csvOrigin === "upload" ? undefined : filePath,
          ...(timestampField ? { timestampField } : {}),
        });
      }
    },
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

  // Étape 1 : détection colonnes + preview
  const handleNext = async () => {
    setColumnsError("");
    setColumns([]);
    setDataPreview([]);
    setColumnsLoading(true);
    try {
      let res: {
        columns: string[];
        preview?: Record<string, unknown>[];
        types?: Record<string, string>;
      };
      if (type === "csv" && csvOrigin === "upload" && csvFile) {
        console.log("[DETECT] Upload temporaire CSV pour détection:", csvFile);
        // Détection via upload du fichier
        res = await detectColumns({ type, file: csvFile });
      } else {
        const params: any = { type };
        if (type === "csv" && csvOrigin === "url") {
          params.endpoint = endpoint;
        } else if (type === "json") {
          params.endpoint = endpoint;
        }
        console.log("[DETECT] Détection colonnes params:", params);
        res = await detectColumns(params);
      }
      if (!res.columns || res.columns.length === 0) {
        setColumnsError("Aucune colonne détectée.");
        setColumnsLoading(false);
        return;
      }
      // Aperçu des données (5 premières lignes)
      let data: Record<string, unknown>[] = res.preview || [];
      setDataPreview(data);
      // Détection du type de chaque colonne (utilise types du backend si dispo)
      setColumns(
        res.columns.map((col: string) => ({
          name: col,
          type:
            res.types && res.types[col]
              ? res.types[col]
              : Array.isArray(data) &&
                data.length > 0 &&
                data[0][col] !== undefined
              ? typeof data[0][col]
              : "inconnu",
        }))
      );
      // Pré-sélection automatique si une colonne timestamp/date existe
      const autoTimestamp = res.columns.find((col) =>
        ["timestamp", "date", "createdAt", "datetime"].some((k) =>
          col.toLowerCase().includes(k)
        )
      );
      setTimestampField(autoTimestamp || "");
      setStep(2);
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      setColumnsError(
        err.response?.data?.message || "Impossible de détecter les colonnes"
      );
    } finally {
      setColumnsLoading(false);
    }
  };

  // Étape 3 : création
  const handleCreate = async () => {
    setGlobalError("");
    mutation.mutate();
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
