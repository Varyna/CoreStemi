import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MainModel, ScheduleRequest } from '../models/schedule.model';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private apiUrl = '/api/schedule';

  constructor(private http: HttpClient) { }

  getSchedule(request: ScheduleRequest): Observable<MainModel> {
    const body = {
      corpus: request.corpus || 1,
      date: request.date || new Date().toISOString().split('T')[0],
      next: request.next || false
    };

    return this.http.post<MainModel>(this.apiUrl, body);
  }

  getScheduleByCorpusAndDate(corpus: number, date: Date, next: boolean = false): Observable<MainModel> {
    const body = {
      corpus: corpus,
      date: date.toISOString().split('T')[0],
      next: next
    };

    return this.http.post<MainModel>(this.apiUrl, body);
  }
}
