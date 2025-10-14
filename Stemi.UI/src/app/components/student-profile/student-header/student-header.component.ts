import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="row d-flex justify-content-center text-center">
      <h2 class="menu-sidebar-title pb-2">Личный кабинет</h2>
      <span class="nolink pt-2 pb-2 p-2">
        {{studentInfo.name}}:
        Группа {{studentInfo.group}}
        <i class="fa fa-credit-card p-2" id="payment">
          К оплате {{formatCurrency(studentInfo.payment)}}
        </i>
        Сумма обновляется 5-го числа каждого месяца
      </span>
    </div>
  `,
  styles: [`
    .menu-sidebar-title {
      font-size: 18px;
      color: #60707f;
      text-transform: uppercase;
      border-bottom: 4px solid #3442a3;
      display: inline-block;
      font-weight: 700;
      line-height: 1.3em;
    }

    .fa-credit-card {
      color: #0064b4 !important;
    }
  `]
})
export class StudentHeaderComponent implements OnInit {
  @Input() studentInfo: any;

  ngOnInit() {
    // Форматирование валюты после инициализации компонента
    setTimeout(() => {
      this.updatePaymentDisplay();
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB"
    }).format(amount);
  }

  private updatePaymentDisplay() {
    const paymentElement = document.getElementById('payment');
    if (paymentElement) {
      paymentElement.textContent = ` К оплате ${this.formatCurrency(this.studentInfo.payment)}`;
    }
  }
}
