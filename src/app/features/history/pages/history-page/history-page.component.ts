import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

import { HistoryService } from '../../services/history.service';
import { ProjectContextService } from '../../../../core/services/project-context.service';
import { ActivityLabelPipe } from '../../../../shared/pipes/activity-label.pipe';
import { Activity, ActivityAction, ActivityEntity, ActivityFilters } from '../../models/activity.interface';

@Component({
  selector: 'app-history-page',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTooltipModule,
    ActivityLabelPipe
  ],
  templateUrl: './history-page.component.html',
  styleUrl: './history-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HistoryPageComponent implements OnInit {
  private readonly historyService = inject(HistoryService);
  private readonly projectContext = inject(ProjectContextService);

  readonly activities = signal<Activity[]>([]);
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);
  readonly totalLoaded = signal(0);

  readonly filterEntity = signal<ActivityEntity | ''>('');
  readonly filterAction = signal<ActivityAction | ''>('');

  readonly displayedColumns: string[] = ['user', 'action', 'entity', 'description', 'date'];

  ngOnInit(): void {
    this.loadHistory();
  }

  // Cada cambio de filtro dispara una nueva petición al servidor
  onEntityChange(value: ActivityEntity | ''): void {
    this.filterEntity.set(value);
    this.loadHistory();
  }

  onActionChange(value: ActivityAction | ''): void {
    this.filterAction.set(value);
    this.loadHistory();
  }

  loadHistory(): void {
    const projectId = this.projectContext.projectId();
    if (!projectId) return;

    const filters: ActivityFilters = { limit: 50 };
    const entity = this.filterEntity();
    const action = this.filterAction();
    if (entity) filters.entity = entity;
    if (action) filters.action = action;

    this.isLoading.set(true);
    this.error.set(null);

    this.historyService.getProjectHistory(projectId, filters).subscribe({
      next: (res) => {
        this.activities.set(res.data ?? []);
        this.totalLoaded.set(res.data?.length ?? 0);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar el historial. Verifica tu conexión e intenta de nuevo.');
        this.isLoading.set(false);
      }
    });
  }

  //Helpers para la tabla
  getActionChipClass(action: string): string {
    const map: Record<string, string> = {
      CREATE: 'chip-create',
      UPDATE: 'chip-update',
      DELETE: 'chip-delete',
      ASSIGN: 'chip-assign'
    };
    return map[action] ?? '';
  }

  getActionLabel(action: string): string {
    const map: Record<string, string> = {
      CREATE: 'Creación',
      UPDATE: 'Actualización',
      DELETE: 'Eliminación',
      ASSIGN: 'Asignación'
    };
    return map[action] ?? action;
  }

  getEntityLabel(entity: string): string {
    const map: Record<string, string> = {
      Task: 'Tarea',
      UserStory: 'Historia de Usuario',
      Sprint: 'Sprint'
    };
    return map[entity] ?? entity;
  }

  getEntityIcon(entity: string): string {
    const map: Record<string, string> = {
      Task: 'task_alt',
      UserStory: 'auto_stories',
      Sprint: 'view_carousel'
    };
    return map[entity] ?? 'description';
  }

  formatChanges(changes: Record<string, unknown> | null): string {
    if (!changes) return '';
    return Object.entries(changes)
      .filter(([k]) => k !== 'projectId')
      .map(([k, v]) => `${k}: ${v}`)
      .join(', ');
  }
}
