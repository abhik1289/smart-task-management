import { useEffect } from "react";
import { useForm, Controller, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CalendarPlus } from "lucide-react";

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

import { MemberMultiSelect } from "@/components/models/MemberMultiSelect";
import { PrioritySelect } from "@/components/models/PrioritySelect";
import { RichTextEditor } from "@/components/models/RichTextEditor";
import { TagInput } from "@/components/models/TagInput";
import {
  createTaskSchema,
  type CreateTaskFormValues,
} from "@/components/models/createTaskSchema";

import { useCreateTaskStore } from "@/store/createTaskStore";

import { cn } from "@/lib/utils";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-[11px] font-medium text-[#ef4444]">{message}</p>;
}

export function CreateTaskDialog() {
  const {
    open,
    title,
    description,
    assigneeIds,
    priority,
    tags,
    dueDate,
    setOpen,
    setTitle,
    setDescription,
    toggleAssignee,
    setPriority,
    addTag,
    removeTag,
    setDueDate,
    reset,
  } = useCreateTaskStore();

  const {
    register,
    handleSubmit,
    control,
    reset: resetForm,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<CreateTaskFormValues>({
    resolver: zodResolver(createTaskSchema) as Resolver<CreateTaskFormValues>,
    defaultValues: {
      title,
      description,
      assigneeIds,
      priority,
      tags,
      dueDate,
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  // Keep RHF in sync with Zustand values (covers controlled widgets
  // like Tiptap, MemberMultiSelect, PrioritySelect, TagInput).
  useEffect(() => {
    setValue("title", title, { shouldValidate: false });
  }, [title, setValue]);
  useEffect(() => {
    setValue("description", description, { shouldValidate: false });
  }, [description, setValue]);
  useEffect(() => {
    setValue("assigneeIds", assigneeIds, { shouldValidate: true });
  }, [assigneeIds, setValue]);
  useEffect(() => {
    setValue("priority", priority, { shouldValidate: false });
  }, [priority, setValue]);
  useEffect(() => {
    setValue("tags", tags, { shouldValidate: false });
  }, [tags, setValue]);
  useEffect(() => {
    setValue("dueDate", dueDate, { shouldValidate: false });
  }, [dueDate, setValue]);

  // Reset Zustand + RHF whenever the dialog closes
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        reset();
        resetForm();
      }, 200);
      return () => clearTimeout(t);
    }
  }, [open, reset, resetForm]);

  async function onSubmit(values: CreateTaskFormValues) {
    console.log("CreateTask payload:", values);
    toast.success("Task created", {
      description: `"${values.title}" has been added to your workspace.`,
    });
    setOpen(false);
  }

  const titleReg = register("title");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        showCloseButton
        className="flex max-h-[90vh] w-[95vw] flex-col gap-0 overflow-hidden p-0 sm:max-w-[520px]">
        <DialogHeader className="flex-row items-start gap-3 border-b border-[#e5e7eb] px-6 py-4">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#111111] text-white">
            <CalendarPlus className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <DialogTitle className="text-[18px] font-semibold tracking-[-0.2px] text-[#111111]">
              Create new task
            </DialogTitle>
            <DialogDescription className="mt-0.5 text-[13px] text-[#6b7280]">
              Fill in the details below. Required fields are marked.
            </DialogDescription>
          </div>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex min-h-0 flex-1 flex-col"
          noValidate>
          <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
            {/* Title */}
            <div className="space-y-1.5">
              <Label
                htmlFor="task-title"
                className="text-[13px] font-semibold text-[#111111]">
                Title <span className="text-[#ef4444]">*</span>
              </Label>
              <Input
                id="task-title"
                placeholder="e.g. Ship onboarding redesign"
                className={cn(
                  "h-10 border-[#e5e7eb] bg-white text-[14px]",
                  errors.title &&
                    "border-[#ef4444] focus-visible:ring-[#ef4444]/30",
                )}
                autoFocus
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  titleReg.onChange(e);
                }}
                aria-invalid={!!errors.title}
              />
              <FieldError message={errors.title?.message} />
            </div>

            {/* Description with Tiptap */}
            <div className="space-y-1.5">
              <Label className="text-[13px] font-semibold text-[#111111]">
                Description
              </Label>
              <Controller
                control={control}
                name="description"
                render={() => (
                  <RichTextEditor
                    value={description}
                    onChange={setDescription}
                    placeholder="Add context, acceptance criteria, links…"
                  />
                )}
              />
              <FieldError message={errors.description?.message} />
            </div>

            {/* Assign to */}
            <div className="space-y-1.5">
              <Label className="text-[13px] font-semibold text-[#111111]">
                Assign to <span className="text-[#ef4444]">*</span>
              </Label>
              <Controller
                control={control}
                name="assigneeIds"
                render={({ field }) => (
                  <MemberMultiSelect
                    selectedIds={field.value ?? []}
                    onToggle={(id) => {
                      const next = (field.value ?? []).includes(id)
                        ? (field.value ?? []).filter((v) => v !== id)
                        : [...(field.value ?? []), id];
                      field.onChange(next);
                      toggleAssignee(id);
                    }}
                  />
                )}
              />
              <FieldError message={errors.assigneeIds?.message} />
            </div>

            {/* Priority + Due date row */}
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[13px] font-semibold text-[#111111]">
                  Priority
                </Label>
                <Controller
                  control={control}
                  name="priority"
                  render={({ field }) => (
                    <PrioritySelect
                      value={field.value}
                      onChange={(p) => {
                        field.onChange(p);
                        setPriority(p);
                      }}
                    />
                  )}
                />
                <FieldError message={errors.priority?.message} />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="task-due"
                  className="text-[13px] font-semibold text-[#111111]">
                  Due date
                </Label>
                <Controller
                  control={control}
                  name="dueDate"
                  render={({ field }) => (
                    <Input
                      id="task-due"
                      type="date"
                      value={field.value ?? ""}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        setDueDate(e.target.value);
                      }}
                      className={cn(
                        "h-10 border-[#e5e7eb] bg-white text-[14px]",
                        errors.dueDate &&
                          "border-[#ef4444] focus-visible:ring-[#ef4444]/30",
                      )}
                      aria-invalid={!!errors.dueDate}
                    />
                  )}
                />
                <FieldError message={errors.dueDate?.message} />
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-1.5">
              <Label className="text-[13px] font-semibold text-[#111111]">
                Tags
              </Label>
              <Controller
                control={control}
                name="tags"
                render={({ field }) => (
                  <TagInput
                    value={field.value ?? []}
                    onAdd={(tag) => {
                      const next = [...(field.value ?? []), tag];
                      field.onChange(next);
                      addTag(tag);
                    }}
                    onRemove={(tag) => {
                      const next = (field.value ?? []).filter((t) => t !== tag);
                      field.onChange(next);
                      removeTag(tag);
                    }}
                    placeholder="Add a tag and press Enter"
                  />
                )}
              />
              <FieldError
                message={errors.tags?.message as string | undefined}
              />
              <p className="text-[11px] text-[#898989]">
                Press Enter or comma to add. Backspace removes the last tag.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 border-t border-[#e5e7eb] bg-[#f8f9fa] px-6 py-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="h-10 rounded-md px-4 text-[14px] font-semibold text-[#374151] hover:bg-white">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-10 rounded-md bg-[#111111] px-5 text-[14px] font-semibold text-white hover:bg-[#242424] disabled:opacity-60">
              Create task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
