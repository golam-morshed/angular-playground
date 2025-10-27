import { Component, EventEmitter, Output } from '@angular/core';
import { TaskStatus } from '../../models/task.model';

@Component({
  selector: 'app-task-filter',
  templateUrl: './task-filter.component.html',
  styleUrls: ['./task-filter.component.scss']
})
export class TaskFilterComponent {
  @Output() filterChange = new EventEmitter<TaskStatus | 'all'>();
  
  selectedFilter: TaskStatus | 'all' = 'all';
  TaskStatus = TaskStatus; // Expose enum to template

  onFilterChange(filter: TaskStatus | 'all'): void {
    this.selectedFilter = filter;
    this.filterChange.emit(filter);
  }
}

