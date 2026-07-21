import * as React from "react";
import { Link } from "react-router-dom";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { WorkspaceSwitcher } from "@/components/WorkspaceSwitcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  CheckSquare2Icon,
  FolderKanbanIcon,
  LayoutDashboardIcon,
  UsersRoundIcon,
} from "lucide-react";

const data = {
  user: {
    name: "Your workspace",
    email: "Manage work with focus",
    avatar: "",
  },
  navMain: [
    {
      title: "Overview",
      url: "/",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "My tasks",
      url: "/task",
      icon: <CheckSquare2Icon />,
      badge: "12",
    },
    {
      title: "Workspaces",
      url: "/workspaces",
      icon: <FolderKanbanIcon />,
    },
    {
      title: "Members",
      url: "/members",
      icon: <UsersRoundIcon />,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-[#e5e7eb] bg-white shadow-[8px_0_30px_rgba(17,17,17,0.025)] dark:border-zinc-800 dark:bg-zinc-950"
      {...props}>
      <SidebarHeader className="px-3 pt-4 group-data-[collapsible=icon]:px-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Smart Task"
              render={<Link to="/" />}
              className="h-11 rounded-lg px-2.5 hover:bg-transparent hover:text-inherit group-data-[collapsible=icon]:size-9! group-data-[collapsible=icon]:p-2!">
              <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-[#111111] text-white shadow-[0_5px_12px_rgba(17,17,17,0.16)]">
                <CheckSquare2Icon className="size-4" strokeWidth={2.8} />
              </span>
              <span className="flex min-w-0 flex-col leading-tight">
                <span className="text-sm font-bold tracking-tight text-[#111111] dark:text-zinc-100">
                  Smart Task
                </span>
                <span className="text-[0.65rem] font-medium text-[#898989]">
                  Work, simplified
                </span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <WorkspaceSwitcher />
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter className="border-t border-[#f3f4f6] p-3 dark:border-zinc-800 group-data-[collapsible=icon]:p-2">
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
