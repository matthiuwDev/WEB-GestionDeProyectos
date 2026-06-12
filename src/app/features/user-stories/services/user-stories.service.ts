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

  getUserStories(projectId?: number): Observable<UserStoryListResponse> {
    const url = projectId ? `${this.apiUrl}?projectId=${projectId}` : this.apiUrl;
    return this.http.get<UserStoryListResponse>(url);
  }

  createUserStory(userStory: CreateUserStoryDto): Observable<UserStoryResponse> {
    return this.http.post<UserStoryResponse>(this.apiUrl, userStory);
  }

  getUserStoryById(id: number): Observable<UserStoryResponse> {
    return this.http.get<UserStoryResponse>(`${this.apiUrl}/${id}`);
  }

  updateUserStory(id: number, userStory: Partial<CreateUserStoryDto>): Observable<UserStoryResponse> {
    return this.http.put<UserStoryResponse>(`${this.apiUrl}/${id}`, userStory);
  }

  deleteUserStory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
