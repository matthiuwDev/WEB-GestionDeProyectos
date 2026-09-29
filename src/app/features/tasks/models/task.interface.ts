export interface Task {
  id: number;
  name: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  userStoryId: number;
  assigneeId: number | null;
  assignee?: { id: number, name: string, email: string };
}

export interface CreateTaskDto {
  name: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  userStoryId: number;
  projectId?: number;
  assigneeId?: number | null;
}
