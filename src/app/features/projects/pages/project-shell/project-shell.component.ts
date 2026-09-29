import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';



import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ProjectContextService } from '../../../../core/services/project-context.service';
import { AuthService } from '../../../auth/services/auth.service';
import { NotificationService } from '../../../../shared/services/notification.service';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly breakpointObserver = inject(BreakpointObserver);

  projectId = input.required<string>();

  // Usa contexto centralizado para estado compartido
  readonly project = this.projectContext.project;
  readonly isLoading = this.projectContext.isLoading;
  readonly error = this.projectContext.error;
  readonly isOwner = this.projectContext.isOwner;
  
  readonly isMobile = signal(false);


  private readonly route = inject(ActivatedRoute);

  constructor() {
    effect(() => {
      const id = this.route.snapshot.paramMap.get('projectId');
      if (id) {
        this.projectContext.setProjectId(Number(id));
      }
    });
    // Existing breakpointObserver effect remains
    this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.TabletPortrait])
      .pipe(takeUntilDestroyed())
      .subscribe(result => {
        this.isMobile.set(result.matches);
      });
  }

  reloadProject(): void {
    this.projectContext.refreshProject();
  }

  logout(): void {
    this.authService.logout();
    this.notificationService.info('Has cerrado sesión correctamente');
  }
}
