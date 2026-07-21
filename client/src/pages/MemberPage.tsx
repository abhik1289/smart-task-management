import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Ban,
  CheckCircle2,
  Pencil,
  Search,
  Shield,
  UsersRound,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { EditMemberRoleDialog } from "@/components/models/EditMemberRoleDialog";
import {
  useWorkspaceStore,
  type WorkspaceMember,
  type WorkspaceRole,
} from "@/store/workspaceStore";
import { useActiveWorkspaceStore } from "@/store/activeWorkspaceStore";

import { cn } from "@/lib/utils";

// --- Role styling ----------------------------------------------------------

const roleMeta: Record<
  WorkspaceRole,
  { label: string; classes: string; dot: string }
> = {
  owner: {
    label: "Owner",
    classes:
      "bg-[#111111]/5 text-[#111111] border-[#111111]/15 hover:bg-[#111111]/10",
    dot: "bg-[#111111]",
  },
  admin: {
    label: "Admin",
    classes:
      "bg-[#3b82f6]/10 text-[#1d4ed8] border-[#3b82f6]/20 hover:bg-[#3b82f6]/15",
    dot: "bg-[#3b82f6]",
  },
  member: {
    label: "Member",
    classes:
      "bg-[#10b981]/10 text-[#047857] border-[#10b981]/20 hover:bg-[#10b981]/15",
    dot: "bg-[#10b981]",
  },
  guest: {
    label: "Guest",
    classes:
      "bg-[#f59e0b]/10 text-[#a16207] border-[#f59e0b]/20 hover:bg-[#f59e0b]/15",
    dot: "bg-[#f59e0b]",
  },
};

function RoleBadge({ role }: { role: WorkspaceRole }) {
  const meta = roleMeta[role];
  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-medium",
        meta.classes,
      )}>
      <span className={cn("h-1.5 w-1.5 rounded-full", meta.dot)} />
      {meta.label}
    </Badge>
  );
}

// --- Helpers ---------------------------------------------------------------

function formatJoinDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// --- Stat cards ------------------------------------------------------------

