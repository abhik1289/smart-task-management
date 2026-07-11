import api from "./axios";
import {
  clearActivationEmail,
  clearAuthTokens,
  getActivationEmail,
  saveActivationEmail,
  saveAuthTokens,
} from "./authStorage";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignUpPayload {
  fullName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const response = await api.post("/auth/login", payload);
  const result = response.data?.data as AuthResponse;
  saveAuthTokens(result.access_token, result.refresh_token);
  return result;
}

export async function signUp(payload: SignUpPayload) {
  await api.post("/auth/sign-up", {
    name: payload.fullName,
    email: payload.email,
    password: payload.password,
  });
  saveActivationEmail(payload.email.trim().toLowerCase());
}

export async function activateAccount(otp: string): Promise<void> {
  const email = getActivationEmail();
  if (!email) {
    throw new Error("Activation email not found. Please sign up again.");
  }

  await api.post(`/auth/activate/${encodeURIComponent(email)}`, {
    otp,
  });
  clearActivationEmail();
}

export async function logout(): Promise<void> {
  const refreshToken = localStorage.getItem("auth_refresh_token");
  if (refreshToken) {
    await api.post("/auth/logout", { refreshToken });
  }
  clearAuthTokens();
}
