export interface Task {
  id: number;
  name: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  userStoryId: number;
}

export interface CreateTaskDto {
  name: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  userStoryId: number;
}
