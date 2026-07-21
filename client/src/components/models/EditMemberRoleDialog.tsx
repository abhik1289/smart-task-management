import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import { useWorkspaceStore, type WorkspaceRole } from "@/store/workspaceStore";

import { cn } from "@/lib/utils";

const ROLES: { value: WorkspaceRole; label: string; description: string }[] = [
  {
    value: "owner",
    label: "Owner",
    description: "Full access including billing and workspace deletion.",
  },
  {
    value: "admin",
    label: "Admin",
    description: "Can manage members, roles, and all workspace content.",
  },
  {
    value: "member",
    label: "Member",
    description: "Can create and edit tasks they have access to.",
  },
  {
    value: "guest",
    label: "Guest",
    description: "Read-only access to assigned tasks and comments.",
  },
];

function RolePicker({
  value,
  onChange,
}: {
  value: WorkspaceRole;
  onChange: (role: WorkspaceRole) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {ROLES.map((r) => {
        const active = r.value === value;
        return (
          <button
            key={r.value}
            type="button"
            onClick={() => onChange(r.value)}
            data-active={active}
            className={cn(
              "flex flex-col items-start gap-1 rounded-lg border border-[#e5e7eb] bg-white px-3 py-2 text-left text-[13px] font-medium text-[#374151] transition-colors hover:border-[#d1d5db] hover:bg-[#f8f9fa]",
              active &&
                "border-[#111111] bg-[#111111]/5 text-[#111111] hover:bg-[#111111]/10",
            )}>
            <span className="text-[13px] font-semibold text-[#111111]">
              {r.label}
            </span>
            <span className="text-[11px] font-normal text-[#6b7280]">
              {r.description}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function EditMemberRoleDialog() {
  const editMemberId = useWorkspaceStore((s) => s.editMemberId);
  const setEditMemberId = useWorkspaceStore((s) => s.setEditMemberId);
  const members = useWorkspaceStore((s) => s.members);
  const updateRole = useWorkspaceStore((s) => s.updateRole);

  const member = members.find((m) => m.id === editMemberId) ?? null;
  const [role, setRole] = useState<WorkspaceRole>("member");
  const [saving, setSaving] = useState(false);

  // Sync local role to the selected member whenever the dialog reopens
  useEffect(() => {
    if (member) setRole(member.role);
  }, [member]);

  const open = !!member;

  function handleOpenChange(next: boolean) {
    if (!next) setEditMemberId(null);
  }

  async function handleSave() {
    if (!member) return;
    setSaving(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 250));
    updateRole(member.id, role);
    setSaving(false);
    toast.success("Role updated", {
      description: `${member.name} is now a ${ROLES.find((r) => r.value === role)?.label}.`,
    });
    setEditMemberId(null);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton
        className="flex max-h-[90vh] w-[95vw] flex-col gap-0 overflow-hidden p-0 sm:max-w-[480px]">
        <DialogHeader className="flex-row items-start gap-3 border-b border-[#e5e7eb] px-6 py-4">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#111111] text-white">
            <ShieldCheck className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <DialogTitle className="text-[18px] font-semibold tracking-[-0.2px] text-[#111111]">
              Change role
            </DialogTitle>
            <DialogDescription className="mt-0.5 text-[13px] text-[#6b7280]">
              {member ? (
                <>
                  Update role for{" "}
                  <span className="font-semibold text-[#111111]">
                    {member.name}
                  </span>
                  .
                </>
              ) : (
                "Select a member to change their role."
              )}
            </DialogDescription>
          </div>
        </DialogHeader>

        {member && (
          <div className="space-y-5 px-6 py-5">
            {/* Member card */}
            <div className="flex items-center gap-3 rounded-lg border border-[#e5e7eb] bg-[#f8f9fa] px-3 py-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[12px] font-semibold text-[#111111]">
                {member.avatar}
              </span>
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold text-[#111111]">
                  {member.name}
                </p>
                <p className="truncate text-[12px] text-[#6b7280]">
                  {member.email}
                </p>
              </div>
              <span className="ml-auto text-[11px] text-[#6b7280]">
                Joined{" "}
                {new Date(member.joinedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>

            {/* Role picker */}
            <div className="space-y-1.5">
              <Label className="text-[13px] font-semibold text-[#111111]">
                Role
              </Label>
              <RolePicker value={role} onChange={setRole} />
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 border-t border-[#e5e7eb] bg-[#f8f9fa] px-6 py-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setEditMemberId(null)}
            className="h-10 rounded-md px-4 text-[14px] font-semibold text-[#374151] hover:bg-white">
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={!member || saving || member.role === role}
            className="h-10 rounded-md bg-[#111111] px-5 text-[14px] font-semibold text-white hover:bg-[#242424] disabled:opacity-60">
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
