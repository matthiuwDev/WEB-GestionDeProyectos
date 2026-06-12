export interface UserStory {
  id: number;
  name: string;
  description: string | null;
  projectId: number;
  sprintId: number | null;
  position: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserStoryDto {
  name: string;
  description: string | null;
  projectId: number;
  sprintId: number | null;
  position: number | null;
}

export interface UserStoryResponse {
  status: string;
  data: UserStory;
}

export interface UserStoryListResponse {
  status: string;
  data: UserStory[];
}
