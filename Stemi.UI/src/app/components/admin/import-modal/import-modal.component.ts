import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserImportResult } from '../../../services/user.service';

@Component({
  selector: 'app-import-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="display" class="modal-overlay" (click)="close.emit()">
      <div class="modal-container" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3 class="modal-title">Импорт пользователей</h3>
          <button class="modal-close" (click)="close.emit()">×</button>
        </div>
        
        <div class="modal-body">
          <div class="upload-area" 
               [class.dragover]="isDragOver"
               (drop)="onFileDrop($event)"
               (dragover)="onDragOver($event)"
               (dragleave)="onDragLeave($event)">
            <div class="upload-content" *ngIf="!uploadedFile">
              <div class="upload-icon">📊</div>
              <h4>Перетащите файл Excel</h4>
              <p>или</p>
              <button class="btn btn-outline" (click)="fileInput.click()" [disabled]="loading">
                Выбрать файл
              </button>
              <input #fileInput type="file" class="file-input" 
                    accept=".xlsx,.xls" 
                    (change)="onFileSelect($event)"
                    [disabled]="loading">
            </div>
            
            <div class="file-preview" *ngIf="uploadedFile">
              <div class="file-icon">📄</div>
              <div class="file-info">
                <h5>{{ uploadedFile.name }}</h5>
                <p>{{ (uploadedFile.size / 1024 / 1024).toFixed(2) }} MB</p>
              </div>
              <button class="btn-icon" (click)="uploadedFile = null" [disabled]="loading">×</button>
            </div>
          </div>

          <div *ngIf="importResult" class="import-results">
            <div class="result-stats">
              <div class="stat-item total">
                <span class="stat-number">{{ importResult.totalRows }}</span>
                <span class="stat-label">Всего строк</span>
              </div>
              <div class="stat-item success">
                <span class="stat-number">{{ importResult.successfullyImported }}</span>
                <span class="stat-label">Успешно</span>
              </div>
              <div class="stat-item error">
                <span class="stat-number">{{ importResult.failed }}</span>
                <span class="stat-label">Ошибки</span>
              </div>
            </div>

            <div *ngIf="importResult.errors.length > 0" class="errors-section">
              <h5>Ошибки импорта:</h5>
              <div class="errors-list">
                <div *ngFor="let error of importResult.errors.slice(0, 5)" 
                     class="error-item">
                  ❌ {{ error }}
                </div>
                <div *ngIf="importResult.errors.length > 5" class="more-errors">
                  ... и еще {{ importResult.errors.length - 5 }} ошибок
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn btn-secondary" 
                  (click)="close.emit()"
                  [disabled]="loading">
            Отмена
          </button>
          <button class="btn btn-primary" 
                  (click)="startImport()"
                  [disabled]="!uploadedFile || loading">
            <span *ngIf="loading" class="spinner"></span>
            {{ loading ? 'Импорт...' : 'Начать импорт' }}
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
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(5px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 2rem;
    }

    .modal-container {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 20px;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
      max-width: 500px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem 2rem;
      border-bottom: 1px solid var(--border-color);
    }

    .modal-title {
      margin: 0;
      color: var(--text-primary);
    }

    .modal-close {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: var(--text-secondary);
      transition: color 0.3s ease;
    }

    .modal-close:hover {
      color: var(--text-primary);
    }

    .modal-body {
      padding: 2rem;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      padding: 1.5rem 2rem;
      border-top: 1px solid var(--border-color);
    }

    /* Upload Area */
    .upload-area {
      border: 2px dashed var(--border-color);
      border-radius: 16px;
      padding: 3rem 2rem;
      text-align: center;
      transition: all 0.3s ease;
      margin-bottom: 1.5rem;
    }

    .upload-area.dragover {
      border-color: var(--primary);
      background: var(--bg-tertiary);
    }

    .upload-content h4 {
      margin: 1rem 0 0.5rem 0;
      color: var(--text-primary);
    }

    .upload-content p {
      color: var(--text-secondary);
      margin-bottom: 1rem;
    }

    .upload-icon {
      font-size: 3rem;
      opacity: 0.7;
    }

    .file-input {
      display: none;
    }

    .file-preview {
      display: flex;
      align-items: center;
      gap: 1rem;
      background: var(--bg-tertiary);
      padding: 1rem;
      border-radius: 12px;
    }

    .file-icon {
      font-size: 2rem;
    }

    .file-info h5 {
      margin: 0 0 0.25rem 0;
      color: var(--text-primary);
    }

    .file-info p {
      margin: 0;
      color: var(--text-secondary);
      font-size: 0.875rem;
    }

    .btn-icon {
      background: var(--bg-secondary);
      border: none;
      width: 32px;
      height: 32px;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-secondary);
      transition: all 0.3s ease;
    }

    .btn-icon:hover:not(:disabled) {
      background: var(--danger);
      color: white;
    }

    .btn-outline {
      background: transparent;
      border: 2px solid var(--primary);
      color: var(--primary);
      padding: 0.75rem 1.5rem;
      border-radius: 12px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s ease;
    }

    .btn-outline:hover:not(:disabled) {
      background: var(--primary);
      color: white;
    }

    /* Import Results */
    .import-results {
      background: var(--bg-tertiary);
      border-radius: 12px;
      padding: 1.5rem;
    }

    .result-stats {
      display: flex;
      justify-content: space-around;
      margin-bottom: 1.5rem;
    }

    .stat-item {
      text-align: center;
    }

    .stat-number {
      display: block;
      font-size: 2rem;
      font-weight: 700;
    }

    .stat-item.total .stat-number { color: var(--text-primary); }
    .stat-item.success .stat-number { color: var(--success); }
    .stat-item.error .stat-number { color: var(--danger); }

    .stat-label {
      font-size: 0.875rem;
      color: var(--text-secondary);
    }

    .errors-section h5 {
      margin: 0 0 1rem 0;
      color: var(--text-primary);
    }

    .errors-list {
      max-height: 200px;
      overflow-y: auto;
    }

    .error-item {
      padding: 0.5rem 0;
      border-bottom: 1px solid var(--border-color);
      color: var(--danger);
      font-size: 0.875rem;
    }

    .error-item:last-child {
      border-bottom: none;
    }

    .more-errors {
      padding: 0.5rem 0;
      color: var(--text-secondary);
      font-size: 0.875rem;
      text-align: center;
    }

    /* Spinner */
    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid transparent;
      border-top: 2px solid white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      display: inline-block;
      margin-right: 0.5rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
      .modal-overlay {
        padding: 1rem;
      }
      
      .modal-header,
      .modal-body,
      .modal-footer {
        padding: 1rem;
      }
      
      .upload-area {
        padding: 2rem 1rem;
      }
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
      text-decoration: none;
      font-size: 0.875rem;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none !important;
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
      transform: translateY(-2px);
    }

    .btn-danger {
      background: var(--danger);
      color: white;
    }

    .btn-danger:hover:not(:disabled) {
      background: #dc2626;
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4);
    }

    .btn-icon {
      font-size: 1.1rem;
    }

    /* Стили для кнопок в таблице */
    .action-buttons .btn-icon {
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
      font-size: 1rem;
    }

    .action-buttons .btn-icon:hover:not(:disabled) {
      transform: scale(1.05);
    }

    .action-buttons .btn-icon.edit:hover:not(:disabled) {
      background: var(--info);
      color: white;
    }

    .action-buttons .btn-icon.delete:hover:not(:disabled) {
      background: var(--danger);
      color: white;
    }

    /* Адаптивность для кнопок в заголовке */
    @media (max-width: 768px) {
      .header-actions {
        flex-direction: column;
        width: 100%;
      }
      
      .btn {
        width: 100%;
        justify-content: center;
      }
    }

    @media (max-width: 480px) {
      .header-actions {
        gap: 0.5rem;
      }
      
      .btn {
        padding: 0.6rem 1rem;
        font-size: 0.8rem;
      }
    }
  `]
})
export class ImportModalComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  @Input() display = false;
  @Input() loading = false;
  @Output() close = new EventEmitter<void>();
  @Output() import = new EventEmitter<File>();

  uploadedFile: File | null = null;
  importResult: UserImportResult | null = null;
  isDragOver = false;

  onFileSelect(event: any): void {
    const file = event.target.files?.[0];
    this.handleFileSelect(file);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFileSelect(files[0]);
    }
  }

  private handleFileSelect(file: File): void {
    if (!file) return;

    const allowedTypes = ['.xlsx', '.xls'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

    if (!allowedTypes.includes(fileExtension)) {
      alert('Выберите файл Excel (.xlsx или .xls)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('Размер файла не должен превышать 10MB');
      return;
    }

    this.uploadedFile = file;
    this.importResult = null;
  }

  startImport(): void {
    if (this.uploadedFile) {
      this.import.emit(this.uploadedFile);
    }
  }
}
