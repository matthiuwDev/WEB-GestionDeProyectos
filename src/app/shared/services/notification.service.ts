import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private snackBar = inject(MatSnackBar);

  private readonly defaultConfig: MatSnackBarConfig = {
    duration: 3000,
    horizontalPosition: 'center',
    verticalPosition: 'bottom',
  };

  success(message: string): void {
    this.show(message, 'success-snackbar');
  }

  error(message: string): void {
    this.show(message, 'error-snackbar', 5000);
  }

  info(message: string): void {
    this.show(message, 'info-snackbar');
  }

  private show(message: string, panelClass: string, duration?: number): void {
    this.snackBar.open(message, 'Cerrar', {
      ...this.defaultConfig,
      duration: duration || this.defaultConfig.duration,
      panelClass: [panelClass]
    });
  }
}
