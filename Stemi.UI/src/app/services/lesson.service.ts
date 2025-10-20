import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ImportResultDto {
  successfullyImported: number;
  failed: number;
  errors: string[];
  totalRows?: number;
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

    return this.http.post<ImportResultDto>(`${this.apiUrl}/ImportLessonsExcel`, formData);
  }

  getLessons(): Observable<LessonDto[]> {
    return this.http.get<LessonDto[]>(this.apiUrl);
  }

  getLesson(id: number): Observable<LessonDto> {
    return this.http.get<LessonDto>(`${this.apiUrl}/${id}`);
  }

  createLesson(lesson: Omit<LessonDto, 'id'>): Observable<number> {
    return this.http.post<number>(this.apiUrl, lesson);
  }

  updateLesson(id: number, lesson: Partial<LessonDto>): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, lesson);
  }

  deleteLesson(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
