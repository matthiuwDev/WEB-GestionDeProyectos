import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Sprint } from '../../models/sprint.interface';
import { MatTooltipModule } from '@angular/material/tooltip';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sprint-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, DatePipe, MatTooltipModule, RouterModule],
  templateUrl: './sprint-card.component.html',
  styleUrl: './sprint-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SprintCardComponent {
  sprint = input.required<Sprint>();

  onDelete = output<Sprint>();
}
