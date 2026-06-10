export interface ProjectUserPivot {
  role: string;
  status: string;
}

export interface ProjectUser {
  id: number;
  name: string;
  email: string;
  projects_users: ProjectUserPivot;
}

export interface Project {
  id: number;
  name: string;
  priority: number;
  description: string;
  createdAt: string;
  updatedAt: string;
  users?: ProjectUser[];
}

export interface ProjectResponse {
  status: string;
  data: Project[];
}

export interface CreateProjectDto {
  name: string;
  description: string;
  priority: number;
}

export interface UpdateProjectDto extends Partial<CreateProjectDto> {}

export interface ProjectCreated {
  id: number;
  name: string;
  description: string;
  priority: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectResponse {
  status: string;
  data: ProjectCreated;
}

export interface UpdateProjectResponse extends CreateProjectResponse {}