import api from "./api";
import type { DataSource } from "@/core/types/data-source";
import type { ApiError, ApiData, ApiResponse } from "@/core/types/api";

export async function getSources(): Promise<DataSource[]> {
  const res = await api.get<ApiResponse<DataSource[]>>("/sources");
  if ((res.data as ApiError).error)
    throw new Error((res.data as ApiError).error.message);
  return (res.data as ApiData<DataSource[]>).data;
}

export async function getSourceById(id: string): Promise<DataSource> {
  const res = await api.get<ApiResponse<DataSource>>(`/sources/${id}`);
  if ((res.data as ApiError).error)
    throw new Error((res.data as ApiError).error.message);
  return (res.data as ApiData<DataSource>).data;
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
    if ((res.data as ApiError).error)
      throw new Error((res.data as ApiError).error.message);
    return (res.data as ApiData<DataSource>).data;
  } else {
    const res = await api.post<ApiResponse<DataSource>>("/sources", data);
    if ((res.data as ApiError).error)
      throw new Error((res.data as ApiError).error.message);
    return (res.data as ApiData<DataSource>).data;
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
  if ((res.data as ApiError).error)
    throw new Error((res.data as ApiError).error.message);
  return (res.data as ApiData<DataSource>).data;
}

export async function deleteSource(id: string): Promise<{ message: string }> {
  const res = await api.delete<ApiResponse<{ message: string }>>(
    `/sources/${id}`
  );
  if ((res.data as ApiError).error)
    throw new Error((res.data as ApiError).error.message);
  return (res.data as ApiData<{ message: string }>).data;
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
    if ((res.data as ApiError).error)
      throw new Error((res.data as ApiError).error.message);
    return (
      res.data as ApiData<{
        columns: string[];
        preview?: any[];
        types?: Record<string, string>;
      }>
    ).data;
  } else {
    const res = await api.post<
      ApiResponse<{
        columns: string[];
        preview?: any[];
        types?: Record<string, string>;
      }>
    >("/sources/detect-columns", params);
    if ((res.data as ApiError).error)
      throw new Error((res.data as ApiError).error.message);
    return (
      res.data as ApiData<{
        columns: string[];
        preview?: any[];
        types?: Record<string, string>;
      }>
    ).data;
  }
}

export async function fetchSourceData(
  sourceId: string,
  options?: { from?: string; to?: string }
): Promise<any[]> {
  const params = new URLSearchParams();
  if (options?.from) params.append("from", options.from);
  if (options?.to) params.append("to", options.to);
  const url = `/sources/${sourceId}/data${
    params.toString() ? `?${params}` : ""
  }`;
  const res = await api.get<ApiResponse<any[]>>(url);
  if ((res.data as ApiError).error)
    throw new Error((res.data as ApiError).error.message);
  return (res.data as ApiData<any[]>).data;
}
