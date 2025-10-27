import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task, TaskStatus } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  public tasks$ = this.tasksSubject.asObservable();
  
  private nextId = 7;

  constructor() {
    this.loadInitialTasks();
  }

  private loadInitialTasks(): void {
    const sampleTasks: Task[] = [
      {
        id: 1,
        title: 'Complete Angular Assignment',
        description: 'Finish the task management application using BehaviorSubject',
        status: TaskStatus.PENDING,
        createdDate: '2024-10-25'
      },
      {
        id: 2,
        title: 'Review Pull Requests',
        description: 'Review and merge pending pull requests from team members',
        status: TaskStatus.COMPLETED,
        createdDate: '2024-10-24',
        completedDate: '2024-10-26'
      },
      {
        id: 3,
        title: 'Update Documentation',
        description: 'Update project documentation with latest API changes',
        status: TaskStatus.ONGOING,
        createdDate: '2024-10-26'
      },
      {
        id: 4,
        title: 'Fix Bug #123',
        description: 'Resolve the authentication issue in production',
        status: TaskStatus.COMPLETED,
        createdDate: '2024-10-23',
        completedDate: '2024-10-25'
      },
      {
        id: 5,
        title: 'Prepare Presentation',
        description: 'Create slides for project demo next week',
        status: TaskStatus.PENDING,
        createdDate: '2024-10-27'
      },
      {
        id: 6,
        title: 'Code Review Session',
        description: 'Conduct code review for the new feature implementation',
        status: TaskStatus.ONGOING,
        createdDate: '2024-10-26'
      }
    ];
    
    this.tasksSubject.next(sampleTasks);
  }

  getTasks(): Observable<Task[]> {
    return this.tasks$;
  }

  addTask(task: Omit<Task, 'id'>): void {
    const newTask: Task = { ...task, id: this.nextId++ };
    const currentTasks = this.tasksSubject.value;
    this.tasksSubject.next([...currentTasks, newTask]);
  }

  updateTask(id: number, updates: Partial<Task>): void {
    const currentTasks = this.tasksSubject.value;
    const updatedTasks = currentTasks.map(task => 
      task.id === id ? { ...task, ...updates } : task
    );
    this.tasksSubject.next(updatedTasks);
  }

  deleteTask(id: number): void {
    const currentTasks = this.tasksSubject.value;
    const filteredTasks = currentTasks.filter(task => task.id !== id);
    this.tasksSubject.next(filteredTasks);
  }

  markAsCompleted(id: number): void {
    this.updateTask(id, { 
      status: TaskStatus.COMPLETED,
      completedDate: new Date().toISOString().split('T')[0]
    });
  }

  markAsOngoing(id: number): void {
    this.updateTask(id, { 
      status: TaskStatus.ONGOING,
      completedDate: undefined
    });
  }

  markAsPending(id: number): void {
    this.updateTask(id, { 
      status: TaskStatus.PENDING,
      completedDate: undefined
    });
  }
}

