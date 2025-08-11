import api from "@services/api";
import { extractApiData } from "@utils/apiUtils";
import type { ApiResponse } from "@type/api";
import type { LoginRegisterResponse } from "@type/authTypes";

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
