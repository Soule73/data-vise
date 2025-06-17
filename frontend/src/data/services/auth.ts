import api from "./api";
import type { ApiError, ApiData, ApiResponse } from "@/core/types/api";
import type { User } from "@/core/types/auth-types";

interface LoginRegisterResponse {
  user: User;
  token: string;
}

export async function login(
  email: string,
  password: string
): Promise<LoginRegisterResponse> {
  const res = await api.post<ApiResponse<LoginRegisterResponse>>(
    "/auth/login",
    {
      email,
      password,
    }
  );
  if ((res.data as ApiError).error) {
    const err = (res.data as ApiError).error;
    throw { response: { data: err } };
  }
  return (res.data as ApiData<LoginRegisterResponse>).data;
}

export async function register(
  username: string,
  email: string,
  password: string
): Promise<LoginRegisterResponse> {
  const res = await api.post<ApiResponse<LoginRegisterResponse>>(
    "/auth/register",
    {
      username,
      email,
      password,
    }
  );
  if ((res.data as ApiError).error) {
    const err = (res.data as ApiError).error;
    throw { response: { data: err } };
  }
  return (res.data as ApiData<LoginRegisterResponse>).data;
}
