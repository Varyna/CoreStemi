// admin.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { UserService, User } from '../../services/user.service';
import { AdminHeaderComponent } from './admin-header/admin-header.component';
import { AdminSidebarComponent } from './admin-sidebar/admin-sidebar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { ImportModalComponent } from './import-modal/import-modal.component';
import { NotificationComponent } from './notification/notification.component';

interface Schedule {
  id: number;
  subjectName: string;
  teacherName: string;
  groupName: string;
  classroom: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  lessonType: string;
  corpus: number;
}

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
    NotificationComponent
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
          (sectionChange)="showSection($event)">
        </app-admin-sidebar>

        <main class="admin-content">
          <app-dashboard 
            *ngIf="currentSection === 'overview'"
            [users]="users"
            (sectionChange)="showSection($event)">
          </app-dashboard>

          <app-user-management
            *ngIf="currentSection === 'users'"
            [users]="users"
            [selectedUsers]="selectedUsers"
            [loading]="loading"
            (usersUpdate)="loadUsers()"
            (selectionChange)="onSelectionChange($event)"
            (importDialog)="showImportDialog('users')"
            (downloadTemplate)="downloadTemplate('users')"
            (deleteUsers)="deleteSelectedUsers($event)">
          </app-user-management>

       
        </main>
      </div>

      <app-import-modal
        [display]="displayUserImportDialog"
        [loading]="userImportLoading"
        (close)="onUserImportDialogHide()"
        (import)="onUserImport($event)">
      </app-import-modal>

     

      <app-notification
        [notification]="notification"
        (close)="hideNotification()">
      </app-notification>
    </div>
  `,
  styles: [`
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
    .admin-content { flex: 1; }
    @media (max-width: 1024px) {
      .admin-layout { flex-direction: column; padding: 1rem; }
    }
  `]
})
export class AdminComponent implements OnInit {
  currentUser: any = null;
  currentSection = 'overview';
  users: User[] = [];
  schedules: Schedule[] = [];
  selectedUsers: User[] = [];

  displayUserImportDialog = false;
  displayScheduleImportDialog = false;
  userImportLoading = false;
  scheduleImportLoading = false;
  loading = false;
  scheduleLoading = false;

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
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/dashboard']);
      return;
    }
    this.loadUsers();
    this.loadSchedules();
  }

  showSection(section: string): void {
    this.currentSection = section;
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

  loadSchedules(): void {
    this.scheduleLoading = true;
    setTimeout(() => {
      this.schedules = [
        {
          id: 1,
          subjectName: 'Математика',
          teacherName: 'Иванов И.И.',
          groupName: 'Группа 101',
          classroom: 'Аудитория 301',
          dayOfWeek: 'monday',
          startTime: '09:00',
          endTime: '10:30',
          lessonType: 'lecture',
          corpus: 1
        }
      ];
      this.scheduleLoading = false;
    }, 1000);
  }

  showImportDialog(type: 'users' | 'schedule'): void {
    if (type === 'users') {
      this.displayUserImportDialog = true;
    } else {
      this.displayScheduleImportDialog = true;
    }
  }

  onUserImportDialogHide(): void {
    this.displayUserImportDialog = false;
  }

  onScheduleImportDialogHide(): void {
    this.displayScheduleImportDialog = false;
  }

  onUserImport(file: File): void {
    this.userImportLoading = true;
    this.userService.importUsersFromExcel(file).subscribe({
      next: (result) => {
        this.userImportLoading = false;
        this.displayUserImportDialog = false;
        if (result.successfullyImported > 0) {
          this.showSuccess(`Успешно импортировано ${result.successfullyImported} пользователей`);
          this.loadUsers();
        }
        if (result.failed > 0) {
          this.showWarn(`Не удалось импортировать ${result.failed} пользователей`);
        }
      },
      error: (error) => {
        this.showError('Ошибка при импорте пользователей');
        this.userImportLoading = false;
      }
    });
  }

  onScheduleImport(file: File): void {
    this.scheduleImportLoading = true;
    setTimeout(() => {
      this.scheduleImportLoading = false;
      this.displayScheduleImportDialog = false;
      this.showSuccess('Расписание успешно импортировано');
      this.loadSchedules();
    }, 2000);
  }

  downloadTemplate(type: 'users' | 'schedule'): void {
    if (type === 'users') {
      this.userService.downloadTemplate().subscribe({
        next: (blob) => this.downloadBlob(blob, 'Users_Import_Template.xlsx'),
        error: () => this.showError('Ошибка при скачивании шаблона')
      });
    } else {
      const blob = new Blob([''], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      this.downloadBlob(blob, 'Schedule_Import_Template.xlsx');
    }
  }

  deleteSchedule(schedule: Schedule): void {
    this.scheduleLoading = true;
    setTimeout(() => {
      this.schedules = this.schedules.filter(s => s.id !== schedule.id);
      this.scheduleLoading = false;
      this.showSuccess('Занятие успешно удалено');
    }, 500);
  }

  onSelectionChange(selectedUsers: User[]): void {
    this.selectedUsers = selectedUsers;
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
      this.showError('Ошибка при удалении пользователей');
      this.loading = false;
    });
  }

  private downloadBlob(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
    this.showSuccess('Шаблон успешно скачан');
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
    this.notification = { show: true, type, title, message };
    setTimeout(() => this.hideNotification(), 5000);
  }

  hideNotification(): void {
    this.notification.show = false;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
