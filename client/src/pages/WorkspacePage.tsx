import { useEffect } from "react";
import {
  CalendarDaysIcon,
  FolderKanbanIcon,
  MoreHorizontalIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
  UsersRoundIcon,
} from "lucide-react";
import { toast } from "sonner";

import { WorkspaceDialog } from "@/components/models/WorkspaceDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useActiveWorkspaceStore } from "@/store/activeWorkspaceStore";
import { useWorkspaceManagementStore } from "@/store/workspaceManagementStore";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function WorkspacePage() {
  const workspaces = useWorkspaceManagementStore((state) => state.workspaces);
  const isLoading = useWorkspaceManagementStore((state) => state.isLoading);
  const isSaving = useWorkspaceManagementStore((state) => state.isSaving);
  const error = useWorkspaceManagementStore((state) => state.error);
  const deletingWorkspace = useWorkspaceManagementStore(
    (state) => state.deletingWorkspace,
  );
  const fetchWorkspaces = useWorkspaceManagementStore(
    (state) => state.fetchWorkspaces,
  );
  const openCreateDialog = useWorkspaceManagementStore(
    (state) => state.openCreateDialog,
  );
  const openEditDialog = useWorkspaceManagementStore(
    (state) => state.openEditDialog,
  );
  const requestDelete = useWorkspaceManagementStore(
    (state) => state.requestDelete,
  );
  const cancelDelete = useWorkspaceManagementStore(
    (state) => state.cancelDelete,
  );
  const deleteSelectedWorkspace = useWorkspaceManagementStore(
    (state) => state.deleteSelectedWorkspace,
  );
  const syncActiveWorkspace = useActiveWorkspaceStore(
    (state) => state.syncActiveWorkspace,
  );

  useEffect(() => {
    void fetchWorkspaces();
  }, [fetchWorkspaces]);

  useEffect(() => {
    if (!isLoading) syncActiveWorkspace(workspaces);
  }, [isLoading, syncActiveWorkspace, workspaces]);

  async function confirmDelete() {
    if (!deletingWorkspace) return;

    try {
      const name = deletingWorkspace.name;
      await deleteSelectedWorkspace();
      toast.success("Workspace deleted", {
        description: `“${name}” and its tasks have been removed.`,
      });
    } catch {
      toast.error("Could not delete workspace", {
        description: "Please try again.",
      });
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#898989]">
            Team spaces
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-[-0.6px] text-[#111111]">
            Workspaces
          </h1>
          <p className="mt-1 text-sm text-[#6b7280]">
            Organize tasks and collaboration around the work that matters.
          </p>
        </div>
        <Button
          onClick={openCreateDialog}
          className="h-10 rounded-md bg-[#111111] px-4 font-semibold text-white hover:bg-[#242424]">
          <PlusIcon className="size-4" />
          Create workspace
        </Button>
      </section>

      {error && (
        <div className="rounded-lg border border-[#ef4444]/25 bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">
          {error}
        </div>
      )}

      <Card className="overflow-hidden border-[#e5e7eb] bg-white shadow-none">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-3 p-6">
              {[0, 1, 2].map((item) => (
                <div
                  key={item}
                  className="h-14 animate-pulse rounded-lg bg-[#f5f5f5]"
                />
              ))}
            </div>
          ) : workspaces.length === 0 ? (
            <div className="flex flex-col items-center px-6 py-16 text-center">
              <span className="grid size-12 place-items-center rounded-xl bg-[#f5f5f5] text-[#374151]">
                <FolderKanbanIcon className="size-5" />
              </span>
              <h2 className="mt-4 text-base font-semibold text-[#111111]">
                Create your first workspace
              </h2>
              <p className="mt-1 max-w-sm text-sm text-[#6b7280]">
                Set up a dedicated space for a project, team, or area of work.
              </p>
              <Button
                variant="outline"
                onClick={openCreateDialog}
                className="mt-5 h-10 rounded-md border-[#e5e7eb] px-4 font-semibold text-[#111111] hover:bg-[#f8f9fa]">
                <PlusIcon className="size-4" />
                Create workspace
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-[#e5e7eb] bg-[#f8f9fa] hover:bg-[#f8f9fa]">
                  <TableHead className="h-11 px-5 text-[12px] font-semibold uppercase tracking-wide text-[#6b7280]">
                    Workspace
                  </TableHead>
                  <TableHead className="hidden h-11 text-[12px] font-semibold uppercase tracking-wide text-[#6b7280] md:table-cell">
                    Join code
                  </TableHead>
                  <TableHead className="hidden h-11 text-[12px] font-semibold uppercase tracking-wide text-[#6b7280] sm:table-cell">
                    Updated
                  </TableHead>
                  <TableHead className="h-11 px-5 text-right text-[12px] font-semibold uppercase tracking-wide text-[#6b7280]">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workspaces.map((workspace) => (
                  <TableRow
                    key={workspace.id}
                    className="border-[#f3f4f6] hover:bg-[#f8f9fa]">
                    <TableCell className="px-5 py-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#f5f5f5] text-[#111111]">
                          <FolderKanbanIcon className="size-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-[#111111]">
                            {workspace.name}
                          </p>
                          <p className="mt-0.5 max-w-md truncate text-[12px] text-[#6b7280]">
                            {workspace.description ||
                              "No description provided."}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden py-4 md:table-cell">
                      {workspace.joinCode ? (
                        <Badge
                          variant="outline"
                          className="rounded-md border-[#e5e7eb] bg-[#f8f9fa] px-2 py-0.5 font-mono text-[11px] font-medium text-[#374151]">
                          {workspace.joinCode}
                        </Badge>
                      ) : (
                        <span className="text-sm text-[#898989]">—</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden py-4 text-sm text-[#6b7280] sm:table-cell">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDaysIcon className="size-3.5" />
                        {formatDate(
                          workspace.updateDate || workspace.creationDate,
                        )}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label={`Actions for ${workspace.name}`}
                              className="size-8 rounded-md text-[#6b7280] hover:bg-[#f5f5f5] hover:text-[#111111]"
                            />
                          }>
                          <MoreHorizontalIcon className="size-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem
                            onClick={() => openEditDialog(workspace)}>
                            <PencilIcon className="size-4" />
                            Edit workspace
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => requestDelete(workspace)}>
                            <Trash2Icon className="size-4" />
                            Delete workspace
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center gap-2 text-xs text-[#898989]">
        <UsersRoundIcon className="size-3.5" />
        Workspace owners can edit details, invite members, and delete their
        workspaces.
      </div>

      {deletingWorkspace && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/35 p-4">
          <Card className="w-full max-w-sm border-[#e5e7eb] bg-white shadow-xl">
            <CardContent className="p-6">
              <h2 className="text-base font-semibold text-[#111111]">
                Delete workspace?
              </h2>
              <p className="mt-2 text-sm text-[#6b7280]">
                This permanently deletes “{deletingWorkspace.name}” and its
                tasks. This action cannot be undone.
              </p>
              <div className="mt-6 flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={cancelDelete}
                  className="h-9 rounded-md border-[#e5e7eb]">
                  Cancel
                </Button>
                <Button
                  onClick={confirmDelete}
                  disabled={isSaving}
                  className="h-9 rounded-md bg-[#ef4444] text-white hover:bg-[#dc2626]">
                  {isSaving ? "Deleting…" : "Delete workspace"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <WorkspaceDialog />
    </div>
  );
}
