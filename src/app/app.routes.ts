import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'login', 
    pathMatch: 'full' 
  },
  // Ruta dinámica del login
  { 
    path: 'login', 
    loadComponent: () => import('./features/auth/components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'projects',
    canActivate: [authGuard],
    loadComponent: () => import('./features/projects/components/project-list/project-list.component').then(m => m.ProjectListComponent)
  },
  {
    path: 'projects/:projectId',
    canActivate: [authGuard],
    loadComponent: () => import('./features/projects/pages/project-shell/project-shell.component'),
    children: [
      {
        path: 'backlog',
        loadComponent: () => import('./features/projects/pages/backlog/backlog-page.component')
      },
      {
        path: 'sprints',
        loadComponent: () => import('./features/projects/pages/sprint-list/sprint-list-page.component')
      },
      {
        path: 'active-sprint',
        loadComponent: () => import('./features/projects/pages/active-sprint/active-sprint-page.component')
      },
      {
        path: '',
        redirectTo: 'backlog',
        pathMatch: 'full'
      }
    ]
  },
  { 
    path: '**', 
    redirectTo: 'login' 
  }
];