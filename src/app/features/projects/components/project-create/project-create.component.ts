import { Component, OnInit, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ProjectsService } from '../../services/projects.service';
import { Project, CreateProjectResponse } from '../../models/project.interface';

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
export class ProjectCreateComponent implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  private projectsService = inject(ProjectsService);
  private dialogRef = inject(MatDialogRef<ProjectCreateComponent>);
  protected data = inject<Project | null>(MAT_DIALOG_DATA);

  isLoading = signal(false);
  isEditMode = signal(false);

  projectForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required]],
    priority: [3, [Validators.required, Validators.min(1), Validators.max(5)]]
  });

  ngOnInit(): void {
    if (this.data) {
      this.isEditMode.set(true);
      this.projectForm.patchValue({
        name: this.data.name,
        description: this.data.description,
        priority: this.data.priority
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      this.isLoading.set(true);
      const projectData = this.projectForm.getRawValue();
      console.log("Datos del proyecto a enviar: ", projectData);
      
      const request$ = this.isEditMode() && this.data
        ? this.projectsService.updateProject(this.data.id, projectData)
        : this.projectsService.createProject(projectData);
      console.log("Observable de la solicitud: ", request$);
      request$.subscribe({
        next: (response: CreateProjectResponse) => {
          this.isLoading.set(false);
          this.dialogRef.close(response.data);
        },
        error: (err) => {
          this.isLoading.set(false);
          console.error(`Error al ${this.isEditMode() ? 'actualizar' : 'crear'} el proyecto`, err);
        }
      });
    } else {
      this.projectForm.markAllAsTouched();
    }
  }
}
