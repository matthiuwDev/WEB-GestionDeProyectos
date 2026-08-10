import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProjectsService } from '../../services/projects.service';
import { Project, ProjectResponse } from '../../models/project.interface';
import { ProjectCreateComponent } from '../../components/project-create/project-create.component';
import { ConfirmDialogComponent } from '../../../../shared/ui/confirm-dialog/confirm-dialog.component';
import { NotificationService } from '../../../../shared/services/notification.service';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    RouterLink,
    CommonModule
  ],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.scss',
})
export class ProjectListComponent implements OnInit {
  private projectsService = inject(ProjectsService);
  private dialog = inject(MatDialog);
  private notificationService = inject(NotificationService);
  private authService = inject(AuthService);

  projects = signal<Project[]>([]);
  isLoading = signal<boolean>(false);
  currentUser = this.authService.currentUser;

  ngOnInit() {
    this.loadProjects();
  }

  logout(): void {
    this.authService.logout();
    this.notificationService.info('Has cerrado sesión correctamente');
  }

  getPriorityLabel(priority: number): { text: string, colorClass: string, icon: string } {
    switch(Number(priority)) {
      case 1: return { text: 'P1 · Crítica', colorClass: 'p-critical', icon: 'local_fire_department' };
      case 2: return { text: 'P2 · Alta', colorClass: 'p-high', icon: 'trending_up' };
      case 3: return { text: 'P3 · Media', colorClass: 'p-medium', icon: 'remove' };
      case 4: return { text: 'P4 · Baja', colorClass: 'p-low', icon: 'trending_down' };
      case 6: default: return { text: `P${priority} · Menor`, colorClass: 'p-lowest', icon: 'low_priority' };
    }
  }

  loadProjects(): void {
    this.isLoading.set(true);
    this.projectsService.getProjects().subscribe({
      next: (response: ProjectResponse) => { 
        this.projects.set(response.data); 
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar proyectos', err);
        this.isLoading.set(false);
        this.notificationService.error('Error al cargar los proyectos');
      }
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(ProjectCreateComponent, {
      width: '520px',
      disableClose: true,
      data: null
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.projects.update(currentProjects => [result, ...currentProjects]);
        this.notificationService.success('Proyecto creado con éxito');
      }
    });
  }

  openEditDialog(project: Project): void {
    const dialogRef = this.dialog.open(ProjectCreateComponent, {
      width: '520px',
      disableClose: true,
      data: project
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.projects.update(currentProjects => 
          currentProjects.map(p => p.id === result.id ? { ...p, ...result } : p)
        );
        this.notificationService.success('Proyecto actualizado con éxito');
      }
    });
  }

  deleteProject(project: Project): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      data: {
        title: 'Eliminar Proyecto',
        message: `¿Estás seguro de que deseas eliminar "${project.name}"? Esta acción no se puede deshacer y eliminará todos los sprints y tareas asociados.`,
        confirmText: 'Eliminar',
        isDestructive: true
      }
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.projectsService.deleteProject(project.id).subscribe({
          next: () => {
            this.projects.update(list => list.filter(p => p.id !== project.id));
            this.notificationService.success('Proyecto eliminado correctamente');
          },
          error: (err) => {
            const message = err.error?.message || 'Error al eliminar el proyecto';
            this.notificationService.error(message);
          }
        });
      }
    });
  }
}