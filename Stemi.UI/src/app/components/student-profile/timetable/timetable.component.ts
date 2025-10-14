import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-timetable',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="week_selector">
      <svg class="arrow" version="1.1" id="arrow_left" xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="123.964px" height="123.964px"
          viewBox="0 0 123.964 123.964" style="enable-background:new 0 0 123.964 123.964;" xml:space="preserve">
          <g>
              <path
                  d="M121.7,57.681L83,26.881c-4-3.1-10-0.3-10,4.8v10.3c0,3.3-2.2,6.2-5.5,6.2H6c-3.3,0-6,2.4-6,5.8v16.2c0,3.2,2.7,6,6,6h61.5 c3.3,0,5.5,2.601,5.5,5.9v10.3c0,5,6,7.8,9.9,4.7l38.6-30C124.7,64.781,124.8,60.081,121.7,57.681z" />
          </g>
      </svg>
      <div class="week_date">
          <h2 style="font-size:14px; line-height: 0px; margin-bottom: 0; margin-top: 0;">{{currentWeek}}</h2>
      </div>
      <svg class="arrow" version="1.1" id="arrow_right" xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="123.964px" height="123.964px"
          viewBox="0 0 123.964 123.964" style="enable-background:new 0 0 123.964 123.964;" xml:space="preserve">
          <g>
              <path
                  d="M121.7,57.681L83,26.881c-4-3.1-10-0.3-10,4.8v10.3c0,3.3-2.2,6.2-5.5,6.2H6c-3.3,0-6,2.4-6,5.8v16.2c0,3.2,2.7,6,6,6h61.5 c3.3,0,5.5,2.601,5.5,5.9v10.3c0,5,6,7.8,9.9,4.7l38.6-30C124.7,64.781,124.8,60.081,121.7,57.681z" />
          </g>
      </svg>
    </div>
    
    <table class="m-auto mt-5 styled-table table">
      <thead>
        <tr>
          <th colspan="4">
            <h3></h3>
          </th>
        </tr>
        <tr>
          <th>Время</th>
          <th>Предмет</th>
          <th>Преподаватель</th>
          <th>Кабинет</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let lesson of lessons">
          <td>{{lesson.time}}</td>
          <td>{{lesson.subject}}</td>
          <td>{{lesson.teacher}}</td>
          <td>{{lesson.classroom}}</td>
        </tr>
        <tr *ngIf="lessons.length === 0">
          <td colspan="4" class="text-center">Нет занятий на эту неделю</td>
        </tr>
      </tbody>
    </table>
  `,
  styles: [`
    .week_selector {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 20px;
      margin: 20px 0;
    }

    .arrow {
      width: 30px;
      height: 30px;
      cursor: pointer;
      fill: #0064b4;
    }

    .week_date h2 {
      font-size: 14px;
      line-height: 0px;
      margin-bottom: 0;
      margin-top: 0;
    }

    .styled-table {
      width: 100%;
      border-collapse: collapse;
      margin: 25px 0;
      font-size: 0.9em;
      font-family: 'Arimo', sans-serif;
      min-width: 400px;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
    }

    .styled-table thead tr {
      background-color: #0064b4;
      color: #ffffff;
      text-align: left;
    }

    .styled-table th,
    .styled-table td {
      padding: 12px 15px;
    }

    .styled-table tbody tr {
      border-bottom: 1px solid #dddddd;
    }

    .styled-table tbody tr:nth-of-type(even) {
      background-color: #f3f3f3;
    }

    .styled-table tbody tr:last-of-type {
      border-bottom: 2px solid #0064b4;
    }

    .styled-table tbody tr.active-row {
      font-weight: bold;
      color: #0064b4;
    }
  `]
})
export class TimetableComponent {
  currentWeek = '13-10-2025-19-10-2025';
  lessons: any[] = []; // Здесь будут данные о занятиях

  // В реальном приложении здесь будет загрузка данных
}
