import { Component, OnInit, inject, signal } from '@angular/core';
import { ProjectsService } from '../../services/projects.service';
import { Project, ProjectResponse } from '../../models/project.interface';

@Component({
  selector: 'app-project-list',
  standalone: true,
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.scss',
})
export class ProjectListComponent implements OnInit {
  private projectsService = inject(ProjectsService);

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
    })
  }
}