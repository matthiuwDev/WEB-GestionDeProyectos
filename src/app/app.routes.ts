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
    path: '**', 
    redirectTo: 'login' 
  }
];