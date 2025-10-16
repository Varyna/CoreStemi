// schedule-management.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Schedule {
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
  selector: 'app-schedule-management',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="schedule-management">
      <div class="management-header">
        <div class="header-info">
          <h2>Управление расписанием</h2>
          <p class="subtitle">Всего занятий: {{ schedules.length }}</p>
        </div>
        
        <div class="header-actions">
          <button class="btn btn-secondary" 
                  (click)="onDownloadTemplate()"
                  [disabled]="loading">
            📥 Скачать шаблон
          </button>
          <button class="btn btn-primary" 
                  (click)="onImportDialog()"
                  [disabled]="loading">
            📊 Импорт Excel
          </button>
        </div>
      </div>

      <!-- Остальной код без изменений -->
      <div *ngIf="loading" class="loading-container">
        <div class="spinner"></div>
        <p>Загрузка расписания...</p>
      </div>

      <div *ngIf="!loading" class="schedule-list">
        <div *ngFor="let schedule of schedules" class="schedule-card">
          <div class="schedule-info">
            <h4>{{ schedule.subjectName }}</h4>
            <div class="schedule-details">
              <span>👨‍🏫 {{ schedule.teacherName }}</span>
              <span>👥 {{ schedule.groupName }}</span>
              <span>🏫 {{ schedule.classroom }} (Корпус {{ schedule.corpus }})</span>
              <span>📅 {{ getDayName(schedule.dayOfWeek) }} {{ schedule.startTime }}-{{ schedule.endTime }}</span>
              <span>📚 {{ getLessonType(schedule.lessonType) }}</span>
            </div>
          </div>
          <div class="schedule-actions">
            <button class="btn-icon" title="Удалить" (click)="deleteSchedule(schedule)">
              🗑️
            </button>
          </div>
        </div>

        <div *ngIf="schedules.length === 0" class="empty-state">
          <div class="empty-icon">📚</div>
          <h3>Расписание пустое</h3>
          <p>Начните с импорта расписания из Excel файла</p>
          <button class="btn btn-primary" (click)="onImportDialog()">
            📊 Импорт расписания
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
  .schedule-management {
    padding: 1rem 0;
  }

  .management-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .management-header h2 {
    margin: 0;
    color: var(--text-primary);
  }

  .subtitle {
    color: var(--text-secondary);
    margin: 0.25rem 0 0 0;
  }

  .header-actions {
    display: flex;
    gap: 1rem;
  }

  .schedule-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .schedule-card {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    transition: all 0.3s ease;
  }

  .schedule-card:hover {
    border-color: var(--border-light);
    transform: translateY(-2px);
  }

  .schedule-info h4 {
    margin: 0 0 1rem 0;
    color: var(--text-primary);
  }

  .schedule-details {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .schedule-details span {
    color: var(--text-secondary);
    font-size: 0.875rem;
  }

  .schedule-actions {
    display: flex;
    gap: 0.5rem;
  }

  .btn-icon {
    background: var(--bg-secondary);
    border: none;
    width: 36px;
    height: 36px;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
  }

  .btn-icon:hover {
    background: var(--danger);
    transform: scale(1.05);
  }

  .empty-state {
    text-align: center;
    padding: 3rem 2rem;
    background: var(--bg-card);
    border-radius: 16px;
    border: 2px dashed var(--border-color);
  }

  .empty-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.7;
  }

  .empty-state h3 {
    margin: 0 0 0.5rem 0;
    color: var(--text-primary);
  }

  .empty-state p {
    color: var(--text-secondary);
    margin-bottom: 1.5rem;
  }

  .loading-container {
    text-align: center;
    padding: 3rem 2rem;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid var(--border-color);
    border-top: 4px solid var(--primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem auto;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

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

  @media (max-width: 768px) {
    .management-header {
      flex-direction: column;
      align-items: stretch;
    }
    
    .header-actions {
      justify-content: stretch;
    }
    
    .btn {
      flex: 1;
      justify-content: center;
    }
  }
`]
})
export class ScheduleManagementComponent {
  @Input() schedules: Schedule[] = [];
  @Input() loading = false;
  @Output() importDialog = new EventEmitter<void>();
  @Output() downloadTemplate = new EventEmitter<void>();
  @Output() deleteScheduleEvent = new EventEmitter<Schedule>();

  onDownloadTemplate(): void {
    this.downloadTemplate.emit();
  }

  onImportDialog(): void {
    this.importDialog.emit();
  }

  getDayName(day: string): string {
    const days: { [key: string]: string } = {
      monday: 'Понедельник',
      tuesday: 'Вторник',
      wednesday: 'Среда',
      thursday: 'Четверг',
      friday: 'Пятница',
      saturday: 'Суббота',
      sunday: 'Воскресенье'
    };
    return days[day] || day;
  }

  getLessonType(type: string): string {
    const types: { [key: string]: string } = {
      lecture: 'Лекция',
      practice: 'Практика',
      lab: 'Лабораторная',
      seminar: 'Семинар'
    };
    return types[type] || type;
  }

  deleteSchedule(schedule: Schedule): void {
    if (confirm(`Удалить занятие "${schedule.subjectName}"?`)) {
      this.deleteScheduleEvent.emit(schedule);
    }
  }
}
