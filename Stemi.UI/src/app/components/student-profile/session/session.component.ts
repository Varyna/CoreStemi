import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-session',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="session-container">
      <h3>Успеваемость - Сессия</h3>
      <div class="card">
        <div class="card-body">
          <p>Здесь будет информация о сессии и успеваемости</p>
          <!-- Добавьте контент для отображения сессии -->
        </div>
      </div>
    </div>
  `,
  styles: [`
    .session-container {
      padding: 20px;
    }
    
    .card {
      margin-top: 20px;
    }
  `]
})
export class SessionComponent {
  // Логика для отображения данных сессии
}
