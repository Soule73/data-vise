export interface ApiError {
  error: { message: string } | { errors: Record<string, string> };
  status?: number;
}

export interface ApiData<T> {
  data: T;
}

export type ApiResponse<T> = ApiData<T> | ApiError;
