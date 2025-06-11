import api from './api';

export async function fetchRoles() {
  return (await api.get('/auth/roles')).data;
}

export async function updateRole(id: string, payload: any) {
  return (await api.put(`/auth/roles/${id}`, payload)).data;
}

export async function deleteRole(id: string) {
  return (await api.delete(`/auth/roles/${id}`)).data;
}

export async function createRole(payload: any) {
  return (await api.post('/auth/roles', payload)).data;
}
