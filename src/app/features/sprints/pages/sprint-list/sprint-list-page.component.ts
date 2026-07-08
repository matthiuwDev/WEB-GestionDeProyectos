import { Component, ChangeDetectionStrategy, inject, signal, effect, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { DatePipe } from '@angular/common';

import { SprintsService } from '../../services/sprints.service';
import { Sprint } from '../../models/sprint.interface';
import { SprintCreateDialogComponent } from '../../components/sprint-create-dialog/sprint-create-dialog.component';
import { ProjectContextService } from '../../../../core/services/project-context.service';
import { NotificationService } from '../../../../../app/shared/services/notification.service';
import { ConfirmDialogComponent } from '../../../../shared/ui/confirm-dialog/confirm-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-sprint-list-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatChipsModule,
    MatDividerModule,
    DatePipe,
    MatTooltipModule
  ],
  templateUrl: './sprint-list-page.component.html',
  styleUrl: './sprint-list-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SprintListPageComponent implements OnInit {
  private readonly sprintsService = inject(SprintsService);
  private readonly projectContext = inject(ProjectContextService);
  private readonly dialog = inject(MatDialog);
  private readonly notificationService = inject(NotificationService);

  readonly sprints = signal<Sprint[]>([]);
  readonly isLoading = signal(true);
  readonly error = signal<string | null>(null);

  constructor() {
    effect(() => {
      const id = this.projectContext.projectId();
      if (id !== null) {
        this.loadSprints(id);
      }
    });
  }

  ngOnInit() {
    const id = this.projectContext.projectId();
    if (id) {
      this.loadSprints(id);
    }
  }

  loadSprints(projectId: number): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.sprintsService.getSprintsByProject(projectId).subscribe({
      next: (response) => {
        this.sprints.set(response.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading sprints', err);
        this.error.set('No se pudieron cargar los sprints.');
        this.isLoading.set(false);
      },
    });
  }

  retryLoad(): void {
    const id = this.projectContext.projectId();
    if (id) this.loadSprints(id);
  }

  openCreateDialog(): void {
    const id = this.projectContext.projectId();
    if (id === null) return;

    const dialogRef = this.dialog.open(SprintCreateDialogComponent, {
      width: '600px',
      data: { projectId: id },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadSprints(id);
      }
    });
  }

  deleteSprint(sprint: Sprint): void {
    if (sprint.status === 'ACTIVE') {
      this.notificationService.error('No se puede eliminar un sprint ACTIVO');
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar Sprint',
        message: `¿Estás seguro de que deseas eliminar el sprint "${sprint.name}"?`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
        isDestructive: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Optimistic delete
        this.sprints.update(list => list.filter(s => s.id !== sprint.id));

        this.sprintsService.deleteSprint(sprint.id).subscribe({
          next: () => {
            this.notificationService.success('Sprint eliminado con éxito');
          },
          error: (err) => {
            console.error('Error deleting sprint', err);
            this.notificationService.error('No se pudo eliminar el sprint.');
            // Rollback
            this.sprints.update(list => [...list, sprint]);
          }
        });
      }
    });
  }
}
