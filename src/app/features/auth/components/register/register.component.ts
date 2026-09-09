import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../../../shared/services/notification.service';
import { RegisterCredentials } from '../../models/auth.interface';

@Component({
  selector: 'app-register',
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
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  inviteToken: string | null = null;
  inviteEmail: string | null = null;
  projectId: number | null = null;

  showPassword = signal(false);
  isLoading = signal(false);

  registerForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  });

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { inviteToken?: string, inviteEmail?: string, projectId?: number };
    const historyState = history.state;

    this.inviteToken = state?.inviteToken || historyState?.inviteToken || null;
    this.inviteEmail = state?.inviteEmail || historyState?.inviteEmail || null;
    this.projectId = state?.projectId || historyState?.projectId || null;

    if (this.inviteEmail) {
      this.registerForm.patchValue({ email: this.inviteEmail });
      this.registerForm.get('email')?.disable();
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword.update(show => !show);
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading.set(true);
      const formValue = this.registerForm.getRawValue();
      
      const payload: RegisterCredentials = {
        name: formValue.name,
        email: formValue.email,
        password: formValue.password,
        confirmPassword: formValue.confirmPassword,
        inviteToken: this.inviteToken
      };

      if(payload.password !== payload.confirmPassword) {
        this.isLoading.set(false);
        this.notificationService.error('Las contraseñas no coinciden');
        return;
      }

      this.authService.register(payload).subscribe({
        next: (response) => {
          this.notificationService.success('Registro exitoso. Iniciando sesión...');
          
          this.authService.login({ email: payload.email, password: payload.password }).subscribe({
            next: () => {
              this.isLoading.set(false);
              this.router.navigate(['/projects'], { state: { inviteToken: this.inviteToken, projectId: this.projectId } });
            },
            error: () => {
              this.isLoading.set(false);
              this.router.navigate(['/login'], { state: { inviteToken: this.inviteToken, projectId: this.projectId } });
            }
          });
        },
        error: (err) => {
          this.isLoading.set(false);
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
