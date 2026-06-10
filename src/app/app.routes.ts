import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { DashboardComponent } from './components/dashboard/dashboard';
import { AdminComponent } from './components/admin/admin';
import { AdminPollsComponent } from './components/admin-polls/admin-polls';
import { AdminRevealComponent } from './components/admin-reveal/admin-reveal';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout';
import { UserLayoutComponent } from './components/user-layout/user-layout';
import { MyPollComponent } from './components/my-poll/my-poll';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'user', 
    component: UserLayoutComponent, 
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'my-poll', component: MyPollComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { 
    path: 'admin', 
    component: AdminLayoutComponent, 
    canActivate: [authGuard],
    children: [
      { path: 'teams', component: AdminComponent }, // Teams
      { path: 'polls', component: AdminPollsComponent },
      { path: 'reveal', component: AdminRevealComponent },
      { path: '', redirectTo: 'teams', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
