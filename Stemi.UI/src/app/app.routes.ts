import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { LoginComponent } from './components/login/login.component';
import { StudentProfileComponent } from './components/student-profile/student-profile.component';
import { AdminComponent } from './components/admin/admin.component';
import { UserRole } from './models/auth.model';

// Импортируем компоненты для дочерних маршрутов
import { TimetableComponent } from './components/student-profile/timetable/timetable.component';
import { SessionComponent } from './components/student-profile/session/session.component';
import { WelcomeContentComponent } from './components/student-profile/welcome-content/welcome-content.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },

  // Студентская часть с дочерними маршрутами
  {
    path: 'dashboard',
    component: StudentProfileComponent,
    canActivate: [RoleGuard],
    data: { roles: [UserRole.STUDENT] },
    children: [
      {
        path: '',
        component: WelcomeContentComponent
      },
      {
        path: 'timetable',
        component: TimetableComponent
      },
      {
        path: 'session',
        component: SessionComponent
      },
      // Можно добавить другие дочерние маршруты позже
      {
        path: '**',
        redirectTo: ''
      }
    ]
  },

  // Административная часть
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [RoleGuard],
    data: { roles: [UserRole.ADMIN] }
  },

  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
