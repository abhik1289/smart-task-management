const ACCESS_TOKEN_KEY = "auth_access_token";
const REFRESH_TOKEN_KEY = "auth_refresh_token";
const ACTIVATION_EMAIL_KEY = "auth_activation_email";

export function getAccessToken(): string | null {
  return typeof window === "undefined"
    ? null
    : localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return typeof window === "undefined"
    ? null
    : localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function saveAuthTokens(accessToken: string, refreshToken: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function clearAuthTokens() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function saveActivationEmail(email: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACTIVATION_EMAIL_KEY, email);
}

export function getActivationEmail(): string | null {
  return typeof window === "undefined"
    ? null
    : localStorage.getItem(ACTIVATION_EMAIL_KEY);
}

export function clearActivationEmail() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACTIVATION_EMAIL_KEY);
}
