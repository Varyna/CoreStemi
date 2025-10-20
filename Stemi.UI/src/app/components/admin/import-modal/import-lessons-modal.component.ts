// import-lessons-modal.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImportResultDto } from '../../../services/lesson.service';

@Component({
  selector: 'app-import-lessons-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="display" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Импорт расписания занятий</h3>
          <button class="close-btn" (click)="onClose()">×</button>
        </div>

        <div class="modal-body">
          <!-- Состояние загрузки -->
          <div *ngIf="loading" class="loading-state">
            <div class="spinner"></div>
            <p>Импорт расписания...</p>
          </div>

          <!-- Форма выбора файла -->
          <div *ngIf="!loading && !importResult" class="upload-section">
            <div class="file-upload">
              <input
                type="file"
                #fileInput
                (change)="onFileSelected($event)"
                accept=".xlsx,.xls"
                style="display: none"
              >
              <button
                class="browse-btn"
                (click)="fileInput.click()"
              >
                Выберите Excel файл
              </button>
              <p class="file-hint">Поддерживаются файлы .xlsx и .xls</p>
            </div>

            <div *ngIf="selectedFile" class="selected-file">
              <span>Выбран файл: {{ selectedFile.name }}</span>
              <button class="remove-btn" (click)="clearFile()">×</button>
            </div>

            <!-- Информация о формате файла -->
           <div class="format-info">
  <h4>Требования к файлу:</h4>
  <ul>
    <li>Файл должен быть выгружен из системы Элжур в формате Excel (.xlsx, .xls)</li>
    <li>Название файла должно содержать дату понедельника недели в формате ДД.ММ.ГГГГ</li>
    <li>Пример: <code>02.12.2024.xlsx</code> (для недели с 2 декабря 2024)</li>
  </ul>
</div>
          </div>

          <!-- Результаты импорта -->
          <div *ngIf="importResult" class="import-results">
            <h4>Результаты импорта расписания</h4>

            <div class="stats-grid">
              <div class="stat-item success">
                <span class="stat-label">Успешно импортировано</span>
                <span class="stat-number">{{ importResult.successfullyImported }}</span>
              </div>

              <div class="stat-item error">
                <span class="stat-label">Ошибки</span>
                <span class="stat-number">{{ importResult.failed }}</span>
              </div>

              <div class="stat-item total">
                <span class="stat-label">Всего обработано</span>
                <span class="stat-number">{{ getTotalRows() }}</span>
              </div>
            </div>

            <!-- Список ошибок -->
            <div *ngIf="importResult.errors && importResult.errors.length > 0" class="errors-section">
              <h5>Детали ошибок:</h5>
              <ul class="errors-list">
                <li *ngFor="let error of importResult.errors.slice(0, 10)">
                  {{ error }}
                </li>
                <li *ngIf="importResult.errors.length > 10">
                  ... и еще {{ importResult.errors.length - 10 }} ошибок
                </li>
              </ul>
            </div>

            <!-- Успешный импорт -->
            <div *ngIf="importResult.errors && importResult.errors.length === 0 && importResult.successfullyImported > 0" class="success-message">
              <div class="success-icon">✓</div>
              <p>Расписание успешно импортировано!</p>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button
            *ngIf="!importResult"
            class="btn-primary"
            [disabled]="!selectedFile || loading"
            (click)="onImport()"
          >
            {{ loading ? 'Импорт...' : 'Импортировать расписание' }}
          </button>

          <button
            *ngIf="importResult"
            class="btn-primary"
            (click)="onClose()"
          >
            Готово
          </button>

          <button
            class="btn-secondary"
            (click)="onClose()"
            [disabled]="loading"
          >
            {{ importResult ? 'Закрыть' : 'Отмена' }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .modal-content {
      background: var(--bg-secondary);
      border-radius: 12px;
      padding: 0;
      width: 90%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
      border: 1px solid var(--border-color);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid var(--border-color);
    }

    .modal-header h3 {
      margin: 0;
      color: var(--text-primary);
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: var(--text-secondary);
    }

    .close-btn:hover {
      color: var(--text-primary);
    }

    .modal-body {
      padding: 1.5rem;
    }

    .loading-state {
      text-align: center;
      padding: 2rem;
    }

    .spinner {
      border: 3px solid var(--border-color);
      border-top: 3px solid var(--primary);
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .upload-section {
      text-align: center;
    }

    .browse-btn {
      background: var(--primary);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      cursor: pointer;
      font-size: 1rem;
    }

    .browse-btn:hover:not(:disabled) {
      background: var(--primary-hover);
    }

    .browse-btn:disabled {
      background: var(--text-muted);
      cursor: not-allowed;
    }

    .file-hint {
      color: var(--text-muted);
      font-size: 0.875rem;
      margin-top: 0.5rem;
    }

    .selected-file {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--bg-tertiary);
      padding: 0.75rem;
      border-radius: 6px;
      margin-top: 1rem;
    }

    .remove-btn {
      background: none;
      border: none;
      color: var(--danger);
      cursor: pointer;
      font-size: 1.25rem;
    }

    .format-info {
      margin-top: 1.5rem;
      padding: 1rem;
      background: var(--bg-tertiary);
      border-radius: 8px;
      text-align: left;
    }

    .format-info h4 {
      margin: 0 0 0.75rem 0;
      color: var(--text-primary);
    }

    .format-info ul {
      margin: 0;
      padding-left: 1.25rem;
      color: var(--text-secondary);
    }

    .format-info li {
      margin-bottom: 0.25rem;
      font-size: 0.875rem;
    }

    .import-results {
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .stats-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin: 1.5rem 0;
    }

    .stat-item {
      padding: 1rem;
      border-radius: 8px;
      text-align: center;
    }

    .stat-item.success {
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid var(--success);
    }

    .stat-item.error {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid var(--danger);
    }

    .stat-item.total {
      grid-column: 1 / -1;
      background: rgba(99, 102, 241, 0.1);
      border: 1px solid var(--primary);
    }

    .stat-label {
      display: block;
      font-size: 0.875rem;
      color: var(--text-secondary);
      margin-bottom: 0.5rem;
    }

    .stat-number {
      display: block;
      font-size: 1.5rem;
      font-weight: bold;
      color: var(--text-primary);
    }

    .errors-section {
      margin-top: 1.5rem;
    }

    .errors-section h5 {
      margin: 0 0 0.75rem 0;
      color: var(--text-primary);
    }

    .errors-list {
      background: var(--bg-tertiary);
      border-radius: 6px;
      padding: 1rem;
      max-height: 200px;
      overflow-y: auto;
    }

    .errors-list li {
      color: var(--danger);
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
      word-break: break-word;
    }

    .success-message {
      text-align: center;
      padding: 2rem;
      color: var(--success);
    }

    .success-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }

    .modal-footer {
      display: flex;
      gap: 0.75rem;
      justify-content: flex-end;
      padding: 1.5rem;
      border-top: 1px solid var(--border-color);
    }

    .btn-primary {
      background: var(--primary);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      cursor: pointer;
    }

    .btn-primary:hover:not(:disabled) {
      background: var(--primary-hover);
    }

    .btn-primary:disabled {
      background: var(--text-muted);
      cursor: not-allowed;
    }

    .btn-secondary {
      background: transparent;
      color: var(--text-primary);
      border: 1px solid var(--border-color);
      padding: 0.75rem 1.5rem;
      border-radius: 6px;
      cursor: pointer;
    }

    .btn-secondary:hover:not(:disabled) {
      background: var(--bg-hover);
    }
  `]
})
export class ImportLessonsModalComponent {
  @Input() display = false;
  @Input() loading = false;
  @Input() importResult: ImportResultDto | null = null;

  @Output() close = new EventEmitter<void>();
  @Output() import = new EventEmitter<File>();

  selectedFile: File | null = null;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  clearFile(): void {
    this.selectedFile = null;
  }

  onImport(): void {
    if (this.selectedFile) {
      this.import.emit(this.selectedFile);
    }
  }

  onClose(): void {
    this.selectedFile = null;
    this.close.emit();
  }

  getTotalRows(): number {
    if (!this.importResult) return 0;
    return this.importResult.successfullyImported + this.importResult.failed;
  }
}
