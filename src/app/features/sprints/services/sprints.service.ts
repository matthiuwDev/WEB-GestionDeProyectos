import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Sprint, CreateSprintDto, SprintResponse, SprintListResponse, UpdateSprintDto } from '../models/sprint.interface';

@Injectable({ providedIn: 'root' })
export class SprintsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/sprints`;

  getSprintsByProject(projectId: number): Observable<SprintListResponse> {
    return this.http.get<SprintListResponse>(`${this.apiUrl}?projectId=${projectId}`);
  }

  getSprintById(id: number, projectId?: number): Observable<SprintResponse> {
    let url = `${this.apiUrl}/${id}`;
    if (projectId) url += `?projectId=${projectId}`;
    return this.http.get<SprintResponse>(url);
  }

  createSprint(sprint: CreateSprintDto): Observable<SprintResponse> {
    return this.http.post<SprintResponse>(this.apiUrl, sprint);
  }

  updateSprint(id: number, sprint: Partial<UpdateSprintDto> & { projectId?: number }): Observable<SprintResponse> {
    return this.http.put<SprintResponse>(`${this.apiUrl}/${id}`, sprint);
  }

  deleteSprint(id: number, projectId?: number): Observable<void> {
    const url = projectId ? `${this.apiUrl}/${id}?projectId=${projectId}` : `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}
