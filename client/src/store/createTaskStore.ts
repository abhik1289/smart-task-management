import { create } from "zustand";

export interface WorkspaceMember {
  id: string;
  name: string;
  email: string;
  avatar: string; // initials
  role: "owner" | "admin" | "member" | "guest";
}

export type Priority = "high" | "medium" | "low";

interface CreateTaskState {
  open: boolean;
  title: string;
  description: string; // raw HTML from tiptap
  assigneeIds: string[];
  priority: Priority;
  tags: string[];
  dueDate: string; // yyyy-mm-dd

  setOpen: (open: boolean) => void;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  toggleAssignee: (id: string) => void;
  setPriority: (priority: Priority) => void;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  setDueDate: (date: string) => void;
  reset: () => void;
}

const initialState = {
  open: false,
  title: "",
  description: "",
  assigneeIds: [] as string[],
  priority: "medium" as Priority,
  tags: [] as string[],
  dueDate: "",
};

export const useCreateTaskStore = create<CreateTaskState>((set) => ({
  ...initialState,

  setOpen: (open) => set({ open }),
  setTitle: (title) => set({ title }),
  setDescription: (description) => set({ description }),
  toggleAssignee: (id) =>
    set((state) => ({
      assigneeIds: state.assigneeIds.includes(id)
        ? state.assigneeIds.filter((a) => a !== id)
        : [...state.assigneeIds, id],
    })),
  setPriority: (priority) => set({ priority }),
  addTag: (tag) =>
    set((state) =>
      state.tags.includes(tag) || !tag.trim()
        ? state
        : { tags: [...state.tags, tag.trim()] },
    ),
  removeTag: (tag) =>
    set((state) => ({ tags: state.tags.filter((t) => t !== tag) })),
  setDueDate: (dueDate) => set({ dueDate }),
  reset: () => set({ ...initialState, open: false }),
}));

// Mocked workspace members — in production this comes from
// GET /workspaces/:id/members
export const WORKSPACE_MEMBERS: WorkspaceMember[] = [
  {
    id: "u1",
    name: "Maya Lin",
    email: "maya@acme.io",
    avatar: "ML",
    role: "owner",
  },
  {
    id: "u2",
    name: "Arjun Patel",
    email: "arjun@acme.io",
    avatar: "AP",
    role: "admin",
  },
  {
    id: "u3",
    name: "Sofia Reyes",
    email: "sofia@acme.io",
    avatar: "SR",
    role: "member",
  },
  {
    id: "u4",
    name: "Noah Becker",
    email: "noah@acme.io",
    avatar: "NB",
    role: "member",
  },
  {
    id: "u5",
    name: "Priya Shah",
    email: "priya@acme.io",
    avatar: "PS",
    role: "member",
  },
  {
    id: "u6",
    name: "Liam Chen",
    email: "liam@acme.io",
    avatar: "LC",
    role: "admin",
  },
  {
    id: "u7",
    name: "Diego Alvarez",
    email: "diego@acme.io",
    avatar: "DA",
    role: "guest",
  },
];
