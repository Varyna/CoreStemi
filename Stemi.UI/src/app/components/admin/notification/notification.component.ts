import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common'; // Добавляем импорт

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule], // Добавляем CommonModule здесь
  template: `
    <div *ngIf="notification.show" 
         class="notification"
         [class]="'notification-' + notification.type">
      <div class="notification-content">
        <div class="notification-icon">
          <span *ngIf="notification.type === 'success'">✅</span>
          <span *ngIf="notification.type === 'error'">❌</span>
          <span *ngIf="notification.type === 'warning'">⚠️</span>
        </div>
        <div class="notification-text">
          <div class="notification-title">{{ notification.title }}</div>
          <div class="notification-message">{{ notification.message }}</div>
        </div>
      </div>
      <button class="notification-close" (click)="close.emit()">×</button>
    </div>
  `,
  styles: [`
    .notification {
      position: fixed;
      top: 2rem;
      right: 2rem;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
      padding: 1rem 1.5rem;
      max-width: 400px;
      z-index: 1001;
      animation: slideIn 0.3s ease;
    }

    .notification-success {
      border-left: 4px solid var(--success);
    }

    .notification-error {
      border-left: 4px solid var(--danger);
    }

    .notification-warning {
      border-left: 4px solid var(--warning);
    }

    .notification-content {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .notification-icon {
      font-size: 1.5rem;
    }

    .notification-text {
      flex: 1;
    }

    .notification-title {
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 0.25rem;
    }

    .notification-message {
      color: var(--text-secondary);
      font-size: 0.875rem;
    }

    .notification-close {
      background: none;
      border: none;
      font-size: 1.25rem;
      cursor: pointer;
      color: var(--text-secondary);
      margin-left: 1rem;
    }

    .notification-close:hover {
      color: var(--text-primary);
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @media (max-width: 768px) {
      .notification {
        right: 1rem;
        left: 1rem;
        max-width: none;
      }
    }
  `]
})
export class NotificationComponent {
  @Input() notification: any;
  @Output() close = new EventEmitter<void>();
}
