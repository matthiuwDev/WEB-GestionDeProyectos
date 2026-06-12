import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
} from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ProjectContextService } from '../../../../core/services/project-context.service';

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
  private readonly projectContext = inject(ProjectContextService);

  projectId = input.required<string>();

  // Usa contexto centralizado para estado compartido
  readonly project = this.projectContext.project;
  readonly isLoading = this.projectContext.isLoading;
  readonly error = this.projectContext.error;

  constructor() {
    effect(() => {
      // Establece el ID del proyecto en el contexto, lo que dispara la carga de datos
      this.projectContext.setProjectId(this.projectId());
    });
  }

  reloadProject(): void {
    this.projectContext.refreshProject();
  }
}