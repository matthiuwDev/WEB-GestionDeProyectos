import { Injectable, inject, signal, computed } from '@angular/core';
import { ProjectsService } from '../../features/projects/services/projects.service';
import { Project } from '../../features/projects/models/project.interface';
import { AuthService } from '../../features/auth/services/auth.service';
import { finalize } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectContextService {
  private readonly projectsService = inject(ProjectsService);

  // Private state
  private readonly _projectId = signal<number | null>(null);
  private readonly _project = signal<Project | null>(null);
  private readonly _isLoading = signal(false);
  private readonly _error = signal<string | null>(null);

  // Public read-only signals
  readonly projectId = this._projectId.asReadonly();
  readonly project = this._project.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  // Roles helpers
  private readonly authService = inject(AuthService);
  
  readonly projectRole = computed(() => {
    const project = this._project() as any;
    console.log('Project in projectRole computed:', project);
    const user = this.authService.currentUser();
    console.log('Current user in projectRole computed:', user);
    if (!project || !user) return null;

    if (project.projects_users?.role) return project.projects_users.role;
    if (project.role) return project.role;

    if (project.users && Array.isArray(project.users)) {
      const projectUser = project.users.find((u: any) => Number(u.id) === Number(user.id));
      return projectUser?.projects_users?.role || null;
    }

    return null;
  });

  readonly isOwner = computed(() => this.projectRole() === 'OWNER');
  readonly isAdmin = computed(() => this.authService.currentUser()?.role === 'ADMIN');

  // Computed helper
  readonly hasProject = computed(() => !!this._project());

  /**
   * Establece el ID del proyecto actual y dispara la carga de datos.
   * @param id El ID del proyecto (number)
   */
  setProjectId(id: number | string | null): void {
    const numericId = id !== null ? Number(id) : null;

    // Evitar recargas si el ID es el mismo
    if (this._projectId() === numericId && this._project()) return;

    this._projectId.set(numericId);

    if (numericId !== null && !isNaN(numericId)) {
      this.fetchProject(numericId);
    } else {
      this.clearContext();
    }
  }

  /**
   * Limpia el contexto actual del proyecto.
   */
  clearContext(): void {
    this._projectId.set(null);
    this._project.set(null);
    this._isLoading.set(false);
    this._error.set(null);
  }

  /**
   * Recarga los datos del proyecto actual.
   */
  refreshProject(): void {
    const currentId = this._projectId();
    if (currentId) {
      this.fetchProject(currentId);
    }
  }

  private fetchProject(id: number): void {
    this._isLoading.set(true);
    this._error.set(null);

    this.projectsService.getProjectById(id)
      .pipe(finalize(() => this._isLoading.set(false)))
      .subscribe({
        next: (response) => {
          this._project.set(response.data);
        },
        error: (err) => {
          console.error('Error loading project context', err);
          this._error.set('No se pudo cargar la información del proyecto.');
          this._project.set(null);
        }
      });
  }
}
