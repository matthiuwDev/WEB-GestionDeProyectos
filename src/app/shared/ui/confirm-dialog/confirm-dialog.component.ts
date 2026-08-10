import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="modal-wrapper">
      <div class="modal-header">
        <div class="header-titles">
          <h2>{{ data.title }}</h2>
        </div>
        <button mat-icon-button (click)="onCancel()" class="close-btn" type="button">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <mat-dialog-content class="modal-content">
        <p class="confirm-message">{{ data.message }}</p>
      </mat-dialog-content>

      <mat-dialog-actions class="modal-actions">
        <button mat-button (click)="onCancel()" class="minimal-btn">
          {{ data.cancelText || 'Cancelar' }}
        </button>
        <button 
          mat-flat-button 
          (click)="onConfirm()"
          [ngClass]="data.isDestructive ? 'minimal-warn-btn' : 'minimal-primary-btn'">
          {{ data.confirmText || 'Confirmar' }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .modal-wrapper {
      display: flex;
      flex-direction: column;
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px 32px 16px;

      .header-titles h2 {
        font-size: 18px;
        font-weight: 600;
        color: #111111;
        margin: 0;
        letter-spacing: -0.02em;
      }

      .close-btn {
        color: #999999;
        margin-right: -8px;
        &:hover { color: #111111; background: transparent; }
      }
    }

    .modal-content {
      padding: 16px 32px 24px !important;
      min-width: 400px;
    }

    .confirm-message {
      margin: 0;
      font-size: 14px;
      line-height: 1.5;
      color: #666666;
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 16px 32px 24px;
      margin: 0;

      .minimal-btn {
        color: #666666;
        font-weight: 500;
        border-radius: 6px;
        &:hover:not(:disabled) {
          color: #111111;
          background: #f5f5f5;
        }
      }

      .minimal-primary-btn {
        background-color: #111111 !important;
        color: #ffffff !important;
        border-radius: 8px;
        font-weight: 500;
        padding: 0 20px;
        box-shadow: none;
        
        &:hover:not(:disabled) {
          opacity: 0.9;
        }
      }

      .minimal-warn-btn {
        background-color: #d93025 !important;
        color: #ffffff !important;
        border-radius: 8px;
        font-weight: 500;
        padding: 0 20px;
        box-shadow: none;

        &:hover:not(:disabled) {
          opacity: 0.9;
        }
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialogComponent {
  protected data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
