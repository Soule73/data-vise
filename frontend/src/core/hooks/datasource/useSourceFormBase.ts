import { useState } from "react";
import { detectColumnsQuery } from "@/data/repositories/sources";
import {
  mapDetectedColumns,
  autoDetectTimestampField,
  buildDetectParams,
} from "@/core/utils/dataSourceFormUtils";

export interface SourceFormState {
  name: string;
  type: "json" | "csv";
  endpoint: string;
  httpMethod: "GET" | "POST";
  authType: "none" | "bearer" | "apiKey" | "basic";
  authConfig: any;
  timestampField: string;
  file?: File | null;
}

export function useSourceFormBase(initial?: Partial<SourceFormState>) {
  const [form, setForm] = useState<SourceFormState>({
    name: initial?.name || "",
    type: initial?.type || "json",
    endpoint: initial?.endpoint || "",
    httpMethod: initial?.httpMethod || "GET",
    authType: initial?.authType || "none",
    authConfig: initial?.authConfig || {},
    timestampField: initial?.timestampField || "",
    file: initial?.file || null,
  });
  const [step, setStep] = useState(1);
  const [csvOrigin, setCsvOrigin] = useState<"url" | "upload">("url");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [columns, setColumns] = useState<{ name: string; type: string }[]>([]);
  const [columnsError, setColumnsError] = useState("");
  const [dataPreview, setDataPreview] = useState<Record<string, unknown>[]>([]);
  const [timestampField, setTimestampField] = useState(
    initial?.timestampField || ""
  );
  const [globalError, setGlobalError] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Détection colonnes
  const [detectParams, setDetectParams] = useState<any | null>(null);
  const {
    data: detectData,
    isLoading: columnsLoading,
    error: detectError,
    isFetching,
  } = detectColumnsQuery(detectParams, !!detectParams);

  // Handler pour changer un champ du form
  const setFormField = (field: string, value: any) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  // Étape 1 : détection colonnes + preview
  const handleNext = () => {
    setColumnsError("");
    setColumns([]);
    setDataPreview([]);
    // Construction des params
    const params = buildDetectParams({
      type: form.type,
      csvOrigin,
      csvFile,
      endpoint: form.endpoint,
      httpMethod: form.httpMethod,
      authType: form.authType,
      authConfig: form.authConfig,
    });
    setDetectParams(params);
  };

  // Effet pour traiter le résultat de la détection
  if (detectParams && !columnsLoading && !isFetching) {
    if (detectError) {
      if (!columnsError)
        setColumnsError(
          (detectError as any)?.response?.data?.message ||
            (detectError as Error)?.message ||
            "Impossible de détecter les colonnes"
        );
    } else if (detectData) {
      if (!detectData.columns || detectData.columns.length === 0) {
        setColumnsError("Aucune colonne détectée.");
      } else {
        let data: Record<string, unknown>[] = detectData.preview || [];
        setDataPreview(data);
        setColumns(mapDetectedColumns(detectData, data));
        const autoTimestamp = autoDetectTimestampField(detectData.columns);
        setTimestampField(autoTimestamp || "");
        setStep(2);
      }
    }
  }

  return {
    form,
    setForm,
    step,
    setStep,
    columns,
    columnsLoading,
    columnsError,
    dataPreview,
    timestampField,
    setTimestampField,
    csvOrigin,
    setCsvOrigin,
    csvFile,
    setCsvFile,
    handleNext,
    showModal,
    setShowModal,
    globalError,
    setGlobalError,
    setFormField,
  };
}
