import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Sprint, CreateSprintDto, SprintResponse, SprintListResponse } from '../models/sprint.interface';

@Injectable({ providedIn: 'root' })
export class SprintsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/sprints`;

  getSprintsByProject(projectId: number): Observable<SprintListResponse> {
    return this.http.get<SprintListResponse>(`${this.apiUrl}?projectId=${projectId}`);
  }

  getSprintById(id: number): Observable<SprintResponse> {
    return this.http.get<SprintResponse>(`${this.apiUrl}/${id}`);
  }

  createSprint(sprint: CreateSprintDto): Observable<SprintResponse> {
    return this.http.post<SprintResponse>(this.apiUrl, sprint);
  }

  updateSprint(id: number, sprint: Partial<CreateSprintDto>): Observable<SprintResponse> {
    return this.http.put<SprintResponse>(`${this.apiUrl}/${id}`, sprint);
  }

  deleteSprint(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
