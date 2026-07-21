import { create } from "zustand";

import type { Workspace } from "@/api/workspace";

const ACTIVE_WORKSPACE_STORAGE_KEY = "active_workspace_id";

function getStoredWorkspaceId() {
  return localStorage.getItem(ACTIVE_WORKSPACE_STORAGE_KEY);
}

interface ActiveWorkspaceState {
  activeWorkspace: Workspace | null;
  setActiveWorkspace: (workspace: Workspace) => void;
  syncActiveWorkspace: (workspaces: Workspace[]) => void;
  clearActiveWorkspace: () => void;
}

export const useActiveWorkspaceStore = create<ActiveWorkspaceState>((set) => ({
  activeWorkspace: null,

  setActiveWorkspace: (workspace) => {
    localStorage.setItem(ACTIVE_WORKSPACE_STORAGE_KEY, workspace.id);
    set({ activeWorkspace: workspace });
  },

  syncActiveWorkspace: (workspaces) => {
    const storedWorkspaceId = getStoredWorkspaceId();
    const selectedWorkspace =
      workspaces.find((workspace) => workspace.id === storedWorkspaceId) ??
      workspaces[0] ??
      null;

    if (selectedWorkspace) {
      localStorage.setItem(ACTIVE_WORKSPACE_STORAGE_KEY, selectedWorkspace.id);
    } else {
      localStorage.removeItem(ACTIVE_WORKSPACE_STORAGE_KEY);
    }

    set({ activeWorkspace: selectedWorkspace });
  },

  clearActiveWorkspace: () => {
    localStorage.removeItem(ACTIVE_WORKSPACE_STORAGE_KEY);
    set({ activeWorkspace: null });
  },
}));
