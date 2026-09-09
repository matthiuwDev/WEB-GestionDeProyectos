import { Component, ChangeDetectionStrategy, inject, signal, effect, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

import { UserStoriesService } from '../../services/user-stories.service';
import { UserStory } from '../../models/user-story.interface';
import { UserStoryCreateDialogComponent } from '../../components/user-story-create-dialog/user-story-create-dialog.component';
import { ProjectContextService } from '../../../../core/services/project-context.service';
import { NotificationService } from '../../../../shared/services/notification.service';
import { ConfirmDialogComponent } from '../../../../shared/ui/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-backlog-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
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
  private notificationService = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);

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

  ngOnInit() {
    this.loadUserStories(this.projectContext.projectId()!);
  }

  loadUserStories(projectId: number): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.userStoriesService.getUserStories({ projectId }).subscribe({
      next: (response) => {
        // Filtrar solo las que no tienen sprintId (backlog)
        const backlogStories = response.data.filter((s) => s.sprintId === null);
        this.userStories.set(backlogStories);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading user stories', err);
        this.error.set('No se pudieron cargar las historias de usuario.');
        this.isLoading.set(false);
      },
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

    dialogRef.afterClosed().pipe(takeUntilDestroyed(this.destroyRef)).subscribe((result) => {
      if (result) {
        this.loadUserStories(id);
      }
    });
  }

  openEditDialog(userStory: UserStory): void {
    const dialogRef = this.dialog.open(UserStoryCreateDialogComponent, {
      width: '500px',
      disableClose: true,
      data: userStory,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userStories.update((currentUserStories) =>
          currentUserStories.map((s) => (s.id === result.id ? { ...s, ...result } : s)),
        );
      }
    });
  }

  deleteUserStory(story: UserStory): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar Historia de Usuario',
        message: `¿Estás seguro de que deseas eliminar la historia "${story.name}"? Esta acción no se puede deshacer.`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
        isDestructive: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userStoriesService.deleteUserStory(story.id).subscribe({
          next: () => {
            this.userStories.update(list => list.filter(s => s.id !== story.id));
            this.notificationService.success('Historia de usuario eliminada con éxito');
          },
          error: (err) => {
            console.error('Error deleting user story', err);
          }
        });
      }
    });
  }
}
