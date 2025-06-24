import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { detectColumnsQuery } from "@/data/repositories/sources";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { useNotificationStore } from "@/core/store/notification";
import { useCreateSourceMutation } from "@/data/repositories/sources";
import {
  mapDetectedColumns,
  autoDetectTimestampField,
  buildDetectParams,
} from "@/core/utils/dataSourceFormUtils";
import { useQueryClient } from "@tanstack/react-query";

const dataSourceSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  type: z.enum(["json", "csv"]),
  endpoint: z.string().optional(),
  httpMethod: z.enum(["GET", "POST"]),
  authType: z.enum(["none", "bearer", "apiKey", "basic"]),
  authConfig: z.any(),
  timestampField: z.string().optional(),
});

export type DataSourceFormType = z.infer<typeof dataSourceSchema>;

export function useDataSourceForm() {
  // RHF
  const methods = useForm<DataSourceFormType>({
    defaultValues: {
      name: "",
      type: "json",
      endpoint: "",
      httpMethod: "GET",
      authType: "none",
      authConfig: {},
      timestampField: "",
    },
    resolver: zodResolver(dataSourceSchema),
    mode: "onChange",
  });
  const { setValue, getValues } = methods;

  // Flow multi-étapes
  const [step, setStep] = useState(1);
  const [csvOrigin, setCsvOrigin] = useState<"url" | "upload">("url");
  const [csvFile, setCsvFile] = useState<File | null>(null);
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

  // Navigation étape 1 -> 2 (détection colonnes)
  const handleNext = () => {
    setColumnsError("");
    setColumns([]);
    setDataPreview([]);
    const values = getValues();
    const params = buildDetectParams({
      type: values.type,
      csvOrigin,
      csvFile,
      endpoint: values.endpoint || "",
      httpMethod: values.httpMethod,
      authType: values.authType,
      authConfig: values.authConfig,
    });
    setDetectParams(params);
  };

  // Effet pour traiter le résultat de la détection
  useEffect(() => {
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
      setValue("timestampField", autoTimestamp || "");
      setStep(2);
    }
  }, [
    detectData,
    detectError,
    columnsLoading,
    isFetching,
    detectParams,
    setValue,
  ]);

  // Soumission finale (création)
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const showNotification = useNotificationStore((s) => s.showNotification);
  const mutation = useCreateSourceMutation({
    queryClient,
    onSuccess: () => {
      setGlobalError("");
      showNotification({
        open: true,
        type: "success",
        title: "Source ajoutée",
        description: "La source a bien été créée.",
      });
      setTimeout(() => navigate(ROUTES.sources), 1200);
    },
    onError: (e: any) => {
      setGlobalError(
        e?.response?.data?.message ||
          e?.message ||
          "Erreur lors de la création de la source"
      );
    },
  });

  const onSubmit = (data: DataSourceFormType) => {
    if (data.type === "csv" && csvOrigin === "upload" && csvFile) {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("type", data.type);
      formData.append("file", csvFile);
      if (data.timestampField)
        formData.append("timestampField", data.timestampField);
      formData.append("httpMethod", data.httpMethod);
      formData.append("authType", data.authType);
      formData.append("authConfig", JSON.stringify(data.authConfig));
      mutation.mutate(formData);
    } else {
      mutation.mutate({
        name: data.name,
        type: data.type,
        endpoint: data.endpoint,
        ...(data.timestampField ? { timestampField: data.timestampField } : {}),
        httpMethod: data.httpMethod,
        authType: data.authType,
        authConfig: data.authConfig,
      });
    }
  };

  return {
    ...methods,
    step,
    setStep,
    csvOrigin,
    setCsvOrigin,
    csvFile,
    setCsvFile,
    columns,
    columnsLoading,
    columnsError,
    dataPreview,
    showModal,
    setShowModal,
    globalError,
    setGlobalError,
    handleNext,
    onSubmit,
  };
}
