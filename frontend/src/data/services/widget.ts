import api from "./api";
import type { Widget } from "@/core/models/Widget";

interface ApiError {
  error: { message: string };
  status?: number;
}

interface ApiData<T> {
  data: T;
}

type ApiResponse<T> = ApiData<T> | ApiError;

export async function fetchWidgets(): Promise<Widget[]> {
  const response = await api.get<ApiResponse<Widget[]>>("/widgets");
  if ((response.data as ApiError).error)
    throw new Error((response.data as ApiError).error.message);
  return (response.data as ApiData<Widget[]>).data;
}

export async function fetchWidgetById(id: string): Promise<Widget> {
  const response = await api.get<ApiResponse<Widget>>(`/widgets/${id}`);
  if ((response.data as ApiError).error)
    throw new Error((response.data as ApiError).error.message);
  return (response.data as ApiData<Widget>).data;
}

export async function createWidget(payload: Partial<Widget>): Promise<Widget> {
  const response = await api.post<ApiResponse<Widget>>("/widgets", payload);
  if ((response.data as ApiError).error)
    throw new Error((response.data as ApiError).error.message);
  return (response.data as ApiData<Widget>).data;
}

export async function updateWidget(
  id: string,
  payload: Partial<Widget>
): Promise<Widget> {
  const response = await api.put<ApiResponse<Widget>>(
    `/widgets/${id}`,
    payload
  );
  if ((response.data as ApiError).error)
    throw new Error((response.data as ApiError).error.message);
  return (response.data as ApiData<Widget>).data;
}

export async function deleteWidget(id: string): Promise<{ success: boolean }> {
  const response = await api.delete<ApiResponse<{ success: boolean }>>(
    `/widgets/${id}`
  );
  if ((response.data as ApiError).error)
    throw new Error((response.data as ApiError).error.message);
  return (response.data as ApiData<{ success: boolean }>).data;
}
