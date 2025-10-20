import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../../services/user.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="content-section">
      <div class="section-header">
        <h2 class="section-title">Панель управления</h2>
        <p class="section-subtitle">Обзор системы и быстрый доступ</p>
      </div>

      <!-- Statistics Cards -->
      <div class="stats-grid">
        <div class="stat-card primary">
          <div class="stat-icon">👥</div>
          <div class="stat-content">
            <h3 class="stat-value">{{ users.length }}</h3>
            <p class="stat-label">Всего пользователей</p>
          </div>
          <div class="stat-trend">+12%</div>
        </div>
        
        <div class="stat-card success">
          <div class="stat-icon">🎓</div>
          <div class="stat-content">
            <h3 class="stat-value">{{ getUsersByRole('Student').length }}</h3>
            <p class="stat-label">Студентов</p>
          </div>
          <div class="stat-trend">+8%</div>
        </div>
        
        <div class="stat-card warning">
          <div class="stat-icon">👨‍🏫</div>
          <div class="stat-content">
            <h3 class="stat-value">{{ getUsersByRole('Teacher').length }}</h3>
            <p class="stat-label">Преподавателей</p>
          </div>
          <div class="stat-trend">+5%</div>
        </div>
        
        <div class="stat-card danger">
          <div class="stat-icon">⚡</div>
          <div class="stat-content">
            <h3 class="stat-value">{{ getUsersByRole('Admin').length }}</h3>
            <p class="stat-label">Администраторов</p>
          </div>
          <div class="stat-trend">+2%</div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <h3 class="actions-title">Быстрые действия</h3>
        <div class="actions-grid">
          <button class="action-card" (click)="sectionChange.emit('users')">
            <div class="action-icon">👥</div>
            <div class="action-content">
              <h4>Управление пользователями</h4>
              <p>Добавление, редактирование и удаление пользователей</p>
            </div>
            <div class="action-arrow">→</div>
          </button>
          
          <button class="action-card" (click)="downloadTemplate.emit()">
            <div class="action-icon">📥</div>
            <div class="action-content">
              <h4>Скачать шаблон пользователей</h4>
              <p>Excel шаблон для массового импорта пользователей</p>
            </div>
            <div class="action-arrow">→</div>
          </button>
          
          <button class="action-card" (click)="downloadLessonsTemplate.emit()">
            <div class="action-icon">📋</div>
            <div class="action-content">
              <h4>Скачать шаблон расписания</h4>
              <p>Excel шаблон для импорта занятий</p>
            </div>
            <div class="action-arrow">→</div>
          </button>
          
          <button class="action-card" (click)="importDialog.emit()">
            <div class="action-icon">📊</div>
            <div class="action-content">
              <h4>Импорт пользователей</h4>
              <p>Массовое добавление пользователей из Excel</p>
            </div>
            <div class="action-arrow">→</div>
          </button>

          <button class="action-card" (click)="importLessonsDialog.emit()">
            <div class="action-icon">📅</div>
            <div class="action-content">
              <h4>Импорт расписания</h4>
              <p>Массовое добавление занятий из Excel</p>
            </div>
            <div class="action-arrow">→</div>
          </button>
          
          <button class="action-card">
            <div class="action-icon">📈</div>
            <div class="action-content">
              <h4>Генерация отчетов</h4>
              <p>Создание аналитических отчетов</p>
            </div>
            <div class="action-arrow">→</div>
          </button>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="recent-activity">
        <h3 class="activity-title">Последние действия</h3>
        <div class="activity-list">
          <div class="activity-item">
            <div class="activity-icon success">✅</div>
            <div class="activity-content">
              <p>Новый пользователь зарегистрирован</p>
              <span class="activity-time">2 минуты назад</span>
            </div>
          </div>
          <div class="activity-item">
            <div class="activity-icon primary">📊</div>
            <div class="activity-content">
              <p>Импорт пользователей завершен</p>
              <span class="activity-time">1 час назад</span>
            </div>
          </div>
          <div class="activity-item">
            <div class="activity-icon warning">📅</div>
            <div class="activity-content">
              <p>Расписание занятий обновлено</p>
              <span class="activity-time">2 часа назад</span>
            </div>
          </div>
          <div class="activity-item">
            <div class="activity-icon info">⚙️</div>
            <div class="activity-content">
              <p>Системные настройки обновлены</p>
              <span class="activity-time">3 часа назад</span>
            </div>
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

    /* Statistics */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      padding: 1.5rem;
      border-radius: 16px;
      display: flex;
      align-items: center;
      gap: 1rem;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
    }

    .stat-card.primary::before { background: var(--primary); }
    .stat-card.success::before { background: var(--success); }
    .stat-card.warning::before { background: var(--warning); }
    .stat-card.danger::before { background: var(--danger); }

    .stat-card:hover {
      transform: translateY(-5px);
      border-color: var(--border-light);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
    }

    .stat-icon {
      font-size: 2.5rem;
      opacity: 0.8;
    }

    .stat-content {
      flex: 1;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      margin: 0;
      color: var(--text-primary);
    }

    .stat-label {
      color: var(--text-secondary);
      margin: 0;
    }

    .stat-trend {
      font-weight: 600;
      color: var(--success);
    }

    /* Quick Actions */
    .quick-actions {
      margin-bottom: 2rem;
    }

    .actions-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 1rem;
      color: var(--text-primary);
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1rem;
    }

    .action-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      padding: 1.5rem;
      border-radius: 16px;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 1rem;
      text-align: left;
      width: 100%;
    }

    .action-card:hover {
      border-color: var(--primary);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(99, 102, 241, 0.2);
    }

    .action-icon {
      font-size: 2rem;
    }

    .action-content {
      flex: 1;
    }

    .action-content h4 {
      margin: 0 0 0.5rem 0;
      color: var(--text-primary);
    }

    .action-content p {
      margin: 0;
      color: var(--text-secondary);
      font-size: 0.875rem;
    }

    .action-arrow {
      color: var(--primary);
      font-size: 1.25rem;
      font-weight: 700;
    }

    /* Recent Activity */
    .recent-activity {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      padding: 1.5rem;
      border-radius: 16px;
    }

    .activity-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 1rem;
      color: var(--text-primary);
    }

    .activity-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 0;
      border-bottom: 1px solid var(--border-color);
    }

    .activity-item:last-child {
      border-bottom: none;
    }

    .activity-icon {
      font-size: 1.25rem;
    }

    .activity-icon.success { color: var(--success); }
    .activity-icon.primary { color: var(--primary); }
    .activity-icon.warning { color: var(--warning); }
    .activity-icon.info { color: var(--info); }

    .activity-content {
      flex: 1;
    }

    .activity-content p {
      margin: 0 0 0.25rem 0;
      color: var(--text-primary);
    }

    .activity-time {
      font-size: 0.875rem;
      color: var(--text-secondary);
    }

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }
      
      .actions-grid {
        grid-template-columns: 1fr;
      }
      
      .content-section {
        padding: 1rem;
      }
    }
  `]
})
export class DashboardComponent {
  @Input() users: User[] = [];
  @Output() sectionChange = new EventEmitter<string>();
  @Output() importDialog = new EventEmitter<void>();
  @Output() downloadTemplate = new EventEmitter<void>();
  @Output() importLessonsDialog = new EventEmitter<void>();
  @Output() downloadLessonsTemplate = new EventEmitter<void>();

  getUsersByRole(role: string): User[] {
    return this.users.filter(user => user.roles.includes(role));
  }
}
