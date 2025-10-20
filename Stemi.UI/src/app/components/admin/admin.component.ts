import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { UserService, User } from '../../services/user.service';
import { LessonService, LessonDto, ImportResultDto } from '../../services/lesson.service';
import { AdminHeaderComponent } from './admin-header/admin-header.component';
import { AdminSidebarComponent } from './admin-sidebar/admin-sidebar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { ImportModalComponent } from './import-modal/import-modal.component';
import { NotificationComponent } from './notification/notification.component';
import { ImportLessonsModalComponent } from './import-modal/import-lessons-modal.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    AdminHeaderComponent,
    AdminSidebarComponent,
    DashboardComponent,
    UserManagementComponent,
    ImportModalComponent,
    NotificationComponent,
    ImportLessonsModalComponent,
  ],
  template: `
    <div class="admin-dashboard dark-theme">
      <app-admin-header
        [currentUser]="currentUser"
        (logout)="logout()">
      </app-admin-header>

      <div class="admin-layout">
        <app-admin-sidebar
          [currentSection]="currentSection"
          [usersCount]="users.length"
          [lessonsCount]="lessons.length"
          (sectionChange)="showSection($event)">
        </app-admin-sidebar>

        <main class="admin-content">
          <app-dashboard
            *ngIf="currentSection === 'overview'"
            [users]="users"
            (sectionChange)="showSection($event)"
            (importDialog)="displayImportDialog = true"
            (importLessonsDialog)="displayImportLessonsDialog = true"
            (downloadTemplate)="downloadTemplate()"
            (downloadLessonsTemplate)="downloadLessonsTemplate()">
          </app-dashboard>

          <app-user-management
            *ngIf="currentSection === 'users'"
            [users]="users"
            [selectedUsers]="selectedUsers"
            [loading]="loading"
            (usersUpdate)="loadUsers()"
            (selectionChange)="onSelectionChange($event)"
            (importDialog)="displayImportDialog = true"
            (downloadTemplate)="downloadTemplate()"
            (deleteUsers)="deleteSelectedUsers($event)">
          </app-user-management>


        </main>
      </div>

      <!-- Модальное окно импорта пользователей -->
      <app-import-modal
        [display]="displayImportDialog"
        [loading]="importLoading"
        [importResult]="userImportResult"
        (close)="onImportDialogHide()"
        (import)="onUserImport($event)">
      </app-import-modal>

      <!-- Модальное окно импорта расписания -->
      <app-import-lessons-modal
        [display]="displayImportLessonsDialog"
        [loading]="lessonsImportLoading"
        [importResult]="lessonsImportResult"
        (close)="onImportLessonsDialogHide()"
        (import)="onLessonsImport($event)">
      </app-import-lessons-modal>

      <app-notification
        [notification]="notification"
        (close)="hideNotification()">
      </app-notification>
    </div>
  `,
  styles: [`
    .dark-theme {
      --bg-primary: #0f0f23;
      --bg-secondary: #1a1b2e;
      --bg-tertiary: #25253d;
      --bg-card: #2d2d4d;
      --bg-hover: #3a3a5d;
      --text-primary: #ffffff;
      --text-secondary: #a0a0c0;
      --text-muted: #6c6c8c;
      --border-color: #3a3a5d;
      --border-light: #4a4a6d;
      --primary: #6366f1;
      --primary-hover: #5a5ee0;
      --success: #10b981;
      --warning: #f59e0b;
      --danger: #ef4444;
      --info: #06b6d4;
      --gradient-primary: linear-gradient(135deg, #6366f1, #8b5cf6);
      --gradient-card: linear-gradient(135deg, #2d2d4d, #25253d);
    }

    .admin-dashboard {
      min-height: 100vh;
      background: var(--bg-primary);
      color: var(--text-primary);
    }

    .admin-layout {
      display: flex;
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
      gap: 2rem;
    }

    .admin-content {
      flex: 1;
    }

    @media (max-width: 1024px) {
      .admin-layout {
        flex-direction: column;
        padding: 1rem;
      }
    }
  `]
})
export class AdminComponent implements OnInit {
  currentUser: any = null;
  currentSection = 'overview';
  users: User[] = [];
  lessons: LessonDto[] = [];
  selectedUsers: User[] = [];

  // Модальные окна
  displayImportDialog = false;
  displayImportLessonsDialog = false;

  // Состояние загрузки
  importLoading = false;
  lessonsImportLoading = false;
  loading = false;

  // Результаты импорта
  userImportResult: any = null;
  lessonsImportResult: ImportResultDto | null = null;

