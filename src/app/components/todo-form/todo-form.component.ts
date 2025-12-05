import { Component, inject, signal, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { TodoService } from '../../services/todo.service';
import { TodoStatus } from '../../models/todo.model';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './todo-form.component.html',
  styleUrl: './todo-form.component.css'
})
export class TodoFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private todoService = inject(TodoService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  todoId = signal<string | null>(null);
  isEditMode = signal(false);
  loading = signal(false);
  submitting = signal(false);
  successMessage = signal<string | null>(null);

  form: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required]],
    status: ['pending' as TodoStatus, [Validators.required]]
  });

  statuses: { value: TodoStatus; label: string }[] = [
    { value: 'pending', label: '⏳ Pending' },
    { value: 'in-progress', label: '🔄 In Progress' },
    { value: 'completed', label: '✅ Completed' }
  ];

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.todoId.set(id);
      this.isEditMode.set(true);
      this.loadTodo(id);
    }
  }

  private loadTodo(id: string) {
    this.loading.set(true);
    this.todoService.getTodos().subscribe({
      next: (todos) => {
        const todo = todos.find(t => t.id === id);
        if (todo) {
          this.form.patchValue({
            title: todo.title,
            description: todo.description,
            status: todo.status
          });
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    const data = this.form.value;

    try {
      if (this.isEditMode() && this.todoId()) {
        await this.todoService.updateTodo(this.todoId()!, data);
        this.router.navigate(['/']);
      } else {
        await this.todoService.addTodo(data);
        this.form.reset({ status: 'pending' });
        this.successMessage.set('Todo added successfully!');
        setTimeout(() => this.successMessage.set(null), 3000);
      }
    } catch {
      // Error handling
    } finally {
      this.submitting.set(false);
    }
  }

  get f() {
    return this.form.controls;
  }
}
