import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { UserStoriesService } from '../../services/user-stories.service';
import { UserStory } from '../../models/user-story.interface';
import { TasksService } from '../../../tasks/services/tasks.service';
import { Task } from '../../../tasks/models/task.interface';
import { NotificationService } from '../../../../shared/services/notification.service';

@Component({
  selector: 'app-user-story-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatDividerModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './user-story-detail.component.html',
  styleUrl: './user-story-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class UserStoryDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly userStoriesService = inject(UserStoriesService);
  private readonly tasksService = inject(TasksService);
  private readonly notificationService = inject(NotificationService);

  readonly story = signal<UserStory | null>(null);
  readonly tasks = signal<Task[]>([]);
  readonly isLoading = signal(true);
  readonly isEditing = signal(false);
  
  readonly isEditable = computed(() => {
    const current = this.story();
    return current ? current.sprintId === null : false;
  });
  
  // Model for inline editing
  readonly editName = signal('');
  readonly editDescription = signal('');

  // Quick add task
  readonly newTaskName = signal('');
  readonly isAddingTask = signal(false);

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('storyId'));
      if (id) {
        this.loadUserStoryAndTasks(id);
      }
    });
  }

  private loadUserStoryAndTasks(storyId: number): void {
    this.isLoading.set(true);

    this.userStoriesService.getUserStoryById(storyId).subscribe({
      next: (response) => {
        this.story.set(response.data);
        this.editName.set(response.data.name);
        this.editDescription.set(response.data.description || '');
        this.loadTasks(storyId);
      },
      error: (err) => {
        console.error('Error loading story', err);
        this.isLoading.set(false);
      }
    });
  }

  private loadTasks(storyId: number): void {
    this.tasksService.getTasksByUserStory(storyId).subscribe({
      next: (response) => {
        this.tasks.set(response.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading tasks', err);
        this.isLoading.set(false);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['../../backlog'], { relativeTo: this.route });
  }

  // Edición en línea
  enableEdit(): void {
    const currentStory = this.story();
    if (currentStory) {
      this.editName.set(currentStory.name);
      this.editDescription.set(currentStory.description || '');
      this.isEditing.set(true);
    }
  }

  cancelEdit(): void {
    this.isEditing.set(false);
  }

  saveStory(): void {
    const currentStory = this.story();
    if (!currentStory) return;

    const updatedData = {
      name: this.editName().trim(),
      description: this.editDescription().trim() || null
    };

    if (!updatedData.name) {
      this.notificationService.error('El nombre no puede estar vacío');
      return;
    }

    this.story.update(s => s ? { ...s, name: updatedData.name, description: updatedData.description } : s);
    this.isEditing.set(false);

    this.userStoriesService.updateUserStory(currentStory.id, updatedData).subscribe({
      next: (res) => {
        this.story.set(res.data);
        this.notificationService.success('Historia guardada con éxito');
      },
      error: (err) => {
        console.error('Error saving story', err);
        this.loadUserStoryAndTasks(currentStory.id);
      }
    });
  }

  // Agregar Tarea
  addTask(): void {
    const name = this.newTaskName().trim();
    const currentStory = this.story();
    
    if (!name || !currentStory || this.isAddingTask()) return;

    this.isAddingTask.set(true);

    const newTaskDto = {
      name: name,
      status: 'TODO' as const,
      userStoryId: currentStory.id
    };

    this.tasksService.createTask(newTaskDto).subscribe({
      next: (res) => {
        this.tasks.update(list => [...list, res.data]);
        this.newTaskName.set('');
        this.isAddingTask.set(false);
      },
      error: (err) => {
        console.error('Error creating task', err);
        this.isAddingTask.set(false);
      }
    });
  }

  // Actualizar estado de la tarea
  updateTaskStatus(task: Task, newStatus: 'TODO' | 'IN_PROGRESS' | 'DONE'): void {
    if (task.status === newStatus) return;

    const originalStatus = task.status;

    this.tasks.update(list => list.map(t => t.id === task.id ? { ...t, status: newStatus } : t));

    this.tasksService.updateTask(task.id, { status: newStatus }).subscribe({
      next: (res) => {
        this.tasks.update(list => list.map(t => t.id === res.data.id ? res.data : t));
      },
      error: (err) => {
        console.error('Error updating task status', err);
        this.tasks.update(list => list.map(t => t.id === task.id ? { ...t, status: originalStatus } : t));
      }
    });
  }

  // Eliminar tarea
  deleteTask(task: Task): void {
    this.tasks.update(list => list.filter(t => t.id !== task.id));

    this.tasksService.deleteTask(task.id).subscribe({
      next: () => {
        this.notificationService.success('Tarea eliminada');
      },
      error: (err) => {
        console.error('Error deleting task', err);
        this.tasks.update(list => [...list, task]);
      }
    });
  }
}
