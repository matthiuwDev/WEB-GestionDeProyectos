import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ActivityFilters, ActivityResponse } from '../models/activity.interface';

@Injectable({
  providedIn: 'root',
})
export class HistoryService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/history`;

  /**
   * Retorna el historial completo de un proyecto con filtros opcionales.
   */
  getProjectHistory(projectId: number, filters?: ActivityFilters): Observable<ActivityResponse> {
    let params = new HttpParams();
    if (filters?.entity) params = params.set('entity', filters.entity);
    if (filters?.action) params = params.set('action', filters.action);
    if (filters?.limit) params = params.set('limit', filters.limit.toString());

    return this.http.get<ActivityResponse>(`${this.apiUrl}/projects/${projectId}`, { params });
  }

  /**
   * Retorna las actividades de un usuario específico dentro de un proyecto.
   */
  getUserHistory(projectId: number, userId: number): Observable<ActivityResponse> {
    return this.http.get<ActivityResponse>(`${this.apiUrl}/projects/${projectId}/users/${userId}`);
  }
}