function StatCard({
  icon,
  label,
  value,
  hint,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  hint?: string;
  tone?: "default" | "warning" | "danger";
}) {
  return (
    <Card className="border-[#e5e7eb] bg-white">
      <CardContent className="flex items-center gap-4 p-5">
        <span
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
            tone === "warning" && "bg-[#f59e0b]/10 text-[#a16207]",
            tone === "danger" && "bg-[#ef4444]/10 text-[#ef4444]",
            (!tone || tone === "default") && "bg-[#111111]/5 text-[#111111]",
          )}>
          {icon}
        </span>
        <div className="min-w-0">
          <p className="text-[12px] font-medium uppercase tracking-wide text-[#6b7280]">
            {label}
          </p>
          <p className="mt-0.5 text-[22px] font-semibold tracking-[-0.4px] text-[#111111]">
            {value}
          </p>
          {hint && <p className="mt-0.5 text-[11px] text-[#6b7280]">{hint}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

// --- Block confirm inline row ---------------------------------------------

function ConfirmBlockButton({
  member,
  onConfirm,
  onCancel,
}: {
  member: WorkspaceMember;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="flex items-center justify-end gap-1.5">
      <span className="mr-1 text-[11px] font-medium text-[#ef4444]">
        {member.blocked ? "Unblock" : "Block"} this member?
      </span>
      <Button
        size="xs"
        variant="ghost"
        onClick={onCancel}
        className="h-7 rounded-md px-2 text-[12px] font-medium text-[#6b7280] hover:bg-[#f5f5f5]">
        Cancel
      </Button>
      <Button
        size="xs"
        onClick={onConfirm}
        className={cn(
          "h-7 rounded-md px-2 text-[12px] font-semibold text-white",
          member.blocked
            ? "bg-[#10b981] hover:bg-[#059669]"
            : "bg-[#ef4444] hover:bg-[#dc2626]",
        )}>
        {member.blocked ? "Unblock" : "Block"}
      </Button>
    </div>
  );
}

// --- Member row actions ---------------------------------------------------

function MemberActions({ member }: { member: WorkspaceMember }) {
  const setEditMemberId = useWorkspaceStore((s) => s.setEditMemberId);
  const setBlockConfirmId = useWorkspaceStore((s) => s.setBlockConfirmId);
  const blockConfirmId = useWorkspaceStore((s) => s.blockConfirmId);
  const setBlocked = useWorkspaceStore((s) => s.setBlocked);

  const confirming = blockConfirmId === member.id;

  if (confirming) {
    return (
      <ConfirmBlockButton
        member={member}
        onCancel={() => setBlockConfirmId(null)}
        onConfirm={() => {
          setBlocked(member.id, !member.blocked);
          setBlockConfirmId(null);
          toast.success(
            member.blocked ? "Member unblocked" : "Member blocked",
            {
              description: `${member.name} can ${member.blocked ? "now access" : "no longer access"} this workspace.`,
            },
          );
        }}
      />
    );
  }

  return (
    <div className="flex items-center justify-end gap-1.5">
      <Button
        size="xs"
        variant="ghost"
        onClick={() => setEditMemberId(member.id)}
        disabled={member.blocked}
        className="h-7 gap-1 rounded-md px-2 text-[12px] font-medium text-[#374151] hover:bg-[#f5f5f5] disabled:opacity-40">
        <Pencil className="h-3 w-3" />
        Edit
      </Button>
      <Button
        size="xs"
        variant="ghost"
        onClick={() => setBlockConfirmId(member.id)}
        className={cn(
          "h-7 gap-1 rounded-md px-2 text-[12px] font-medium hover:bg-[#fef2f2]",
          member.blocked
            ? "text-[#047857] hover:bg-[#ecfdf5]"
            : "text-[#ef4444]",
        )}>
        <Ban className="h-3 w-3" />
        {member.blocked ? "Unblock" : "Block"}
      </Button>
    </div>
  );
}

// --- Page -----------------------------------------------------------------

export default function MemberPage() {
  const { workspaceId } = useParams();
  const activeWorkspace = useActiveWorkspaceStore(
    (state) => state.activeWorkspace,
  );
  const members = useWorkspaceStore((s) => s.members);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | WorkspaceRole>("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "blocked"
  >("all");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return members.filter((m) => {
      if (q) {
        const hay = `${m.name} ${m.email}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (roleFilter !== "all" && m.role !== roleFilter) return false;
      if (statusFilter === "active" && m.blocked) return false;
      if (statusFilter === "blocked" && !m.blocked) return false;
      return true;
    });
  }, [members, search, roleFilter, statusFilter]);

  const counts = useMemo(() => {
    return {
      total: members.length,
      admins: members.filter((m) => m.role === "owner" || m.role === "admin")
        .length,
      members: members.filter((m) => m.role === "member").length,
      blocked: members.filter((m) => m.blocked).length,
    };
  }, [members]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#111111] text-white">
              <UsersRound className="h-4 w-4" />
            </span>
            <h1 className="text-[22px] font-semibold tracking-[-0.4px] text-[#111111]">
              Workspace members
            </h1>
          </div>
          <p className="mt-1 text-[13px] text-[#6b7280]">
            {workspaceId && activeWorkspace?.id === workspaceId
              ? `Manage access to ${activeWorkspace.name}.`
              : "Manage who has access to this workspace and what they can do."}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard
          icon={<UsersRound className="h-4 w-4" />}
          label="Total members"
          value={counts.total}
        />
        <StatCard
          icon={<Shield className="h-4 w-4" />}
          label="Admins & owners"
          value={counts.admins}
          hint="Full access"
        />
        <StatCard
          icon={<CheckCircle2 className="h-4 w-4" />}
          label="Members"
          value={counts.members}
          hint="Can create tasks"
        />
        <StatCard
          icon={<Ban className="h-4 w-4" />}
          label="Blocked"
          value={counts.blocked}
          tone={counts.blocked > 0 ? "danger" : "default"}
        />
      </div>

      {/* Members card */}
      <Card className="border-[#e5e7eb] bg-white">
        <CardHeader className="border-b border-[#f3f4f6] px-5 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="text-[15px] font-semibold text-[#111111]">
              Members
              <span className="ml-2 text-[12px] font-medium text-[#6b7280]">
                {filtered.length} of {members.length}
              </span>
            </CardTitle>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#6b7280]" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name or email"
                  className="h-9 w-[220px] border-[#e5e7eb] pl-8 text-[13px]"
                />
              </div>
              <Select
                value={roleFilter}
                onValueChange={(v) =>
                  setRoleFilter(v as "all" | WorkspaceRole)
                }>
                <SelectTrigger className="h-9 min-w-[130px] border-[#e5e7eb] bg-white">
                  <SelectValue placeholder="All roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All roles</SelectItem>
                  <SelectItem value="owner">Owner</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="guest">Guest</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={statusFilter}
                onValueChange={(v) =>
                  setStatusFilter(v as "all" | "active" | "blocked")
                }>
                <SelectTrigger className="h-9 min-w-[130px] border-[#e5e7eb] bg-white">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[#f3f4f6] hover:bg-transparent">
                <TableHead className="h-10 px-5 text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">
                  Member
                </TableHead>
                <TableHead className="h-10 text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">
                  Role
                </TableHead>
                <TableHead className="h-10 text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">
                  Joining date
                </TableHead>
                <TableHead className="h-10 text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">
                  Status
                </TableHead>
                <TableHead className="h-10 px-5 text-right text-[11px] font-semibold uppercase tracking-wide text-[#6b7280]">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={5} className="px-5 py-12 text-center">
                    <p className="text-[14px] font-semibold text-[#111111]">
                      No members found
                    </p>
                    <p className="mt-1 text-[12px] text-[#6b7280]">
                      Try clearing your search or filters.
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((m) => (
                  <TableRow
                    key={m.id}
                    className="border-b border-[#f3f4f6] last:border-b-0">
                    <TableCell className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f5f5f5] text-[12px] font-semibold text-[#111111]">
                          {m.avatar}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-semibold text-[#111111]">
                            {m.name}
                          </p>
                          <p className="truncate text-[12px] text-[#6b7280]">
                            {m.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3.5">
                      <RoleBadge role={m.role} />
                    </TableCell>
                    <TableCell className="py-3.5 text-[13px] text-[#374151]">
                      {formatJoinDate(m.joinedAt)}
                    </TableCell>
                    <TableCell className="py-3.5">
                      {m.blocked ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ef4444]/10 px-2 py-0.5 text-[11px] font-medium text-[#ef4444]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#ef4444]" />
                          Blocked
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#10b981]/10 px-2 py-0.5 text-[11px] font-medium text-[#047857]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
                          Active
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="px-5 py-3.5">
                      <MemberActions member={m} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Mounted dialog */}
      <EditMemberRoleDialog />
    </div>
  );
}
