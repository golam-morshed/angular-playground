export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  createdDate: string;
  completedDate?: string;
}

export enum TaskStatus {
  PENDING = 'pending',
  ONGOING = 'ongoing',
  COMPLETED = 'completed'
}

