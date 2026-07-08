import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { SprintsService } from '../../services/sprints.service';
import { NotificationService } from '../../../../shared/services/notification.service';
import { CreateSprintDto } from '../../models/sprint.interface';

@Component({
  selector: 'app-sprint-create-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './sprint-create-dialog.component.html',
  styleUrl: './sprint-create-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SprintCreateDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<SprintCreateDialogComponent>);
  private readonly sprintsService = inject(SprintsService);
  private readonly notificationService = inject(NotificationService);
  protected data = inject<{ projectId: number }>(MAT_DIALOG_DATA);

  readonly isLoading = signal(false);

  readonly form = this.fb.group({
    name: ['', [Validators.required]],
    startDate: [new Date(), [Validators.required]],
    endDate: [new Date(), [Validators.required]],
    goal: ['', [Validators.required]],
    status: ['PENDING', [Validators.required]]
  }, { validators: this.dateRangeValidator });

  ngOnInit(): void {
    if (!this.data || !this.data.projectId) {
      this.notificationService.error('Falta el ID del proyecto.');
      this.dialogRef.close();
    }
  }

  dateRangeValidator(group: AbstractControl): ValidationErrors | null {
    const start = group.get('startDate')?.value;
    const end = group.get('endDate')?.value;
    if (start && end && start > end) {
      return { dateRangeInvalid: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    const values = this.form.value;
    const dto: CreateSprintDto = {
      projectId: this.data.projectId,
      name: values.name!,
      startDate: values.startDate!.toISOString(),
      endDate: values.endDate!.toISOString(),
      goal: values.goal!,
      status: values.status as 'PENDING' | 'ACTIVE' | 'COMPLETED'
    };

    this.sprintsService.createSprint(dto).subscribe({
      next: (response) => {
        this.notificationService.success('Sprint creado con éxito');
        this.isLoading.set(false);
        this.dialogRef.close(response.data);
      },
      error: (err) => {
        console.error('Error creating sprint', err);
        const errorMsg = err.error?.message || 'Ya existe un sprint activo o hubo un error.';
        this.notificationService.error(errorMsg);
        this.isLoading.set(false);
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
