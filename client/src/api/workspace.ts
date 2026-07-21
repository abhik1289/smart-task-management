import api from "./axios";

export interface Workspace {
  id: string;
  name: string;
  description?: string | null;
  creationDate: string;
  updateDate: string;
  joinCode?: string;
}

export interface WorkspacePayload {
  name: string;
  description?: string;
}

export async function getMyWorkspaces(): Promise<Workspace[]> {
  const response = await api.get("/workspace/me");
  return response.data?.data as Workspace[];
}

export async function createWorkspace(
  payload: WorkspacePayload,
): Promise<Workspace> {
  const response = await api.post("/workspace", payload);
  return response.data?.data as Workspace;
}

export async function updateWorkspace(
  id: string,
  payload: WorkspacePayload,
): Promise<Workspace> {
  const response = await api.put(`/workspace/${id}`, payload);
  return response.data?.data as Workspace;
}

export async function deleteWorkspace(id: string): Promise<void> {
  await api.delete(`/workspace/${id}`);
}
