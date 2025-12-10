import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
  imports: [RouterLink, FormsModule],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.css'
})
export class TodoListComponent implements OnInit, OnDestroy {
  private todoService = inject(TodoService);
  private subscription?: Subscription;

  todos = signal<Todo[]>([]);
  loading = signal(true);
  
  // Search & Filter
  searchQuery = signal('');
  statusFilter = signal<'all' | TodoStatus>('all');

  // Filtered todos based on search and status
  filteredTodos = computed(() => {
    let result = this.todos();
    
    // Apply status filter
    const status = this.statusFilter();
    if (status !== 'all') {
      result = result.filter(todo => todo.status === status);
    }
    
    // Apply search filter
    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      result = result.filter(todo =>
        todo.title.toLowerCase().includes(query) ||
        todo.description.toLowerCase().includes(query)
      );
    }
    
    return result;
  });

  // Grouped todos (uses filtered results)
  groupedTodos = computed<GroupedTodos>(() => {
    const all = this.filteredTodos();
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

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
  }

  onFilterChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value as 'all' | TodoStatus;
    this.statusFilter.set(value);
  }

  clearFilters() {
    this.searchQuery.set('');
    this.statusFilter.set('all');
  }
}
