function isPublicAuthRequest(url?: string) {
  return (
    !!url &&
    (url.includes("/auth/login") ||
      url.includes("/auth/sign-up") ||
      url.includes("/auth/activate") ||
      url.includes("/auth/refresh-token"))
  );
}

import axios from "axios";
import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  clearAuthTokens,
  getRefreshToken,
  saveAuthTokens,
} from "./authStorage";

const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (accessToken && !isPublicAuthRequest(config.url)) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const refreshToken = getRefreshToken();

    if (
      error.response?.status === 401 &&
      original &&
      !original._retry &&
      !isPublicAuthRequest(original.url) &&
      refreshToken
    ) {
      try {
        original._retry = true;
        const response = await api.post("/auth/refresh-token", {
          refreshToken,
        });
        const tokens = response.data.data as {
          access_token: string;
          refresh_token: string;
        };

        saveAuthTokens(tokens.access_token, tokens.refresh_token);
        original.headers.Authorization = `Bearer ${tokens.access_token}`;
        return api(original);
      } catch (refreshError) {
        clearAuthTokens();
        window.location.assign("/sign-in");
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status === 401 && !isPublicAuthRequest(original?.url)) {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    }

    return Promise.reject(error);
  },
);

export default api;
