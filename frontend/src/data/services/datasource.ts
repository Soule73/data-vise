/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@services/api";
import type { CreateSourcePayload, DataSource, DetectParams, FetchSourceDataOptions, SourceFormState } from "@type/dataSource";
import type { ApiError, ApiResponse } from "@type/api";
import { extractApiData } from "@utils/apiUtils";

export async function getSources(): Promise<DataSource[]> {
  const res = await api.get<ApiResponse<DataSource[]>>("/sources");
  return extractApiData(res);
}

export async function getSourceById(id: string): Promise<DataSource> {
  const res = await api.get<ApiResponse<DataSource>>(`/sources/${id}`);
  return extractApiData(res);
}


export async function createSource(
  data: CreateSourcePayload
): Promise<DataSource> {
  // Si un fichier est présent, on utilise FormData
  if (typeof data === "object" && "file" in data && data.file instanceof File) {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("type", data.type);
    if (data.endpoint) formData.append("endpoint", data.endpoint);
    if (data.httpMethod) formData.append("httpMethod", data.httpMethod);
    if (data.authType) formData.append("authType", data.authType);
    if (data.authConfig) formData.append("authConfig", JSON.stringify(data.authConfig));
    if (data.timestampField) formData.append("timestampField", data.timestampField);
    if (data.esIndex) formData.append("esIndex", data.esIndex);
    if (data.esQuery) formData.append("esQuery", JSON.stringify(data.esQuery));
    formData.append("file", data.file);
    const res = await api.post<ApiResponse<DataSource>>("/sources", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return extractApiData(res);
  } else {
    // On nettoie le payload pour n'envoyer que les champs nécessaires
    const payload: CreateSourcePayload = {
      name: data.name,
      type: data.type,
      visibility: data.visibility || "private",
    };
    if (data.endpoint) payload.endpoint = data.endpoint;
    if (data.httpMethod) payload.httpMethod = data.httpMethod;
    if (data.authType) payload.authType = data.authType;
    if (data.authConfig) payload.authConfig = data.authConfig;
    if (data.timestampField) payload.timestampField = data.timestampField;
    if (data.esIndex) payload.esIndex = data.esIndex;
    if (data.esQuery) payload.esQuery = data.esQuery;
    // if (data.filePath) payload.filePath = data.filePath;
    if (data.config) payload.config = data.config;
    const res = await api.post<ApiResponse<DataSource>>("/sources", payload);
    return extractApiData(res);
  }
}

export async function updateSource(
  id: string,
  data: SourceFormState
): Promise<DataSource> {
  const res = await api.put<ApiResponse<DataSource>>(`/sources/${id}`, data);
  return extractApiData(res);
}

export async function deleteSource(id: string): Promise<{ message: string }> {
  const res = await api.delete<ApiResponse<{ message: string }>>(
    `/sources/${id}`
  );
  return extractApiData(res);
}

export async function detectColumns(params: DetectParams | null): Promise<{
  columns: string[];
  preview?: any[];
  types?: Record<string, string>;
}> {
  if (!params) {
    throw new Error("No parameters provided for column detection");
  }
  if (params.file) {
    const formData = new FormData();
    if (params.type) formData.append("type", params.type);
    formData.append("file", params.file);
    const res = await api.post<
      ApiResponse<{
        columns: string[];
        preview?: any[];
        types?: Record<string, string>;
      }>
    >("/sources/detect-columns", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return extractApiData(res);
  } else {
    const res = await api.post<
      ApiResponse<{
        columns: string[];
        preview?: any[];
        types?: Record<string, string>;
      }>
    >("/sources/detect-columns", params);
    return extractApiData(res);
  }
}


export async function fetchSourceData(
  {
    sourceId,
    options
  }: {
    sourceId: string;
    options?: FetchSourceDataOptions;
  }
): Promise<Record<string, any> | ApiError> {

  const params = new URLSearchParams();

  if (options?.from) params.append("from", options.from);

  if (options?.to) params.append("to", options.to);

  params.append("page", String(options?.page ?? 1));

  params.append("pageSize", String(options?.pageSize ?? 5000));

  if (options?.fields) {
    const fieldsStr = Array.isArray(options.fields)
      ? options.fields.join(",")
      : options.fields;
    params.append("fields", fieldsStr);
  }

  if (options?.forceRefresh) {
    params.append("forceRefresh", "1");
  }

  if (options?.shareId) params.append("shareId", options.shareId);

  const url = `/sources/${sourceId}/data${params.toString() ? `?${params}` : ""
    }`;

  const res = await api.get<ApiResponse<Record<string, any>>>(url);

  const apiData = extractApiData(res);

  // Si la réponse contient { data, total }, on retourne data et total
  if (Array.isArray(apiData)) {
    return apiData;
  } else if (apiData && Array.isArray(apiData.data)) {
    // Cas { data: [...], total }
    return Object.assign(apiData.data, { total: apiData.total });
  } else {
    // Cas inattendu, retourne vide
    return [];
  }
}

export async function fetchUploadedFile(filename: string): Promise<Blob> {
  const res = await api.get(`/uploads/${filename}`, {
    responseType: "blob",
  });
  return res.data as Blob;
}
