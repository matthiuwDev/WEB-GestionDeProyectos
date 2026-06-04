import { Injectable, inject, signal } from '@angular/core'; // 🛡️ Importar signal
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';
import { Observable, tap } from 'rxjs'; // 🛡️ tap es para interceptar la respuesta sin modificarla
import { AuthResponse, LoginCredentials, User } from '../models/auth.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/auth`;

  // Signal para almacenar el usuario actual. Es como una "caja" reactiva que puede contener un User o null.
  currentUser = signal<User | null>(null);

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: AuthResponse) => {
        this.saveToken(response.token);
        
        // Metemos los datos del usuario en la "caja" reactiva
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
  }
}