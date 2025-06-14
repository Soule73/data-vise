import api from "./api";

export async function getSources() {
  const res = await api.get("/sources");
  return res.data;
}

export async function createSource(data: {
  name: string;
  type: string;
  endpoint: string;
  config?: any;
}) {
  const res = await api.post("/sources", data);
  return res.data;
}

export async function updateSource(
  id: string,
  data: { name: string; type: string; endpoint: string; config?: any }
) {
  const res = await api.put(`/sources/${id}`, data);
  return res.data;
}

export async function deleteSource(id: string) {
  const res = await api.delete(`/sources/${id}`);
  return res.data;
}

export async function detectColumns(endpoint: string) {
  const res = await api.post("/sources/detect-columns", { endpoint });
  return res.data;
}

// Récupérer les données brutes d'une source via son endpoint
export async function fetchSourceData(endpoint: string): Promise<any[]> {
  const res = await fetch(endpoint);
  const data = await res.json();
  return Array.isArray(data) ? data : [data];
}
