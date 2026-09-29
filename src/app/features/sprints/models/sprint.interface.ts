export interface Sprint {
  id: number;
  projectId: number;
  name: string;
  startDate: string;
  endDate: string;
  goal: string;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED';
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateSprintDto {
  projectId: number;
  name: string;
  startDate: string;
  endDate: string;
  goal: string;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED';
}

export interface UpdateSprintDto {
  projectId: number;
  name?: string;
  startDate?: string;
  endDate?: string;
  goal?: string;
  status?: 'PENDING' | 'ACTIVE' | 'COMPLETED';
}

export interface SprintResponse {
  status: string;
  data: Sprint;
}

export interface SprintListResponse {
  status: string;
  data: Sprint[];
}
