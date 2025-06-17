import api from "./api";
import type { Widget } from "@/core/models/Widget";
import type { ApiError, ApiData, ApiResponse } from "@/core/types/api";

function extractApiError(
  err: { message: string } | { errors: Record<string, string> }
): string {
  if ("message" in err) return err.message;
  if ("errors" in err) return Object.values(err.errors).join(", ");
  return "Erreur inconnue";
}

export async function fetchWidgets(): Promise<Widget[]> {
  const response = await api.get<ApiResponse<Widget[]>>("/widgets");
  if ((response.data as ApiError).error) {
    const err = (response.data as ApiError).error;
    throw new Error(extractApiError(err));
  }
  return (response.data as ApiData<Widget[]>).data;
}

export async function fetchWidgetById(id: string): Promise<Widget> {
  const response = await api.get<ApiResponse<Widget>>(`/widgets/${id}`);
  if ((response.data as ApiError).error) {
    const err = (response.data as ApiError).error;
    throw new Error(extractApiError(err));
  }
  return (response.data as ApiData<Widget>).data;
}

export async function createWidget(payload: Partial<Widget>): Promise<Widget> {
  const response = await api.post<ApiResponse<Widget>>("/widgets", payload);
  if ((response.data as ApiError).error) {
    const err = (response.data as ApiError).error;
    throw new Error(extractApiError(err));
  }
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
  if ((response.data as ApiError).error) {
    const err = (response.data as ApiError).error;
    throw new Error(extractApiError(err));
  }
  return (response.data as ApiData<Widget>).data;
}

export async function deleteWidget(id: string): Promise<{ success: boolean }> {
  const response = await api.delete<ApiResponse<{ success: boolean }>>(
    `/widgets/${id}`
  );
  if ((response.data as ApiError).error) {
    const err = (response.data as ApiError).error;
    throw new Error(extractApiError(err));
  }
  return (response.data as ApiData<{ success: boolean }>).data;
}
