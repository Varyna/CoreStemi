import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  template: `
    <header class="admin-header">
      <div class="header-content">
        <div class="header-brand">
          <div class="logo-container">
            <img src="assets/img/logo_stemi.png" alt="STEMI" class="logo">
          </div>
          <div class="brand-text">
            <h1 class="brand-title">Административная панель</h1>
            <p class="brand-subtitle">Управление системой</p>
          </div>
        </div>
        
        <div class="header-actions">
          <div class="user-menu">
            <div class="user-avatar">
              <span class="avatar-icon">👨‍💼</span>
            </div>
            <div class="user-info">
              <span class="user-name">{{currentUser?.userName}}</span>
              <span class="user-role">Администратор</span>
            </div>
            <button class="logout-btn" (click)="logout.emit()" title="Выйти">
              <span class="logout-icon">🚪</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .admin-header {
      background: var(--bg-secondary);
      border-bottom: 1px solid var(--border-color);
      padding: 1rem 2rem;
      backdrop-filter: blur(10px);
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1400px;
      margin: 0 auto;
    }

    .header-brand {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .logo-container {
      width: 50px;
      height: 50px;
      background: var(--gradient-primary);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .logo {
      width: 30px;
      height: 30px;
      filter: brightness(0) invert(1);
    }

    .brand-text {
      color: var(--text-primary);
    }

    .brand-title {
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0;
    }

    .brand-subtitle {
      font-size: 0.875rem;
      color: var(--text-secondary);
      margin: 0;
    }

    .user-menu {
      display: flex;
      align-items: center;
      gap: 1rem;
      background: var(--bg-tertiary);
      padding: 0.5rem 1rem;
      border-radius: 12px;
      border: 1px solid var(--border-color);
    }

    .user-avatar {
      width: 45px;
      height: 45px;
      background: var(--gradient-primary);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
    }

    .user-info {
      text-align: right;
    }

    .user-name {
      display: block;
      font-weight: 600;
      color: var(--text-primary);
    }

    .user-role {
      font-size: 0.875rem;
      color: var(--text-secondary);
    }

    .logout-btn {
      background: var(--bg-hover);
      border: none;
      width: 40px;
      height: 40px;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }

    .logout-btn:hover {
      background: var(--danger);
      transform: scale(1.05);
    }

    .logout-icon {
      font-size: 1.2rem;
    }

    @media (max-width: 768px) {
      .admin-header {
        padding: 1rem;
      }
      
      .brand-title {
        font-size: 1.25rem;
      }
      
      .user-info {
        display: none;
      }
    }
  `]
})
export class AdminHeaderComponent {
  @Input() currentUser: any;
  @Output() logout = new EventEmitter<void>();
}
