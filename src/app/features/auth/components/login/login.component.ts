import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { AuthResponse } from '../../models/auth.interface';
import { UserService } from '../../../users/services/user.service';
import { NotificationService } from '../../../../shared/services/notification.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private userService = inject(UserService);
  private notificationService = inject(NotificationService);

  inviteToken: string | null = null;
  projectId: number | null = null;
  inviteEmail: string | null = null;

  showPassword = signal(false);
  isLoading = signal(false);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as any;
    const historyState = history.state;

    this.inviteToken = state?.inviteToken || historyState?.inviteToken || null;
    this.projectId = state?.projectId || historyState?.projectId || null;
    this.inviteEmail = state?.inviteEmail || historyState?.inviteEmail || null;

    if (this.inviteEmail) {
      this.loginForm.patchValue({ email: this.inviteEmail });
      this.loginForm.get('email')?.disable();
      this.notificationService.info('Inicia sesión para aceptar la invitación al proyecto');
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword.update(show => !show);
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      const formValue = this.loginForm.getRawValue();

      this.authService.login({ email: formValue.email, password: formValue.password }).subscribe({
        next: (response: AuthResponse) => { 
          console.log('Autenticación exitosa. Estado actualizado.');
          
          if (this.inviteToken) {
            this.userService.acceptInvitation(this.inviteToken).subscribe({
              next: () => {
                this.notificationService.success('¡Invitación aceptada exitosamente!');
                this.isLoading.set(false);
                if (this.projectId) {
                  this.router.navigate([`/projects/${this.projectId}/backlog`]);
                } else {
                  this.router.navigate(['/projects']);
                }
              },
              error: (err) => {
                console.error('Error al aceptar invitación', err);
                this.isLoading.set(false);
                this.notificationService.error('Error al unirte al proyecto');
                this.router.navigate(['/projects']);
              }
            });
          } else {
            this.isLoading.set(false);
            this.router.navigate(['/projects']);
          }
        },
        error: (err) => { 
          console.error('Error al iniciar sesión', err);
          this.isLoading.set(false);
          this.notificationService.error('Credenciales incorrectas o error en el servidor');
        }
      });
    } else {
      this.loginForm.markAllAsTouched(); 
    }
  }
}