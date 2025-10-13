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
      <div class="main_logo">
        <img class="img-fluid mx-auto" src="assets/img/logo_w.png" />
      </div>
      <div class="Login pt-5 d-flex justify-content-center">
        <section class="ftco-section pt-5">
          <div class="stemi-avt pt-5 pb-5 mx-4">
            <a href="https://technicum.info/">
              <img src="assets/img/logo_stemi.png" width="360" height="90" />
            </a>
          </div>
          <div class="container">
            <div class="row justify-content-center">
              <div class="col-md-12 text-center mb-5">
                <h2 class="heading-section fw-bold">Войдите через аккаунт СТЭМИ</h2>
              </div>
            </div>
            <div class="row justify-content-center">
              <div class="col-md-10 col-lg-10">
                <div class="login-wrap p-0">
                  <form class="form-signin" (ngSubmit)="onSubmit()" #loginForm="ngForm">
                    <div class="form-group">
                      <input 
                        type="text" 
                        id="inputEmail" 
                        class="form-control" 
                        placeholder="Фамилия (Рус)" 
                        [(ngModel)]="loginRequest.email"
                        name="email"
                        required>
                    </div>
                    <div class="form-group">
                      <input 
                        type="password" 
                        name="password" 
                        id="inputPassword" 
                        class="form-control" 
                        placeholder="Пароль" 
                        [(ngModel)]="loginRequest.password"
                        required>
                      <span toggle="#password-field" class="fa fa-fw field-icon toggle-password fa-eye"></span>
                    </div>
                    <div class="form-group">
                      <button 
                        id="loginbtn" 
                        type="submit"
                        class="form-control btn btn-primary submit px-3"
                        [disabled]="!loginForm.form.valid || isLoading">
                        {{ isLoading ? 'Вход...' : 'Вход' }}
                      </button>
                    </div>
                  </form>

                  <div *ngIf="error" class="error-message text-center mt-3">
                    <div class="alert alert-danger">
                      {{ error }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </body>
  `,
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginRequest: LoginRequest = { email: '', password: '' };
  isLoading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (this.isLoading) return;

    this.isLoading = true;
    this.error = '';

    this.authService.login(this.loginRequest).subscribe({
      next: () => {
        this.router.navigate(['/students']);
      },
      error: (error) => {
        this.error = 'Ошибка входа. Проверьте логин и пароль.';
        this.isLoading = false;
        console.error('Login error:', error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