  notification = {
    show: false,
    type: 'success',
    title: '',
    message: ''
  };

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private lessonService: LessonService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();

    if (!this.authService.isAdmin()) {
      this.router.navigate(['/dashboard']);
      return;
    }

    this.loadUsers();
    this.loadLessons();
  }

  showSection(section: string): void {
    this.currentSection = section;
    if (section === 'users') {
      this.loadUsers();
    }
    if (section === 'schedule') {
      this.loadLessons();
    }
  }

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

  loadLessons(): void {
    this.loading = true;
    this.lessonService.getLessons().subscribe({
      next: (lessons) => {
        this.lessons = lessons;
        this.loading = false;
      },
      error: (error) => {
        console.error('Ошибка загрузки расписания:', error);
        this.showError('Ошибка загрузки расписания');
        this.loading = false;
      }
    });
  }

  onSelectionChange(selectedUsers: User[]): void {
    this.selectedUsers = selectedUsers;
  }

  // Обработчики для модального окна пользователей
  onImportDialogHide(): void {
    this.displayImportDialog = false;
    this.userImportResult = null;
  }

  onUserImport(file: File): void {
    if (!file) return;

    this.importLoading = true;
    this.userService.importUsersFromExcel(file).subscribe({
      next: (result) => {
        this.importLoading = false;
        this.userImportResult = result;

        if (result.successfullyImported > 0) {
          this.showSuccess(`Успешно импортировано ${result.successfullyImported} пользователей`);
          this.loadUsers();
        }

        if (result.failed > 0) {
          this.showWarn(`Не удалось импортировать ${result.failed} пользователей`);

          if (result.errors && result.errors.length > 0) {
            const errorMessage = result.errors.slice(0, 5).join(', ');
            this.showWarn(`Ошибки: ${errorMessage}`);
          }
        }
      },
      error: (error) => {
        console.error('Ошибка импорта пользователей:', error);
        this.showError('Ошибка при импорте пользователей');
        this.importLoading = false;
      }
    });
  }

  // Обработчики для модального окна расписания
  onImportLessonsDialogHide(): void {
    this.displayImportLessonsDialog = false;
    this.lessonsImportResult = null;
  }

  onLessonsImport(file: File): void {
    if (!file) return;

    this.lessonsImportLoading = true;
    this.lessonService.importLessons(file).subscribe({
      next: (result) => {
        this.lessonsImportLoading = false;
        this.lessonsImportResult = result;

        if (result.successfullyImported > 0) {
          this.showSuccess(`Успешно импортировано ${result.successfullyImported} занятий`);
          this.loadLessons();
        }

        if (result.failed > 0) {
          this.showWarn(`Не удалось импортировать ${result.failed} занятий`);

          if (result.errors && result.errors.length > 0) {
            const errorMessage = result.errors.slice(0, 5).join(', ');
            this.showWarn(`Ошибки: ${errorMessage}`);
          }
        }
      },
      error: (error) => {
        console.error('Ошибка импорта расписания:', error);
        this.showError('Ошибка при импорте расписания');
        this.lessonsImportLoading = false;
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
        this.showSuccess('Шаблон пользователей успешно скачан');
      },
      error: (error) => {
        console.error('Ошибка скачивания шаблона:', error);
        this.showError('Ошибка при скачивании шаблона пользователей');
      }
    });
  }

  downloadLessonsTemplate(): void {
    // Создаем CSV шаблон для расписания
    const templateData = [
      ['Subject', 'Teacher', 'GroupName', 'TimeName', 'NumberLecture', 'Date', 'CabinetName'],
      ['Математика', 'Иванов И.И.', 'Группа 1', '09:00-10:30', '1', '2024-01-15', 'Аудитория 101'],
      ['Физика', 'Петров П.П.', 'Группа 2', '10:45-12:15', '2', '2024-01-15', 'Аудитория 102'],
      ['Программирование', 'Сидоров С.С.', 'Группа 3', '13:00-14:30', '3', '2024-01-15', 'Компьютерный класс 201']
    ];

    let csvContent = templateData.map(row =>
      row.map(field => `"${field}"`).join(',')
    ).join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], {
      type: 'text/csv;charset=utf-8;'
    });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Lessons_Import_Template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    this.showSuccess('Шаблон расписания успешно скачан');
  }

  deleteSelectedUsers(users: User[]): void {
    this.loading = true;
    const deletePromises = users.map(user =>
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

  private showSuccess(message: string): void {
    this.showNotification('success', 'Успешно', message);
  }

  private showError(message: string): void {
    this.showNotification('error', 'Ошибка', message);
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
