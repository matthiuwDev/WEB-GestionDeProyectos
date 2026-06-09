import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ProjectsService } from '../../services/projects.service';
import { CreateProjectResponse } from '../../models/project.interface';

@Component({
  selector: 'app-project-create',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './project-create.component.html',
  styleUrl: './project-create.component.scss'
})
export class ProjectCreateComponent {
  private fb = inject(NonNullableFormBuilder);
  private projectsService = inject(ProjectsService);
  private dialogRef = inject(MatDialogRef<ProjectCreateComponent>);

  isLoading = signal(false);

  projectForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required]],
    priority: [3, [Validators.required, Validators.min(1), Validators.max(5)]]
  });

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      this.isLoading.set(true);
      this.projectsService.createProject(this.projectForm.getRawValue()).subscribe({
        next: (response: CreateProjectResponse) => {
          this.isLoading.set(false);
          this.dialogRef.close(response.data);
        },
        error: (err) => {
          this.isLoading.set(false);
          console.error('Error al crear el proyecto', err);
        }
      });
    } else {
      this.projectForm.markAllAsTouched();
    }
  }
}
