import { Component, OnInit, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProjectsService } from '../../services/projects.service';
import { Project, ProjectResponse } from '../../models/project.interface';
import { ProjectCreateComponent } from '../project-create/project-create.component';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.scss',
})
export class ProjectListComponent implements OnInit {
  private projectsService = inject(ProjectsService);
  private dialog = inject(MatDialog);

  projects = signal<Project[]>([]);
  isLoading = signal<boolean>(false);

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects(): void {
    this.isLoading.set(true);
    this.projectsService.getProjects().subscribe({
      next: (response: ProjectResponse) => { 
        this.projects.set(response.data); 
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar proyectos', err);
        this.isLoading.set(false);
      }
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(ProjectCreateComponent, {
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Update signals reactively
        this.projects.update(currentProjects => [result, ...currentProjects]);
      }
    });
  }
}