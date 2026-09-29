import { Task } from '../../../features/tasks/models/task.interface';

export interface UserStory {
  id: number;
  name: string;
  description: string | null;
  projectId: number;
  sprintId: number | null;
  position: number | null;
  assigneeId: number | null;
  assignee?: { id: number, name: string, email: string };
  createdAt: string;
  updatedAt: string;
  tasks?: Task[];
}

export interface CreateUserStoryDto {
  name: string;
  description: string | null;
  projectId: number;
  sprintId: number | null;
  position: number | null;
  assigneeId?: number | null;
}

export interface UserStoryResponse {
  status: string;
  data: UserStory;
}

export interface UserStoryListResponse {
  status: string;
  data: UserStory[];
}
