import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Task, CreateTaskDto } from '../models/task.interface';

@Injectable({ providedIn: 'root' })
export class TasksService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/tasks`;

  getTasksByUserStory(userStoryId: number, projectId?: number): Observable<{ data: Task[] }> {
    let url = `${this.apiUrl}?userStoryId=${userStoryId}`;
    if (projectId) url += `&projectId=${projectId}`;
    return this.http.get<{ data: Task[] }>(url);
  }

  createTask(task: CreateTaskDto): Observable<{ data: Task }> {
    return this.http.post<{ data: Task }>(this.apiUrl, task);
  }

  updateTask(id: number, task: Partial<Task> & { projectId?: number }): Observable<{ data: Task }> {
    return this.http.put<{ data: Task }>(`${this.apiUrl}/${id}`, task);
  }

  deleteTask(id: number, projectId?: number): Observable<void> {
    const url = projectId ? `${this.apiUrl}/${id}?projectId=${projectId}` : `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}
