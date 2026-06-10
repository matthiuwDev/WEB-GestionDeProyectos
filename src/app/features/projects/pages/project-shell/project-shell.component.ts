import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  numberAttribute,
  signal
} from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ProjectsService } from '../../services/projects.service';
import { Project } from '../../models/project.interface';

@Component({
  selector: 'app-project-shell',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './project-shell.component.html',
  styleUrl: './project-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProjectShellComponent {
  private readonly projectsService = inject(ProjectsService);

  projectId = input.required<string>();

  readonly project = signal<Project | null>(null);
  readonly isLoading = signal(true);
  readonly error = signal<string | null>(null);

  constructor() {
    effect(() => {
      const id = Number(this.projectId());

      if (id) {
        this.fetchProject(id);
      }
    });
  }

  reloadProject(): void {
    this.fetchProject(Number(this.projectId()));
  }

  private fetchProject(id: number): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.projectsService.getProjectById(id).subscribe({
      next: (response) => {
        this.project.set(response.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading project', err);

        this.error.set(
          'No se pudo cargar la información del proyecto.'
        );

        this.isLoading.set(false);
      }
    });
  }
}