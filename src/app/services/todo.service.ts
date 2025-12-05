import { Injectable, inject } from '@angular/core';
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp
} from 'firebase/firestore';
import { Observable } from 'rxjs';
import { Todo, TodoFormData, TodoStatus } from '../models/todo.model';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private firebase = inject(FirebaseService);

  getTodos(): Observable<Todo[]> {
    return new Observable<Todo[]>(subscriber => {
      const todosRef = collection(this.firebase.db, 'todos');
      const q = query(todosRef);
      
      const unsubscribe = onSnapshot(q, 
        (snapshot) => {
          const todos: Todo[] = [];
          snapshot.forEach((docSnap) => {
            todos.push({ id: docSnap.id, ...docSnap.data() } as Todo);
          });
          subscriber.next(todos);
        },
        (error) => {
          subscriber.error(error);
        }
      );

      return () => unsubscribe();
    });
  }

  async addTodo(data: TodoFormData): Promise<void> {
    const todosRef = collection(this.firebase.db, 'todos');
    const now = Timestamp.now();
    await addDoc(todosRef, {
      ...data,
      createdAt: now,
      updatedAt: now
    });
  }

  async updateTodo(id: string, data: Partial<TodoFormData>): Promise<void> {
    const todoDoc = doc(this.firebase.db, 'todos', id);
    await updateDoc(todoDoc, {
      ...data,
      updatedAt: Timestamp.now()
    });
  }

  async updateStatus(id: string, status: TodoStatus): Promise<void> {
    await this.updateTodo(id, { status });
  }

  async deleteTodo(id: string): Promise<void> {
    const todoDoc = doc(this.firebase.db, 'todos', id);
    await deleteDoc(todoDoc);
  }
}
