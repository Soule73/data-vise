import type { ApiError, ApiData, ApiResponse } from "@type/api";

export function extractApiError(
  err: ApiError
): string {
  if (err.message) return err.message;

  if (err.errors) return Object.values(err.errors).join(", ");


  return "Erreur inconnue";
}

export function extractApiData<T>(res: { data: ApiResponse<T> }): T {
  if ((res.data as ApiError).message || (res.data as ApiError).errors) {
    throw new Error(extractApiError(res.data as ApiError));
  }
  return (res.data as ApiData<T>).data;
}
