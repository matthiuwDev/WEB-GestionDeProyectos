import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserService } from '../../services/user.service';
import { UserInvitationResponse } from '../../models/user.interface';
import { ProjectContextService } from '../../../../core/services/project-context.service';

@Component({
  selector: 'app-user-invitation-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './user-invitation-dialog.component.html',
  styleUrl: './user-invitation-dialog.component.scss'
})
export class UserInvitationDialogComponent {
  private fb = inject(NonNullableFormBuilder);
  private userService = inject(UserService);
  private dialogRef = inject(MatDialogRef<UserInvitationDialogComponent>);
  private readonly projectContext = inject(ProjectContextService);

  isLoading = signal(false);
  id = Number(this.projectContext.projectId());

  userInvitationForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.userInvitationForm.valid) {
      this.isLoading.set(true);
      const userData = this.userInvitationForm.getRawValue();
      
      this.userService.inviteUser(this.id, userData.email).subscribe({
        next: (response: UserInvitationResponse) => {
          this.isLoading.set(false);
          this.dialogRef.close(response);
        },
        error: (err) => {
          this.isLoading.set(false);
          console.error(`Error al invitar al usuario`, err);
        }
      });
    } else {
      this.userInvitationForm.markAllAsTouched();
    }
  }
}
