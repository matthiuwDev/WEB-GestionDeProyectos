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

export interface ValidationData {
  isValid: boolean;
  email: string;
  project: { id: string | number };
  userExists: boolean;
}

export interface ValidationResponse {
  status: string;
  data: ValidationData;
}

export interface AcceptInvitationResponse {
  status: string;
  message?: string;
  data?: any;
}