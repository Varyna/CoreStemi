import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
      <div class="card">
        <div class="card-header bg-primary text-white">
          <h2>Студенты</h2>
        </div>
        <div class="card-body">
          <p>Страница студентов находится в разработке...</p>
          <p>Вы успешно авторизовались! 🎉</p>
          <button class="btn btn-secondary" routerLink="/login">Выйти</button>
        </div>
      </div>
    </div>
  `
})
export class StudentsComponent { }
