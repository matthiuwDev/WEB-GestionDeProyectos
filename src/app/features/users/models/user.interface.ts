export interface UserListResponse {
  status: string;
  data: User[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  status: string;
  createdAt: Date;
  expiresAt: Date | null;
  canResend?: boolean;
}

export interface UserInvitationResponse {
  status: string;
  data: string;
}