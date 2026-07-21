import { create } from "zustand";

export type WorkspaceRole = "owner" | "admin" | "member" | "guest";

export interface WorkspaceMember {
  id: string;
  name: string;
  email: string;
  avatar: string; // initials
  role: WorkspaceRole;
  joinedAt: string; // ISO yyyy-mm-dd
  blocked: boolean;
}

interface WorkspaceState {
  members: WorkspaceMember[];
  editMemberId: string | null;
  blockConfirmId: string | null;

  setEditMemberId: (id: string | null) => void;
  setBlockConfirmId: (id: string | null) => void;

  updateRole: (id: string, role: WorkspaceRole) => void;
  setBlocked: (id: string, blocked: boolean) => void;
}

// Mocked members. In production this would come from
// GET /workspaces/:id/members — fields align with the request:
// name, email, role, joining date, blocked status.
const initialMembers: WorkspaceMember[] = [
  {
    id: "u1",
    name: "Maya Lin",
    email: "maya.lin@acme.io",
    avatar: "ML",
    role: "owner",
    joinedAt: "2024-03-12",
    blocked: false,
  },
  {
    id: "u2",
    name: "Arjun Patel",
    email: "arjun.patel@acme.io",
    avatar: "AP",
    role: "admin",
    joinedAt: "2024-05-03",
    blocked: false,
  },
  {
    id: "u3",
    name: "Sofia Reyes",
    email: "sofia.reyes@acme.io",
    avatar: "SR",
    role: "member",
    joinedAt: "2024-09-21",
    blocked: false,
  },
  {
    id: "u4",
    name: "Noah Becker",
    email: "noah.becker@acme.io",
    avatar: "NB",
    role: "member",
    joinedAt: "2025-01-08",
    blocked: false,
  },
  {
    id: "u5",
    name: "Priya Shah",
    email: "priya.shah@acme.io",
    avatar: "PS",
    role: "member",
    joinedAt: "2025-02-14",
    blocked: false,
  },
  {
    id: "u6",
    name: "Liam Chen",
    email: "liam.chen@acme.io",
    avatar: "LC",
    role: "admin",
    joinedAt: "2025-04-02",
    blocked: false,
  },
  {
    id: "u7",
    name: "Diego Alvarez",
    email: "diego.alvarez@acme.io",
    avatar: "DA",
    role: "guest",
    joinedAt: "2025-06-30",
    blocked: false,
  },
  {
    id: "u8",
    name: "Hannah Okafor",
    email: "hannah.okafor@acme.io",
    avatar: "HO",
    role: "member",
    joinedAt: "2025-08-11",
    blocked: false,
  },
];

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  members: initialMembers,
  editMemberId: null,
  blockConfirmId: null,

  setEditMemberId: (id) => set({ editMemberId: id }),
  setBlockConfirmId: (id) => set({ blockConfirmId: id }),

  updateRole: (id, role) =>
    set((state) => ({
      members: state.members.map((m) => (m.id === id ? { ...m, role } : m)),
    })),

  setBlocked: (id, blocked) =>
    set((state) => ({
      members: state.members.map((m) => (m.id === id ? { ...m, blocked } : m)),
    })),
}));
