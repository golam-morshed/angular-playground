import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Task } from './models/task.model';
import { TaskService } from './services/task.service';

@Component({
  selector: 'app-task-management',
  templateUrl: './task-management.component.html',
  styleUrls: ['./task-management.component.scss']
})
export class TaskManagementComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];
  private destroy$ = new Subject<void>();

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    // Subscribe to tasks$
    this.taskService.tasks$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(tasks => {
      this.tasks = tasks;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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

