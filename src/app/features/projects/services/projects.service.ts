import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ProjectResponse } from '../models/project.interface';
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
}
