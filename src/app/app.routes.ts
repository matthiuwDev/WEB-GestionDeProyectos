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
    loadComponent: () => import('./features/projects/pages/project-list/project-list.component').then(m => m.ProjectListComponent)
  },
  {
    path: 'projects/:projectId',
    canActivate: [authGuard],
    loadComponent: () => import('./features/projects/pages/project-shell/project-shell.component'),
    children: [
      {
        path: 'backlog',
        loadComponent: () => import('./features/user-stories/pages/backlog/backlog-page.component')
      },
      {
        path: 'sprints',
        loadComponent: () => import('./features/sprints/pages/sprint-list/sprint-list-page.component')
      },
      {
        path: 'sprints/:sprintId',
        loadComponent: () => import('./features/sprints/pages/sprint-planning/sprint-planning-page.component')
      },
      {
        path: 'active-sprint',
        loadComponent: () => import('./features/sprints/pages/active-sprint/active-sprint-page.component')
      },
      {
        path: 'user-stories/:storyId',
        loadComponent: () => import('./features/user-stories/pages/user-story-detail/user-story-detail.component')
      },
      {
        path: 'users',
        loadComponent: () => import('./features/users/pages/project-users-page/project-users-page.component')
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