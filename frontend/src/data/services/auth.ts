import api from "@services/api";
import { extractApiData } from "@utils/api-utils";
import type { ApiResponse } from "@type/api";
import type { LoginRegisterResponse } from "@type/auth-types";

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
