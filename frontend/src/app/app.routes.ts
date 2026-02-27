import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { TaskListComponent } from './task-list/task-list/task-list.component'
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
{path:'login', component: LoginComponent},
{path: 'register', component: RegisterComponent},
{path:'tasks', component :TaskListComponent,
    canActivate:[authGuard]
},
{path:'', redirectTo: '/login', pathMatch: 'full'}

];
