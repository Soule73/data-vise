import api from "./api";

export async function fetchUsers() {
  return (await api.get("/auth/users")).data;
}

export async function createRole(payload: any) {
  return (await api.post("/auth/roles", payload)).data;
}
export async function createUser(payload: any) {
  return (await api.post("/auth/users", payload)).data;
}

export async function updateUser(id: string, payload: any) {
  return (await api.put(`/auth/users/${id}`, payload)).data;
}

export async function deleteUser(id: string) {
  return (await api.delete(`/auth/users/${id}`)).data;
}
