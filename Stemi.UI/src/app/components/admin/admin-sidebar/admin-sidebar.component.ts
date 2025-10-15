import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="admin-sidebar">
      <div class="sidebar-content">
        <div class="sidebar-menu">
          <div class="menu-group">
            <div class="menu-title">Главная</div>
            <a class="menu-item" [class.active]="currentSection === 'overview'" 
               (click)="sectionChange.emit('overview')">
              <span class="menu-icon">📊</span>
              <span class="menu-text">Обзор системы</span>
            </a>
          </div>
          
          <div class="menu-group">
            <div class="menu-title">Управление</div>
            <a class="menu-item" [class.active]="currentSection === 'users'" 
               (click)="sectionChange.emit('users')">
              <span class="menu-icon">👥</span>
              <span class="menu-text">Пользователи</span>
              <span class="menu-badge">{{usersCount}}</span>
            </a>
            <a class="menu-item">
              <span class="menu-icon">📅</span>
              <span class="menu-text">Расписание</span>
            </a>
            <a class="menu-item">
              <span class="menu-icon">💰</span>
              <span class="menu-text">Финансы</span>
            </a>
          </div>
          
          <div class="menu-group">
            <div class="menu-title">Аналитика</div>
            <a class="menu-item">
              <span class="menu-icon">📈</span>
              <span class="menu-text">Отчеты</span>
            </a>
            <a class="menu-item">
              <span class="menu-icon">📋</span>
              <span class="menu-text">Статистика</span>
            </a>
          </div>
          
          <div class="menu-group">
            <div class="menu-title">Система</div>
            <a class="menu-item">
              <span class="menu-icon">⚙️</span>
              <span class="menu-text">Настройки</span>
            </a>
            <a class="menu-item">
              <span class="menu-icon">🛡️</span>
              <span class="menu-text">Безопасность</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .admin-sidebar {
      flex: 0 0 280px;
    }

    .sidebar-content {
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: 16px;
      padding: 1.5rem;
      backdrop-filter: blur(10px);
    }

    .menu-group {
      margin-bottom: 2rem;
    }

    .menu-title {
      font-size: 0.875rem;
      font-weight: 600;
      text-transform: uppercase;
      color: var(--text-muted);
      margin-bottom: 1rem;
      padding-left: 0.5rem;
    }

    .menu-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
      color: var(--text-secondary);
      margin-bottom: 0.25rem;
    }

    .menu-item:hover {
      background: var(--bg-hover);
      color: var(--text-primary);
      transform: translateX(5px);
    }

    .menu-item.active {
      background: var(--gradient-primary);
      color: white;
      box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
    }

    .menu-icon {
      font-size: 1.2rem;
    }

    .menu-text {
      flex: 1;
      font-weight: 500;
    }

    .menu-badge {
      background: var(--bg-tertiary);
      color: var(--text-secondary);
      padding: 0.25rem 0.5rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .menu-item.active .menu-badge {
      background: rgba(255, 255, 255, 0.2);
      color: white;
    }

    @media (max-width: 1024px) {
      .admin-sidebar {
        flex: none;
        width: 100%;
      }
    }
  `]
})
export class AdminSidebarComponent {
  @Input() currentSection!: string;
  @Input() usersCount!: number;
  @Output() sectionChange = new EventEmitter<string>();
}
