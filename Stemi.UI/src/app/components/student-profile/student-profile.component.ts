import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Импортируем компоненты
import { NavbarComponent } from './navbar/navbar.component';
import { StudentHeaderComponent } from './student-header/student-header.component';
import { SidebarMenuComponent } from './sidebar-menu/sidebar-menu.component';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavbarComponent,
    StudentHeaderComponent,
    SidebarMenuComponent,
    FooterComponent
  ],
  template: `
    <app-navbar></app-navbar>

    <!-- Основной контент -->
    <section class="main-section">
      <div class="container">
        <app-student-header [studentInfo]="studentInfo"></app-student-header>
        
        <app-sidebar-menu></app-sidebar-menu>

        <!-- Контент страницы -->
        <div class="row justify-content-md-center d-flex justify-content-center" id="page">
          <div class="col-md-12 profile">
            <!-- Здесь будут отображаться дочерние компоненты -->
            <router-outlet></router-outlet>
          </div>
        </div>
      </div>
    </section>

    <app-footer></app-footer>
  `,
  styles: [`
    .main-section {
      padding: 8rem 0 5rem 0;
      width: 100%;
      font-family: 'Arimo', sans-serif;
    }

    #page {
      min-height: 50vh;
    }

    @media (max-width: 768px) {
      .main-section {
        padding: 6rem 0 3rem 0;
      }
    }
  `]
})
export class StudentProfileComponent implements OnInit {
  studentInfo = {
    name: 'Монгуш Алёна Айдысовна',
    group: '127СД5',
    payment: 59000,
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
}
