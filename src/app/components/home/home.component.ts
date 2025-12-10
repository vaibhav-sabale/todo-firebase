import { Component, signal, OnInit } from '@angular/core';
import { TodoListComponent } from '../todo-list/todo-list.component';
import { TodoFormComponent } from '../todo-form/todo-form.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TodoListComponent, TodoFormComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  activeTab = signal<'list' | 'add'>('list');
  darkMode = signal(false);

  ngOnInit() {
    // Check saved preference
    const saved = localStorage.getItem('darkMode');
    if (saved === 'true') {
      this.darkMode.set(true);
      document.body.classList.add('dark-mode');
    }
  }

  setTab(tab: 'list' | 'add') {
    this.activeTab.set(tab);
  }

  toggleDarkMode() {
    const newValue = !this.darkMode();
    this.darkMode.set(newValue);
    document.body.classList.toggle('dark-mode', newValue);
    localStorage.setItem('darkMode', String(newValue));
  }
}
