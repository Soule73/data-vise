import type { ApiError, ApiData, ApiResponse } from "@type/api";

export function extractApiError(
  err: { message: string } | { errors: Record<string, string> }
): string {
  if ("message" in err) return err.message;
  if ("errors" in err) return Object.values(err.errors).join(", ");
  return "Erreur inconnue";
}

export function extractApiData<T>(res: { data: ApiResponse<T> }): T {
  if ((res.data as ApiError).error) {
    const err = (res.data as ApiError).error;
    throw new Error(extractApiError(err));
  }
  return (res.data as ApiData<T>).data;
}
