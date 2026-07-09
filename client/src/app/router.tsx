import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import AuthLayout from "../layouts/AuthLayout";
import HomePage from "../pages/HomePage";
import SignInPage from "../pages/auth/SignInPage";
import SignUpPage from "../pages/auth/SignUpPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ChangePasswordPage from "../pages/auth/ChangePasswordPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <div>404</div>,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "",
        element: <AuthLayout />,
        children: [
          { path: "sign-in", element: <SignInPage /> },
          { path: "sign-up", element: <SignUpPage /> },
          { path: "forgot-password", element: <ForgotPasswordPage /> },
          { path: "change-password", element: <ChangePasswordPage /> },
        ],
      },
    ],
  },
]);
