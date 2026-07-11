import api from "./axios";

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: string;
  priority: string;
  completed: boolean;
}

export interface PageResult<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export async function getTasksByWorkspace(
  workspaceId: number,
  completed = false,
  page = 0,
  size = 10,
): Promise<PageResult<Task>> {
  const response = await api.get(`/tasks/workspace/${workspaceId}`, {
    params: { completed, page, size },
  });
  return response.data?.data as PageResult<Task>;
}
