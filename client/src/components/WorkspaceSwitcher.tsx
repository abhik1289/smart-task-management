import { useEffect } from "react";
import {
  CheckIcon,
  ChevronDownIcon,
  FolderKanbanIcon,
  PlusIcon,
  Settings2Icon,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useActiveWorkspaceStore } from "@/store/activeWorkspaceStore";
import { useWorkspaceManagementStore } from "@/store/workspaceManagementStore";

export function WorkspaceSwitcher() {
  const navigate = useNavigate();
  const workspaces = useWorkspaceManagementStore((state) => state.workspaces);
  const isLoading = useWorkspaceManagementStore((state) => state.isLoading);
  const fetchWorkspaces = useWorkspaceManagementStore(
    (state) => state.fetchWorkspaces,
  );
  const openCreateDialog = useWorkspaceManagementStore(
    (state) => state.openCreateDialog,
  );
  const activeWorkspace = useActiveWorkspaceStore(
    (state) => state.activeWorkspace,
  );
  const setActiveWorkspace = useActiveWorkspaceStore(
    (state) => state.setActiveWorkspace,
  );
  const syncActiveWorkspace = useActiveWorkspaceStore(
    (state) => state.syncActiveWorkspace,
  );

  useEffect(() => {
    if (workspaces.length > 0) {
      syncActiveWorkspace(workspaces);
      return;
    }

    async function loadWorkspaces() {
      try {
        await fetchWorkspaces();
      } catch {
        // Route guards handle an unavailable authenticated session.
      }
    }

    void loadWorkspaces();
  }, [fetchWorkspaces, syncActiveWorkspace, workspaces]);

  useEffect(() => {
    if (!isLoading) syncActiveWorkspace(workspaces);
  }, [isLoading, syncActiveWorkspace, workspaces]);

  function selectWorkspace(workspace: (typeof workspaces)[number]) {
    setActiveWorkspace(workspace);
    navigate(`/workspaces/${workspace.id}/tasks`);
  }

  function createWorkspace() {
    openCreateDialog();
    navigate("/workspaces");
  }

  return (
    <div className="px-3 pb-2 group-data-[collapsible=icon]:px-2">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="outline"
              className="h-11 w-full justify-start gap-2 rounded-lg border-[#e5e7eb] bg-[#f8f9fa] px-2.5 text-left text-[#111111] hover:bg-[#f5f5f5] group-data-[collapsible=icon]:size-9! group-data-[collapsible=icon]:justify-center! group-data-[collapsible=icon]:px-0!"
              aria-label="Select workspace"
            />
          }>
          <span className="grid size-7 shrink-0 place-items-center rounded-md bg-white text-[#111111] shadow-sm ring-1 ring-[#e5e7eb]">
            <FolderKanbanIcon className="size-3.5" />
          </span>
          <span className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
            <span className="block truncate text-[12px] font-semibold">
              {activeWorkspace?.name ??
                (isLoading ? "Loading…" : "Select workspace")}
            </span>
            <span className="block truncate text-[10px] font-medium text-[#898989]">
              {activeWorkspace ? "Active workspace" : "Create or select one"}
            </span>
          </span>
          <ChevronDownIcon className="size-4 text-[#6b7280] group-data-[collapsible=icon]:hidden" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" side="bottom" className="w-60">
          <DropdownMenuLabel>Your workspaces</DropdownMenuLabel>
          {workspaces.length === 0 && !isLoading ? (
            <div className="px-2 py-5 text-center text-xs text-[#6b7280]">
              No workspaces yet.
            </div>
          ) : (
            workspaces.map((workspace) => {
              const selected = workspace.id === activeWorkspace?.id;
              return (
                <DropdownMenuItem
                  key={workspace.id}
                  onClick={() => selectWorkspace(workspace)}
                  className="py-2">
                  <span className="grid size-7 place-items-center rounded-md bg-[#f5f5f5] text-[#111111]">
                    <FolderKanbanIcon className="size-3.5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-semibold">
                      {workspace.name}
                    </span>
                    <span className="block truncate text-[11px] text-[#6b7280]">
                      {workspace.description || "No description"}
                    </span>
                  </span>
                  {selected && <CheckIcon className="size-4 text-[#111111]" />}
                </DropdownMenuItem>
              );
            })
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={createWorkspace}>
            <PlusIcon className="size-4" />
            Create workspace
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link to="/workspaces" />}>
            <Settings2Icon className="size-4" />
            Manage workspaces
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
