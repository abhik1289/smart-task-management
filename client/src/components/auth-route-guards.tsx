import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getAccessToken } from "@/api/authStorage";

function isAuthenticated() {
  return Boolean(getAccessToken());
}

export function RequireAuth() {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/sign-in" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export function RedirectAuthenticatedUser() {
  if (isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
