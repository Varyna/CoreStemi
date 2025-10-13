import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Навигационная панель -->
    <nav class="navbar navbar-expand-lg navbar-dark menu shadow fixed-top">
      <div class="container">
        <a class="navbar-brand" routerLink="/dashboard">
          <img src="assets/img/logo_stemi.png" width="180" height="50" alt="СТЭМИ">
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
          aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link" routerLink="/dashboard">Главная</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="mailto:stemi@stemi24.ru">
                <i class="fas fa-envelope"></i> stemi&#64;stemi24.ru
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="https://vk.com/stemi" target="_blank">
                Мы в <i class="fab fa-vk fa-lg mx-1"></i>
              </a>
            </li>
          </ul>
          <a href="tel:+78002224906" class="ms-2 rounded-pill btn-rounded">
            <p>8 800 222-49-06</p>
            <span>
              <i class="fas fa-phone-alt"></i>
            </span>
          </a>
        </div>
      </div>
    </nav>

    <!-- Основной контент -->
    <section class="main-section">
      <div class="container">
        <div class="row d-flex justify-content-center text-center">
          <h2 class="menu-sidebar-title pb-2">Личный кабинет</h2>
          <span class="nolink pt-2 pb-2 p-2">
            {{studentInfo.name}}:
            Группа {{studentInfo.group}}
            <i class="fa fa-credit-card p-2">
              К оплате {{formatCurrency(studentInfo.payment)}}
            </i>
            Сумма обновляется 5-го числа каждого месяца
          </span>

          <!-- Навигационные табы -->
          <ul class="nav justify-content-center nav-pills flex-column flex-sm-row pb-2">
            <li class="nav-item">
              <a class="nav-link" routerLink="/dashboard/timetable" routerLinkActive="active">
                Расписание
              </a>
            </li>
            
            <!-- Успеваемость -->
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" role="button">
                Успеваемость
              </a>
              <ul class="dropdown-menu">
                <li>
                  <a class="dropdown-item" routerLink="/dashboard/session">Сессия</a>
                </li>
              </ul>
            </li>

            <!-- Студентам -->
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" data-bs-toggle="dropdown" data-bs-auto-close="outside">
                Студентам
              </a>
              <ul class="dropdown-menu">
                <!-- Заочная форма -->
                <li class="dropend">
                  <a class="dropdown-item dropdown-toggle" data-bs-toggle="dropdown">Заочная форма обучения</a>
                  <ul class="dropdown-menu dropdown-submenu">
                    <li><a class="dropdown-item" href="https://technicum.info/index.php/studentam/zaoch-form/zaochnaya-forma-obucheniya" target="_blank">Общая информация</a></li>
                    <li><a class="dropdown-item" href="http://moodle.stemi24.ru/login/index.php" target="_blank">Moodle</a></li>
                    <li><a class="dropdown-item" href="https://stemi.bitrix24.ru/~62JD6" target="_blank">Справка-вызов</a></li>
                  </ul>
                </li>
                <li><hr class="dropdown-divider"></li>

                <!-- Выпускнику -->
                <li class="dropend">
                  <a class="dropdown-item dropdown-toggle" data-bs-toggle="dropdown">Выпускнику</a>
                  <ul class="dropdown-menu dropdown-submenu">
                    <li><a class="dropdown-item" href="https://stemi.bitrix24.ru/~vR7CN" target="_blank">Шаблоны работ</a></li>
                    <li><a class="dropdown-item" href="https://stemi.bitrix24.ru/~L7k7O" target="_blank">Расписание экзаменов</a></li>
                    <li><a class="dropdown-item" href="https://stemi.bitrix24.ru/~tNmDz" target="_blank">Методические документы</a></li>
                  </ul>
                </li>
                <li><hr class="dropdown-divider"></li>

                <!-- Справки -->
                <li class="dropend">
                  <a class="dropdown-item dropdown-toggle" data-bs-toggle="dropdown">Справки и заявления</a>
                  <ul class="dropdown-menu dropdown-submenu">
                    <li><a class="dropdown-item" href="https://technicum.info/index.php/studentam/spravki-i-napravleniya/zakazat-spravku" target="_blank">Заказ справок</a></li>
                    <li><a class="dropdown-item" href="https://stemi.bitrix24.ru/~4g2L5" target="_blank">Пересдача</a></li>
                    <li><a class="dropdown-item" href="https://stemi.bitrix24.ru/~62JD6" target="_blank">Справка-вызов</a></li>
                    <li><a class="dropdown-item" href="https://stemi.bitrix24.ru/~N0oqB" target="_blank">Перезачет</a></li>
                    <li><a class="dropdown-item" href="https://b24-21eqx0.bitrix24.site/crm_form_lqxg8/" target="_blank">Договор на практику</a></li>
                  </ul>
                </li>
                <li><hr class="dropdown-divider"></li>

                <li><a class="dropdown-item" href="https://stemi.eljur.ru/" target="_blank">Электронный дневник</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="https://technicum.info/index.php/studentam/obraz" target="_blank">Образовательный кредит</a></li>
              </ul>
            </li>

            <li class="nav-item">
              <a class="nav-link" href="https://stemi.bitrix24.ru/~x6KKT" target="_blank">
                Ссылки Я.Телемост
              </a>
            </li>
            
            <li class="nav-item">
              <a class="nav-link" href="https://b24-21eqx0.bitrix24.site/crm_form23/" target="_blank">
                Электронная приемная
              </a>
            </li>
            
            <li class="nav-item">
              <a class="nav-link text-danger" (click)="logout()">
                Выход
              </a>
            </li>
          </ul>
        </div>

        <!-- Контент страницы -->
        <div class="row justify-content-md-center d-flex justify-content-center" id="page">
          <div class="col-md-12 profile">
            <router-outlet></router-outlet>
            
            <!-- Заглушка если нет активного дочернего роута -->
            <div *ngIf="isDefaultView()" class="text-center py-5">
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
          </div>
        </div>
      </div>
    </section>

    <!-- Футер -->
    <footer class="footer pt-1">
      <div class="row">
        <div class="container info col-auto mt-5">
          <h5 class="text-capitalize fw-bold">
            Частное образовательное учреждение профессионального образования
            «Саянский техникум СТЭМИ»
          </h5>
          <hr class="bg-white d-inline-block mb-4" style="width: 60px; height: 2px;">
          <p class="lh-1"><strong>Юридический адрес:</strong></p>
          <p class="lh-1">Россия, Республика Хакасия, г. Саяногорск, Ленинградский микрорайон, 19, 39Н</p>
          <p class="mb-5 lh-1">Телефон <strong>8 800 222 49 06</strong>, электронная почта: stemi&#64;stemi24.ru</p>
          <p style="font-size: 12px;">© ЧОУ ПО «Саянский техникум СТЭМИ» 2024. Все права защищены.</p>
          <p style="font-size: 12px;">
            Изготовление сайта: 
            <a href="http://our-link.ru" target="_blank" class="text-white">«Записать нас»</a>
          </p>
        </div>
        <div class="container payment col-auto mt-5">
          <p>QR-КОД ДЛЯ ОПЛАТЫ</p>
          <img src="assets/img/kode.png" alt="QR код" style="max-width: 150px;">
          <p class="mt-2">
            <a href="https://technicum.info/images/doc/instrukcia.pdf" target="_blank" class="text-white">ИНСТРУКЦИЯ ПО ОПЛАТЕ</a>
          </p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    /* Основные стили личного кабинета */
    .menu {
      background-color: #0064b4;
    }

    .navbar-nav a {
      font-weight: bold;
      color: #f3f3f3;
    }

    .nav-link {
      cursor: pointer;
    }

    .nav-link:hover {
      color: rgba(255, 255, 255, 0.8) !important;
    }

    .main-section {
      padding: 8rem 0 5rem 0;
      width: 100%;
    }

    .menu-sidebar-title {
      font-size: 18px;
      color: #60707f;
      text-transform: uppercase;
      border-bottom: 4px solid #3442a3;
      display: inline-block;
      font-weight: 700;
      line-height: 1.3em;
    }

    .nav-pills .nav-link.active {
      background-color: #0064b4;
      color: white;
    }

    .dropdown-submenu {
      position: relative;
    }

    .dropdown-submenu .dropdown-menu {
      top: 0;
      left: 100%;
      margin-top: -1px;
    }

    .footer {
      display: flex;
      justify-content: space-evenly;
      background-color: #0064b4;
      color: #f3f3f3;
    }

    .payment {
      text-align: center;
      margin-left: 1.5em;
    }

    .payment a {
      color: #f3f3f3;
    }

    .info {
      margin-left: .5em;
    }

    .fa-credit-card {
      color: #0064b4 !important;
    }

    /* Кнопка с телефоном */
    .btn-rounded {
      position: relative;
      padding: 0.1rem 2.5rem 0.1rem 0.1rem;
      font-weight: 700;
      margin: 0;
      border: 0.1rem solid rgba(255, 255, 255, 0.6);
      background-color: #f3f3f3;
      display: block;
      transition: all .6s ease-in-out;
      text-decoration: none;
      color: #0064b4;
      border-radius: 50px;
    }

    .btn-rounded:hover {
      background-color: #0064b4;
      transform: scale(1.1);
      color: #fff;
      text-decoration: none;
    }

    .btn-rounded:hover span {
      background-color: #0099e6;
    }

    .btn-rounded span {
      position: absolute;
      background-color: #0099e6;
      width: 2em;
      height: 2em;
      top: 50%;
      right: 5px;
      transform: translateY(-50%);
      border-radius: 50%;
    }

    .btn-rounded span i {
      color: #fff;
      font-size: 1rem;
      line-height: 2em;
      padding-left: 0.5em;
    }

    .btn-rounded p {
      margin: 0.2em;
      padding: 0.2em;
      color: #0064b4;
    }

    .btn-rounded:hover p {
      color: #fff;
    }

    /* Адаптивность */
    @media (max-width: 768px) {
      .main-section {
        padding: 6rem 0 3rem 0;
      }
      
      .footer {
        flex-direction: column;
        text-align: center;
      }
      
      .payment, .info {
        margin: 1rem 0;
      }
    }

    #page {
      min-height: 50vh;
    }

    .card {
      border: none;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      margin-bottom: 1rem;
    }
  `]
})
export class StudentProfileComponent implements OnInit {
  studentInfo = {
    name: 'Иванов Иван Иванович',
    group: 'ИТ-21',
    payment: 12500.50,
    sessionId: 'session-123'
  };

  constructor(public router: Router) { }

  ngOnInit(): void {
    // Загрузка данных студента
    const userName = localStorage.getItem('userName');
    if (userName) {
      this.studentInfo.name = userName;
    }
  }

  isDefaultView(): boolean {
    return this.router.url === '/dashboard' || this.router.url === '/dashboard/';
  }

  logout(): void {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userName');
    this.router.navigate(['/login']);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB"
    }).format(amount);
  }
}
