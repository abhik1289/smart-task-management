import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FolderKanbanIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWorkspaceManagementStore } from "@/store/workspaceManagementStore";

type WorkspaceFormValues = {
  name: string;
  description: string;
};

export function WorkspaceDialog() {
  const dialogOpen = useWorkspaceManagementStore((state) => state.dialogOpen);
  const editingWorkspace = useWorkspaceManagementStore(
    (state) => state.editingWorkspace,
  );
  const isSaving = useWorkspaceManagementStore((state) => state.isSaving);
  const closeDialog = useWorkspaceManagementStore((state) => state.closeDialog);
  const saveWorkspace = useWorkspaceManagementStore(
    (state) => state.saveWorkspace,
  );
  const isEditing = Boolean(editingWorkspace);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WorkspaceFormValues>({
    defaultValues: { name: "", description: "" },
  });

  useEffect(() => {
    if (dialogOpen) {
      reset({
        name: editingWorkspace?.name ?? "",
        description: editingWorkspace?.description ?? "",
      });
    }
  }, [dialogOpen, editingWorkspace, reset]);

  async function onSubmit(values: WorkspaceFormValues) {
    try {
      const workspace = await saveWorkspace({
        name: values.name.trim(),
        description: values.description.trim() || undefined,
      });
      toast.success(isEditing ? "Workspace updated" : "Workspace created", {
        description: `“${workspace.name}” is ready to use.`,
      });
    } catch {
      // The store retains the API error for the page-level message.
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={(open) => !open && closeDialog()}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-120">
        <DialogHeader className="flex-row items-start gap-3 border-b border-[#e5e7eb] px-6 py-4">
          <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#111111] text-white">
            <FolderKanbanIcon className="size-4" />
          </span>
          <div>
            <DialogTitle className="text-[18px] font-semibold tracking-[-0.2px] text-[#111111]">
              {isEditing ? "Edit workspace" : "Create workspace"}
            </DialogTitle>
            <DialogDescription className="mt-0.5 text-[13px] text-[#6b7280]">
              {isEditing
                ? "Update the details your team sees."
                : "Give your team a focused place to manage work."}
            </DialogDescription>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-5 px-6 py-5">
            <div className="space-y-1.5">
              <Label
                htmlFor="workspace-name"
                className="text-[13px] font-semibold text-[#111111]">
                Workspace name <span className="text-[#ef4444]">*</span>
              </Label>
              <Input
                id="workspace-name"
                autoFocus
                placeholder="e.g. Product launch"
                className="h-10 border-[#e5e7eb] bg-white text-[14px]"
                {...register("name", {
                  required: "Workspace name is required.",
                  maxLength: {
                    value: 100,
                    message: "Workspace name must be 100 characters or fewer.",
                  },
                })}
              />
              {errors.name && (
                <p className="text-[12px] font-medium text-[#ef4444]">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="workspace-description"
                className="text-[13px] font-semibold text-[#111111]">
                Description{" "}
                <span className="font-normal text-[#898989]">(optional)</span>
              </Label>
              <textarea
                id="workspace-description"
                rows={4}
                placeholder="What is this workspace for?"
                className="flex w-full resize-none rounded-md border border-[#e5e7eb] bg-white px-3 py-2 text-[14px] text-[#111111] outline-none placeholder:text-[#898989] focus-visible:border-[#111111] focus-visible:ring-2 focus-visible:ring-[#111111]/10"
                {...register("description", {
                  maxLength: {
                    value: 1000,
                    message: "Description must be 1000 characters or fewer.",
                  },
                })}
              />
              {errors.description && (
                <p className="text-[12px] font-medium text-[#ef4444]">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 border-t border-[#e5e7eb] bg-[#f8f9fa] px-6 py-3">
            <Button
              type="button"
              variant="ghost"
              onClick={closeDialog}
              className="h-10 rounded-md px-4 font-semibold text-[#374151] hover:bg-white">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="h-10 rounded-md bg-[#111111] px-5 font-semibold text-white hover:bg-[#242424]">
              {isSaving
                ? "Saving…"
                : isEditing
                  ? "Save changes"
                  : "Create workspace"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
