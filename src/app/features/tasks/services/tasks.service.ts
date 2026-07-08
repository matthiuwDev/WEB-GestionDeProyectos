import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Task, CreateTaskDto } from '../models/task.interface';

@Injectable({ providedIn: 'root' })
export class TasksService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/tasks`;

  getTasksByUserStory(userStoryId: number): Observable<{ data: Task[] }> {
    return this.http.get<{ data: Task[] }>(`${this.apiUrl}?userStoryId=${userStoryId}`);
  }

  createTask(task: CreateTaskDto): Observable<{ data: Task }> {
    return this.http.post<{ data: Task }>(this.apiUrl, task);
  }

  updateTask(id: number, task: Partial<Task>): Observable<{ data: Task }> {
    return this.http.put<{ data: Task }>(`${this.apiUrl}/${id}`, task);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
