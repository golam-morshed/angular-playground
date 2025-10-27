import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Task, TaskStatus } from './models/task.model';
import { TaskService } from './services/task.service';

@Component({
  selector: 'app-task-management',
  templateUrl: './task-management.component.html',
  styleUrls: ['./task-management.component.scss']
})
export class TaskManagementComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  currentFilter: TaskStatus | 'all' = 'all';
  private destroy$ = new Subject<void>();

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    // Subscribe to tasks$ and apply current filter
    this.taskService.tasks$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(tasks => {
      this.tasks = tasks;
      this.applyFilter(this.currentFilter);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onFilterChange(filter: TaskStatus | 'all'): void {
    this.currentFilter = filter;
    this.applyFilter(filter);
  }

  applyFilter(filter: TaskStatus | 'all'): void {
    if (filter === 'all') {
      this.filteredTasks = this.tasks;
    } else {
      this.filteredTasks = this.tasks.filter(task => task.status === filter);
    }
  }

  onMarkComplete(id: number): void {
    this.taskService.markAsCompleted(id);
  }

  onMarkOngoing(id: number): void {
    this.taskService.markAsOngoing(id);
  }

  onMarkPending(id: number): void {
    this.taskService.markAsPending(id);
  }

  onDeleteTask(id: number): void {
    this.taskService.deleteTask(id);
  }
}

