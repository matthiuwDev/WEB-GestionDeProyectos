import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { CreateProjectDto, CreateProjectResponse, ProjectResponse, UpdateProjectDto, UpdateProjectResponse } from '../models/project.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/projects`;

  getProjects(): Observable<ProjectResponse> {
    return this.http.get<ProjectResponse>(this.apiUrl);
  }

  createProject(project: CreateProjectDto): Observable<CreateProjectResponse> {
    return this.http.post<CreateProjectResponse>(this.apiUrl, project);
  }

  updateProject(id: number, project: UpdateProjectDto): Observable<UpdateProjectResponse> {
    return this.http.put<UpdateProjectResponse>(`${this.apiUrl}/${id}`, project);
  }
}
