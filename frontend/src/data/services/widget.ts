import api from "./api";
import { extractApiData } from "../../core/utils/api-utils";
import type { Widget } from "@/core/types/widget-types";
import type { ApiResponse } from "@/core/types/api";

// Les fonctions extractApiError et extractApiData seront déplacées dans un utilitaire commun.

export async function fetchWidgets(): Promise<Widget[]> {
  const response = await api.get<ApiResponse<Widget[]>>("/widgets");
  return extractApiData(response);
}

export async function fetchWidgetById(id: string): Promise<Widget> {
  const response = await api.get<ApiResponse<Widget>>(`/widgets/${id}`);
  return extractApiData(response);
}

export async function createWidget(payload: Partial<Widget>): Promise<Widget> {
  const response = await api.post<ApiResponse<Widget>>("/widgets", payload);
  return extractApiData(response);
}

export async function updateWidget(
  id: string,
  payload: Partial<Widget>
): Promise<Widget> {
  const response = await api.put<ApiResponse<Widget>>(
    `/widgets/${id}`,
    payload
  );
  return extractApiData(response);
}

export async function deleteWidget(id: string): Promise<{ success: boolean }> {
  const response = await api.delete<ApiResponse<{ success: boolean }>>(
    `/widgets/${id}`
  );
  return extractApiData(response);
}
