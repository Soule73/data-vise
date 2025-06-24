import api from "./api";
import { extractApiData } from "../../core/utils/api-utils";
import type { ApiResponse } from "@/core/types/api";
import type { LoginRegisterResponse } from "@/core/types/auth-types";

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
  return extractApiData(res);
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
  return extractApiData(res);
}
