import { Component, signal } from '@angular/core';
import { TodoListComponent } from '../todo-list/todo-list.component';
import { TodoFormComponent } from '../todo-form/todo-form.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TodoListComponent, TodoFormComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  activeTab = signal<'list' | 'add'>('list');

  setTab(tab: 'list' | 'add') {
    this.activeTab.set(tab);
  }
}
