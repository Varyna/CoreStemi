import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface ImportResultDto {
  successfullyImported: number;
  failed: number;
  errors: string[];
  totalRows?: number;
  success?: boolean; // Добавлено для совместимости
  message?: string;  // Добавлено для совместимости
}

export interface LessonDto {
  id: number;
  subject: string;
  teacher: string;
  directoryGroupsId: number;
  groupName: string;
  directoryTimeId: number;
  timeName: string;
  numberLecture: number;
  date: Date;
  directoryCabinetsId: number;
  cabinetName: string;
}

@Injectable({
  providedIn: 'root'
})
export class LessonService {
  private apiUrl = 'api/lessons';

  constructor(private http: HttpClient) { }

  importLessons(file: File): Observable<ImportResultDto> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<ImportResultDto>(
      `${this.apiUrl}/ImportLessonsExcel`,
      formData
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        const userMessage = this.getUserFriendlyErrorMessage(error);
        return throwError(() => new Error(userMessage));
      })
    );
  }

  private getUserFriendlyErrorMessage(error: HttpErrorResponse): string {
    if (error.status === 0) {
      return 'Ошибка соединения с сервером. Проверьте интернет-соединение.';
    }

    if (error.status === 400) {
      // Пытаемся извлечь сообщение об ошибке из ответа
      if (typeof error.error === 'string') {
        return error.error;
      } else if (error.error?.message) {
        return error.error.message;
      } else if (error.error) {
        return JSON.stringify(error.error);
      }
      return 'Неверный формат файла или данных';
    }

    if (error.status === 413) {
      return 'Файл слишком большой. Максимальный размер: 10MB';
    }

    if (error.status === 415) {
      return 'Неподдерживаемый тип файла. Используйте .xlsx или .xls';
    }

    if (error.status === 500) {
      return 'Внутренняя ошибка сервера. Попробуйте позже.';
    }

    if (error.status === 404) {
      return 'Сервис импорта не найден. Обратитесь к администратору.';
    }

    return `Ошибка импорта (${error.status}): ${error.message}`;
  }

  getLessons(): Observable<LessonDto[]> {
    return this.http.get<LessonDto[]>(this.apiUrl).pipe(
      catchError((error: HttpErrorResponse) => {
        const userMessage = this.getUserFriendlyErrorMessage(error);
        return throwError(() => new Error(userMessage));
      })
    );
  }

  getLesson(id: number): Observable<LessonDto> {
    return this.http.get<LessonDto>(`${this.apiUrl}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        const userMessage = this.getUserFriendlyErrorMessage(error);
        return throwError(() => new Error(userMessage));
      })
    );
  }

  createLesson(lesson: Omit<LessonDto, 'id'>): Observable<number> {
    return this.http.post<number>(this.apiUrl, lesson).pipe(
      catchError((error: HttpErrorResponse) => {
        const userMessage = this.getUserFriendlyErrorMessage(error);
        return throwError(() => new Error(userMessage));
      })
    );
  }

  updateLesson(id: number, lesson: Partial<LessonDto>): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, lesson).pipe(
      catchError((error: HttpErrorResponse) => {
        const userMessage = this.getUserFriendlyErrorMessage(error);
        return throwError(() => new Error(userMessage));
      })
    );
  }

  deleteLesson(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        const userMessage = this.getUserFriendlyErrorMessage(error);
        return throwError(() => new Error(userMessage));
      })
    );
  }

  // Дополнительные методы для работы с расписанием
  getLessonsByDateRange(startDate: Date, endDate: Date): Observable<LessonDto[]> {
    const params = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    };

    return this.http.get<LessonDto[]>(`${this.apiUrl}/by-date-range`, { params }).pipe(
      catchError((error: HttpErrorResponse) => {
        const userMessage = this.getUserFriendlyErrorMessage(error);
        return throwError(() => new Error(userMessage));
      })
    );
  }

  getLessonsByGroup(groupId: number): Observable<LessonDto[]> {
    return this.http.get<LessonDto[]>(`${this.apiUrl}/by-group/${groupId}`).pipe(
      catchError((error: HttpErrorResponse) => {
        const userMessage = this.getUserFriendlyErrorMessage(error);
        return throwError(() => new Error(userMessage));
      })
    );
  }

  // Метод для проверки доступности сервера
  healthCheck(): Observable<{ status: string; timestamp: string }> {
    return this.http.get<{ status: string; timestamp: string }>(`${this.apiUrl}/health`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => new Error('Сервер недоступен'));
      })
    );
  }
}
