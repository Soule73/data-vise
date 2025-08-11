import api from "@services/api";
import { extractApiData } from "@utils/apiUtils";
import type { ApiResponse } from "@type/api";
import type { User, Role } from "@type/authTypes";

export async function fetchUsers(): Promise<User[]> {
  const res = await api.get<ApiResponse<User[]>>("/auth/users");
  return extractApiData(res);
}

export async function createRole(payload: Omit<Role, '_id' | 'canDelete'>): Promise<Role> {
  const res = await api.post<ApiResponse<Role>>("/auth/roles", payload);
  return extractApiData(res);
}

export async function createUser(payload: Omit<User, '_id'> & { password: string; roleId: string }): Promise<User> {
  const res = await api.post<ApiResponse<{ user: User }>>("/auth/users", payload);
  return extractApiData<{ user: User }>(res).user;
}

export async function updateUser(id: string, payload: Partial<User> & { password?: string; roleId?: string }): Promise<User> {
  const res = await api.put<ApiResponse<{ user: User }>>(`/auth/users/${id}`, payload);
  return extractApiData<{ user: User }>(res).user;
}

export async function deleteUser(id: string): Promise<{ message: string }> {
  const res = await api.delete<ApiResponse<{ message: string }>>(`/auth/users/${id}`);
  return extractApiData(res);
}
