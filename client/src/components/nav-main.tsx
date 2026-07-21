import { Link, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { CirclePlusIcon } from "lucide-react";
import { useActiveWorkspaceStore } from "@/store/activeWorkspaceStore";

export type NavigationItem = {
  title: string;
  url: string;
  icon: ReactNode;
  badge?: string;
};

export function NavMain({ items }: { items: NavigationItem[] }) {
  const location = useLocation();
  const activeWorkspace = useActiveWorkspaceStore(
    (state) => state.activeWorkspace,
  );
  const workspacePath = activeWorkspace
    ? `/workspaces/${activeWorkspace.id}`
    : "/workspaces";

  return (
    <SidebarGroup className="px-3 py-3 group-data-[collapsible=icon]:px-2">
      <SidebarGroupContent className="flex flex-col gap-5">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={
                activeWorkspace ? "Create task" : "Select a workspace first"
              }
              disabled={!activeWorkspace}
              render={<Link to={`${workspacePath}/tasks`} />}
              className="h-10 rounded-lg bg-[#111111] px-3 font-semibold text-white shadow-[0_6px_14px_rgba(17,17,17,0.14)] hover:bg-[#242424] hover:text-white active:bg-[#242424] data-active:bg-[#242424] data-active:text-white disabled:bg-[#d1d5db] group-data-[collapsible=icon]:size-9! group-data-[collapsible=icon]:p-2!">
              <CirclePlusIcon className="size-4.5 text-white" />
              <span className="text-white">New task</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <div>
          <SidebarGroupLabel className="px-2 text-[0.65rem] font-bold tracking-[0.14em] text-[#898989] group-data-[collapsible=icon]:sr-only">
            Workspace
          </SidebarGroupLabel>
          <SidebarMenu className="mt-1 gap-1">
            {items.map((item) => {
              const requiresWorkspace =
                item.title === "My tasks" || item.title === "Members";
              const url =
                item.title === "My tasks"
                  ? `${workspacePath}/tasks`
                  : item.title === "Members"
                    ? `${workspacePath}/members`
                    : item.url;
              const isActive =
                item.url === "/"
                  ? location.pathname === "/"
                  : location.pathname === url ||
                    location.pathname.startsWith(`${url}/`);

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={
                      requiresWorkspace && !activeWorkspace
                        ? "Select a workspace first"
                        : item.title
                    }
                    isActive={isActive}
                    disabled={requiresWorkspace && !activeWorkspace}
                    render={<Link to={url} />}
                    className="h-10 rounded-lg px-3 text-[#6b7280] hover:bg-[#f8f9fa] hover:text-[#111111] data-active:bg-[#f5f5f5] data-active:font-semibold data-active:text-[#111111] disabled:cursor-not-allowed disabled:opacity-45 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100 dark:data-active:bg-zinc-800 dark:data-active:text-zinc-50 group-data-[collapsible=icon]:size-9! group-data-[collapsible=icon]:p-2!">
                    {item.icon}
                    <span>{item.title}</span>
                    {item.badge && (
                      <span className="ml-auto rounded-full bg-[#f5f5f5] px-1.5 py-0.5 text-[0.65rem] font-bold leading-none text-[#374151] dark:bg-zinc-800 dark:text-zinc-200">
                        {item.badge}
                      </span>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </div>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
