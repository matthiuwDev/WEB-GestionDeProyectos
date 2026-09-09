import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DragDropModule, CdkDragDrop } from '@angular/cdk/drag-drop';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { ProjectContextService } from '../../../../core/services/project-context.service';
import { SprintsService } from '../../services/sprints.service';
import { UserStoriesService } from '../../../user-stories/services/user-stories.service';
import { TasksService } from '../../../tasks/services/tasks.service';
import { NotificationService } from '../../../../shared/services/notification.service';
import { Sprint } from '../../models/sprint.interface';
import { UserStory } from '../../../user-stories/models/user-story.interface';
import { Task } from '../../../tasks/models/task.interface';

@Component({
  selector: 'app-active-sprint-page',
  standalone: true,
  imports: [
    CommonModule,
    DragDropModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    DatePipe
  ],
  templateUrl: './active-sprint-page.component.html',
  styleUrl: './active-sprint-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class ActiveSprintPageComponent implements OnInit {
  private readonly projectContext = inject(ProjectContextService);
  private readonly sprintsService = inject(SprintsService);
  private readonly userStoriesService = inject(UserStoriesService);
  private readonly tasksService = inject(TasksService);
  private readonly notificationService = inject(NotificationService);

  readonly isLoading = signal(true);
  readonly error = signal<string | null>(null);
  
  readonly activeSprint = signal<Sprint | null>(null);
  readonly userStories = signal<UserStory[]>([]);

  ngOnInit() {
    this.loadActiveSprint();
  }

  loadActiveSprint() {
    this.isLoading.set(true);
    const projectId = this.projectContext.projectId();
    if (!projectId) {
      this.error.set('No se encontró el proyecto actual.');
      this.isLoading.set(false);
      return;
    }

    this.sprintsService.getSprintsByProject(projectId).subscribe({
      next: (res) => {
        const sprints = res.data;
        const active = sprints.find(s => s.status === 'ACTIVE');
        
        if (active) {
          this.activeSprint.set(active);
          this.loadBoardData(active.id);
        } else {
          this.activeSprint.set(null);
          this.isLoading.set(false);
        }
      },
      error: (err) => {
        console.error('Error fetching sprints', err);
        this.error.set('Error al cargar sprints del proyecto.');
        this.isLoading.set(false);
      }
    });
  }

  loadBoardData(sprintId: number) {
    this.userStoriesService.getUserStories({ sprintId, includeTasks: true }).subscribe({
      next: (res) => {
        this.userStories.set(res.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching board data', err);
        this.error.set('Error al cargar el tablero del sprint.');
        this.isLoading.set(false);
      }
    });
  }

  getTasksByStatus(story: UserStory, status: 'TODO' | 'IN_PROGRESS' | 'DONE'): Task[] {
    return (story.tasks || []).filter(t => t.status === status);
  }

  drop(event: CdkDragDrop<any>, storyIndex: number, newStatus: 'TODO' | 'IN_PROGRESS' | 'DONE') {
    const task = event.item.data as Task;
    
    if (task.status === newStatus) {
      return;
    }

    const currentStories = [...this.userStories()];
    const storyToUpdate = { ...currentStories[storyIndex] };
    
    const updatedTasks = (storyToUpdate.tasks || []).map(t => 
      t.id === task.id ? { ...t, status: newStatus } : t
    );
    
    storyToUpdate.tasks = updatedTasks;
    currentStories[storyIndex] = storyToUpdate;
    this.userStories.set(currentStories);

    this.tasksService.updateTask(task.id, { status: newStatus }).subscribe({
      next: () => {
        // UI actualizada correctamente, no se necesita hacer nada más
      },
      error: (err) => {
        console.error('Error updating task status', err);
        this.loadBoardData(this.activeSprint()!.id);
      }
    });
  }
}
