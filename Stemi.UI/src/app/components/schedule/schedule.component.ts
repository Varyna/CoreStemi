import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ScheduleService } from '../../services/schedule.service';
import { MainModel } from '../../models/schedule.model';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<!-- Навигация -->
<nav class="navbar navbar-expand-lg navbar-dark menu shadow fixed-top">
  <div class="container">
    <a class="navbar-brand" href="">
      <img src="/img/logo_stemi.png" width="180" height="50" alt="logo image">
    </a>
    <button class="navbar-toggler collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="navbar-collapse justify-content-end collapse" id="navbarNav">
      <ul class="navbar-nav">
        <li>
          <h3 class="heading-section fw-bold">
            Расписание занятий на {{getFormattedDate()}}
          </h3>
        </li>
        <li class="nav-item">
          <a class="nav-link" style="cursor: pointer;" (click)="onNextPage()">
            Следующая страница
          </a>
        </li>
        <li>
          <input type="number" class="form-control" [(ngModel)]="model.corpus" 
                 (change)="onCorpusChange()" min="1">
        </li>
      </ul>
      <a type="button" href="tel:+78002224906" class="ms-2 rounded-pill btn-rounded">
        <p>8 800 222-49-06</p>
        <span>
          <i class="fas fa-phone-alt"></i>
        </span>
      </a>
    </div>
  </div>
</nav>

<!-- Основной контент -->
<section class="main-section" id="pw">
  <!-- Загрузка -->
  <div *ngIf="isLoading" class="text-center mt-5">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Загрузка...</span>
    </div>
  </div>

  <!-- Ошибка -->
  <div *ngIf="error && !isLoading" class="alert alert-danger mt-3" role="alert">
    {{error}}
  </div>

  <!-- Таблицы расписания -->
  <div *ngIf="!isLoading && !error" class="tables-container mt-5">
    <div *ngFor="let table of model.tables; let tableIndex = index" 
         class="table-container mb-4">
      
      <table class="customers">
        <!-- Заголовок с группами -->
        <thead>
          <tr>
            <th>группа</th>
            <th *ngFor="let group of model.groupInformations[tableIndex]?.group" 
                colspan="2">
              {{group}}
            </th>
          </tr>
          <tr>
            <th *ngFor="let column of table.columns; let i = index">
              <span *ngIf="i === 0">время</span>
              <span *ngIf="i !== 0 && column.includes('КАБ')">каб</span>
              <span *ngIf="i !== 0 && !column.includes('КАБ')">урок</span>
            </th>
          </tr>
        </thead>
        
        <!-- Тело таблицы -->
        <tbody>
          <tr *ngFor="let row of table.rows; let rowIndex = index">
            <th *ngIf="row[0]">{{row[0]}}</th>
            <td *ngFor="let cell of row | slice:1; let cellIndex = index" 
                [innerHTML]="cell">
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Сообщение если нет данных -->
  <div *ngIf="model.tables.length === 0 && !isLoading && !error" 
       class="alert alert-info mt-5 text-center">
    Нет данных о расписании на выбранную дату
  </div>
</section>
  `,
  styles: [`
    .main-section {
      padding-top: 100px;
    }

    .customers {
      font-family: 'Arimo', Arial, sans-serif;
      border-collapse: collapse;
      width: 100%;
      margin-bottom: 30px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .customers td, .customers th {
      border: 1px solid #ddd;
      padding: 12px 8px;
      text-align: center;
    }

    .customers tr:nth-child(even) {
      background-color: #f8f9fa;
    }

    .customers tr:hover {
      background-color: #e9ecef;
    }

    .customers th {
      padding-top: 16px;
      padding-bottom: 16px;
      background-color: #04AA6D;
      color: white;
      font-weight: bold;
    }

    .customers thead tr:first-child th {
      background-color: #038a5a;
    }

    .table-container {
      overflow-x: auto;
    }

    .navbar {
      background-color: #343a40;
    }

    .btn-rounded {
      display: flex;
      align-items: center;
      text-decoration: none;
      color: white;
      padding: 8px 16px;
      border: 1px solid white;
      border-radius: 50px;
      transition: all 0.3s ease;
    }

    .btn-rounded:hover {
      background-color: white;
      color: #343a40;
    }

    .loading-spinner {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 200px;
    }
  `]
})
export class ScheduleComponent implements OnInit {
  model: MainModel = {
    tables: [],
    groupInformations: [],
    date: new Date(),
    corpus: 1,
    news: [],
    img: ''
  };

  isLoading: boolean = false;
  error: string = '';

  constructor(private scheduleService: ScheduleService) { }

  ngOnInit() {
    this.loadData(false);
  }

  loadData(next: boolean) {
    this.isLoading = true;
    this.error = '';

    this.scheduleService.getScheduleByCorpusAndDate(this.model.corpus, this.model.date, next)
      .subscribe({
        next: (response) => {
          this.model = response;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading schedule:', error);
          this.error = 'Ошибка при загрузке расписания';
          this.isLoading = false;
        }
      });
  }

  onNextPage() {
    this.loadData(true);
  }

  onCorpusChange() {
    this.loadData(false);
  }

  getFormattedDate(): string {
    return new Date(this.model.date).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}
