import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserService, User, UserImportResult } from '../../services/user.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
                <a class="list-group-item list-group-item-action active" (click)="showSection('overview')">📊 Обзор</a>
                <a class="list-group-item list-group-item-action" (click)="showSection('users')">👥 Управление пользователями</a>
                <a class="list-group-item list-group-item-action">📅 Расписание</a>
                <a class="list-group-item list-group-item-action">💰 Финансы</a>
                <a class="list-group-item list-group-item-action">📈 Отчеты</a>
                <a class="list-group-item list-group-item-action">⚙️ Настройки</a>
              </div>
            </div>
          </div>

          <!-- Main Content -->
          <div class="col-md-9">
            <!-- Overview Section -->
            <div *ngIf="currentSection === 'overview'" class="overview-section">
              <h2>Панель администратора</h2>
              
              <!-- Статистика -->
              <div class="row mb-4">
                <div class="col-md-3">
                  <div class="card text-white bg-primary">
                    <div class="card-body">
                      <h4>{{ users.length }}</h4>
                      <p>Пользователей</p>
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="card text-white bg-success">
                    <div class="card-body">
                      <h4>{{ getUsersByRole('Student').length }}</h4>
                      <p>Студентов</p>
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="card text-white bg-warning">
                    <div class="card-body">
                      <h4>{{ getUsersByRole('Teacher').length }}</h4>
                      <p>Преподавателей</p>
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="card text-white bg-info">
                    <div class="card-body">
                      <h4>{{ getUsersByRole('Admin').length }}</h4>
                      <p>Администраторов</p>
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
                      <button class="btn btn-outline-primary w-100" (click)="showSection('users')">
                        👥 Управление пользователями
                      </button>
                    </div>
                    <div class="col-md-4 mb-3">
                      <button class="btn btn-outline-success w-100" (click)="downloadTemplate()">
                        📥 Скачать шаблон Excel
                      </button>
                    </div>
                    <div class="col-md-4 mb-3">
                      <button class="btn btn-outline-info w-100" (click)="displayImportDialog = true">
                        📊 Импорт из Excel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Users Management Section -->
            <div *ngIf="currentSection === 'users'" class="users-section">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h2>Управление пользователями</h2>
                <div>
                  <button class="btn btn-secondary me-2" (click)="downloadTemplate()">
                    📥 Скачать шаблон
                  </button>
                  <button class="btn btn-success me-2" (click)="displayImportDialog = true">
                    📊 Импорт из Excel
                  </button>
                  <button class="btn btn-danger" 
                          [disabled]="selectedUsers.length === 0"
                          (click)="confirmDeleteSelected()">
                    🗑️ Удалить выбранных ({{selectedUsers.length}})
                  </button>
                </div>
              </div>

              <!-- Таблица пользователей -->
              <div class="card">
                <div class="card-body">
                  <div class="table-responsive">
                    <table class="table table-striped table-hover">
                      <thead>
                        <tr>
                          <th>
                            <input type="checkbox" 
                                  [checked]="isAllSelected()"
                                  (change)="toggleSelectAll($event)">
                          </th>
                          <th>Имя пользователя</th>
                          <th>Email</th>
                          <th>Роли</th>
                          <th>Дата создания</th>
                          <th>Действия</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr *ngFor="let user of users" 
                            [class.table-active]="isSelected(user)">
                          <td>
                            <input type="checkbox" 
                                  [checked]="isSelected(user)"
                                  (change)="toggleUserSelection(user)">
                          </td>
                          <td>{{ user.userName }}</td>
                          <td>{{ user.email }}</td>
                          <td>
                            <span *ngFor="let role of user.roles" 
                                  class="badge me-1"
                                  [ngClass]="getRoleBadgeClass(role)">
                              {{ role }}
                            </span>
                          </td>
                          <td>{{ user.createdAt | date:'dd.MM.yyyy HH:mm' }}</td>
                          <td>
                            <button class="btn btn-sm btn-outline-primary me-1" title="Редактировать">
                              ✏️
                            </button>
                            <button class="btn btn-sm btn-outline-danger" 
                                    title="Удалить"
                                    (click)="confirmDeleteUser(user)">
                              🗑️
                            </button>
                          </td>
                        </tr>
                        <tr *ngIf="users.length === 0">
                          <td colspan="6" class="text-center p-4 text-muted">
                            <div>👥</div>
                            <p class="mt-2">Пользователи не найдены</p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <!-- Пагинация -->
                  <div class="d-flex justify-content-between align-items-center mt-3">
                    <div>
                      Показано {{ users.length }} пользователей
                    </div>
                    <div>
                      <button class="btn btn-sm btn-outline-secondary me-1" disabled>Назад</button>
                      <button class="btn btn-sm btn-outline-secondary" disabled>Вперед</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Диалог импорта -->
      <div *ngIf="displayImportDialog" class="modal show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5);">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Импорт пользователей из Excel</h5>
              <button type="button" class="btn-close" (click)="onImportDialogHide()"></button>
            </div>
            <div class="modal-body">
              <!-- Загрузка файла -->
              <div class="mb-3">
                <label for="fileInput" class="form-label">Выберите Excel файл</label>
                <input #fileInput type="file" class="form-control" 
                      accept=".xlsx,.xls" 
                      (change)="onFileSelect($event)"
                      [disabled]="importLoading">
                <div class="form-text">Поддерживаемые форматы: .xlsx, .xls. Максимальный размер: 10MB</div>
              </div>

              <!-- Выбранный файл -->
              <div *ngIf="uploadedFile" class="mb-3">
                <div class="alert alert-info d-flex align-items-center">
                  <span class="me-2">📄</span>
                  <div>
                    <strong>Выбран файл:</strong> {{ uploadedFile.name }}
                    <br>
                    <small>Размер: {{ (uploadedFile.size / 1024 / 1024).toFixed(2) }} MB</small>
                  </div>
                </div>
              </div>

              <!-- Кнопка выбора файла (альтернатива) -->
              <div class="mb-3">
                <button class="btn btn-outline-primary w-100" (click)="fileInput.click()">
                  📁 Выбрать файл Excel
                </button>
              </div>

              <!-- Результат импорта -->
              <div *ngIf="importResult" class="import-result p-3 bg-light rounded">
                <h6>Результат импорта:</h6>
                <p><strong>Всего строк:</strong> {{ importResult.totalRows }}</p>
                <p class="text-success"><strong>Успешно:</strong> {{ importResult.successfullyImported }}</p>
                <p class="text-danger"><strong>Ошибок:</strong> {{ importResult.failed }}</p>

                <!-- Список ошибок -->
                <div *ngIf="importResult.errors.length > 0" class="errors-list mt-3">
                  <h6>Ошибки импорта:</h6>
                  <div class="border rounded p-2" style="max-height: 200px; overflow-y: auto;">
                    <ul class="list-unstyled mb-0">
                      <li *ngFor="let error of importResult.errors.slice(0, 10)" 
                          class="text-danger small mb-1">
                        ❌ {{ error }}
                      </li>
                    </ul>
                    <p *ngIf="importResult.errors.length > 10" class="text-muted small mt-2">
                      ... и еще {{ importResult.errors.length - 10 }} ошибок
                    </p>
                  </div>
                </div>

                <!-- Импортированные пользователи -->
                <div *ngIf="importResult.importedUsers.length > 0" class="imported-users mt-3">
                  <h6>Импортированные пользователи:</h6>
                  <div class="border rounded p-2" style="max-height: 150px; overflow-y: auto;">
                    <ul class="list-unstyled mb-0">
                      <li *ngFor="let user of importResult.importedUsers.slice(0, 5)" 
                          class="text-success small mb-1">
                        ✅ {{ user.userName }} ({{ user.email }})
                      </li>
                    </ul>
                    <p *ngIf="importResult.importedUsers.length > 5" class="text-muted small mt-2">
                      ... и еще {{ importResult.importedUsers.length - 5 }} пользователей
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" 
                      (click)="onImportDialogHide()"
                      [disabled]="importLoading">
                Отмена
              </button>
              <button type="button" class="btn btn-success" 
                      (click)="onImport()"
                      [disabled]="!uploadedFile || importLoading">
                <span *ngIf="importLoading" class="spinner-border spinner-border-sm me-2"></span>
                {{ importLoading ? 'Импорт...' : 'Импортировать' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Уведомления -->
      <div *ngIf="notification.show" 
           class="alert alert-dismissible fade show position-fixed top-0 end-0 m-3"
           [ngClass]="'alert-' + notification.type"
           style="z-index: 9999; max-width: 400px;">
        <strong>{{ notification.title }}</strong> {{ notification.message }}
        <button type="button" class="btn-close" (click)="hideNotification()"></button>
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
      cursor: pointer;
    }
    .list-group-item.active {
      background-color: #0064b4;
      border-color: #0064b4;
    }
    .list-group-item:hover:not(.active) {
      background-color: #e9ecef;
    }
    .badge-admin {
      background-color: #dc3545;
    }
    .badge-teacher {
      background-color: #ffc107;
      color: #000;
    }
    .badge-student {
      background-color: #0dcaf0;
    }
    .table th {
      border-top: none;
      font-weight: 600;
    }
    .modal {
      z-index: 1050;
    }
  `]
})
export class AdminComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;

  currentUser: any = null;
  currentSection = 'overview';

  // Users management
  users: User[] = [];
  selectedUsers: User[] = [];
  loading = false;

  // Import functionality
  displayImportDialog = false;
  uploadedFile: File | null = null;
  importResult: UserImportResult | null = null;
  importLoading = false;

  // Notification
  notification = {
    show: false,
    type: 'success',
    title: '',
    message: ''
  };

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();

    // Проверяем права администратора
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/dashboard']);
      return;
    }

    this.loadUsers();
  }

  showSection(section: string): void {
    this.currentSection = section;
    if (section === 'users') {
      this.loadUsers();
    }
  }

  // Users management methods
  loadUsers(): void {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: (error) => {
        console.error('Ошибка загрузки пользователей:', error);
        this.showError('Ошибка загрузки пользователей');
        this.loading = false;
      }
    });
  }

  getUsersByRole(role: string): User[] {
    return this.users.filter(user => user.roles.includes(role));
  }

  getRoleBadgeClass(role: string): string {
    switch (role) {
      case 'Admin': return 'badge-admin';
      case 'Teacher': return 'badge-teacher';
      case 'Student': return 'badge-student';
      default: return 'badge-secondary';
    }
  }

  // Selection methods
  isSelected(user: User): boolean {
    return this.selectedUsers.some(u => u.id === user.id);
  }

  isAllSelected(): boolean {
    return this.users.length > 0 && this.selectedUsers.length === this.users.length;
  }

  toggleUserSelection(user: User): void {
    const index = this.selectedUsers.findIndex(u => u.id === user.id);
    if (index > -1) {
      this.selectedUsers.splice(index, 1);
    } else {
      this.selectedUsers.push(user);
    }
  }

  toggleSelectAll(event: any): void {
    if (event.target.checked) {
      this.selectedUsers = [...this.users];
    } else {
      this.selectedUsers = [];
    }
  }

  // Import methods
  onFileSelect(event: any): void {
    const file = event.target.files?.[0];
    if (file) {
      // Проверка типа файла
      const allowedTypes = ['.xlsx', '.xls'];
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

      if (!allowedTypes.includes(fileExtension)) {
        this.showError('Выберите файл Excel (.xlsx или .xls)');
        this.fileInput.nativeElement.value = '';
        return;
      }

      // Проверка размера файла (10MB)
      if (file.size > 10 * 1024 * 1024) {
        this.showError('Размер файла не должен превышать 10MB');
        this.fileInput.nativeElement.value = '';
        return;
      }

      this.uploadedFile = file;
      this.importResult = null; // Сбрасываем предыдущие результаты
    }
  }

  onImport(): void {
    if (!this.uploadedFile) {
      this.showWarn('Выберите файл для импорта');
      return;
    }

    this.importLoading = true;
    this.userService.importUsersFromExcel(this.uploadedFile).subscribe({
      next: (result) => {
        this.importResult = result;
        this.importLoading = false;

        if (result.successfullyImported > 0) {
          this.showSuccess(`Успешно импортировано ${result.successfullyImported} пользователей`);
          this.loadUsers();
        }

        if (result.failed > 0) {
          this.showWarn(`Не удалось импортировать ${result.failed} пользователей`);
        }
      },
      error: (error) => {
        console.error('Ошибка импорта:', error);
        this.showError('Ошибка при импорте пользователей');
        this.importLoading = false;
      }
    });
  }

  downloadTemplate(): void {
    this.userService.downloadTemplate().subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Users_Import_Template.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
        this.showSuccess('Шаблон успешно скачан');
      },
      error: (error) => {
        console.error('Ошибка скачивания шаблона:', error);
        this.showError('Ошибка при скачивании шаблона');
      }
    });
  }

  onImportDialogHide(): void {
    this.uploadedFile = null;
    this.importResult = null;
    this.displayImportDialog = false;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  // Delete methods
  confirmDeleteUser(user: User): void {
    if (confirm(`Вы уверены, что хотите удалить пользователя "${user.userName}"?`)) {
      this.deleteUser(user);
    }
  }

  confirmDeleteSelected(): void {
    if (this.selectedUsers.length === 0) return;

    if (confirm(`Вы уверены, что хотите удалить выбранных пользователей (${this.selectedUsers.length})?`)) {
      this.deleteSelectedUsers();
    }
  }

  deleteUser(user: User): void {
    this.userService.deleteUser(user.id).subscribe({
      next: () => {
        this.showSuccess('Пользователь успешно удален');
        this.loadUsers();
      },
      error: (error) => {
        console.error('Ошибка удаления:', error);
        this.showError('Ошибка при удалении пользователя');
      }
    });
  }

  deleteSelectedUsers(): void {
    this.loading = true;
    const deletePromises = this.selectedUsers.map(user =>
      this.userService.deleteUser(user.id).toPromise()
    );

    Promise.all(deletePromises).then(() => {
      this.showSuccess('Пользователи успешно удалены');
      this.loadUsers();
      this.selectedUsers = [];
      this.loading = false;
    }).catch(error => {
      console.error('Ошибка удаления:', error);
      this.showError('Ошибка при удалении пользователей');
      this.loading = false;
    });
  }

  // Notification methods
  private showSuccess(message: string): void {
    this.showNotification('success', 'Успешно', message);
  }

  private showError(message: string): void {
    this.showNotification('danger', 'Ошибка', message);
  }

  private showWarn(message: string): void {
    this.showNotification('warning', 'Внимание', message);
  }

  private showNotification(type: string, title: string, message: string): void {
    this.notification = {
      show: true,
      type,
      title,
      message
    };

    // Автоматически скрыть через 5 секунд
    setTimeout(() => {
      this.hideNotification();
    }, 5000);
  }

  hideNotification(): void {
    this.notification.show = false;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
