import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { TodoService } from '../../services/todo.service';
import { Todo, TodoStatus } from '../../models/todo.model';
import { Timestamp } from 'firebase/firestore';

interface GroupedTodos {
  today: Todo[];
  yesterday: Todo[];
  older: Todo[];
}

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.css'
})
export class TodoListComponent implements OnInit, OnDestroy {
  private todoService = inject(TodoService);
  private subscription?: Subscription;

  todos = signal<Todo[]>([]);
  loading = signal(true);

  groupedTodos = computed<GroupedTodos>(() => {
    const all = this.todos();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    return {
      today: all.filter(t => this.getDate(t.createdAt) >= today),
      yesterday: all.filter(t => {
        const d = this.getDate(t.createdAt);
        return d >= yesterday && d < today;
      }),
      older: all.filter(t => this.getDate(t.createdAt) < yesterday)
    };
  });

  ngOnInit() {
    this.subscription = this.todoService.getTodos().subscribe({
      next: (todos) => {
        this.todos.set(todos);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  private getDate(timestamp: Timestamp): Date {
    return timestamp?.toDate?.() ?? new Date(0);
  }

  formatDate(timestamp: Timestamp): string {
    const date = this.getDate(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  async deleteTodo(todo: Todo) {
    if (todo.id && confirm('Delete this todo?')) {
      await this.todoService.deleteTodo(todo.id);
    }
  }

  getStatusClass(status: TodoStatus): string {
    return `status-${status}`;
  }
}
