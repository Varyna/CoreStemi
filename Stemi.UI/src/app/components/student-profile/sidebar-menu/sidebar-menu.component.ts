import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <ul class="nav justify-content-center nav-pills flex-column flex-sm-row pb-2">
      <li class="nav-item">
        <a class="nav-link" routerLink="/dashboard/timetable" routerLinkActive="active">
          Расписание
        </a>
      </li>
      
      <!-- Успеваемость -->
      <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button"
          aria-expanded="false">Успеваемость</a>
        <ul class="dropdown-menu">
          <li>
            <a class="dropdown-item" routerLink="/dashboard/session" routerLinkActive="active">
              Сессия
            </a>
          </li>
          <li>
            <hr class="dropdown-divider">
          </li>
        </ul>
      </li>

      <!-- Остальное меню без изменений -->
      <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown"
          data-bs-auto-close="outside">Студентам</a>
        <ul class="dropdown-menu">
          <!-- ... остальное меню ... -->
        </ul>
      </li>

      <!-- ... остальные пункты меню ... -->
      
      <li class="nav-item">
        <a class="nav-link" (click)="logout()">
          Выход
        </a>
      </li>
    </ul>
  `,
  styles: [`
    .nav-pills .nav-link.active {
      background-color: #0064b4;
      color: white;
    }

    .dropdown-submenu {
      position: relative;
    }

    .dropdown-submenu .dropdown-menu {
      top: 0;
      left: 100%;
      margin-top: -1px;
    }

    .nav-link {
      cursor: pointer;
    }
  `]
})
export class SidebarMenuComponent {
  constructor(private router: Router) { }

  logout(): void {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    this.router.navigate(['/login']);
  }
}
