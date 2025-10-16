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
            (sectionChange)="showSection($event)"
            (importDialog)="displayImportDialog = true"
            (downloadTemplate)="downloadTemplate()">
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

      <app-import-modal
        [display]="displayImportDialog"
        [loading]="importLoading"
        (close)="onImportDialogHide()"
        (import)="onImport($event)">
      </app-import-modal>

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
  selectedUsers: User[] = [];
  displayImportDialog = false;
  importLoading = false;
  loading = false;

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
  }

  showSection(section: string): void {
    this.currentSection = section;
    if (section === 'users') {
      this.loadUsers();
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

  onSelectionChange(selectedUsers: User[]): void {
    this.selectedUsers = selectedUsers;
  }

  onImportDialogHide(): void {
    this.displayImportDialog = false;
  }

  onImport(file: File): void {
    if (!file) return;

    this.importLoading = true;
    this.userService.importUsersFromExcel(file).subscribe({
      next: (result) => {
        this.importLoading = false;
        this.displayImportDialog = false;

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
