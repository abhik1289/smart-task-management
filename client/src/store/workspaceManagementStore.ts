import { create } from "zustand";
import {
  createWorkspace,
  deleteWorkspace,
  getMyWorkspaces,
  updateWorkspace,
  type Workspace,
  type WorkspacePayload,
} from "@/api/workspace";
import { useActiveWorkspaceStore } from "@/store/activeWorkspaceStore";

interface WorkspaceManagementState {
  workspaces: Workspace[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  dialogOpen: boolean;
  editingWorkspace: Workspace | null;
  deletingWorkspace: Workspace | null;
  fetchWorkspaces: () => Promise<void>;
  openCreateDialog: () => void;
  openEditDialog: (workspace: Workspace) => void;
  closeDialog: () => void;
  saveWorkspace: (payload: WorkspacePayload) => Promise<Workspace>;
  requestDelete: (workspace: Workspace) => void;
  cancelDelete: () => void;
  deleteSelectedWorkspace: () => Promise<void>;
}

function getErrorMessage(error: unknown, fallback: string) {
  if (typeof error === "object" && error && "response" in error) {
    const response = error.response as { data?: { message?: string } };
    return response.data?.message ?? fallback;
  }

  return fallback;
}

export const useWorkspaceManagementStore = create<WorkspaceManagementState>(
  (set, get) => ({
    workspaces: [],
    isLoading: false,
    isSaving: false,
    error: null,
    dialogOpen: false,
    editingWorkspace: null,
    deletingWorkspace: null,

    fetchWorkspaces: async () => {
      set({ isLoading: true, error: null });
      try {
        const workspaces = await getMyWorkspaces();
        set({ workspaces, isLoading: false });
      } catch (error) {
        set({
          isLoading: false,
          error: getErrorMessage(error, "Unable to load workspaces."),
        });
      }
    },

    openCreateDialog: () =>
      set({ dialogOpen: true, editingWorkspace: null, error: null }),

    openEditDialog: (workspace) =>
      set({ dialogOpen: true, editingWorkspace: workspace, error: null }),

    closeDialog: () =>
      set({ dialogOpen: false, editingWorkspace: null, error: null }),

    saveWorkspace: async (payload) => {
      const { editingWorkspace } = get();
      set({ isSaving: true, error: null });

      try {
        const workspace = editingWorkspace
          ? await updateWorkspace(editingWorkspace.id, payload)
          : await createWorkspace(payload);

        const workspaces = editingWorkspace
          ? get().workspaces.map((item) =>
              item.id === workspace.id ? workspace : item,
            )
          : [workspace, ...get().workspaces];

        set({
          workspaces,
          isSaving: false,
          dialogOpen: false,
          editingWorkspace: null,
        });

        const activeWorkspace =
          useActiveWorkspaceStore.getState().activeWorkspace;
        if (!editingWorkspace || activeWorkspace?.id === workspace.id) {
          useActiveWorkspaceStore.getState().setActiveWorkspace(workspace);
        }

        return workspace;
      } catch (error) {
        const message = getErrorMessage(error, "Unable to save workspace.");
        set({ isSaving: false, error: message });
        throw new Error(message, { cause: error });
      }
    },

    requestDelete: (workspace) => set({ deletingWorkspace: workspace }),
    cancelDelete: () => set({ deletingWorkspace: null }),

    deleteSelectedWorkspace: async () => {
      const workspace = get().deletingWorkspace;
      if (!workspace) return;

      set({ isSaving: true, error: null });
      try {
        await deleteWorkspace(workspace.id);
        const workspaces = get().workspaces.filter(
          (item) => item.id !== workspace.id,
        );
        set({
          workspaces,
          deletingWorkspace: null,
          isSaving: false,
        });
        useActiveWorkspaceStore.getState().syncActiveWorkspace(workspaces);
      } catch (error) {
        set({
          isSaving: false,
          error: getErrorMessage(error, "Unable to delete workspace."),
        });
        throw error;
      }
    },
  }),
);
