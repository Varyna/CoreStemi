import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../../services/user.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="content-section">
      <div class="section-header">
        <div class="header-content">
          <div>
            <h2 class="section-title">Управление пользователями</h2>
            <p class="section-subtitle">Управление учетными записями и правами доступа</p>
          </div>
          <div class="header-actions">
            <button class="btn btn-secondary" (click)="downloadTemplate.emit()" [disabled]="loading">
              <span class="btn-icon">📥</span>
              Скачать шаблон
            </button>
            <button class="btn btn-primary" (click)="importDialog.emit()" [disabled]="loading">
              <span class="btn-icon">📊</span>
              Импорт из Excel
            </button>
            <button class="btn btn-danger" 
                    [disabled]="selectedUsers.length === 0 || loading"
                    (click)="confirmDeleteSelected()">
              <span class="btn-icon">🗑️</span>
              Удалить выбранных ({{selectedUsers.length}})
            </button>
          </div>
        </div>
      </div>

      <!-- Users Table -->
      <div class="content-card">
        <div class="table-container">
          <table class="modern-table">
            <thead>
              <tr>
                <th class="checkbox-column">
                  <label class="checkbox-wrapper">
                    <input type="checkbox" 
                          [checked]="isAllSelected()"
                          (change)="toggleSelectAll($event)"
                          [disabled]="loading">
                    <span class="checkmark"></span>
                  </label>
                </th>
                <th>Пользователь</th>
                <th>Контакт</th>
                <th>Роли</th>
                <th>Статус</th>
                <th>Дата регистрации</th>
                <th class="actions-column">Действия</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let user of users" 
                  [class.selected]="isSelected(user)">
                <td class="checkbox-column">
                  <label class="checkbox-wrapper">
                    <input type="checkbox" 
                          [checked]="isSelected(user)"
                          (change)="toggleUserSelection(user)"
                          [disabled]="loading">
                    <span class="checkmark"></span>
                  </label>
                </td>
                <td>
                  <div class="user-cell">
                    <div class="user-avatar small">
                      <span class="avatar-icon">👤</span>
                    </div>
                    <div class="user-details">
                      <div class="user-name">{{ user.userName }}</div>
                      <div class="user-id">ID: {{ user.id }}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="contact-info">
                    <div class="email">{{ user.email }}</div>
                  X
                  </div>
                </td>
                <td>
                  <div class="roles-container">
                    <span *ngFor="let role of user.roles" 
                          class="role-badge"
                          [ngClass]="getRoleBadgeClass(role)">
                      {{ role }}
                    </span>
                  </div>
                </td>
                <td>
                  <span class="status-badge active">Активен</span>
                </td>
                <td>
                  <div class="date-cell">
                    {{ user.createdAt | date:'dd.MM.yyyy' }}
                    <div class="time">{{ user.createdAt | date:'HH:mm' }}</div>
                  </div>
                </td>
                <td class="actions-column">
                  <div class="action-buttons">
                    <button class="btn-icon edit" title="Редактировать" [disabled]="loading">
                      <span>✏️</span>
                    </button>
                    <button class="btn-icon delete" 
                            title="Удалить"
                            (click)="confirmDeleteUser(user)"
                            [disabled]="loading">
                      <span>🗑️</span>
                    </button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="users.length === 0 && !loading">
                <td colspan="7" class="empty-state">
                  <div class="empty-content">
                    <div class="empty-icon">👥</div>
                    <h3>Пользователи не найдены</h3>
                    <p>Начните с добавления первого пользователя</p>
                    <button class="btn btn-primary" (click)="importDialog.emit()">
                      📊 Импорт пользователей
                    </button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="loading">
                <td colspan="7" class="loading-state">
                  <div class="loading-content">
                    <div class="spinner"></div>
                    <p>Загрузка пользователей...</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="table-footer">
          <div class="footer-info">
            Показано {{ users.length }} из {{ users.length }} пользователей
          </div>
          <div class="pagination">
            <button class="pagination-btn" disabled>
              <span>←</span>
            </button>
            <button class="pagination-btn active">1</button>
            <button class="pagination-btn">2</button>
            <button class="pagination-btn">
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .content-section {
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: 16px;
      padding: 2rem;
      backdrop-filter: blur(10px);
    }

    .section-header {
      margin-bottom: 2rem;
    }

    .section-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 0.5rem 0;
    }

    .section-subtitle {
      color: var(--text-secondary);
      margin: 0;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .header-actions {
      display: flex;
      gap: 1rem;
    }

    /* Buttons */
    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-primary {
      background: var(--gradient-primary);
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
    }

    .btn-secondary {
      background: var(--bg-tertiary);
      color: var(--text-primary);
      border: 1px solid var(--border-color);
    }

    .btn-secondary:hover:not(:disabled) {
      background: var(--bg-hover);
      border-color: var(--border-light);
    }

    .btn-danger {
      background: var(--danger);
      color: white;
    }

    .btn-danger:hover:not(:disabled) {
      background: #dc2626;
      transform: translateY(-2px);
    }

    /* Table Styles */
    .content-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 16px;
      overflow: hidden;
    }

    .table-container {
      overflow-x: auto;
    }

    .modern-table {
      width: 100%;
      border-collapse: collapse;
    }

    .modern-table th {
      background: var(--bg-tertiary);
      padding: 1rem;
      text-align: left;
      font-weight: 600;
      color: var(--text-secondary);
      border-bottom: 1px solid var(--border-color);
    }

    .modern-table td {
      padding: 1rem;
      border-bottom: 1px solid var(--border-color);
      color: var(--text-primary);
    }

    .modern-table tr:hover {
      background: var(--bg-hover);
    }

    .modern-table tr.selected {
      background: var(--bg-tertiary);
    }

    .checkbox-wrapper {
      display: inline-block;
      position: relative;
      cursor: pointer;
    }

    .checkbox-wrapper input {
      opacity: 0;
      position: absolute;
    }

    .checkmark {
      width: 20px;
      height: 20px;
      border: 2px solid var(--border-light);
      border-radius: 4px;
      display: inline-block;
      position: relative;
      transition: all 0.3s ease;
      background: var(--bg-secondary);
    }

    .checkbox-wrapper input:checked + .checkmark {
      background: var(--primary);
      border-color: var(--primary);
    }

    .checkbox-wrapper input:checked + .checkmark:after {
      content: '✓';
      position: absolute;
      color: white;
      font-size: 14px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .user-cell {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .user-avatar.small {
      width: 40px;
      height: 40px;
      font-size: 1rem;
      background: var(--gradient-primary);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .user-name {
      font-weight: 600;
      color: var(--text-primary);
    }

    .user-id {
      font-size: 0.875rem;
      color: var(--text-secondary);
    }

    .contact-info .email {
      font-weight: 500;
      color: var(--text-primary);
    }

    .contact-info .phone {
      font-size: 0.875rem;
      color: var(--text-secondary);
    }

    .roles-container {
      display: flex;
      flex-wrap: wrap;
      gap: 0.25rem;
    }

    .role-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .badge-admin { background: #fee2e2; color: #dc2626; }
    .badge-teacher { background: #fef3c7; color: #d97706; }
    .badge-student { background: #d1fae5; color: #065f46; }

    .status-badge {
      padding: 0.375rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .status-badge.active {
      background: #d1fae5;
      color: #065f46;
    }

    .date-cell {
      color: var(--text-primary);
    }

    .date-cell .time {
      font-size: 0.875rem;
      color: var(--text-secondary);
    }

    .action-buttons {
      display: flex;
      gap: 0.5rem;
    }

    .btn-icon {
      width: 36px;
      height: 36px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      background: var(--bg-secondary);
      color: var(--text-secondary);
    }

    .btn-icon:hover:not(:disabled) {
      transform: scale(1.05);
    }

    .btn-icon.edit:hover:not(:disabled) {
      background: var(--info);
      color: white;
    }

    .btn-icon.delete:hover:not(:disabled) {
      background: var(--danger);
      color: white;
    }

    .empty-state {
      padding: 4rem 2rem;
      text-align: center;
    }

    .empty-content {
      max-width: 300px;
      margin: 0 auto;
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      opacity: 0.5;
    }

    .empty-content h3 {
      color: var(--text-primary);
      margin-bottom: 0.5rem;
    }

    .empty-content p {
      color: var(--text-secondary);
      margin-bottom: 1.5rem;
    }

    .loading-state {
      padding: 3rem 2rem;
      text-align: center;
    }

    .loading-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .spinner {
      width: 32px;
      height: 32px;
      border: 3px solid var(--border-color);
      border-top: 3px solid var(--primary);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .table-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.5rem;
      background: var(--bg-tertiary);
      border-top: 1px solid var(--border-color);
    }

    .footer-info {
      color: var(--text-secondary);
      font-size: 0.875rem;
    }

    .pagination {
      display: flex;
      gap: 0.5rem;
    }

    .pagination-btn {
      width: 40px;
      height: 40px;
      border: 1px solid var(--border-color);
      background: var(--bg-secondary);
      color: var(--text-secondary);
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .pagination-btn:hover:not(:disabled) {
      border-color: var(--primary);
      color: var(--primary);
    }

    .pagination-btn.active {
      background: var(--primary);
      border-color: var(--primary);
      color: white;
    }

    .pagination-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 1rem;
      }
      
      .header-actions {
        width: 100%;
        justify-content: flex-end;
        flex-wrap: wrap;
      }
      
      .content-section {
        padding: 1rem;
      }
    }
  `]
})
export class UserManagementComponent {
  @Input() users: User[] = [];
  @Input() selectedUsers: User[] = [];
  @Input() loading = false;
  @Output() usersUpdate = new EventEmitter<void>();
  @Output() selectionChange = new EventEmitter<User[]>();
  @Output() importDialog = new EventEmitter<void>();
  @Output() downloadTemplate = new EventEmitter<void>();
  @Output() deleteUsers = new EventEmitter<User[]>();

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
    this.selectionChange.emit(this.selectedUsers);
  }

  toggleSelectAll(event: any): void {
    if (event.target.checked) {
      this.selectedUsers = [...this.users];
    } else {
      this.selectedUsers = [];
    }
    this.selectionChange.emit(this.selectedUsers);
  }

  getRoleBadgeClass(role: string): string {
    switch (role) {
      case 'Admin': return 'badge-admin';
      case 'Teacher': return 'badge-teacher';
      case 'Student': return 'badge-student';
      default: return 'badge-secondary';
    }
  }

  confirmDeleteUser(user: User): void {
    if (confirm(`Вы уверены, что хотите удалить пользователя "${user.userName}"?`)) {
      this.deleteUsers.emit([user]);
    }
  }

  confirmDeleteSelected(): void {
    if (this.selectedUsers.length === 0) return;

    if (confirm(`Вы уверены, что хотите удалить выбранных пользователей (${this.selectedUsers.length})?`)) {
      this.deleteUsers.emit(this.selectedUsers);
    }
  }
}
