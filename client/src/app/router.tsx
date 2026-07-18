import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import AuthLayout from "../layouts/AuthLayout";
import HomePage from "../pages/HomePage";
import ProfilePage from "../pages/ProfilePage";
import SignInPage from "../pages/auth/SignInPage";
import SignUpPage from "../pages/auth/SignUpPage";
import ActivationPage from "../pages/auth/ActivationPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ChangePasswordPage from "../pages/auth/ChangePasswordPage";
import DashboardLayout from "@/layouts/dashboard-layout";
import MemberPage from "@/pages/MemberPage";
import TaskPage from "@/pages/TaskPage";
import WorkspacePage from "@/pages/WorkspacePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <div>404</div>,
    children: [
      {
        path: "",

        element: <DashboardLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: "profile", element: <ProfilePage /> },
          { path: "members", element: <MemberPage /> },
          { path: "dashboard", element: <ProfilePage /> },
          { path: "task", element: <TaskPage /> },
          { path: "workspaces", element: <WorkspacePage /> },
        ],
      },
      {
        path: "",
        element: <AuthLayout />,
        children: [
          { path: "sign-in", element: <SignInPage /> },
          { path: "sign-up", element: <SignUpPage /> },
          { path: "activate", element: <ActivationPage /> },
          { path: "forgot-password", element: <ForgotPasswordPage /> },
          { path: "change-password", element: <ChangePasswordPage /> },
        ],
      },
    ],
  },
]);
