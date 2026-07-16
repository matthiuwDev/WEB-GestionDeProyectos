import { Component, OnInit, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../../services/user.service';
import { UserInvitationResponse } from '../../models/user.interface';
import { ProjectContextService } from '../../../../core/services/project-context.service';

@Component({
  selector: 'app-user-invitation-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
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
  isEditMode = signal(false);
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
      console.log("Datos del usuario a enviar: ", userData);

      const request$ = this.userService.inviteUser(this.id, userData.email);
      console.log("Observable de la solicitud: ", request$);
      request$.subscribe({
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
