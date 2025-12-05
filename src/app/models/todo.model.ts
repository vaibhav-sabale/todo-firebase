import { Timestamp } from 'firebase/firestore';

export type TodoStatus = 'pending' | 'in-progress' | 'completed';

export interface Todo {
  id?: string;
  title: string;
  description: string;
  status: TodoStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface TodoFormData {
  title: string;
  description: string;
  status: TodoStatus;
}
