import api from "./api";
import type { DataSource } from "@/core/types/data-source";
import type { ApiResponse } from "@/core/types/api";
import { extractApiData } from "../../core/utils/api-utils";

export async function getSources(): Promise<DataSource[]> {
  const res = await api.get<ApiResponse<DataSource[]>>("/sources");
  return extractApiData(res);
}

export async function getSourceById(id: string): Promise<DataSource> {
  const res = await api.get<ApiResponse<DataSource>>(`/sources/${id}`);
  return extractApiData(res);
}

export async function createSource(
  data:
    | {
      name: string;
      type: string;
      endpoint?: string;
      filePath?: string;
      config?: Record<string, unknown>;
    }
    | FormData
): Promise<DataSource> {
  if (data instanceof FormData) {
    const res = await api.post<ApiResponse<DataSource>>("/sources", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return extractApiData(res);
  } else {
    const res = await api.post<ApiResponse<DataSource>>("/sources", data);
    return extractApiData(res);
  }
}

export async function updateSource(
  id: string,
  data: {
    name: string;
    type: string;
    endpoint: string;
    config?: Record<string, unknown>;
  }
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

export async function detectColumns(params: {
  type?: string;
  endpoint?: string;
  filePath?: string;
  file?: File;
}): Promise<{
  columns: string[];
  preview?: any[];
  types?: Record<string, string>;
}> {
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
  sourceId: string,
  options?: {
    from?: string;
    to?: string;
    page?: number;
    pageSize?: number;
    fields?: string[] | string;
    forceRefresh?: boolean;
  }
): Promise<any[]> {
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
  const url = `/sources/${sourceId}/data${params.toString() ? `?${params}` : ""
    }`;
  const res = await api.get<ApiResponse<any[]>>(url);
  return extractApiData(res);
}
