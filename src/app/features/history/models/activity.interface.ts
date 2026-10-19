export type ActivityAction = 'CREATE' | 'UPDATE' | 'DELETE';
export type ActivityEntity = 'Task' | 'UserStory' | 'Sprint';

export interface Activity {
  _id: string;
  action: ActivityAction;
  entity: ActivityEntity;
  entityId: number;
  projectId: number;
  userId: number;
  userName: string;
  snapshot: Record<string, unknown> | null;
  changes: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityResponse {
  status: string;
  data: Activity[];
}

export interface ActivityFilters {
  entity?: ActivityEntity;
  action?: ActivityAction;
  limit?: number;
}
