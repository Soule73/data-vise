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

export async function createSource(data: {
  name: string;
  type: string;
  endpoint: string;
  config?: Record<string, unknown>;
}): Promise<DataSource> {
  const res = await api.post<ApiResponse<DataSource>>("/sources", data);
  if ((res.data as ApiError).error)
    throw new Error((res.data as ApiError).error.message);
  return (res.data as ApiData<DataSource>).data;
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

export async function detectColumns(
  endpoint: string
): Promise<{ columns: string[] }> {
  const res = await api.post<ApiResponse<{ columns: string[] }>>(
    "/sources/detect-columns",
    { endpoint }
  );
  if ((res.data as ApiError).error)
    throw new Error((res.data as ApiError).error.message);
  return (res.data as ApiData<{ columns: string[] }>).data;
}

// Récupérer les données brutes d'une source via son endpoint
export async function fetchSourceData(endpoint: string): Promise<any[]> {
  const res = await fetch(endpoint);
  const data = await res.json();
  return Array.isArray(data) ? data : [data];
}
