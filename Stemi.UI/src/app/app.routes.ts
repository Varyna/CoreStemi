import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { LoginComponent } from './components/login/login.component';
import { StudentProfileComponent } from './components/student-profile/student-profile.component';
import { AdminComponent } from './components/admin/admin.component';
import { UserRole } from './models/auth.model';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  // Студентская часть
  {
    path: 'dashboard',
    component: StudentProfileComponent,
    canActivate: [RoleGuard],
    data: { roles: [UserRole.STUDENT] }
  },

  // Административная часть
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [RoleGuard],
    data: { roles: [UserRole.ADMIN] }
  },

  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];
