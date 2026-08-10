import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../../services/user.service';
import { ValidationResponse } from '../../models/user.interface';

@Component({
  selector: 'app-activate-invitation',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, MatIconModule, MatButtonModule],
  templateUrl: './activate-invitation.component.html',
  styleUrl: './activate-invitation.component.scss'
})
export class ActivateInvitationComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private userService = inject(UserService);

  isLoading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    const token = this.route.snapshot.paramMap.get('token');
    console.log('Token from URL:', token);

    if (!token) {
      this.error.set('Token no encontrado en la URL.');
      this.isLoading.set(false);
      return;
    }

    this.userService.validateInvitation(token).subscribe({
      next: (response: ValidationResponse) => {
        const { email, userExists, project } = response.data;
        console.log('Invitation validation response:', response);
        
        // Pasamos el token, email y el projectId en el estado
        const navigationState = { 
          inviteToken: token, 
          inviteEmail: email,
          projectId: project.id 
        };

        if (userExists) {
          // Si el usuario existe, va a login
          this.router.navigate(['/login'], { state: navigationState });
        } else {
          // Si no existe, va a registrarse
          this.router.navigate(['/register'], { state: navigationState });
        }
      },
      error: (err) => {
        console.error('Error validating invitation', err);
        this.error.set('El enlace de invitación es inválido o ha expirado.');
        this.isLoading.set(false);
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
