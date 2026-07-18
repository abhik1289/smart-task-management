import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
// import { ThemeProvider } from "next-themes";
import "./index.css";
import { queryClient } from "./api/queryClient";
import { router } from "./app/router";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./components/theme-provider";

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>,
);
