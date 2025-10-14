import { Component } from '@angular/core';

@Component({
  selector: 'app-welcome-content',
  standalone: true,
  template: `
    <div class="text-center py-5">
      <h4>Добро пожаловать в личный кабинет!</h4>
      <p class="text-muted">Выберите раздел в меню для продолжения работы</p>
      <div class="row mt-4">
        <div class="col-md-4">
          <div class="card">
            <div class="card-body">
              <h5>📅 Расписание</h5>
              <p>Просмотр учебного расписания</p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card">
            <div class="card-body">
              <h5>📝 Сессия</h5>
              <p>Успеваемость и результаты сессии</p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card">
            <div class="card-body">
              <h5>💰 Оплата</h5>
              <p>Информация по оплате обучения</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      border: none;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      margin-bottom: 1rem;
      transition: transform 0.2s;
    }

    .card:hover {
      transform: translateY(-5px);
    }

    .card-body {
      padding: 1.5rem;
    }
  `]
})
export class WelcomeContentComponent { }
