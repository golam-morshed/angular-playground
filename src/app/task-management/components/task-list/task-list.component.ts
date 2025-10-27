import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task, TaskStatus } from '../../models/task.model';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent {
  @Input() tasks: Task[] = [];
  @Output() markComplete = new EventEmitter<number>();
  @Output() markOngoing = new EventEmitter<number>();
  @Output() markPending = new EventEmitter<number>();
  @Output() deleteTask = new EventEmitter<number>();

  TaskStatus = TaskStatus; // Expose enum to template

  onMarkComplete(id: number): void {
    this.markComplete.emit(id);
  }

  onMarkOngoing(id: number): void {
    this.markOngoing.emit(id);
  }

  onMarkPending(id: number): void {
    this.markPending.emit(id);
  }

  onDelete(id: number): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.deleteTask.emit(id);
    }
  }
}

