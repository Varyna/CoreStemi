import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../models/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <body class="main">
      <div class="login-container">
        <!-- Фоновый логотип слева -->
        <div class="background-logo">
          <img src="assets/img/logo_w.png" class="bg-logo" alt="СТЭМИ">
        </div>
        <!-- Основной контент справа -->
        <div class="login-content">
          <!-- Логотип в шапке -->
          <div class="header-logo">
            <img src="assets/img/logo_stemi.png" alt="СТЭМИ">
          </div>
          <!-- Карточка авторизации -->
          <div class="login-card">
            <div class="card-header">
              <h2 class="welcome-title">Добро пожаловать</h2>
              <p class="welcome-subtitle">Войдите в свой аккаунт</p>
            </div>

            <form class="login-form" (ngSubmit)="onSubmit()" #loginForm="ngForm">
              <!-- Поле логина -->
              <div class="form-group">
                <label class="form-label">Логин</label>
                <input 
                  type="text" 
                  class="form-control" 
                  placeholder="Введите ваш логин" 
                  [(ngModel)]="loginRequest.email"
                  name="email"
                  required
                  autocomplete="username">
                <div class="form-icon">
                  <i class="fas fa-user"></i>
                </div>
              </div>
              <!-- Поле пароля -->
              <div class="form-group">
                <label class="form-label">Пароль</label>
                <input 
                  type="password" 
                  class="form-control" 
                  placeholder="Введите ваш пароль" 
                  [(ngModel)]="loginRequest.password"
                  name="password"
                  required
                  autocomplete="current-password">
                <div class="form-icon">
                  <i class="fas fa-lock"></i>
                </div>
              </div>
              <!-- Кнопка входа -->
              <button 
                type="submit"
                class="login-btn"
                [disabled]="!loginForm.form.valid || isLoading">
                <span *ngIf="!isLoading">Войти в систему</span>
                <span *ngIf="isLoading" class="loading-spinner">
                  <i class="fas fa-spinner fa-spin"></i> Вход...
                </span>
              </button>
            </form>
            <!-- Сообщение об ошибке -->
            <div *ngIf="error" class="error-message">
              <i class="fas fa-exclamation-triangle"></i>
              {{ error }}
            </div>
            <!-- Футер карточки -->
            <div class="card-footer">
              <p class="support-text">
                Техническая поддержка: 
                <a href="tel:+78002224906" class="support-link">8 800 222-49-06</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </body>
  `,
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginRequest: LoginRequest = {
    email: '',
    password: ''
  };
  isLoading = false;
  error = '';
  showDemoHint = true;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  onSubmit(): void {
    if (this.isLoading) return;

    this.isLoading = true;
    this.error = '';

    this.authService.login(this.loginRequest).subscribe({
      next: (response) => {
        if (this.authService.isStudent()) {
          this.router.navigate(['/dashboard']);
        } else if (this.authService.isAdmin()) {
          this.router.navigate(['/admin']);
        }
      },
      error: (error) => {
        this.error = 'Неверный логин или пароль. Пожалуйста, проверьте введенные данные.';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
