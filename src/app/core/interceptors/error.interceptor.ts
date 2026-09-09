import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../../features/auth/services/auth.service';
import { NotificationService } from '../../shared/services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ha ocurrido un error inesperado. Por favor, intenta de nuevo.';

      if (error.error instanceof ErrorEvent) {
        // Error de lado del cliente
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Error del backend
        if (error.status === 401) {
          if (req.url.includes('auth/login')) {
            errorMessage = error.error?.message || 'Credenciales incorrectas.';
            notificationService.error(errorMessage);
            return throwError(() => error);
          } else {
            errorMessage = 'Tu sesión ha expirado o no tienes permisos. Iniciando sesión de nuevo...';
            notificationService.error(errorMessage);
            authService.logout();
            return throwError(() => error);
          }
        } else if (error.status === 0) {
          errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
        } else if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else if (error.status === 500) {
          errorMessage = 'Error interno del servidor. Por favor, reporta este problema.';
        } else if (error.status === 403) {
          errorMessage = 'No tienes permiso para realizar esta acción.';
        }
      }

      // No mostrar notificaciones para errores 404 (generalmente manejados por las vistas locales)
      if (error.status !== 404) {
        notificationService.error(errorMessage);
      }

      return throwError(() => error);
    })
  );
};
