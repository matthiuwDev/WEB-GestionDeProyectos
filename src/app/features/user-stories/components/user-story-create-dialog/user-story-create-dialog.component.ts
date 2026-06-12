import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { UserStoriesService } from '../../services/user-stories.service';
import { NotificationService } from '../../../../shared/services/notification.service';
import { CreateUserStoryDto } from '../../models/user-story.interface';
import { ProjectContextService } from '../../../../core/services/project-context.service';

@Component({
  selector: 'app-user-story-create-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './user-story-create-dialog.component.html',
  styleUrl: './user-story-create-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserStoryCreateDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<UserStoryCreateDialogComponent>);
  private readonly projectContext = inject(ProjectContextService);
  private readonly userStoriesService = inject(UserStoriesService);
  private readonly notificationService = inject(NotificationService);

  readonly isLoading = signal(false);

  readonly form = this.fb.group({
    name: ['', [Validators.required]],
    description: [''],
  });

  onSubmit(): void {
    if (this.form.invalid) return;

    const projectId = this.projectContext.projectId();
    if (projectId === null) {
      this.notificationService.error('No se pudo identificar el proyecto actual');
      return;
    }

    this.isLoading.set(true);

    const dto: CreateUserStoryDto = {
      name: this.form.value.name!,
      description: this.form.value.description || null,
      projectId: projectId,
      sprintId: null,
      position: null
    };

    this.userStoriesService.createUserStory(dto).subscribe({
      next: () => {
        this.notificationService.success('Historia de usuario creada con éxito');
        this.isLoading.set(false);
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Error creating user story', err);
        this.notificationService.error('Error al crear la historia de usuario');
        this.isLoading.set(false);
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
