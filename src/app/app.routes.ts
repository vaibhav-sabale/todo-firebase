import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { TodoFormComponent } from './components/todo-form/todo-form.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'edit/:id', component: TodoFormComponent },
  { path: '**', redirectTo: '' }
];
