import { useState, useEffect } from "react";
import { dataSourceSchema } from "@/core/validation/datasource";
import { ZodError } from "zod";
import { useDetectColumnsQuery } from "@/data/repositories/sources";
import {
  mapDetectedColumns,
  autoDetectTimestampField,
  buildDetectParams,
} from "@/core/utils/dataSourceFormUtils";

export interface SourceFormState {
  name: string;
  type: "json" | "csv" | "elasticsearch";
  endpoint: string;
  httpMethod: "GET" | "POST";
  authType: "none" | "bearer" | "apiKey" | "basic";
  authConfig: {
    token?: string;
    apiKey?: string;
    username?: string;
    password?: string;
    headerName?: string;
  };
  timestampField: string;
  esIndex?: string;
  esQuery?: string;
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
    esIndex: initial?.esIndex || "",
    esQuery: initial?.esQuery || "",
    file: initial?.file || null,
  });
  // Ajout : synchronisation du formulaire si initial change
  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name || "",
        type: initial.type || "json",
        endpoint: initial.endpoint || "",
        httpMethod: initial.httpMethod || "GET",
        authType: initial.authType || "none",
        authConfig: initial.authConfig || {},
        timestampField: initial.timestampField || "",
        esIndex: initial.esIndex || "",
        esQuery: initial.esQuery || "",
        file: initial.file || null,
      });
    }
  }, [initial]);
  const [step, setStep] = useState(1);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [detectParams, setDetectParams] = useState<any | null>(null);
  const detectColumnsQueryResult = useDetectColumnsQuery(detectParams, Boolean(detectParams));
  const detectData = detectColumnsQueryResult.data;
  const columnsLoading = detectColumnsQueryResult.isLoading;
  const detectError = detectColumnsQueryResult.error;
  const isFetching = detectColumnsQueryResult.isFetching;

  // Handler pour changer un champ du form
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setFormField = (field: string, value: any) => {
    setForm((f) => {
      const updated = { ...f, [field]: value };
      // Validation Zod à chaque changement de champ
      try {
        dataSourceSchema.parse(updated);
        setFieldErrors({});
      } catch (err) {
        if (err instanceof ZodError) {
          const errors: Record<string, string> = {};
          err.errors.forEach((e) => {
            if (e.path && e.path[0]) errors[e.path[0]] = e.message;
          });
          setFieldErrors(errors);
        }
      }
      return updated;
    });
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
      esIndex: form.esIndex,
      esQuery: form.esQuery,
    });
    setDetectParams(params);
  };

  // Effet pour traiter le résultat de la détection
  useEffect(() => {
    if (detectParams && !columnsLoading && !isFetching) {
      if (detectError) {
        if (!columnsError)
          setColumnsError(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (detectError as any)?.response?.data?.message ||
            (detectError as Error)?.message ||
            "Impossible de détecter les colonnes"
          );
      } else if (detectData) {
        if (!detectData.columns || detectData.columns.length === 0) {
          setColumnsError("Aucune colonne détectée.");
        } else {

          const data: Record<string, unknown>[] = detectData.preview || [];
          setDataPreview(data);
          setColumns(mapDetectedColumns(detectData, data));
          const autoTimestamp = autoDetectTimestampField(detectData.columns);
          setTimestampField(autoTimestamp || "");
          setStep(2);
        }
      }
    }
  }, [detectParams, columnsLoading, isFetching, detectError, detectData, columnsError]);

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
    fieldErrors,
  };
}
