import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import {
  detectColumnsQuery,
  useUpdateSourceMutation,
  sourceByIdQuery,
} from "@/data/repositories/sources";
import { useNotificationStore } from "@/core/store/notification";
import { useDashboardStore } from "@/core/store/dashboard";
import {
  mapDetectedColumns,
  autoDetectTimestampField,
} from "@/core/utils/dataSourceFormUtils";
import type { DataSourceFormType } from "@/core/hooks/datasource/useDataSourceForm";
import { ROUTES } from "@/core/constants/routes";

export function useEditDataSourceForm() {
  const { id } = useParams<{ id: string }>();
  const setBreadcrumb = useDashboardStore((s) => s.setBreadcrumb);
  const {
    data: initial,
    isLoading,
    error: queryError,
  } = sourceByIdQuery({ id });
  const navigate = useNavigate();
  const showNotification = useNotificationStore((s) => s.showNotification);
  const queryClient = useQueryClient();

  // Zod schema identique à la création
  const dataSourceSchema = z.object({
    name: z.string().min(1, "Le nom est requis"),
    type: z.enum(["json", "csv"]),
    endpoint: z.string().optional(),
    httpMethod: z.enum(["GET", "POST"]),
    authType: z.enum(["none", "bearer", "apiKey", "basic"]),
    authConfig: z.any(),
    timestampField: z.string().optional(),
  });

  // RHF
  const methods = useForm<DataSourceFormType>({
    defaultValues: {
      name: "",
      type: "json",
      endpoint: "",
      httpMethod: "GET",
      authType: "none",
      authConfig: {
        token: "",
        apiKey: "",
        username: "",
        password: "",
        headerName: "",
      },
      timestampField: "",
    },
    resolver: zodResolver(dataSourceSchema),
    mode: "onChange",
  });
  const { setValue, reset, getValues } = methods;

  // Multi-step et états locaux
  const [step, setStep] = useState(1);
  const [csvOrigin, setCsvOrigin] = useState<"url" | "upload">("url");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [filePath, setFilePath] = useState<string | null>(null); // Ajouté pour gérer le fichier existant
  const [showFileField, setShowFileField] = useState(true);
  const [columns, setColumns] = useState<{ name: string; type: string }[]>([]);
  const [columnsError, setColumnsError] = useState("");
  const [dataPreview, setDataPreview] = useState<Record<string, unknown>[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [globalError, setGlobalError] = useState("");

  // Détection colonnes
  const [detectParams, setDetectParams] = useState<any | null>(null);
  const {
    data: detectData,
    isLoading: columnsLoading,
    error: detectError,
    isFetching,
  } = detectColumnsQuery(detectParams, !!detectParams);

  // Initialisation du formulaire à la réception de la source
  useEffect(() => {
    if (!initial) return;
    // Déduire csvOrigin et filePath
    let deducedCsvOrigin: "url" | "upload" = "url";
    let deducedFilePath: string | null = null;
    let deducedShowFileField = true;
    if (initial.type === "csv") {
      if (initial.filePath) {
        deducedCsvOrigin = "upload";
        deducedFilePath = initial.filePath;
        deducedShowFileField = false;
      } else if (initial.endpoint) {
        deducedCsvOrigin = "url";
        deducedShowFileField = true;
      }
    }
    setCsvOrigin(deducedCsvOrigin);
    setFilePath(deducedFilePath);
    setShowFileField(deducedShowFileField);
    // Initialisation des valeurs du formulaire
    reset({
      name: initial.name || "",
      type: initial.type || "json",
      endpoint: initial.endpoint || "",
      httpMethod: initial.httpMethod || "GET",
      authType: initial.authType || "none",
      authConfig: initial.authConfig || {
        token: "",
        apiKey: "",
        username: "",
        password: "",
        headerName: "",
      },
      timestampField: initial.timestampField || "",
    });
    setBreadcrumb([
      { url: ROUTES.sources, label: "Sources" },
      {
        url: ROUTES.editSource.replace(":id", id || ""),
        label: `Modifier : ${initial.name}`,
      },
    ]);
  }, [initial, reset, setBreadcrumb, id]);

  // Navigation étape 1 -> 2 (détection colonnes)
  const handleNext = () => {
    setColumnsError("");
    setColumns([]);
    setDataPreview([]);
    const values = getValues();
    let params: any = {};
    if (values.type === "csv" && csvOrigin === "upload") {
      if (csvFile) {
        // Nouveau fichier uploadé
        params = {
          type: values.type,
          file: csvFile,
          httpMethod: values.httpMethod,
          authType: values.authType,
          authConfig: values.authConfig,
        };
      } else if (filePath) {
        // Fichier existant, non remplacé
        params = {
          sourceId: id,
          type: values.type,
          httpMethod: values.httpMethod,
          authType: values.authType,
          authConfig: values.authConfig,
        };
      }
    } else if (values.type === "csv" && csvOrigin === "url") {
      params = {
        type: values.type,
        endpoint: values.endpoint,
        httpMethod: values.httpMethod,
        authType: values.authType,
        authConfig: values.authConfig,
      };
    } else if (values.type === "json") {
      params = {
        type: values.type,
        endpoint: values.endpoint,
        httpMethod: values.httpMethod,
        authType: values.authType,
        authConfig: values.authConfig,
      };
    }
    setDetectParams(params);
  };

  // Effet pour traiter le résultat de la détection et passer à l'étape 2
  useEffect(() => {
    if (!detectParams || columnsLoading || isFetching) return;
    if (detectError) {
      setColumnsError("Erreur lors de la détection des colonnes");
      setColumns([]);
      setDataPreview([]);
      setStep(2); // On passe quand même à l'étape 2 pour permettre la modif
      return;
    }
    if (detectData) {
      setColumns(mapDetectedColumns(detectData, detectData.preview || []));
      setDataPreview(detectData.preview || []);
      // Auto-détection du champ timestamp si non défini
      if (!getValues().timestampField) {
        const auto = autoDetectTimestampField(
          (detectData.columns || []) as string[]
        );
        setValue("timestampField", auto);
      }
      setStep(2);
    }
  }, [
    detectData,
    detectError,
    columnsLoading,
    isFetching,
    detectParams,
    setValue,
    getValues,
  ]);

  // Mutation pour la mise à jour
  const updateMutation = useUpdateSourceMutation({
    queryClient,
    onSuccess: () => {
      showNotification({
        type: "success",
        title: "Source modifiée avec succès",
        open: true,
      });
      navigate("/sources");
    },
    onError: (e: any) => {
      setGlobalError(
        e?.response?.data?.message ||
          e?.message ||
          "Erreur lors de la modification de la source"
      );
    },
  });

  // Soumission finale (édition)
  const onSubmit = (data: DataSourceFormType) => {
    setGlobalError("");
    // On ne renvoie pas le fichier (non modifiable), on envoie les champs édités
    updateMutation.mutate({
      id: id || "",
      data: {
        ...data,
        // Pour CSV uploadé, garder filePath, pour CSV distant ou JSON, garder endpoint
        ...(initial?.type === "csv" && initial?.filePath
          ? { filePath: initial.filePath, endpoint: undefined }
          : {}),
        ...(initial?.type === "csv" && initial?.endpoint
          ? { endpoint: data.endpoint, filePath: undefined }
          : {}),
      },
    });
  };

  // Réinitialisation cohérente lors des changements de type/origine
  useEffect(() => {
    // Si on passe de upload à url, on reset le fichier
    if (csvOrigin === "url") {
      setCsvFile(null);
      setFilePath(null);
    }
    // Si on change de type, on reset tout ce qui ne correspond pas
    if (methods.watch("type") !== "csv") {
      setCsvFile(null);
      setFilePath(null);
      setCsvOrigin("url");
    }
  }, [csvOrigin, methods.watch("type")]);

  return {
    methods,
    step,
    setStep,
    csvOrigin,
    setCsvOrigin,
    csvFile,
    setCsvFile,
    filePath,
    setFilePath,
    showFileField,
    setShowFileField,
    columns,
    columnsLoading,
    columnsError,
    dataPreview,
    showModal,
    setShowModal,
    globalError,
    handleNext,
    onSubmit,
    isLoading,
    error: queryError,
  };
}
