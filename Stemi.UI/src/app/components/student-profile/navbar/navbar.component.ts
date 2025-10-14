import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark menu shadow fixed-top">
      <div class="container">
        <a class="navbar-brand" routerLink="/dashboard">
          <img src="/img/logo_stemi.png" width="180" height="50" alt="СТЭМИ">
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
          aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="navbar-collapse justify-content-end collapse" id="navbarNav">
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
                Мы в<i class="fab fa-vk fa-lg mx-1 fs-3"></i>
              </a>
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
  `,
  styles: [`
    .menu {
      background-color: #0064b4;
    }

    .navbar-nav a {
      font-weight: bold;
      color: #f3f3f3;
    }

    .nav-link:hover {
      color: rgba(255, 255, 255, 0.8) !important;
    }

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
  `]
})
export class NavbarComponent { }
