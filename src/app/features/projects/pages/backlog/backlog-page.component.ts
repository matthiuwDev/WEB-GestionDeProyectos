import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

import { UserStoriesService } from '../../../user-stories/services/user-stories.service';
import { UserStory } from '../../../user-stories/models/user-story.interface';
import { UserStoryCreateDialogComponent } from '../../../user-stories/components/user-story-create-dialog/user-story-create-dialog.component';
import { ProjectContextService } from '../../../../core/services/project-context.service';

@Component({
  selector: 'app-backlog-page',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatDividerModule,
  ],
  templateUrl: './backlog-page.component.html',
  styleUrl: './backlog-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class BacklogPageComponent {
  private readonly userStoriesService = inject(UserStoriesService);
  private readonly projectContext = inject(ProjectContextService);
  private readonly dialog = inject(MatDialog);

  readonly userStories = signal<UserStory[]>([]);
  readonly isLoading = signal(true);
  readonly error = signal<string | null>(null);

  constructor() {
    effect(() => {
      const id = this.projectContext.projectId();
      if (id !== null) {
        this.loadUserStories(id);
      }
    });
  }

  loadUserStories(projectId: number): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.userStoriesService.getUserStories(projectId).subscribe({
      next: (response) => {
        // Filtrar solo las que no tienen sprintId (backlog)
        const backlogStories = response.data.filter(s => s.sprintId === null);
        this.userStories.set(backlogStories);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading user stories', err);
        this.error.set('No se pudieron cargar las historias de usuario.');
        this.isLoading.set(false);
      }
    });
  }

  retryLoad(): void {
    const id = this.projectContext.projectId();
    if (id) this.loadUserStories(id);
  }

  openCreateDialog(): void {
    const id = this.projectContext.projectId();
    if (id === null) return;

    const dialogRef = this.dialog.open(UserStoryCreateDialogComponent, {
      width: '500px',
      data: { projectId: id },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadUserStories(id);
      }
    });
  }
}
