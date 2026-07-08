import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { UserStoriesService } from '../../../user-stories/services/user-stories.service';
import { UserStory } from '../../../user-stories/models/user-story.interface';
import { SprintsService } from '../../services/sprints.service';
import { Sprint } from '../../models/sprint.interface';
import { NotificationService } from '../../../../shared/services/notification.service';
import { ProjectContextService } from '../../../../core/services/project-context.service';

@Component({
  selector: 'app-sprint-planning-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DragDropModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './sprint-planning-page.component.html',
  styleUrl: './sprint-planning-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SprintPlanningPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly userStoriesService = inject(UserStoriesService);
  private readonly sprintsService = inject(SprintsService);
  private readonly notificationService = inject(NotificationService);
  private readonly projectContext = inject(ProjectContextService);

  readonly sprint = signal<Sprint | null>(null);
  readonly backlogStories = signal<UserStory[]>([]);
  readonly sprintStories = signal<UserStory[]>([]);
  readonly isLoading = signal(true);
  
  private sprintId: number | null = null;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.sprintId = Number(params.get('sprintId')) || null;
      if (this.sprintId) {
        this.loadData();
      }
    });
  }

  loadData() {
    this.isLoading.set(true);
    const projectId = this.projectContext.projectId();
    
    if (!projectId || !this.sprintId) {
      this.notificationService.error('Faltan parámetros de proyecto o sprint');
      return;
    }

    // Load Sprint Info
    this.sprintsService.getSprintById(this.sprintId).subscribe({
      next: (res) => {
        this.sprint.set(res.data);
      },
      error: (err) => {
        console.error('Error loading sprint', err);
        this.notificationService.error('Error al cargar datos del sprint');
      }
    });

    // Load User Stories
    this.userStoriesService.getUserStories({ projectId }).subscribe({
      next: (res) => {
        const stories = res.data;
        this.backlogStories.set(stories.filter(s => s.sprintId === null));
        this.sprintStories.set(stories.filter(s => s.sprintId === this.sprintId));
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading stories', err);
        this.notificationService.error('Error al cargar historias de usuario');
        this.isLoading.set(false);
      }
    });
  }

  goBack() {
    this.router.navigate(['../../sprints'], { relativeTo: this.route });
  }

  drop(event: CdkDragDrop<UserStory[]>, target: 'BACKLOG' | 'SPRINT') {
    if (event.previousContainer === event.container) {
      // Reordering in same list
      const list = [...event.container.data];
      moveItemInArray(list, event.previousIndex, event.currentIndex);
      if (target === 'BACKLOG') {
        this.backlogStories.set(list);
      } else {
        this.sprintStories.set(list);
      }
    } else {
      // Moving to another list
      const previousList = [...event.previousContainer.data];
      const currentList = [...event.container.data];
      
      transferArrayItem(previousList, currentList, event.previousIndex, event.currentIndex);

      const newSprintId = target === 'SPRINT' ? this.sprintId : null;
      const movedStory = currentList[event.currentIndex];
      
      // Update object immutably
      currentList[event.currentIndex] = { ...movedStory, sprintId: newSprintId };

      // Optimistic update of Signals
      if (target === 'BACKLOG') {
        this.backlogStories.set(currentList);
        this.sprintStories.set(previousList);
      } else {
        this.sprintStories.set(currentList);
        this.backlogStories.set(previousList);
      }

      this.updateStorySprint(movedStory, newSprintId);
    }
  }

  private updateStorySprint(story: UserStory, newSprintId: number | null) {
    this.userStoriesService.updateUserStory(story.id, { sprintId: newSprintId }).subscribe({
      next: () => {
        this.notificationService.success(newSprintId ? 'Historia asignada al sprint' : 'Historia devuelta al backlog');
      },
      error: (err) => {
        console.error('Error moving story', err);
        this.notificationService.error('Error al mover la historia');
        // Rollback on error
        this.loadData();
      }
    });
  }
}
