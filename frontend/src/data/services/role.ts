import api from '@services/api';
import { extractApiData } from "@utils/apiUtils";
import type { ApiResponse } from "@type/api";
import type { Role, Permission } from "@type/authTypes";

export async function fetchRoles(): Promise<Role[]> {
  const res = await api.get<ApiResponse<Role[]>>('/auth/roles');
  return extractApiData(res);
}

export async function updateRole(id: string, payload: Partial<Role>): Promise<Role> {
  const res = await api.put<ApiResponse<Role>>(`/auth/roles/${id}`, payload);
  return extractApiData(res);
}

export async function deleteRole(id: string): Promise<{ message: string }> {
  const res = await api.delete<ApiResponse<{ message: string }>>(`/auth/roles/${id}`);
  return extractApiData(res);
}

export async function createRole(payload: Omit<Role, '_id' | 'canDelete'>): Promise<Role> {
  const res = await api.post<ApiResponse<Role>>('/auth/roles', payload);
  return extractApiData(res);
}

export async function fetchPermissions(): Promise<Permission[]> {
  const res = await api.get<ApiResponse<Permission[]>>('/auth/permissions');
  return extractApiData(res);
}

