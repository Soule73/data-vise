import { ROUTES } from "@constants/routes";
import { useUserStore } from "@store/user";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      const url = api.getUri();
      console.error(
        "Session expirée ou invalide, redirection vers la page de connexion.",
        url
      );
      // Déconnexion automatique si session expirée ou invalide
      useUserStore.getState().logout();
      window.location.replace(ROUTES.login);
    }
    return Promise.reject(error);
  }
);

export default api;
