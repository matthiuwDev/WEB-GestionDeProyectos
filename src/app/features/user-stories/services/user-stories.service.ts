import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  CreateUserStoryDto,
  UserStoryListResponse,
  UserStoryResponse
} from '../models/user-story.interface';

@Injectable({
  providedIn: 'root'
})
export class UserStoriesService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/user-stories`;

  getUserStories(params?: { projectId?: number, sprintId?: number, includeTasks?: boolean }): Observable<UserStoryListResponse> {
    let url = this.apiUrl;
    const query = [];
    if (params?.projectId) query.push(`projectId=${params.projectId}`);
    if (params?.sprintId) query.push(`sprintId=${params.sprintId}`);
    if (params?.includeTasks) query.push(`includeTasks=true`);
    
    if (query.length > 0) {
      url += '?' + query.join('&');
    }
    return this.http.get<UserStoryListResponse>(url);
  }

  createUserStory(userStory: CreateUserStoryDto): Observable<UserStoryResponse> {
    return this.http.post<UserStoryResponse>(this.apiUrl, userStory);
  }

  getUserStoryById(id: number, projectId?: number): Observable<UserStoryResponse> {
    let url = `${this.apiUrl}/${id}`;
    if (projectId) url += `?projectId=${projectId}`;
    return this.http.get<UserStoryResponse>(url);
  }

  updateUserStory(id: number, userStory: Partial<CreateUserStoryDto> & { projectId?: number }): Observable<UserStoryResponse> {
    return this.http.put<UserStoryResponse>(`${this.apiUrl}/${id}`, userStory);
  }

  deleteUserStory(id: number, projectId?: number): Observable<void> {
    const url = projectId ? `${this.apiUrl}/${id}?projectId=${projectId}` : `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}
