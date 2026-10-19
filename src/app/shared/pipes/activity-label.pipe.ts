import { Pipe, PipeTransform } from '@angular/core';
import { Activity, ActivityAction, ActivityEntity } from '../../features/history/models/activity.interface';

const ENTITY_MAP: Record<ActivityEntity, string> = {
  Task: 'la tarea',
  UserStory: 'la historia de usuario',
  Sprint: 'el sprint',
};

const ACTION_MAP: Record<ActivityAction, string> = {
  CREATE: 'creó',
  UPDATE: 'actualizó',
  DELETE: 'eliminó',
};

@Pipe({
  name: 'activityLabel',
  standalone: true
})
export class ActivityLabelPipe implements PipeTransform {
  transform(activity: Activity): string {
    const entity = ENTITY_MAP[activity.entity] ?? activity.entity.toLowerCase();
    const action = ACTION_MAP[activity.action] ?? activity.action.toLowerCase();
    return `${activity.userName} ${action} ${entity} #${activity.entityId}`;
  }
}
