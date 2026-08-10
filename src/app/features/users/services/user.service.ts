import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import {
    UserInvitationResponse,
    UserListResponse,
    ValidationResponse,
    AcceptInvitationResponse
} from '../models/user.interface';
import { Observable } from 'rxjs';
import { ProjectResponse } from '../../projects/models/project.interface';

@Injectable({
    providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/projects`;

  getProjectUsers(projectId: number): Observable<UserListResponse> {
    return this.http.get<UserListResponse>(`${this.apiUrl}/${projectId}/users`);
  }

  inviteUser(projectId: number, email: string): Observable<UserInvitationResponse> {
    return this.http.post<UserInvitationResponse>(`${this.apiUrl}/${projectId}/invite`, { email });
  }

  validateInvitation(token: string): Observable<ValidationResponse> {
    return this.http.get<ValidationResponse>(`${environment.apiUrl}/projects/invitations/validate/${token}`);
  }

  acceptInvitation(token: string): Observable<AcceptInvitationResponse> {
    return this.http.post<AcceptInvitationResponse>(`${environment.apiUrl}/projects/invitations/accept`, { token });
  }
}
