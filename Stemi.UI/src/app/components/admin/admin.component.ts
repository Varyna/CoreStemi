import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-dashboard">
      <!-- Admin Header -->
      <nav class="navbar navbar-dark bg-dark">
        <div class="container">
          <span class="navbar-brand">
            <img src="assets/img/logo_stemi.png" height="40" class="me-2">
            Административная панель
          </span>
          <div class="navbar-nav ms-auto">
            <div class="nav-item dropdown">
              <a class="nav-link dropdown-toggle text-white" href="#" role="button" data-bs-toggle="dropdown">
                👨‍💼 {{currentUser?.userName}}
              </a>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="#">Профиль</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item text-danger" (click)="logout()">Выйти</a></li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      <!-- Admin Content -->
      <div class="container-fluid mt-4">
        <div class="row">
          <!-- Sidebar -->
          <div class="col-md-3">
            <div class="card">
              <div class="card-header bg-primary text-white">
                <h6 class="mb-0">Панель управления</h6>
              </div>
              <div class="list-group list-group-flush">
                <a class="list-group-item list-group-item-action active">📊 Обзор</a>
                <a class="list-group-item list-group-item-action">👥 Управление студентами</a>
                <a class="list-group-item list-group-item-action">📅 Расписание</a>
                <a class="list-group-item list-group-item-action">💰 Финансы</a>
                <a class="list-group-item list-group-item-action">📈 Отчеты</a>
                <a class="list-group-item list-group-item-action">⚙️ Настройки</a>
              </div>
            </div>
          </div>

          <!-- Main Content -->
          <div class="col-md-9">
            <h2>Панель администратора</h2>
            
            <!-- Статистика -->
            <div class="row mb-4">
              <div class="col-md-3">
                <div class="card text-white bg-primary">
                  <div class="card-body">
                    <h4>1,248</h4>
                    <p>Студентов</p>
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="card text-white bg-success">
                  <div class="card-body">
                    <h4>45</h4>
                    <p>Преподавателей</p>
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="card text-white bg-warning">
                  <div class="card-body">
                    <h4>12.5M ₽</h4>
                    <p>Общая оплата</p>
                  </div>
                </div>
              </div>
              <div class="col-md-3">
                <div class="card text-white bg-info">
                  <div class="card-body">
                    <h4>96%</h4>
                    <p>Успеваемость</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Быстрые действия -->
            <div class="card">
              <div class="card-header">
                <h5 class="mb-0">Быстрые действия</h5>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="col-md-4 mb-3">
                    <button class="btn btn-outline-primary w-100">
                      📝 Добавить студента
                    </button>
                  </div>
                  <div class="col-md-4 mb-3">
                    <button class="btn btn-outline-success w-100">
                      📅 Создать расписание
                    </button>
                  </div>
                  <div class="col-md-4 mb-3">
                    <button class="btn btn-outline-info w-100">
                      📊 Сгенерировать отчет
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Последние действия -->
            <div class="card mt-4">
              <div class="card-header">
                <h5 class="mb-0">Последние действия</h5>
              </div>
              <div class="card-body">
                <ul class="list-group">
                  <li class="list-group-item">Новый студент зарегистрирован - 5 мин назад</li>
                  <li class="list-group-item">Обновлено расписание группы ИТ-21 - 1 час назад</li>
                  <li class="list-group-item">Получена оплата от Петрова А.С. - 2 часа назад</li>
                  <li class="list-group-item">Добавлен новый преподаватель - 3 часа назад</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-dashboard {
      min-height: 100vh;
      background-color: #f8f9fa;
    }
    .list-group-item {
      border: none;
      padding: 1rem 1.25rem;
    }
    .list-group-item.active {
      background-color: #0064b4;
      border-color: #0064b4;
    }
  `]
})
export class AdminComponent implements OnInit {
  currentUser: any = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();

    // Проверяем права администратора
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/dashboard']);
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
