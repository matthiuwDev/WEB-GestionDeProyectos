import { Component, OnInit, inject, signal, effect, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ProjectContextService } from '../../../../core/services/project-context.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.interface';
import { UserInvitationDialogComponent } from '../../components/user-invitation-dialog/user-invitation-dialog.component';
import { NotificationService } from '../../../../shared/services/notification.service';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-project-users-page',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatCardModule,
    MatTooltip
  ],
  templateUrl: './project-users-page.component.html',
  styleUrl: './project-users-page.component.scss'
})
export default class ProjectUsersPageComponent implements OnInit {
  private readonly projectContext = inject(ProjectContextService);
  private readonly userService = inject(UserService);
  private readonly dialog = inject(MatDialog);
  private readonly notificationService = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);

  readonly users = signal<User[]>([]);
  readonly isLoading = signal(true);
  readonly error = signal<string | null>(null);

  displayedColumns: string[] = ['name', 'email', 'status', 'actions'];

  constructor() {
    effect(() => {
      const id = this.projectContext.projectId();
      if (id !== null) {
        this.loadUsers(id);
      }
    });
  }

  ngOnInit(): void {
    const id = this.projectContext.projectId();
    if (id !== null) {
      this.loadUsers(id);
    }
  }

  loadUsers(projectId: number): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.userService.getProjectUsers(projectId).subscribe({
      next: (response) => {
        this.users.set(response.data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading users', err);
        this.error.set('No se pudieron cargar los usuarios del proyecto.');
        this.isLoading.set(false);
      }
    });
  }

  retryLoad(): void {
    const id = this.projectContext.projectId();
    if (id) {
      this.loadUsers(id);
    }
  }

  openInviteDialog(): void {
    const projectId = this.projectContext.projectId();
    if (!projectId) return;

    const dialogRef = this.dialog.open(UserInvitationDialogComponent, {
      width: '500px',
      disableClose: true,
      data: { projectId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsers(projectId);
      }
    });
  }

  resendInvitation(user: User): void {
    const projectId = this.projectContext.projectId();
    if (!projectId) return;

    // We can resend invitation using the same invite endpoint
    this.userService.inviteUser(projectId, user.email).subscribe({
      next: () => {
        this.notificationService.success(`Invitación reenviada a ${user.email}`);
        this.loadUsers(projectId);
      },
      error: () => {
        this.notificationService.error('Error al reenviar la invitación');
      }
    });
  }
}
