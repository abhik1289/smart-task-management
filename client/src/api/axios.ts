import axios from "axios";
import {
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  saveAuthTokens,
} from "./authStorage";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const authApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function refreshAccessToken(): Promise<string> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error("Missing refresh token");
  }

  const response = await authApi.post("/auth/refresh-token", {
    refreshToken,
  });

  const authResponse = response.data?.data;
  if (!authResponse?.access_token || !authResponse?.refresh_token) {
    throw new Error("Invalid refresh response");
  }

  saveAuthTokens(authResponse.access_token, authResponse.refresh_token);
  return authResponse.access_token;
}

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

function isPublicAuthRequest(url?: string) {
  return !!url && (
    url.includes("/auth/login") ||
    url.includes("/auth/sign-up") ||
    url.includes("/auth/activate") ||
    url.includes("/auth/refresh-token")
  );
}

api.interceptors.request.use((config) => {
  const accessToken = getAccessToken();
  if (accessToken && config.headers && !isPublicAuthRequest(config.url)) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest?._retry &&
      !isPublicAuthRequest(originalRequest.url)
    ) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        clearAuthTokens();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default api;
