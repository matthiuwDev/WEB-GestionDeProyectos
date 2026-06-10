import { Injectable, inject, signal } from '@angular/core'; 
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'; // 🛡️ Importar Router
import { environment } from '../../../../environments/environment.development';
import { Observable, tap } from 'rxjs'; 
import { AuthResponse, LoginCredentials, User } from '../models/auth.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = `${environment.apiUrl}/auth`;

  currentUser = signal<User | null>(null);

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: AuthResponse) => {
        this.saveToken(response.token);
        this.currentUser.set(response.data); 
      })
    );
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}